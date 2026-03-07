# Library Management System - NestJS Microservices

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        API Gateway (Port 3000)                   │
│  ┌─────────┐ ┌───────────┐ ┌────────────┐ ┌───────────────┐     │
│  │  /auth  │ │ /institute│ │/telecalling│ │  /training    │     │
│  └────┬────┘ └─────┬─────┘ └─────┬──────┘ └───────┬───────┘     │
│       │            │             │                │              │
│  ┌────┴────────────┴─────────────┴────────────────┴───────┐      │
│  │              Library Microservices                    │      │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │      │
│  │  │/library/ │ │/library/ │ │/library/ │ │/library/ │  │      │
│  │  │  books   │ │ members  │ │  issues  │ │ requests │  │      │
│  │  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘  │      │
│  └───────┼────────────┼────────────┼────────────┼─────────┘      │
└──────────┼────────────┼────────────┼────────────┼────────────────┘
           │            │            │            │
     ┌─────┴────┐ ┌────┴─────┐ ┌─────┴────┐ ┌─────┴────┐
     │  Books   │ │ Members  │ │  Issues  │ │ Requests │
     │ Service  │ │ Service  │ │ Service  │ │ Service  │
     │:3001     │ │:3012     │ │:3013     │ │:3014     │
     └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘
          │            │            │            │
     ┌────┴────────────┴────────────┴────────────┴────┐
     │                  Kafka Broker                     │
     │             (Event-Driven Communication)          │
     └───────────────────────────────────────────────────┘
          │            │            │            │
     ┌────┴────┐ ┌────┴────┐ ┌────┴────┐ ┌────┴────┐
     │library_ │ │library_ │ │library_ │ │library_ │
     │ books   │ │ members │ │ issues  │ │requests │
     │         │ │         │ │         │ │         │
     └─────────┘ └─────────┘ └─────────┘ └─────────┘
      (MongoDB)   (MongoDB)   (MongoDB)   (MongoDB)
```

## Microservices Overview

| Service | Port | Database | Responsibility |
|---------|------|----------|----------------|
| **library-books-service** | 3001 | library_books | Book catalog, reviews, inventory |
| **library-members-service** | 3012 | library_members | Member & staff management |
| **library-issues-service** | 3013 | library_issues | Book lending, returns, renewals |
| **library-requests-service** | 3014 | library_requests | Book requests, approvals |

## API Gateway Routes

### Library Services (All prefixed with `/v1`)

```
GET    /library/books                - List all books
POST   /library/books                - Create new book
GET    /library/books/:id            - Get book by ID
PUT    /library/books/:id            - Update book
DELETE /library/books/:id            - Delete book
GET    /library/books/search?q=term - Search books

GET    /library/members              - List all members
POST   /library/members              - Create new member
GET    /library/members/:id          - Get member by ID
PUT    /library/members/:id          - Update member
DELETE /library/members/:id          - Delete member

GET    /library/issues               - List all issued books
POST   /library/issues               - Issue a book
GET    /library/issues/:id           - Get issue record
PUT    /library/issues/:id/return    - Return a book

GET    /library/requests             - List all requests
POST   /library/requests             - Create book request
PUT    /library/requests/:id/approve - Approve request
PUT    /library/requests/:id/reject  - Reject request
DELETE /library/requests/:id         - Delete request
```

## Communication Patterns

### Synchronous (HTTP/REST)
- Client → API Gateway → Microservice
- Inter-service calls for immediate data needs

### Asynchronous (Kafka Events)
Event naming follows `<domain>.<entity>.<action>` convention:

| Event | Payload | Description |
|-------|---------|-------------|
| `book.created` | Book object | New book added |
| `book.updated` | Book object | Book info updated |
| `book.deleted` | Book ID | Book removed |
| `book.reviewed` | Review object | New review added |
| `member.created` | Member object | New member registered |
| `member.updated` | Member object | Member info changed |
| `book.issued` | Issue object | Book checked out |
| `book.returned` | Issue object | Book returned |
| `request.created` | Request object | New book request |
| `request.approved` | Request object | Request approved |
| `request.rejected` | Request object | Request rejected |

## Project Structure

Each microservice follows the standard NestJS structure:

```
src/
├── modules/
│   ├── <feature>/
│   │   ├── controller/        # API endpoints (no business logic)
│   │   ├── service/           # Business logic
│   │   ├── dto/               # Data Transfer Objects (validation)
│   │   ├── entities/          # Database schemas
│   │   └── events/            # Event definitions
│   └── ...
├── common/
│   ├── filters/               # Global exception filters
│   ├── interceptors/          # Request/response interceptors
│   ├── guards/                # Authentication guards
│   ├── decorators/            # Custom decorators
│   └── constants/             # Constants
├── config/                    # Configuration modules
└── main.ts                    # Application entry
```

## Database Per Service

Each microservice owns its database - no shared databases:

- **library_books**: Books, BookReviews
- **library_members**: Members, Staff
- **library_issues**: IssueBook, Renewals
- **library_requests**: BookRequest

## Getting Started

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- MongoDB 7.0+
- Kafka 3.0+

### Installation

```bash
# 1. Navigate to each service and install dependencies
cd microservice/services/library-books-service
npm install

cd ../library-members-service
npm install

cd ../library-issues-service
npm install

cd ../library-requests-service
npm install

# 2. Start infrastructure services
cd ../../
docker-compose up -d mongodb kafka

# 3. Start all microservices (development mode)
# In separate terminals:
cd services/library-books-service && npm run start:dev
cd services/library-members-service && npm run start:dev
cd services/library-issues-service && npm run start:dev
cd services/library-requests-service && npm run start:dev

# 4. Start API Gateway
cd api-gateway && npm run start:dev
```

### Docker Deployment

```bash
# Start all services including infrastructure
docker-compose up -d

# Scale specific service
docker-compose up -d --scale library-books-service=3
```

### Environment Variables

Each service requires:

```env
PORT=3001                    # Service port (varies per service)
MONGODB_URI=mongodb://...    # MongoDB connection
KAFKA_BROKER=localhost:9092  # Kafka broker address
```

## API Documentation

Once services are running, Swagger docs available at:

- Books Service: `http://localhost:3001/api/docs`
- Members Service: `http://localhost:3012/api/docs`
- Issues Service: `http://localhost:3013/api/docs`
- Requests Service: `http://localhost:3014/api/docs`

## Development Guidelines

### 1. Controller Rules
- No business logic in controllers
- Only request validation + service calls
- Use DTOs for all inputs

### 2. Service Rules
- All business logic inside services
- No direct DB access outside repository layer
- Emit events for state changes

### 3. DTO Rules
- All inputs must use DTOs
- Must use validation decorators
- No `any` type allowed

### 4. Error Handling
- Use global exception filter
- Do not expose internal stack traces
- Standard error response format:
```json
{
  "statusCode": 404,
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/library/books/123",
  "message": "Book not found",
  "error": "Not Found"
}
```

## Health Checks

Each service exposes health endpoints:

```
GET /health          - Basic health check
GET /health/detailed - Detailed status with DB/Kafka connectivity
```

## Monitoring & Observability

### Structured Logging
All services use NestJS Logger with structured JSON output:
```json
{
  "timestamp": "2024-01-01T00:00:00.000Z",
  "level": "error",
  "service": "library-books-service",
  "requestId": "uuid",
  "message": "Book not found",
  "context": { "bookId": "123" }
}
```

### Request Tracing
- Correlation IDs passed through all requests
- Traced across Kafka events

## Testing

```bash
# Unit tests
npm test

# Coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

Coverage requirement: **>80%**

## CI/CD Pipeline

```yaml
1. Lint check
2. Unit test (coverage > 80%)
3. Build Docker image
4. Push to registry
5. Deploy to staging
6. Smoke test
7. Deploy to production
```

## Security

- JWT authentication required for all endpoints
- Role-based access control (RBAC)
- Input validation on all DTOs
- No open internal endpoints
- Inter-service authentication via service tokens

## Versioning

- API versioning: `/v1/`, `/v2/`
- Backward compatibility mandatory
- Event versioning if schema changes

## Support

For issues or questions, refer to:
- NestJS Docs: https://docs.nestjs.com
- Microservices Pattern: https://microservices.io
