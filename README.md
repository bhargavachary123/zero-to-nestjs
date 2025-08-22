# Zero to NestJS

This document provides a comprehensive overview of the modules in the Zero to NestJS project, a robust starter project for building scalable, production-ready server-side applications with NestJS.

--- 

## Requirements

- **Node.js** ≥ 20.19.1 (LTS)
- **NPM** ≥ 9.8.1 (comes with Node.js)
- **NestJS framework** 11.x  
  (generated with **@nestjs/cli 11.0.7**)
- **Redis** 7.0.* (for caching)
- **MySQL** (primary database)
--- 

## Table of Contents
- [Features](#features)
- [Project Architecture](#project-architecture)
  - [Module Organization](#module-organization)
  - [Data Relationships](#data-relationships)
  - [Core Modules](#core-modules)
- [Key Features](#key-features)
  - [Database Integration](#database-integration)
  - [Authentication & Authorization](#authentication--authorization)
  - [Caching System](#caching-system)
  - [File Upload System](#file-upload-system)
  - [Task Scheduling](#task-scheduling)
  - [Logging System](#logging-system)
- [Quickstart](#quickstart)
- [Usage Examples](#usage-examples)
  - [Authentication](#authentication)
  - [File Upload](#file-upload)
- [API Endpoint Summary](#api-endpoint-summary)

---

## Features
- **Redis Caching**: High-performance distributed caching with Redis for API acceleration.
- **Persistent Dynamic Jobs**: Schedule and manage background jobs (cron, interval, timeout) with persistence.
- **Background Cron Jobs**: Robust support for recurring and scheduled tasks.
- **File Uploads & Validation**: Upload single or multiple files, with custom validation for type and size.
- **Static Asset Serving**: Serve uploaded files and other static assets.
- **Rate Limiting**: Protect your API from abuse with advanced rate limiting.
- **Advanced Authentication**: Secure endpoints with Passport.js strategies (JWT, Local), including login, registration, and session management.
- **Role-Based Authorization**: Restrict access to endpoints using custom role guards and decorators.
- **JWT Authentication**: Stateless security using JSON Web Tokens (JWT).
- **Password Encryption**: Securely hash user passwords with bcrypt before storing them.
- **Validation & Pipes**: Robust request validation and transformation using class-validator and custom pipes.
- **CRUD Operations**: Full Create, Read, Update, Delete (CRUD) support for Users, Products, Categories, and Orders.
- **TypeORM Entities & Relationships**: Bi-directional relationships between entities (e.g., User-Profile, Product-Category).
- **Logging**: Configurable logging with Winston, including daily rotation and custom loggers.
- **MySQL Integration**: MySQL as the primary database via TypeORM.
- **Centralized Configuration**: Manage environment variables and configuration with `@nestjs/config`.
- **Global Exception Filters**: Consistent error handling across the application.

---
## Project Architecture

The application follows a modular, domain-driven design with a service-oriented architecture. Each business domain is encapsulated in its own NestJS module with dedicated controllers, services, and entities.

### Module Organization

The application is organized into several distinct modules, each responsible for a specific business domain or cross-cutting concern:
```
zero-to-nestjs/
├── src/
│   ├── auth/           # Authentication and authorization
│   ├── category/       # Category management
│   ├── config/         # Application configuration
│   ├── order/          # Order processing
│   ├── product/        # Product management
│   ├── tasks/          # Background tasks and scheduling
│   ├── user/           # User management
│   ├── app.module.ts   # Main application module
│   └── main.ts         # Application entry point
```

---

### Core Modules

#### App Module
The `AppModule` is the root module that brings together all other modules in the application. It configures:

- **Rate Limiting**: Using `ThrottlerModule` to protect against abuse (100 requests per minute)
- **Database Connection**: TypeORM configuration for MySQL with error logging
- **Feature Modules**: Imports all domain-specific modules

---

#### Authentication Module
The `AuthModule` handles user authentication and authorization:

- **JWT Authentication**: Uses `JwtModule` for token generation and validation
- **Passport Integration**: Implements `LocalStrategy` for username/password authentication and `JwtStrategy` for token validation
- **Token Expiration**: Includes a `JwtExpiredFilter` to handle expired tokens
- **User Management**: Integrates with `UserService` for user verification

**Key components:**
- JWT tokens configured with a 60-second expiration (for demonstration)
- TypeORM integration for user and profile entities
- Passport strategies for different authentication methods

---

#### User Module
The `UserModule` manages user-related functionality:

- **User Management**: CRUD operations for user accounts
- **Profile Management**: Handles user profiles with a one-to-one relationship
- **Entity Relationships**: User and Profile entities with TypeORM
- **JWT Integration**: Includes `JwtService` for token operations

---

#### Tasks Module
The `TasksModule` implements background job scheduling:

- **Scheduling**: Uses `@nestjs/schedule` for cron, interval, and timeout jobs
- **Persistence**: Stores job configurations in the database using the `Tasks` entity
- **Job Management**: API for creating, deleting, and managing scheduled tasks

This module enables dynamic creation and management of background jobs with database persistence for recovery after application restart.

---

#### Product Module
The `ProductModule` handles product management:

- **Product CRUD**: Complete operations for product entities
- **Category Integration**: Products are associated with categories
- **Service Dependencies**: Includes `CategoryService` for category operations

---

#### Order Module
The `OrderModule` manages order processing:

- **Order Management**: CRUD operations for orders
- **Entity Relationships**: Orders are linked to users and products
- **Service Dependencies**: Integrates with `UserService`, `ProductService`, and `CategoryService`
- **Complex Relationships**: Manages many-to-many relationships between orders and products

---

#### Category Module
The `CategoryModule` provides category management:

- **Category CRUD**: Operations for product categories
- **Simple Structure**: Focused on the `Category` entity

---

#### Config Module
The `MyConfigModule` centralizes application configuration:

- **Environment Variables**: Loads from `.env` file
- **Configuration Objects**: Uses a structured configuration approach
- **Global Access**: Registered as a global module for application-wide access
- **Exception Handling**: Includes a commented-out global exception filter

---

## Key Features

### Database Integration
- **MySQL**: Primary database using TypeORM
- **Entity Relationships**:
  - **One-to-One**: User and Profile entities
  - **One-to-Many**: A User can have multiple Orders
  - **Many-to-Many**: Orders and Products (via junction table)
  - **Many-to-One**: Products belong to a Category
- **Soft Deletion**: All entities support soft deletion using TypeORM's `@DeleteDateColumn`

### Authentication & Authorization

The authentication and authorization system is built around NestJS, Passport.js, and JSON Web Tokens (JWTs):

- **Authentication Process**:
  - **Local Authentication**: Uses `LocalStrategy` with Passport.js to validate email/password credentials
  - **JWT Generation**: Upon successful validation, generates a JWT token with user ID, name, and role
  - **Password Security**: Passwords are hashed using bcrypt before storage

- **Authorization System**:
  - **JWT Validation**: `JwtAuthGuard` extracts and validates JWT tokens from request headers
  - **Role-Based Access Control**: `@Roles()` decorator and `RolesGuard` restrict access based on user roles
  - **Route Protection**: Controllers and routes can be protected at class or method level

### Caching System

The application implements caching at multiple levels for performance optimization:

- **Global Configuration**: `CacheModule` configured in `AppModule`
- **Controller-Level Caching**: `@UseInterceptors(CacheInterceptor)` on `ProductController`
- **Service-Level Caching**: Direct cache interaction in `ProductService` for specific operations
- **Performance**: Significantly reduces database load for frequently accessed data
- **Redis Integration**: Uses [`@keyv/redis`](src/app.module.ts) with `cache-manager` for distributed caching
- **Cache Configuration**:
  - **Default TTL**: 10 minutes (600,000ms)
  - **Redis Connection**: Configurable via `REDIS_HOST` and `REDIS_PORT` environment variables
  - **Fallback**: Defaults to localhost:6379 if environment variables not set


### File Upload System

The application supports various file upload patterns through NestJS interceptors:

- **Upload Types**:
  - **Single File**: `/single` endpoint with `FileInterceptor('file')`
  - **Multiple Files (One Field)**: `/many` endpoint with `FilesInterceptor('files', 5)`
  - **Multiple Fields**: `/mixed` endpoint with `FileFieldsInterceptor` for different file types

- **Validation**:
  - All uploads are validated with `FilesValidationPipe`
  - Validates file size, MIME type, and presence
  - Configurable through `FileValidationOptions`

### Task Scheduling

The task scheduling system supports dynamic creation and management of background jobs:

- **Job Types**:
  - **Cron Jobs**: Time-based scheduling using cron expressions
  - **Interval Jobs**: Repeated execution at specified intervals
  - **Timeout Jobs**: One-time delayed execution

- **Features**:
  - **Persistence**: All jobs are stored in the database
  - **Recovery**: Jobs are automatically restored on application restart
  - **Management API**: REST endpoints for creating, deleting, stopping, and starting jobs
  - **Callback System**: Predefined callback functions for job execution

### Logging System

The application uses a comprehensive logging system based on Winston:

- **WinstonLogger**: Main logging service with custom levels and formatting
- **Output Destinations**:
  - Console output (in development)
  - Daily rotating log files (in all environments)
- **Log Rotation**: Files are rotated daily, zipped, and retained for 20 days
- **Database Logging**: TypeORM configured to log database errors to file
- **Custom Formatting**: Timestamps, log levels, and colored output

---

## Quickstart

1. **Clone the repository & install dependencies:**
   ```bash
   git clone https://github.com/bhargavachary123/zero-to-nestjs.git
   cd zero-to-nestjs
   npm install
   ```
2. **Configure environment variables:**
   - Copy `example.env` to `.env` and update the values as needed (database, JWT secret, etc).
3. **Run the application:**
   ```bash
   # development
   npm run start

   # watch mode
   npm run start:dev

   # production
   npm run start:prod
   ```
5. **Access the API**: Server runs on `http://localhost:5000`
   - Static files: `http://localhost:5000/public/filename`

## Configuration

---

## Usage Examples

### Authentication

**Login and get JWT token:**
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "johndoe","password": "yourpassword"}'
```
_Response:_
```json
{
  "message": "Login successful",
  "access_token": "<JWT_TOKEN>"
}
```

### File Upload

**Upload a single image:**
```bash
curl -X POST http://localhost:5000/single \
  -F "file=@/path/to/image.jpeg"
```

**Multiple Files on One Field:**
```bash
curl -X POST http://localhost:5000/many \
  -F "files=@/path/to/image1.jpg" \
  -F "files=@/path/to/image2.jpeg"
```
**Multiple Fields with Multiple Files:**
```bash
curl -X POST http://localhost:5000/mixed \
  -F "image=@/path/to/image1.jpg" \
  -F "image=@/path/to/image2.jpg" \
  -F "file=@/path/to/file.pdf"
```
---

## API Endpoint Summary

| Endpoint                        | Method | Description                                 | Auth Required| Role         |
|---------------------------------|--------|--------------------------------------------|--------------|--------------|
| `/auth/login`                   | POST   | Login and receive JWT token                 | No           | -            |
| `/user`                         | POST   | Create a new user                           | Yes          | Admin        |
| `/user`                         | GET    | List all users                              | No           | -            |
| `/product`                      | POST   | Create a new product (with file upload)     | Yes          | Admin        |
| `/product`                      | GET    | List all products                           | No           | -            |
| `/category`                     | GET    | Manage categories                           | Yes          | Admin        |
| `/order`                        | GET    | Manage orders                               | Yes          | User/Admin   |
| `/tasks/cron`                   | POST   | Schedule a new cron job                     | Yes          | Admin        |
| `/tasks/interval`               | POST   | Schedule a new interval job                 | Yes          | Admin        |
| `/tasks/timeout`                | POST   | Schedule a new timeout job                  | Yes          | Admin        |

> _Note: This is a summary. See the source code for full details and additional endpoints._

---
This NestJS project demonstrates best practices for structuring a modern backend application with a focus on modularity, security, and scalability.

For more details, see the source code.