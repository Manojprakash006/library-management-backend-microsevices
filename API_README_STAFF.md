# Staff API Documentation

## Overview

This document describes all APIs available for **Staff** users in the Library Management System. Staff users can manage books, issue/return books, and view their dashboard statistics.

**Base URL:** `http://localhost:3000` (API Gateway)

**Gateway Routes:**
- `/library/books/*` → library-books-service:3001
- `/library/members/*` → library-members-service:3012
- `/library/issues/*` → library-issues-service:3013
- `/library/requests/*` → library-requests-service:3014

**Authentication:** Bearer Token (JWT) required for all endpoints except public ones.

---

## Table of Contents

1. [Authentication](#1-authentication)
2. [Staff Dashboard](#2-staff-dashboard)
3. [Book Management](#3-book-management)
4. [Issue Books](#4-issue-books)
5. [Racks](#5-racks)

---

## 1. Authentication

### POST `/library/members/staff/login`
- **Description:** Staff login
- **Access:** Public
- **Microservice:** library-members-service
- **Full URL:** `http://localhost:3000/library/members/staff/login`
- **Request Body:**
  ```json
  {
    "email": "staff@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Login successful",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIs...",
      "user": { "id": "...", "email": "...", "role": "staff" }
    }
  }
  ```

### POST `/library/members/auth/login`
- **Description:** Alternative login endpoint
- **Access:** Public
- **Microservice:** library-members-service
- **Full URL:** `http://localhost:3000/library/members/auth/login`
- **Request Body:**
  ```json
  {
    "email": "staff@example.com",
    "password": "password123"
  }
  ```

### POST `/library/members/auth/register`
- **Description:** User registration
- **Access:** Public
- **Microservice:** library-members-service
- **Full URL:** `http://localhost:3000/library/members/auth/register`

### POST `/library/members/auth/refresh-token`
- **Description:** Refresh access token
- **Access:** Public
- **Microservice:** library-members-service
- **Full URL:** `http://localhost:3000/library/members/auth/refresh-token`

### POST `/library/members/auth/logout`
- **Description:** User logout
- **Access:** Public
- **Microservice:** library-members-service
- **Full URL:** `http://localhost:3000/library/members/auth/logout`

---

## 2. Staff Dashboard

### GET `/library/members/staff-dashboard/stat-cards`
- **Description:** Get staff dashboard statistics cards
- **Access:** Staff only
- **Microservice:** library-members-service
- **Response:** Statistics about books added, issues handled, etc.

### GET `/library/members/staff-dashboard/books-added-today`
- **Description:** Get books added today by staff
- **Access:** Staff only
- **Microservice:** library-members-service

### GET `/library/members/staff-dashboard/recent-activities`
- **Description:** Get recent staff activities
- **Access:** Staff only
- **Microservice:** library-members-service

### GET `/library/members/staff-dashboard/rack-distribution`
- **Description:** Get rack distribution data
- **Access:** Staff only
- **Microservice:** library-members-service

### POST `/library/members/staff-dashboard/books`
- **Description:** Add new book from staff dashboard
- **Access:** Staff only
- **Microservice:** library-members-service
- **Request Body:**
  ```json
  {
    "bookId": "BOOK001",
    "title": "Book Title",
    "author": "Author Name",
    "category": "Fiction",
    "rackNumber": "A1",
    "price": 29.99
  }
  ```

### GET `/library/members/staff-dashboard/my-activity-logs`
- **Description:** Get my activity logs
- **Access:** Staff only
- **Microservice:** library-members-service

### GET `/library/members/staff-dashboard/my-profile`
- **Description:** Get staff profile
- **Access:** Staff only
- **Microservice:** library-members-service

### GET `/library/members/staff-dashboard/my-contribution`
- **Description:** Get staff contribution statistics
- **Access:** Staff only
- **Microservice:** library-members-service

### GET `/library/members/staff-dashboard/books-by-category`
- **Description:** Get books grouped by category
- **Access:** Staff only
- **Microservice:** library-members-service

### GET `/library/members/staff-dashboard/rack-utilization`
- **Description:** Get rack utilization data
- **Access:** Staff only
- **Microservice:** library-members-service

### GET `/library/members/staff-dashboard/books-status-distribution`
- **Description:** Get books status distribution
- **Access:** Staff only
- **Microservice:** library-members-service

---

## 3. Book Management

### GET `/library/books/books`
- **Description:** Get all books
- **Access:** Public/Authenticated
- **Microservice:** library-books-service
- **Response:**
  ```json
  {
    "message": "Books retrieved successfully",
    "data": [...],
    "count": 50
  }
  ```

### GET `/library/books/books/:id`
- **Description:** Get book by ID
- **Access:** Public/Authenticated
- **Microservice:** library-books-service
- **Response:**
  ```json
  {
    "message": "Book retrieved successfully",
    "data": { ... }
  }
  ```

### GET `/library/books/books/search?q={query}`
- **Description:** Search books by text
- **Access:** Public/Authenticated
- **Microservice:** library-books-service
- **Query Parameters:**
  - `q` - Search query text
- **Response:**
  ```json
  {
    "message": "Search results",
    "data": [...],
    "count": 10
  }
  ```

### GET `/library/books/books/category/:category`
- **Description:** Get books by category
- **Access:** Public/Authenticated
- **Microservice:** library-books-service
- **Path Parameters:**
  - `category` - Book category (e.g., Fiction, Science, History)

### POST `/library/books/books`
- **Description:** Create new book
- **Access:** Admin/Staff
- **Microservice:** library-books-service
- **Request Body:**
  ```json
  {
    "bookId": "BOOK001",
    "title": "Book Title",
    "author": "Author Name",
    "category": "Fiction",
    "rackNumber": "A1",
    "price": 29.99,
    "status": "available"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Book created successfully",
    "data": { ... }
  }
  ```

### PUT `/library/books/books/:id`
- **Description:** Update book
- **Access:** Admin/Staff
- **Microservice:** library-books-service
- **Request Body:**
  ```json
  {
    "title": "Updated Title",
    "author": "Updated Author",
    "status": "issued"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Book updated successfully",
    "data": { ... }
  }
  ```

### DELETE `/library/books/books/:id`
- **Description:** Delete book
- **Access:** Admin/Staff
- **Microservice:** library-books-service
- **Response:**
  ```json
  {
    "message": "Book deleted successfully"
  }
  ```

### GET `/library/books/books/reviews/:bookId`
- **Description:** Get reviews by book ID
- **Access:** Public/Authenticated
- **Microservice:** library-books-service

---

## 4. Issue Books

### POST `/library/issues/issue-books`
- **Description:** Issue a book to member
- **Access:** Admin/Staff
- **Microservice:** library-issues-service
- **Request Body:**
  ```json
  {
    "bookId": "BOOK001",
    "memberId": "MEMBER001",
    "issueDate": "2026-03-09",
    "returnDate": "2026-03-23"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Book issued successfully",
    "data": { ... }
  }
  ```

### GET `/library/issues/issue-books`
- **Description:** Get all issued books
- **Access:** Admin/Staff
- **Microservice:** library-issues-service

### GET `/library/issues/issue-books/:id`
- **Description:** Get issue by ID
- **Access:** Admin/Staff
- **Microservice:** library-issues-service

### PUT `/library/issues/issue-books/:id`
- **Description:** Update issue record
- **Access:** Admin/Staff
- **Microservice:** library-issues-service

### PUT `/library/issues/issue-books/:id/return`
- **Description:** Return issued book
- **Access:** Admin/Staff
- **Microservice:** library-issues-service
- **Response:**
  ```json
  {
    "message": "Book returned successfully",
    "data": { ... }
  }
  ```

### DELETE `/library/issues/issue-books/:id`
- **Description:** Delete issue record
- **Access:** Admin/Staff
- **Microservice:** library-issues-service

---

## 5. Racks

### GET `/library/books/racks`
- **Description:** Get all racks
- **Access:** Admin/Staff/Member
- **Microservice:** library-books-service
- **Response:**
  ```json
  {
    "message": "Racks retrieved successfully",
    "data": [...],
    "count": 10
  }
  ```

### GET `/library/books/racks/:rackNumber`
- **Description:** Get rack by number with books
- **Access:** Admin/Staff/Member
- **Microservice:** library-books-service
- **Path Parameters:**
  - `rackNumber` - Rack identifier (e.g., A1, B2)
- **Response:**
  ```json
  {
    "message": "Rack retrieved successfully",
    "data": {
      "rackNumber": "A1",
      "books": [...]
    }
  }
  ```

---

## Authentication Header

For all protected endpoints, include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## Response Format

All APIs follow a consistent response format:

**Success Response:**
```json
{
  "message": "Operation successful",
  "data": { ... },
  "count": 10
}
```

**Error Response:**
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Error description"
}
```

---

## HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden (Staff role required)
- `404` - Not Found
- `409` - Conflict

---

## Microservices Overview

| Microservice | Description |
|--------------|-------------|
| **library-books-service** | Books, racks, search |
| **library-members-service** | Staff dashboard, auth |
| **library-issues-service** | Book issues, returns |

---

## Staff Permissions Summary

| Feature | Permission |
|---------|------------|
| View Books | Read |
| Add Books | Create |
| Edit Books | Update |
| Delete Books | Delete |
| Issue Books | Create/Update |
| Return Books | Update |
| View Racks | Read |
| View Dashboard | Read |
| View Own Profile | Read |

---

*Generated for Staff role - Library Management System Microservices*
