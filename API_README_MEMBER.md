# Member API Documentation

## Overview

This document describes all APIs available for **Member** users in the Library Management System. Members can browse books, manage their borrowed books, submit requests, and view their dashboard.

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
2. [Member Dashboard](#2-member-dashboard)
3. [Browse Books](#3-browse-books)
4. [Book Requests](#4-book-requests)
5. [Member History](#5-member-history)
6. [Notifications](#6-notifications)
7. [Racks](#7-racks)
8. [Renewals](#8-renewals)

---

## 1. Authentication

### POST `/library/members/member-auth/login`
- **Description:** Member login
- **Access:** Public
- **Microservice:** library-members-service
- **Full URL:** `http://localhost:3000/library/members/member-auth/login`
- **Request Body:**
  ```json
  {
    "email": "member@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": { "id": "...", "email": "...", "role": "member" }
  }
  ```

### POST `/library/members/member-auth/register`
- **Description:** Member registration
- **Access:** Public
- **Microservice:** library-members-service
- **Full URL:** `http://localhost:3000/library/members/member-auth/register`
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "member@example.com",
    "password": "password123",
    "phone": "1234567890"
  }
  ```

### GET `/library/members/member-auth/profile`
- **Description:** Get member profile
- **Access:** Member only
- **Microservice:** library-members-service
- **Full URL:** `http://localhost:3000/library/members/member-auth/profile`
- **Response:**
  ```json
  {
    "message": "Profile retrieved successfully",
    "data": { ... }
  }
  ```

### POST `/library/members/auth/login`
- **Description:** Alternative login endpoint
- **Access:** Public
- **Microservice:** library-members-service
- **Full URL:** `http://localhost:3000/library/members/auth/login`

### POST `/library/members/auth/register`
- **Description:** User registration
- **Access:** Public
- **Microservice:** library-members-service
- **Full URL:** `http://localhost:3000/library/members/auth/register`

### POST `/library/members/auth/logout`
- **Description:** User logout
- **Access:** Public
- **Microservice:** library-members-service
- **Full URL:** `http://localhost:3000/library/members/auth/logout`

---

## 2. Member Dashboard

### GET `/library/members/member-dashboard/stats`
- **Description:** Get member dashboard statistics
- **Access:** Member only
- **Microservice:** library-members-service
- **Response:**
  ```json
  {
    "message": "Stats retrieved successfully",
    "data": {
      "totalBorrowed": 3,
      "totalReturned": 10,
      "overdueCount": 1,
      "pendingRequests": 2
    }
  }
  ```

### GET `/library/members/member-dashboard/overdue-books`
- **Description:** Get overdue books for member
- **Access:** Member only
- **Microservice:** library-members-service
- **Response:**
  ```json
  {
    "message": "Overdue books retrieved",
    "data": [...]
  }
  ```

### GET `/library/members/member-dashboard/recent-requests`
- **Description:** Get recent book requests
- **Access:** Member only
- **Microservice:** library-members-service

### GET `/library/members/member-dashboard/borrowed-books`
- **Description:** Get currently borrowed books
- **Access:** Member only
- **Microservice:** library-members-service
- **Response:**
  ```json
  {
    "message": "Borrowed books retrieved",
    "data": [
      {
        "bookId": "BOOK001",
        "title": "Book Title",
        "issueDate": "2026-03-01",
        "returnDate": "2026-03-15"
      }
    ]
  }
  ```

### GET `/library/members/member-dashboard/book-details/:issueId`
- **Description:** Get book details by issue ID
- **Access:** Member only
- **Microservice:** library-members-service
- **Path Parameters:**
  - `issueId` - Issue record ID

### GET `/library/members/member-dashboard/my-books`
- **Description:** Get all my books (borrowed history)
- **Access:** Member only
- **Microservice:** library-members-service

### POST `/library/members/member-dashboard/report-damage`
- **Description:** Report book damage
- **Access:** Member only
- **Microservice:** library-members-service
- **Request Body:**
  ```json
  {
    "bookId": "BOOK001",
    "issueId": "ISSUE001",
    "damageDescription": "Pages torn",
    "damageType": "physical"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Damage report submitted",
    "data": { ... }
  }
  ```

### POST `/library/members/member-dashboard/renew-book`
- **Description:** Request book renewal
- **Access:** Member only
- **Microservice:** library-members-service
- **Request Body:**
  ```json
  {
    "issueId": "ISSUE001",
    "requestedReturnDate": "2026-03-30"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Book renewal requested",
    "data": { ... }
  }
  ```

### POST `/library/members/member-dashboard/submit-review`
- **Description:** Submit a book review
- **Access:** Member only
- **Microservice:** library-members-service
- **Request Body:**
  ```json
  {
    "bookId": "BOOK001",
    "rating": 5,
    "review": "Excellent book!",
    "title": "Great Read"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Review submitted",
    "data": { ... }
  }
  ```

---

## 3. Browse Books

### GET `/library/books/member-books/browse`
- **Description:** Browse available books
- **Access:** Member only
- **Microservice:** library-books-service
- **Response:**
  ```json
  {
    "message": "Books retrieved successfully",
    "data": [...],
    "count": 25
  }
  ```

### GET `/library/books/member-books/:bookId`
- **Description:** Get book details
- **Access:** Member only
- **Microservice:** library-books-service
- **Path Parameters:**
  - `bookId` - Book ID
- **Response:**
  ```json
  {
    "message": "Book retrieved successfully",
    "data": {
      "bookId": "BOOK001",
      "title": "Book Title",
      "author": "Author Name",
      "category": "Fiction",
      "status": "available"
    }
  }
  ```

### POST `/library/books/member-books/request`
- **Description:** Request a book
- **Access:** Member only
- **Microservice:** library-books-service
- **Request Body:**
  ```json
  {
    "bookId": "BOOK001",
    "requestDate": "2026-03-09",
    "notes": "Would like to borrow this book"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Book requested successfully",
    "data": { ... }
  }
  ```

### GET `/library/books/books`
- **Description:** Get all books (public catalog)
- **Access:** Public/Authenticated
- **Microservice:** library-books-service

### GET `/library/books/books/:id`
- **Description:** Get book by ID
- **Access:** Public/Authenticated
- **Microservice:** library-books-service

### GET `/library/books/books/search?q={query}`
- **Description:** Search books by text
- **Access:** Public/Authenticated
- **Microservice:** library-books-service
- **Query Parameters:**
  - `q` - Search query text

### GET `/library/books/books/category/:category`
- **Description:** Get books by category
- **Access:** Public/Authenticated
- **Microservice:** library-books-service

### GET `/library/books/books/reviews/:bookId`
- **Description:** Get reviews for a book
- **Access:** Public/Authenticated
- **Microservice:** library-books-service

---

## 4. Book Requests

### GET `/library/books/book-requests/member/my-requests`
- **Description:** Get my book requests
- **Access:** Member only
- **Microservice:** library-books-service
- **Response:**
  ```json
  {
    "message": "Requests retrieved successfully",
    "data": [...]
  }
  ```

### GET `/library/books/book-requests/:id`
- **Description:** Get request details
- **Access:** Admin/Member (own requests)
- **Microservice:** library-books-service
- **Path Parameters:**
  - `id` - Request ID

### PUT `/library/books/book-requests/:id/cancel`
- **Description:** Cancel book request
- **Access:** Member only (own requests)
- **Microservice:** library-books-service
- **Response:**
  ```json
  {
    "message": "Request cancelled successfully"
  }
  ```

---

## 5. Member History

### GET `/library/members/member-history/history`
- **Description:** Get borrowing history
- **Access:** Member only
- **Microservice:** library-members-service
- **Response:**
  ```json
  {
    "message": "History retrieved successfully",
    "data": [
      {
        "bookId": "BOOK001",
        "title": "Book Title",
        "borrowedDate": "2026-01-01",
        "returnedDate": "2026-01-15",
        "status": "returned"
      }
    ]
  }
  ```

### POST `/library/members/member-history/request-again`
- **Description:** Request a previously borrowed book again
- **Access:** Member only
- **Microservice:** library-members-service
- **Request Body:**
  ```json
  {
    "bookId": "BOOK001"
  }
  ```

### GET `/library/members/member-history/reviews`
- **Description:** Get my reviews
- **Access:** Member only
- **Microservice:** library-members-service

### POST `/library/members/member-history/reviews`
- **Description:** Add review for a book
- **Access:** Member only
- **Microservice:** library-members-service
- **Request Body:**
  ```json
  {
    "bookId": "BOOK001",
    "rating": 4,
    "review": "Good book",
    "title": "Nice Read"
  }
  ```

### PUT `/library/members/member-history/reviews/:id`
- **Description:** Update my review
- **Access:** Member only
- **Microservice:** library-members-service

### DELETE `/library/members/member-history/reviews/:id`
- **Description:** Delete my review
- **Access:** Member only
- **Microservice:** library-members-service

---

## 6. Notifications

### GET `/library/members/notifications/member`
- **Description:** Get member notifications
- **Access:** Member only
- **Microservice:** library-members-service
- **Response:**
  ```json
  {
    "message": "Notifications retrieved",
    "data": [
      {
        "id": "NOTIF001",
        "type": "due_reminder",
        "message": "Book due tomorrow",
        "isRead": false
      }
    ]
  }
  ```

### PUT `/library/members/notifications/:id/read`
- **Description:** Mark notification as read
- **Access:** Member only
- **Microservice:** library-members-service
- **Path Parameters:**
  - `id` - Notification ID
- **Response:**
  ```json
  {
    "message": "Notification marked as read"
  }
  ```

### PUT `/library/members/notifications/read-all`
- **Description:** Mark all notifications as read
- **Access:** Member only
- **Microservice:** library-members-service
- **Response:**
  ```json
  {
    "message": "All notifications marked as read"
  }
  ```

---

## 7. Racks

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
- **Description:** Get rack by number
- **Access:** Admin/Staff/Member
- **Microservice:** library-books-service
- **Path Parameters:**
  - `rackNumber` - Rack identifier (e.g., A1, B2)

---

## 8. Renewals

### POST `/library/issues/renewals`
- **Description:** Create renewal request
- **Access:** Admin/Member
- **Microservice:** library-issues-service
- **Request Body:**
  ```json
  {
    "issueId": "ISSUE001",
    "requestedReturnDate": "2026-03-30",
    "reason": "Need more time to read"
  }
  ```

### GET `/library/issues/renewals/:id`
- **Description:** Get renewal by ID
- **Access:** Admin/Member (own renewals)
- **Microservice:** library-issues-service

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
- `403` - Forbidden (Member role required)
- `404` - Not Found
- `409` - Conflict

---

## Microservices Overview

| Microservice | Description |
|--------------|-------------|
| **library-books-service** | Browse books, racks, reviews, requests |
| **library-members-service** | Member dashboard, history, notifications, auth |
| **library-issues-service** | Renewals |

---

## Member Permissions Summary

| Feature | Permission |
|---------|------------|
| Browse Books | Read |
| Search Books | Read |
| Request Book | Create |
| View Borrowed Books | Read |
| Return Book | Update |
| Renew Book | Create |
| Submit Review | Create/Update/Delete |
| Report Damage | Create |
| View History | Read |
| View Notifications | Read/Update |
| Cancel Request | Update |

---

## Common Workflows

### 1. Borrowing a Book
1. `GET /member-books/browse` - Find available book
2. `POST /member-books/request` - Request the book
3. Wait for admin/staff to approve and issue
4. `GET /member-dashboard/borrowed-books` - View borrowed book

### 2. Returning a Book
1. `GET /member-dashboard/borrowed-books` - View current books
2. Return book to library physically
3. Staff processes return via `PUT /issue-books/:id/return`

### 3. Renewing a Book
1. `GET /member-dashboard/borrowed-books` - Find book to renew
2. `POST /member-dashboard/renew-book` or `POST /renewals/` - Submit renewal request
3. Wait for admin approval via `PUT /renewals/:id/approve`

### 4. Writing a Review
1. `GET /member-history/history` - Find returned book
2. `POST /member-history/reviews` or `POST /member-dashboard/submit-review` - Submit review

---

*Generated for Member role - Library Management System Microservices*
