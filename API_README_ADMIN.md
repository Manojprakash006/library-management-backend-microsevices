# Admin API Documentation

## Overview

This document describes all APIs available for **Admin** users in the Library Management System. Admin users have full access to manage books, staff, members, reports, and system operations.

**Base URL:** `http://localhost:3000` (API Gateway)

**Gateway Routes:**
- `/library/books/*` → library-books-service
- `/library/members/*` → library-members-service
- `/library/issues/*` → library-issues-service
- `/library/requests/*` → library-requests-service

**Authentication:** Bearer Token (JWT) required for all endpoints except public ones.

---

## Table of Contents

1. [Authentication](#1-authentication)
2. [Dashboard](#2-dashboard)
3. [Staff Management](#3-staff-management)
4. [Member Management](#4-member-management)
5. [Book Management](#5-book-management)
6. [Book Requests](#6-book-requests)
7. [Issue Books](#7-issue-books)
8. [Damage Reports](#8-damage-reports)
9. [Renewals](#9-renewals)
10. [Reports](#10-reports)
11. [Racks](#11-racks)
12. [Activity Logs](#12-activity-logs)
13. [Notifications](#13-notifications)
14. [Utility](#14-utility)

---

## 1. Authentication

### POST `/library/members/auth/login`
- **Description:** Admin login
- **Access:** Public
- **Microservice:** library-members-service
- **Gateway Path:** `/library/members/auth/login`
- **Service Path:** `/auth/login`
- **Full URL:** `http://localhost:3000/library/members/auth/login`
- **Request Body:**
  ```json
  {
    "email": "admin@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": { "id": "...", "email": "...", "role": "admin" }
  }
  ```

### POST `/library/members/auth/register`
- **Description:** Register new user
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

## 2. Dashboard

### GET `/library/books/dashboard/stat-cards`
- **Description:** Get dashboard statistics cards
- **Access:** Admin only
- **Microservice:** library-books-service
- **Full URL:** `http://localhost:3000/library/books/dashboard/stat-cards`
- **Response:** Statistics about books, members, issues, and overdue items

### GET `/library/books/dashboard/recent-books`
- **Description:** Get recently added books
- **Access:** Admin only
- **Microservice:** library-books-service
- **Full URL:** `http://localhost:3000/library/books/dashboard/recent-books`

### GET `/library/books/dashboard/overdue-books`
- **Description:** Get overdue books list
- **Access:** Admin only
- **Microservice:** library-books-service
- **Full URL:** `http://localhost:3000/library/books/dashboard/overdue-books`

### GET `/library/books/dashboard/pending-requests`
- **Description:** Get pending book requests
- **Access:** Admin only
- **Microservice:** library-books-service
- **Full URL:** `http://localhost:3000/library/books/dashboard/pending-requests`

### GET `/library/books/dashboard/pending`
- **Description:** Get pending items (alias)
- **Access:** Admin only
- **Microservice:** library-books-service
- **Full URL:** `http://localhost:3000/library/books/dashboard/pending`

---

## 3. Staff Management

### POST `/library/members/staff/login`
- **Description:** Staff login (public endpoint)
- **Access:** Public
- **Microservice:** library-members-service
- **Request Body:**
  ```json
  {
    "email": "staff@example.com",
    "password": "password123"
  }
  ```

### POST `/library/members/staff`
- **Description:** Create new staff member
- **Access:** Admin only
- **Microservice:** library-members-service
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "staff@example.com",
    "password": "password123",
    "phone": "1234567890"
  }
  ```

### GET `/library/members/staff`
- **Description:** Get all staff members
- **Access:** Admin only
- **Microservice:** library-members-service
- **Response:**
  ```json
  {
    "message": "Staff retrieved successfully",
    "data": [...],
    "count": 5
  }
  ```

### GET `/library/members/staff/:id`
- **Description:** Get staff by ID
- **Access:** Admin only
- **Microservice:** library-members-service

### PUT `/library/members/staff/:id`
- **Description:** Update staff member
- **Access:** Admin only
- **Microservice:** library-members-service
- **Request Body:**
  ```json
  {
    "name": "Updated Name",
    "phone": "9876543210"
  }
  ```

### DELETE `/library/members/staff/:id`
- **Description:** Delete staff member
- **Access:** Admin only
- **Microservice:** library-members-service

---

## 4. Member Management

### POST `/library/members/members`
- **Description:** Create new member
- **Access:** Admin only
- **Microservice:** library-members-service
- **Request Body:**
  ```json
  {
    "name": "Jane Doe",
    "email": "member@example.com",
    "password": "password123",
    "phone": "1234567890"
  }
  ```

### GET `/library/members/members`
- **Description:** Get all members
- **Access:** Admin only
- **Microservice:** library-members-service

### GET `/library/members/members/:id`
- **Description:** Get member by ID
- **Access:** Admin only
- **Microservice:** library-members-service

### PUT `/library/members/members/:id`
- **Description:** Update member
- **Access:** Admin only
- **Microservice:** library-members-service

### DELETE `/library/members/members/:id`
- **Description:** Delete member
- **Access:** Admin only
- **Microservice:** library-members-service

---

## 5. Book Management

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

### GET `/library/books/books/search?q={query}`
- **Description:** Search books by text
- **Access:** Public/Authenticated
- **Microservice:** library-books-service

### GET `/library/books/books/category/:category`
- **Description:** Get books by category
- **Access:** Public/Authenticated
- **Microservice:** library-books-service

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

### PUT `/library/books/books/:id`
- **Description:** Update book
- **Access:** Admin/Staff
- **Microservice:** library-books-service

### DELETE `/library/books/books/:id`
- **Description:** Delete book
- **Access:** Admin/Staff
- **Microservice:** library-books-service

### POST `/library/books/books/reviews`
- **Description:** Create a book review
- **Access:** Member
- **Microservice:** library-books-service

### GET `/library/books/books/reviews/:bookId`
- **Description:** Get reviews by book ID
- **Access:** Public/Authenticated
- **Microservice:** library-books-service

---

## 6. Book Requests

### POST `/library/books/book-requests`
- **Description:** Create new book request
- **Access:** Admin only
- **Microservice:** library-books-service

### GET `/library/books/book-requests`
- **Description:** Get all book requests
- **Access:** Admin only
- **Microservice:** library-books-service

### GET `/library/books/book-requests/:id`
- **Description:** Get request by ID
- **Access:** Admin/Member
- **Microservice:** library-books-service

### PUT `/library/books/book-requests/:id`
- **Description:** Update book request
- **Access:** Admin only
- **Microservice:** library-books-service

### DELETE `/library/books/book-requests/:id`
- **Description:** Delete book request
- **Access:** Admin only
- **Microservice:** library-books-service

### PUT `/library/books/book-requests/:id/approve`
- **Description:** Approve book request
- **Access:** Admin only
- **Microservice:** library-books-service

### PUT `/library/books/book-requests/:id/reject`
- **Description:** Reject book request
- **Access:** Admin only
- **Microservice:** library-books-service

---

## 7. Issue Books

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

### DELETE `/library/issues/issue-books/:id`
- **Description:** Delete issue record
- **Access:** Admin/Staff
- **Microservice:** library-issues-service

---

## 8. Damage Reports

### GET `/library/issues/damage-reports`
- **Description:** Get all damage reports
- **Access:** Admin only
- **Microservice:** library-issues-service

### PUT `/library/issues/damage-reports/approve/:reportId`
- **Description:** Approve damage report
- **Access:** Admin only
- **Microservice:** library-issues-service

### PUT `/library/issues/damage-reports/reject/:reportId`
- **Description:** Reject damage report
- **Access:** Admin only
- **Microservice:** library-issues-service

---

## 9. Renewals

### POST `/library/issues/renewals`
- **Description:** Create renewal request
- **Access:** Admin/Member
- **Microservice:** library-issues-service

### GET `/library/issues/renewals`
- **Description:** Get all renewals
- **Access:** Admin only
- **Microservice:** library-issues-service

### GET `/library/issues/renewals/:id`
- **Description:** Get renewal by ID
- **Access:** Admin/Member
- **Microservice:** library-issues-service

### PUT `/library/issues/renewals/:id/approve`
- **Description:** Approve renewal
- **Access:** Admin only
- **Microservice:** library-issues-service

### PUT `/library/issues/renewals/:id/reject`
- **Description:** Reject renewal
- **Access:** Admin only
- **Microservice:** library-issues-service

### DELETE `/library/issues/renewals/:id`
- **Description:** Delete renewal
- **Access:** Admin only
- **Microservice:** library-issues-service

---

## 10. Reports

### GET `/library/books/reports`
- **Description:** Get all reports
- **Access:** Admin only
- **Microservice:** library-books-service

### GET `/library/books/reports/daily-issue-return`
- **Description:** Get daily issue/return report
- **Access:** Admin only
- **Microservice:** library-books-service

### GET `/library/books/reports/overdue`
- **Description:** Get overdue books report
- **Access:** Admin only
- **Microservice:** library-books-service

### GET `/library/books/reports/rack-inventory`
- **Description:** Get rack inventory report
- **Access:** Admin only
- **Microservice:** library-books-service

### GET `/library/books/reports/rack-inventory/:rackNumber`
- **Description:** Get rack inventory by rack number
- **Access:** Admin only
- **Microservice:** library-books-service

### GET `/library/books/reports/member-activity`
- **Description:** Get member activity report
- **Access:** Admin only
- **Microservice:** library-books-service

---

## 11. Racks

### GET `/library/books/racks`
- **Description:** Get all racks
- **Access:** Admin/Staff/Member
- **Microservice:** library-books-service

### GET `/library/books/racks/:rackNumber`
- **Description:** Get rack by number
- **Access:** Admin/Staff/Member
- **Microservice:** library-books-service

---

## 12. Activity Logs

### GET `/library/members/activities/recent`
- **Description:** Get recent activities
- **Access:** Admin only
- **Microservice:** library-members-service

### GET `/library/members/activities/logs`
- **Description:** Get activity logs
- **Access:** Admin only
- **Microservice:** library-members-service

### POST `/library/members/activities/logs`
- **Description:** Create activity log
- **Access:** Admin only
- **Microservice:** library-members-service

---

## 13. Notifications

### POST `/library/members/notifications/send-due-reminders`
- **Description:** Send due date reminders
- **Access:** Admin only
- **Microservice:** library-members-service

### POST `/library/members/notifications/send-overdue`
- **Description:** Send overdue notifications
- **Access:** Admin only
- **Microservice:** library-members-service

---

## 14. Utility

### DELETE `/library/books/util/clear-all`
- **Description:** Clear all data (use with caution)
- **Access:** Admin only
- **Microservice:** library-books-service

### GET `/library/books/util/health`
- **Description:** Health check
- **Access:** Public
- **Microservice:** library-books-service

### GET `/library/books/util/ping`
- **Description:** Ping service
- **Access:** Public
- **Microservice:** library-books-service

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
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict

---

## Microservices Overview

| Microservice | Description |
|--------------|-------------|
| **library-books-service** | Books, racks, reports, dashboard |
| **library-members-service** | Users, staff, members, auth, notifications |
| **library-issues-service** | Book issues, returns, damage reports, renewals |
| **library-requests-service** | Book requests processing |

---

*Generated for Admin role - Library Management System Microservices*
