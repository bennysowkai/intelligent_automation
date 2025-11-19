.PHONY: help build up down restart logs clean test

# Default target
help:
	@echo "Intelligent Automation Hub - Docker Commands"
	@echo "============================================="
	@echo "make build    - Build all Docker images"
	@echo "make up       - Start all services"
	@echo "make down     - Stop all services"
	@echo "make restart  - Restart all services"
	@echo "make logs     - View logs from all services"
	@echo "make clean    - Remove all containers, images, and volumes"
	@echo "make test     - Run tests"
	@echo "make dev      - Run in development mode (without Docker)"

# Build Docker images
build:
	@echo "Building Docker images..."
	docker-compose build --no-cache

# Start services
up:
	@echo "Starting services..."
	docker-compose up -d
	@echo "Application is running at http://localhost:8080"

# Stop services
down:
	@echo "Stopping services..."
	docker-compose down

# Restart services
restart: down up

# View logs
logs:
	docker-compose logs -f

# Clean everything
clean:
	@echo "Cleaning up Docker resources..."
	docker-compose down -v --rmi all --remove-orphans
	@echo "Clean complete!"

# Run tests
test:
	@echo "Running backend tests..."
	cd server && npm test
	@echo "Running frontend tests..."
	cd client && npm test

# Development mode (without Docker)
dev:
	@echo "Starting development servers..."
	npm run dev
