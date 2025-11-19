#!/bin/bash

# Intelligent Automation Hub - Startup Script
# This script helps you start the application easily

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}Intelligent Automation Hub${NC}"
echo -e "${BLUE}================================${NC}"
echo ""

# Check if Docker is available
if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
    echo -e "${GREEN}✓ Docker found${NC}"
    echo ""
    echo -e "${YELLOW}Starting with Docker Compose...${NC}"
    echo ""

    # Build images
    echo -e "${BLUE}Building Docker images...${NC}"
    docker-compose build

    # Start services
    echo -e "${BLUE}Starting services...${NC}"
    docker-compose up -d

    # Wait for services to be healthy
    echo -e "${BLUE}Waiting for services to be healthy...${NC}"
    sleep 5

    # Show status
    echo ""
    echo -e "${GREEN}✓ Application started successfully!${NC}"
    echo ""
    echo -e "${BLUE}Access the application at:${NC} ${GREEN}http://localhost:8080${NC}"
    echo ""
    echo -e "${YELLOW}Demo credentials:${NC}"
    echo "  Username: intern, analyst, or lead"
    echo "  Password: demo"
    echo ""
    echo -e "${BLUE}To view logs:${NC} docker-compose logs -f"
    echo -e "${BLUE}To stop:${NC} docker-compose down"
    echo ""

elif command -v node &> /dev/null && command -v npm &> /dev/null; then
    echo -e "${YELLOW}! Docker not found, starting in development mode${NC}"
    echo ""

    # Check if dependencies are installed
    if [ ! -d "node_modules" ] || [ ! -d "server/node_modules" ] || [ ! -d "client/node_modules" ]; then
        echo -e "${BLUE}Installing dependencies...${NC}"
        npm run install:all
    fi

    # Create .env if it doesn't exist
    if [ ! -f "server/.env" ]; then
        echo -e "${BLUE}Creating server/.env from .env.example...${NC}"
        cp server/.env.example server/.env
    fi

    echo -e "${BLUE}Starting development servers...${NC}"
    echo ""
    echo -e "${GREEN}✓ Backend will run on:${NC} http://localhost:5000"
    echo -e "${GREEN}✓ Frontend will run on:${NC} http://localhost:5173"
    echo ""
    echo -e "${YELLOW}Demo credentials:${NC}"
    echo "  Username: intern, analyst, or lead"
    echo "  Password: demo"
    echo ""
    echo -e "${BLUE}Press Ctrl+C to stop${NC}"
    echo ""

    npm run dev

else
    echo -e "${RED}✗ Error: Neither Docker nor Node.js found${NC}"
    echo ""
    echo "Please install one of the following:"
    echo "  1. Docker & Docker Compose (recommended)"
    echo "  2. Node.js >= 18 and npm >= 9"
    echo ""
    exit 1
fi
