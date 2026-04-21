# 🐳 Docker Setup Guide

Run the entire Twitter clone stack with Docker (optional).

---

## Prerequisites

- Docker installed ([Get Docker](https://www.docker.com/get-started))
- Docker Compose installed (included with Docker Desktop)

---

## Quick Start with Docker

### 1. Configure Environment Variables

Create `.env` files as normal:

**backend/.env:**
```env
PORT=5000
NODE_ENV=development
# MongoDB URL is handled by docker-compose
# Add your Firebase credentials here
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@...
```

**twitter/.env.local:**
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

### 2. Start All Services

```bash
# From project root
docker-compose up
```

This starts:
- MongoDB (port 27017)
- Backend (port 5000)
- Frontend (port 3000)

### 3. Access Application

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:5000
- **MongoDB:** localhost:27017

---

## Docker Commands

### Start Services
```bash
# Start in foreground
docker-compose up

# Start in background
docker-compose up -d

# Start specific service
docker-compose up backend
```

### Stop Services
```bash
# Stop all
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v
```

### View Logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs frontend

# Follow logs
docker-compose logs -f
```

### Rebuild
```bash
# Rebuild all
docker-compose build

# Rebuild specific service
docker-compose build backend

# Rebuild and start
docker-compose up --build
```

---

## MongoDB Access in Docker

### Connect to MongoDB
```bash
# Using Docker exec
docker-compose exec mongodb mongosh

# Or direct connection
mongosh mongodb://admin:password123@localhost:27017/twitter-clone?authSource=admin
```

### MongoDB Credentials
- **Username:** admin
- **Password:** password123
- **Database:** twitter-clone

**⚠️ Change these in production!**

---

## Development Workflow

### Hot Reload
All services support hot reload:
- Backend: nodemon watches for changes
- Frontend: Next.js dev server auto-reloads

### Making Changes
1. Edit code locally
2. Docker detects changes
3. Service auto-restarts
4. Refresh browser

### Install New Dependencies
```bash
# Backend
docker-compose exec backend npm install <package>

# Frontend
docker-compose exec frontend npm install <package>

# Or rebuild
docker-compose build
```

---

## Production Docker Setup

### 1. Create Production Dockerfile

**backend/Dockerfile.prod:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

**twitter/Dockerfile.prod:**
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["npm", "start"]
```

### 2. Create Production Compose

**docker-compose.prod.yml:**
```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
    env_file:
      - ./backend/.env.production

  frontend:
    build:
      context: ./twitter
      dockerfile: Dockerfile.prod
    ports:
      - "3000:3000"
    depends_on:
      - backend
```

### 3. Run Production Build
```bash
docker-compose -f docker-compose.prod.yml up --build
```

---

## Troubleshooting Docker

### Port Already in Use
```bash
# Stop conflicting services
docker ps
docker stop <container_id>

# Or change ports in docker-compose.yml
```

### Container Won't Start
```bash
# Check logs
docker-compose logs backend

# Check if port is available
lsof -i :5000
```

### Database Connection Failed
```bash
# Ensure MongoDB is running
docker-compose ps

# Check MongoDB logs
docker-compose logs mongodb

# Test connection
docker-compose exec mongodb mongosh
```

### Clean Everything
```bash
# Remove containers, volumes, and images
docker-compose down -v --rmi all

# Start fresh
docker-compose up --build
```

---

## Docker vs Local Development

### When to Use Docker
✅ Consistent environment across team  
✅ Easy MongoDB setup  
✅ Isolate dependencies  
✅ Production-like environment  

### When to Use Local
✅ Faster startup  
✅ Better IDE integration  
✅ Less resource usage  
✅ Simpler debugging  

---

## Advanced Docker Tips

### Multi-Stage Builds
Reduce image size by using multi-stage builds (see production Dockerfile above).

### Volume Management
```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect twitter-clone_mongodb_data

# Backup volume
docker run --rm -v twitter-clone_mongodb_data:/data -v $(pwd):/backup alpine tar czf /backup/mongodb-backup.tar.gz /data
```

### Health Checks
Add to docker-compose.yml:
```yaml
services:
  backend:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### Resource Limits
```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
```

---

## Docker Compose Reference

### Services
- **mongodb** - Database service
- **backend** - Express.js API
- **frontend** - Next.js app

### Networks
- **twitter-network** - Bridge network connecting all services

### Volumes
- **mongodb_data** - Persistent database storage

---

## Environment Variables in Docker

### Pass from .env
```yaml
env_file:
  - ./backend/.env
```

### Override in Compose
```yaml
environment:
  - PORT=5000
  - NODE_ENV=development
```

### Build-time Variables
```dockerfile
ARG NODE_ENV=development
ENV NODE_ENV=$NODE_ENV
```

---

## Common Docker Workflows

### Reset Database
```bash
docker-compose down -v
docker-compose up
```

### View Real-time Logs
```bash
docker-compose logs -f --tail=100
```

### Execute Commands in Container
```bash
# Run npm command
docker-compose exec backend npm run test

# Access shell
docker-compose exec backend sh
```

### Update Dependencies
```bash
docker-compose build --no-cache
docker-compose up
```

---

## Docker Performance

### Speed Up Builds
- Use `.dockerignore` to exclude files
- Order Dockerfile commands by change frequency
- Use Docker layer caching

### Reduce Image Size
- Use Alpine base images
- Multi-stage builds
- Remove dev dependencies in production

### Optimize for Development
- Use volumes for code
- Don't copy node_modules
- Use nodemon for auto-restart

---

**Docker is optional but recommended for:**
- Team collaboration
- Consistent environments
- Easy MongoDB setup
- Testing production builds locally

**For simple solo development, local setup is faster and easier.**
