# General

This repo contains the backend for the EasyGenerator interview assignment.

# Live Demo

![API Status](https://img.shields.io/website-up-down-green-red/https/authly-api-production.up.railway.app/api/v1/health)

[Live API](https://authly-api-production.up.railway.app/api/v1/health)

> **NOTE:** Attempt made not to use any third party auth provider / passport js by default since this is the crux of the assignment.

## Functionality 🛠️

### **User Management** 🚹:

- View User Info
- View All Users
- Simple query builder with query by roles
- Update User
- Delete User

### **Auth Management** 🔐:

- Sign Up User
- Sign In User
- Forgot /Reset Password of User
- Verify Email
- Refresh token

### **Health Management** 🔐:

- Get Health
- Get Memory
- Get Disk

# Features

- Authentication
  - JWT integration
  - Email verification with OTP
  - 5 minute OTP expiry
  - 1 hour access token expiry
  - 10 day refresh token expiry
  - Rate limit OTP reissue
  - Refresh token revocation
  - Email sending
  - Route Guards
  - Hashing of passwords and OTP tokens
- Database
  - ORM (See below for technologies)
- CASL Integration
  - Authorization Guards with role (CUSTOMER, ADMIN)
  - Authorization by role, subject, conditions
- Filters
  - Exception Filters
- Validation Pipes
- Swagger Documentation
- Middlewares
- Interceptors
- Transformers
- Decorators
- Security
  - Throttling of requests
  - Allow CORS for now
  - Helmet
  - API versioning
  - Env variables
- Logging
  - Integration of pino with JSON logging.
  - Log request body
  - Redact sensitive data
  - Correlation Id for each request for debugging
  - Error constants mapping and response
- CI/CD
  - Docker Compose for local mongo setup
  - Deploy to Railway
  - DockerFile for build
  - Status indicator
  - Husky pre commit and linting checks
- MongoDB Replica Set
- Serializers
- Health Check

## Environment Variables 🌍

Default environment variables passed during the Docker build process:

- `DATABASE_URL`: DB Url.
- `APP_PORT`: Api server port to serve requests.
- `SWAGGER_PASSWORD`: Swagger password for opening the api docs
- `RESEND_EMAIL_API_KEY`: [Resend](https://resend.com/) Api key for sending emails.
- `OTP_LENGTH`: Number of OTP digits
- `APP_NAME`: Name of the application
- `DEFAULT_EMAIL`: Email registered with Resend. Make sure it is from the same domain registered and verified
- `DEFAULT_NAME` : Name of the email sender
- `APP_LOGGER_LEVEL`: Logging level

# Providers implemented

- Prisma

# Tools/Technologies

- Nest.js 10
- Docker
- Docker Compose
- MongoDB
- Node.js
- npm
- Prisma ORM
- Typescript

# Development

## MongoDB Replica Set

1. Create volume for each MongoDB node

```bash
docker volume create --name mongodb_repl_data1 -d local
docker volume create --name mongodb_repl_data2 -d local
docker volume create --name mongodb_repl_data3 -d local
```

2. Start the Docker containers on the host machine using docker-compose

```bash
docker-compose -f docker-compose-db.yml up -d
```

3. Start an interactive MongoDb shell session on the primary node in the cluster

```bash
docker exec -it mongo0 mongosh --port 30000

# in the shell
config={"_id":"rs0","members":[{"_id":0,"host":"mongo0:30000"},{"_id":1,"host":"mongo1:30001"},{"_id":2,"host":"mongo2:30002"}]}
rs.initiate(config);
```

4 Update hosts file on hosts machine

```bash
sudo nano /etc/hosts

# write in the file
127.0.0.1 mongo0 mongo1 mongo2
```

5. Connect to MongoDB on host machine and check the status of the replica set

```bash
mongosh "mongodb://localhost:30000,localhost:30001,localhost:30002/?replicaSet=rs0"
```

## API setup

```bash
npm install
```

## DB Setup

2. Generate Prisma Types

```bash
npm run db:generate
```

2. Run migrations

```bash
npm run db:push
```

## Project Compile and Run

3. Run application in below ways

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

# Production

1. Use a mongo cluster via [Atlas](https://cloud.mongodb.com/)
2. For the Api either self host it via

```bash
docker-compose -f docker-compose-api.yml up -d
```

OR

Deploy via [Railway Template](https://railway.app/template/Abo1zu)

## Swagger Documentation

Swagger documentation is available at [{{DOMAIN_NAME}}/docs]({{DOMAIN_NAME}}/docs).

### Credentials

- **Username:** `admin`
- **Password:** Per the environment variable

## JWT

### AuthGuard

`AuthGuard` will look for a JWT in the `Authorization` header with the scheme `Bearer`.
All routes that are protected by the `AuthGuard` decorator will require a valid JWT token in the `Authorization` header of the incoming request.

```typescript
providers: [
  {
    provide: APP_GUARD,
    useClass: AuthGuard,
  },
];
```

### SkipAuth

You can skip authentication for a route by using the `SkipAuth` decorator.

```typescript
@SkipAuth()
```

## CASL

### Roles configuration

Define roles for app:

```typescript
// app.roles.ts

export enum Roles {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
}
```
