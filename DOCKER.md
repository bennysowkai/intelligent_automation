# Docker Deployment Guide

This guide provides detailed information about deploying the Intelligent Automation Hub using Docker.

## Architecture Overview

The application is containerized using Docker Compose with the following services:

### Services

1. **Backend (automation-hub-backend)**
   - Node.js 18 Alpine
   - Express API server
   - Port: 5000 (internal)
   - Health check enabled

2. **Nginx (automation-hub-nginx)**
   - Nginx Alpine
   - Serves React frontend
   - Reverse proxy for API
   - Port: 8080 (exposed)
   - Gzip compression
   - Security headers
   - Health check enabled

### Network

All services communicate through a private bridge network (`automation-network`), ensuring:
- Service isolation from host
- Service-to-service communication
- DNS-based service discovery

## Quick Commands

```bash
# Start everything
docker-compose up -d

# View logs
docker-compose logs -f

# Stop everything
docker-compose down

# Rebuild and restart
docker-compose up -d --build

# Remove everything including volumes
docker-compose down -v --rmi all
```

## Configuration

### Environment Variables

Backend environment variables are set in `docker-compose.yml`:

```yaml
environment:
  - NODE_ENV=production
  - PORT=5000
  - CORS_ORIGIN=http://localhost:8080
  - GRAPH_TENANT_ID=mock-tenant-id-12345
  - GRAPH_CLIENT_ID=mock-client-id-67890
  - GRAPH_BASE_URL=https://graph.microsoft.com/v1.0
```

### Nginx Configuration

The Nginx configuration (`nginx/nginx.conf`) handles:

- **Static file serving**: React build files
- **API proxying**: `/api/*` → `backend:5000`
- **Health checks**: `/health` → `backend:5000/health`
- **Compression**: Gzip for text files
- **Caching**: Static assets cached for 1 year
- **Security**: Multiple security headers

## Health Checks

Both services have health checks configured:

**Backend:**
```yaml
healthcheck:
  test: ["CMD", "node", "-e", "require('http').get(...)"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

**Nginx:**
```yaml
healthcheck:
  test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost/health"]
  interval: 30s
  timeout: 10s
  retries: 3
```

Check health status:
```bash
docker-compose ps
```

## Multi-Stage Builds

### Nginx Container

The `Dockerfile.nginx` uses a multi-stage build:

**Stage 1: Build React App**
- Uses Node.js to build the frontend
- Runs `npm ci` and `npm run build`
- Creates optimized production bundle

**Stage 2: Nginx Server**
- Uses Nginx Alpine (small image)
- Copies build from Stage 1
- Copies Nginx configuration
- Final image: ~25MB

### Backend Container

The `server/Dockerfile`:
- Uses Node.js 18 Alpine (small image)
- Production dependencies only (`npm ci --only=production`)
- Health check included
- Final image: ~150MB

## Production Considerations

### Security

1. **Use secrets for sensitive data:**
   ```yaml
   secrets:
     - db_password
   ```

2. **Enable HTTPS:**
   - Add SSL certificates
   - Update Nginx config for HTTPS
   - Use Let's Encrypt for free certificates

3. **Set resource limits:**
   ```yaml
   deploy:
     resources:
       limits:
         cpus: '0.5'
         memory: 512M
   ```

### Scaling

To scale the backend:
```bash
docker-compose up -d --scale backend=3
```

Update Nginx upstream to load balance:
```nginx
upstream backend {
    server backend_1:5000;
    server backend_2:5000;
    server backend_3:5000;
}
```

### Logging

View logs from specific service:
```bash
docker-compose logs -f backend
docker-compose logs -f nginx
```

Configure log drivers in `docker-compose.yml`:
```yaml
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

### Monitoring

Add Prometheus and Grafana:
```yaml
services:
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
```

## Deployment to Cloud

### AWS ECS

1. Push images to ECR:
   ```bash
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account>.dkr.ecr.us-east-1.amazonaws.com
   docker tag automation-hub-backend:latest <account>.dkr.ecr.us-east-1.amazonaws.com/automation-hub-backend:latest
   docker push <account>.dkr.ecr.us-east-1.amazonaws.com/automation-hub-backend:latest
   ```

2. Create ECS task definition
3. Create ECS service
4. Configure ALB for load balancing

### Azure Container Apps

```bash
# Login to Azure
az login

# Create resource group
az group create --name automation-hub-rg --location eastus

# Create container registry
az acr create --resource-group automation-hub-rg --name automationhub --sku Basic

# Build and push
az acr build --registry automationhub --image automation-hub:latest .

# Deploy container app
az containerapp create \
  --name automation-hub \
  --resource-group automation-hub-rg \
  --image automationhub.azurecr.io/automation-hub:latest \
  --target-port 8080 \
  --ingress external
```

### Google Cloud Run

```bash
# Build and push to GCR
gcloud builds submit --tag gcr.io/PROJECT_ID/automation-hub

# Deploy to Cloud Run
gcloud run deploy automation-hub \
  --image gcr.io/PROJECT_ID/automation-hub \
  --platform managed \
  --port 8080 \
  --allow-unauthenticated
```

## Troubleshooting

### Container won't start

Check logs:
```bash
docker-compose logs backend
docker-compose logs nginx
```

### Port conflicts

Change exposed port:
```yaml
ports:
  - "9090:80"  # Change 8080 to 9090
```

### Out of memory

Increase Docker memory limit in Docker Desktop settings or add:
```yaml
deploy:
  resources:
    limits:
      memory: 1G
```

### Backend not reachable

1. Check if backend is running:
   ```bash
   docker-compose ps
   ```

2. Check network:
   ```bash
   docker network inspect automation_automation-network
   ```

3. Test backend directly:
   ```bash
   docker exec -it automation-hub-backend sh
   wget -O- http://localhost:5000/health
   ```

### Build failures

Clean Docker cache:
```bash
docker system prune -a --volumes
docker-compose build --no-cache
```

## Performance Optimization

### Image Size

Current image sizes:
- Backend: ~150MB
- Nginx: ~25MB

To reduce further:
1. Use distroless images
2. Remove unnecessary files
3. Combine RUN commands

### Build Time

Speed up builds:
```yaml
build:
  context: .
  cache_from:
    - automation-hub-backend:latest
```

### Runtime Performance

1. Enable Nginx caching
2. Use CDN for static assets
3. Enable HTTP/2
4. Implement Redis for session storage

## Backup and Recovery

### Backup (if using volumes)

```bash
docker run --rm -v automation_data:/data -v $(pwd):/backup alpine tar czf /backup/backup.tar.gz /data
```

### Restore

```bash
docker run --rm -v automation_data:/data -v $(pwd):/backup alpine tar xzf /backup/backup.tar.gz -C /
```

## CI/CD Integration

### GitHub Actions

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build images
        run: docker-compose build
      - name: Push to registry
        run: docker-compose push
      - name: Deploy
        run: |
          ssh user@server "cd /app && docker-compose pull && docker-compose up -d"
```

### GitLab CI

```yaml
deploy:
  stage: deploy
  script:
    - docker-compose build
    - docker-compose up -d
  only:
    - main
```

## Further Reading

- [Docker Compose documentation](https://docs.docker.com/compose/)
- [Nginx documentation](https://nginx.org/en/docs/)
- [Docker security best practices](https://docs.docker.com/engine/security/)
- [Multi-stage builds](https://docs.docker.com/develop/develop-images/multistage-build/)
