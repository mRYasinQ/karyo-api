# 🚀 Karyo API

Backend API for Karyo, a robust platform for workspace, project, and task management.

## 📝 Description

Karyo API provides a scalable infrastructure for managing workspaces, collaborating on projects, and tracking tasks through a modern, secure, and fast REST API.

## ✨ Features

- **Modern Architecture** – Built with NestJS and TypeScript.
- **Session-Based Authentication** – Secure authentication using server-side sessions.
- **Workspace-Based Authorization** – Fine-grained access control using custom workspace policies and roles.
- **Database Integration** – PostgreSQL integration using Mikro-ORM for type-safe and efficient queries.
- **Object Storage** – Integrated with MinIO for scalable file and asset management.
- **Caching & Background Jobs** – Redis and BullMQ integration for high-performance caching and task queues.
- **Input Validation** – Strict request validation and schema enforcement using Zod.

## 🚀 Quick Start

> Make sure Docker and Docker Compose are installed on your system.

The project includes three distinct Docker Compose configurations tailored for different environments:

- `docker-compose-dev.yml` — For local development and debugging.
- `docker-compose-demo.yml` — For demonstration, staging, and testing.
- `docker-compose.yml` — For main production deployment.

Follow the steps below to run the project in **Production**:

#### 1. Clone the repository

```bash
git clone https://github.com/mryasinq/karyo-api.git
cd karyo-api
```

#### 2. Create environment file

```bash
cp .env.example .env
```

#### 3. Build and start containers

```bash
docker compose up -d --build
```

#### 4. Enter application container

```bash
docker compose exec app sh
```

#### 5. Create superuser

```bash
npm run superuser:create
```

#### 6. Access the application

- **API Base URL:** http://localhost:3000
- **API Documentation (Swagger):** http://localhost:3000/docs

## 🔧 Environment Configuration

```env
# Application.
NODE_ENV="production"
APP_URL="https://api.yourdomain.com"
APP_PORT="3000"
STORAGE_URL="https://storage.yourdomain.com"
CORS_ORIGINS="https://yourdomain.com"
ENABLE_SWAGGER="1"
DEFAULT_ROLE="مدیر"

# Redis.
REDIS_URL="redis://:karyo_pass@redis:6379"
REDIS_PASSWORD="karyo_pass"

# Database.
DB_HOST="postgres"
DB_PORT="5432"
DB_USER="karyo_user"
DB_PASSWORD="karyo_pass"
DB_NAME="karyo_db"

# SMTP.
MAIL_SECURE="0"
MAIL_FROM="Karyo <karyo@gmail.com>"
MAIL_HOST="smtp4dev"
MAIL_PORT="25"
MAIL_USER="admin"
MAIL_PASSWORD="admin"

# MinIO.
MINIO_URL="http://minio:9000"
MINIO_BUCKET="karyo"
MINIO_USER="karyo_user"
MINIO_PASSWORD="karyo_pass"

# Time
OTP_EXPIRE="3m"
OTP_CACHE="1d"
SESSION_EXPIRE="15d"

# Throttle.
THROTTLE_TTL="60m"
THROTTLE_LIMIT="100"
```

## 🤝 Contributing

1. Fork the repository
2. Create branch: `git checkout -b feature/your-feature-name`
3. Commit: `git commit -m "feat(area): add feature description"`
4. Push: `git push origin feature/your-feature-name`
5. Create Pull Request

**Branch Naming:**

- `feature/feature-name` - New features
- `bugfix/bug-description` - Bug fixes
- `hotfix/critical-fix` - Urgent fixes

## 📄 License

This project is licensed under the MIT License.
