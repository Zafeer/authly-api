# General

This repo contains the backend for the EasyGenerator interview assignment.

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
- Docker Compose
- MongoDB Replica Set
- Serializers
- Health Check

# Providers implemented

- Prisma

# Tools/Technologies

- Nest.js 10
- Docker
- Docker Compose
- MongoDB
- Node.js
- NPM

# Development

## MongoDB Replica Set

1. Create volume for each MongoDB node

```bash
docker volume create --name mongodb_repl_data1 -d local
docker volume create --name mongodb_repl_data2 -d local
docker volume create --name mongodb_repl_data3 -d local
```

2. Start the Docker containers using docker-compose

```bash
docker-compose up -d
```

3. Start an interactive MongoDb shell session on the primary node

```bash
docker exec -it mongo0 mongosh --port 30000

# in the shell
config={"_id":"rs0","members":[{"_id":0,"host":"mongo0:30000"},{"_id":1,"host":"mongo1:30001"},{"_id":2,"host":"mongo2:30002"}]}
rs.initiate(config);
```

4 Update hosts file

```bash
sudo nano /etc/hosts

# write in the file
127.0.0.1 mongo0 mongo1 mongo2
```

5. Connect to MongoDB and check the status of the replica set

```
mongosh "mongodb://localhost:30000,localhost:30001,localhost:30002/?replicaSet=rs0"
```

## Migration

1. Run migrations

```bash
npm run db:migrate:up
```

## Project setup

1. Install Dependancies

```
npm install
```

## Project setup

```bash
$ npm install
```

## Compile and run the project

1. Generate Prisma Types

```
npm run db:generate
```

2. Push MongoDB Schema

```
npm run db:push
```

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

## Swagger

Swagger documentation is available at http://localhost:3000/docs

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
