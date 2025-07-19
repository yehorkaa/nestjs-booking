#!/bin/bash

echo "🚀 Starting development services with hot reload..."

# Reset the project
nx reset

# Stop any running containers and remove them
docker-compose -f docker-compose.dev.yml down -v

# Start services with hot reload
docker-compose -f docker-compose.dev.yml up