# Library Management System - Microservices COMPLETE Documentation

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Service 1: Library Books Service (DETAILED)](#service-1-library-books-service-detailed)
3. [Service 2: Library Members Service (DETAILED)](#service-2-library-members-service-detailed)
4. [Service 3: Library Issues Service (DETAILED)](#service-3-library-issues-service-detailed)
5. [Service 4: Library Requests Service (DETAILED)](#service-4-library-requests-service-detailed)
6. [Complete API Endpoint List](#complete-api-endpoint-list)
7. [Database Schema Details](#database-schema-details)
8. [Quick Commands](#quick-commands)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           API GATEWAY (Port 3000)                          │
│                    Single Entry Point for All Clients                       │
│                                                                              │
│  Routes:                                                                     │
│  • /library/books/*     →  Books Service (3001)                               │
│  • /library/members/*   →  Members Service (3012)                           │
│  • /library/issues/*    →  Issues Service (3013)                            │
│  • /library/requests/*  →  Requests Service (3014)                            │
└──────────────────────┬──────────────────────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┬──────────────┐
        │              │              │              │
        ▼              ▼              ▼              ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│   BOOKS      │ │   MEMBERS    │ │   ISSUES     │ │  REQUESTS    │
│   SERVICE    │ │   SERVICE    │ │   SERVICE    │ │   SERVICE    │
│   :3001      │ │   :3012      │ │   :3013      │ │   :3014      │
│              │ │              │ │              │ │              │
│ gRPC:5001    │ │ gRPC:5002    │ │ gRPC:5003    │ │ gRPC:5004    │
│              │ │              │ │              │ │              │
│ 8 Modules    │ │ 11 Modules   │ │ 3 Modules    │ │ 1 Module     │
│ 10 Controllers│ │ 11 Controllers│ │ 3 Controllers│ │ 1 Controller │
│ 2 Entities   │ │ 5 Entities   │ │ 3 Entities   │ │ 1 Entity     │
└──────┬───────┘ └──────┬───────┘ └──────┬───────┘ └──────┬───────┘
       │                  │                  │                  │
       └──────────────────┴──────────────────┴──────────────────┘
                          │
            ┌─────────────┴─────────────┐
            │    MongoDB Atlas Cloud    │
            │  ───────────────────────  │
            │  • library_books DB      │
            │  • library_members DB    │
            │  • library_issues DB     │
            │  • library_requests DB   │
            └───────────────────────────┘
```

**Summary:**
| Service | Port | gRPC | Modules | Controllers | Entities | APIs |
|---------|------|------|---------|-------------|----------|------|
| Gateway | 3000 | - | 1 | 0 | 0 | 0 (routes only) |
| Books | 3001 | 5001 | 8 | 10 | 2 | 47 |
| Members | 3012 | 5002 | 11 | 11 | 5 | 78 |
| Issues | 3013 | 5003 | 3 | 3 | 3 | 18 |
| Requests | 3014 | 5004 | 1 | 1 | 1 | 7 |
| **TOTAL** | - | - | **23** | **25** | **11** | **148** |

---

## Service 1: Library Books Service (DETAILED)

**📍 Location:** `services/library-books-service/`  
**🌐 HTTP Port:** `3001`  
**📡 gRPC Port:** `5001`  
**🗄️ Database:** `library_books`  

### Complete Folder Structure (EVERY FILE)

```
library-books-service/
├── src/
│   ├── modules/                          ← 8 MODULES
│   │   │
│   │   ├── books/                        📚 BOOK CATALOG MODULE
│   │   │   ├── controller/
│   │   │   │   └── books.controller.ts      ← 10 API endpoints
│   │   │   ├── service/
│   │   │   │   └── books.service.ts       ← Business logic
│   │   │   ├── dto/
│   │   │   │   ├── create-book.dto.ts     ← Create validation
│   │   │   │   ├── update-book.dto.ts     ← Update validation
│   │   │   │   └── create-book-review.dto.ts ← Review validation
│   │   │   ├── entities/
│   │   │   │   ├── book.entity.ts         ← Book schema (20 fields)
│   │   │   │   └── book-review.entity.ts  ← Review schema
│   │   │   └── books.module.ts
│   │   │
│   │   ├── book-requests/                 📝 BOOK REQUESTS MODULE
│   │   │   ├── controller/
│   │   │   │   └── book-requests.controller.ts ← 7 endpoints
│   │   │   ├── service/
│   │   │   │   └── book-requests.service.ts
│   │   │   ├── dto/
│   │   │   │   └── create-book-request.dto.ts
│   │   │   ├── entities/
│   │   │   │   └── book-request.entity.ts
│   │   │   └── book-requests.module.ts
│   │   │
│   │   ├── racks/                         📦 RACK MANAGEMENT
│   │   │   ├── controller/
│   │   │   │   └── racks.controller.ts     ← 2 endpoints
│   │   │   ├── service/
│   │   │   │   └── racks.service.ts
│   │   │   └── racks.module.ts
│   │   │
│   │   ├── reports/                       📊 REPORTS MODULE
│   │   │   └── controller/
│   │   │       └── reports.controller.ts   ← 6 endpoints
│   │   │
│   │   ├── dashboard/                     📈 DASHBOARD STATS
│   │   │   └── controller/
│   │   │       └── dashboard.controller.ts ← 8 endpoints
│   │   │
│   │   ├── member-books/                  👤 MEMBER BOOKS
│   │   │   └── controller/
│   │   │       └── member-books.controller.ts ← 3 endpoints
│   │   │
│   │   ├── upload/                          ⬆️ FILE UPLOAD
│   │   │   └── controller/
│   │   │       └── upload.controller.ts    ← 1 endpoint
│   │   │
│   │   └── util/                            🔧 UTILITIES
│   │       └── controller/
│   │           └── util.controller.ts      ← 4 endpoints
│   │
│   ├── app.module.ts
│   └── main.ts
│
├── proto/
│   └── books.proto                        ← gRPC definitions
│
├── .env
├── .env.example
├── Dockerfile
├── package.json
└── tsconfig.json
```

### MODULE 1: books (9 API Endpoints)

**Purpose:** Complete book catalog management

| # | Method | Endpoint | Description |
|---|--------|----------|-------------|
| 1 | POST | `/library/books` | Create new book |
| 2 | GET | `/library/books` | Get all books |
| 3 | GET | `/library/books/search?q=query` | Search books by text |
| 4 | GET | `/library/books/category/:category` | Filter by category |
| 5 | GET | `/library/books/:id` | Get single book |
| 6 | PUT | `/library/books/:id` | Update book |
| 7 | DELETE | `/library/books/:id` | Delete book |
| 8 | POST | `/library/books/reviews` | Add book review |
| 9 | GET | `/library/books/reviews/:bookId` | Get book reviews |

**Book Entity Fields:**
```typescript
bookId (unique, indexed)
isbn
title (required, indexed)
author (required, indexed)
publisher
publishYear
category (required, indexed)
edition
language
pages
price
rackNumber (required, indexed)
shelfNumber
bookType (enum: 'Issue Book' | 'Reference Book')
condition (enum: 'New' | 'Good' | 'Fair' | 'Poor' | 'Damaged')
description (max 2000 chars)
quantity
coverUrl
createdAt (auto)
updatedAt (auto)
```

### MODULE 2: book-requests (9 API Endpoints)

**Purpose:** Members request books that are unavailable

| # | Method | Endpoint | Auth | Role | Description |
|---|--------|----------|------|------|-------------|
| 1 | POST | `/library/books/requests` | Bearer | admin | Create request |
| 2 | GET | `/library/books/requests` | Bearer | admin | List all requests |
| 3 | GET | `/library/books/requests/member/my-requests` | Bearer | member | My requests |
| 4 | GET | `/library/books/requests/:id` | Bearer | admin,member | Get request |
| 5 | PUT | `/library/books/requests/:id` | Bearer | admin | Update request |
| 6 | PUT | `/library/books/requests/:id/cancel` | Bearer | member | Cancel request |
| 7 | PUT | `/library/books/requests/:id/approve` | Bearer | admin | Approve request |
| 8 | PUT | `/library/books/requests/:id/reject` | Bearer | admin | Reject request |
| 9 | DELETE | `/library/books/requests/:id` | Bearer | admin | Delete request |

### MODULE 3: racks (2 API Endpoints)

**Purpose:** Physical library organization (racks/shelves)

| # | Method | Endpoint | Description |
|---|--------|----------|-------------|
| 1 | GET | `/library/books/racks` | List all racks |
| 2 | GET | `/library/books/racks/:rackNumber` | Get rack by number |

### MODULE 4: reports (6 API Endpoints)

**Purpose:** Analytics and reports

| # | Method | Endpoint | Description |
|---|--------|----------|-------------|
| 1 | GET | `/library/books/reports` | All reports summary |
| 2 | GET | `/library/books/reports/daily-issue-return` | Daily issue/return report |
| 3 | GET | `/library/books/reports/overdue` | Overdue books report |
| 4 | GET | `/library/books/reports/rack-inventory` | Rack inventory report |
| 5 | GET | `/library/books/reports/rack-inventory/:rackNumber` | Rack inventory details |
| 6 | GET | `/library/books/reports/member-activity` | Member activity report |

### MODULE 5: dashboard (8 API Endpoints)

**Purpose:** Dashboard statistics

| # | Method | Endpoint | Description |
|---|--------|----------|-------------|
| 1 | GET | `/library/books/dashboard/stats` | Quick stats |
| 2 | GET | `/library/books/dashboard/books-by-category` | Category chart data |
| 3 | GET | `/library/books/dashboard/books-by-rack` | Rack chart data |
| 4 | GET | `/library/books/dashboard/recent-books` | Recently added |
| 5 | GET | `/library/books/dashboard/stat-cards` | Stat cards data |
| 6 | GET | `/library/books/dashboard/overdue-books` | Overdue books |
| 7 | GET | `/library/books/dashboard/pending-requests` | Pending requests |
| 8 | GET | `/library/books/dashboard/pending` | Pending requests (alias) |

### MODULE 6: member-books (3 API Endpoints)

**Purpose:** Member interactions with books

| # | Method | Endpoint | Description |
|---|--------|----------|-------------|
| 1 | GET | `/library/books/member-books/browse` | Browse all books |
| 2 | GET | `/library/books/member-books/:bookId` | Get book details |
| 3 | POST | `/library/books/member-books/request` | Request a book |

### MODULE 7: upload (1 API Endpoint)

**Purpose:** File uploads

| # | Method | Endpoint | Description |
|---|--------|----------|-------------|
| 1 | POST | `/library/books/upload` | Upload file |

### MODULE 8: util (4 API Endpoints)

**Purpose:** Utility functions

| # | Method | Endpoint | Description |
|---|--------|----------|-------------|
| 1 | GET | `/library/books/util/categories` | All categories list |
| 2 | GET | `/library/books/util/racks` | All racks list |
| 3 | GET | `/library/books/util/isbn-lookup/:isbn` | ISBN lookup API |
| 4 | DELETE | `/library/books/util/clear-all` | Clear all books |

**Total Books Service APIs: 42 endpoints**

---

## Service 2: Library Members Service (DETAILED)

**📍 Location:** `services/library-members-service/`  
**🌐 HTTP Port:** `3012`  
**📡 gRPC Port:** `5002`  
**🗄️ Database:** `library_members`  

### Complete Folder Structure (EVERY FILE)

```
library-members-service/
├── src/
│   ├── auth/                              ← JWT AUTH GUARDS
│   │   └── guards/
│   │       ├── jwt-auth.guard.ts          ← JWT verification
│   │       ├── roles.guard.ts             ← Role checking
│   │       └── roles.decorator.ts         ← @Roles() decorator
│   │
│   ├── modules/                           ← 11 MODULES
│   │   │
│   │   ├── auth/                          🔐 AUTHENTICATION MODULE
│   │   │   ├── controller/
│   │   │   │   └── auth.controller.ts     ← 4 endpoints (login, register, etc)
│   │   │   ├── service/
│   │   │   │   └── auth.service.ts
│   │   │   ├── dto/
│   │   │   │   └── auth.dto.ts
│   │   │   ├── entities/
│   │   │   │   └── user.entity.ts
│   │   │   └── auth.module.ts
│   │   │
│   │   ├── member-auth/                   👤 MEMBER AUTH (separate from staff)
│   │   │   └── controller/
│   │   │       └── member-auth.controller.ts ← 5 endpoints
│   │   │
│   │   ├── members/                       👥 MEMBERS MANAGEMENT
│   │   │   ├── controller/
│   │   │   │   ├── members.controller.ts  ← 5 endpoints
│   │   │   │   └── users.controller.ts    ← 4 endpoints
│   │   │   ├── service/
│   │   │   │   └── members.service.ts
│   │   │   ├── dto/
│   │   │   │   └── create-member.dto.ts
│   │   │   ├── entities/
│   │   │   │   └── member.entity.ts       ← Member schema (15 fields)
│   │   │   └── members.module.ts
│   │   │
│   │   ├── staff/                         👔 STAFF MANAGEMENT
│   │   │   ├── controller/
│   │   │   │   └── staff.controller.ts    ← 7 endpoints
│   │   │   ├── service/
│   │   │   │   └── staff.service.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-staff.dto.ts
│   │   │   │   ├── update-staff.dto.ts
│   │   │   │   └── staff-login.dto.ts
│   │   │   ├── entities/
│   │   │   │   └── staff.entity.ts
│   │   │   └── staff.module.ts
│   │   │
│   │   ├── users/                         🧑 USERS (general)
│   │   │   └── controller/
│   │   │       └── users.controller.ts    ← 4 endpoints
│   │   │
│   │   ├── activity-logs/                 📋 ACTIVITY TRACKING
│   │   │   ├── controller/
│   │   │   │   └── activity-logs.controller.ts ← 8 endpoints
│   │   │   ├── service/
│   │   │   ├── dto/
│   │   │   ├── entities/
│   │   │   │   └── activity-log.entity.ts
│   │   │   └── activity-logs.module.ts
│   │   │
│   │   ├── notifications/                 🔔 NOTIFICATIONS
│   │   │   ├── controller/
│   │   │   │   └── notifications.controller.ts ← 10 endpoints
│   │   │   ├── service/
│   │   │   ├── dto/
│   │   │   ├── entities/
│   │   │   │   └── notification.entity.ts
│   │   │   └── notifications.module.ts
│   │   │
│   │   ├── member-dashboard/              🏠 MEMBER DASHBOARD
│   │   │   ├── controller/
│   │   │   │   └── member-dashboard.controller.ts ← 10 endpoints
│   │   │   ├── service/
│   │   │   ├── dto/
│   │   │   │   ├── report-damage.dto.ts
│   │   │   │   ├── renew-book.dto.ts
│   │   │   │   └── submit-review.dto.ts
│   │   │   └── member-dashboard.module.ts
│   │   │
│   │   ├── staff-dashboard/                 🏢 STAFF DASHBOARD
│   │   │   └── controller/
│   │   │       └── staff-dashboard.controller.ts ← 16 endpoints
│   │   │
│   │   └── member-history/                  📜 MEMBER HISTORY
│   │       ├── controller/
│   │       │   └── member-history.controller.ts ← 7 endpoints
│   │       └── member-history.module.ts
│   │
│   ├── app.module.ts
│   └── main.ts
│
├── proto/
│   └── members.proto
│
├── .env
├── .env.example
├── Dockerfile
├── package.json
└── tsconfig.json
```

### MODULE 1: auth (4 API Endpoints) - GENERAL AUTH

**Purpose:** Staff/Admin authentication

| # | Method | Endpoint | Auth | Description |
|---|--------|----------|------|-------------|
| 1 | POST | `/library/members/auth/register` | No | Register user |
| 2 | POST | `/library/members/auth/login` | No | Login user |
| 3 | POST | `/library/members/auth/refresh-token` | Bearer | Refresh JWT |
| 4 | POST | `/library/members/auth/logout` | Bearer | Logout |

**User Entity:**
```typescript
name: string (required)
email: string (required, unique)
address: string
password: string (hashed with bcrypt)
role: 'admin' | 'staff' | 'member'
createdAt, updatedAt (auto)
```

### MODULE 2: member-auth (5 API Endpoints)

**Purpose:** Library member (borrower) authentication

| # | Method | Endpoint | Auth | Description |
|---|--------|----------|------|-------------|
| 1 | POST | `/library/members/member-auth/register` | No | Member register |
| 2 | POST | `/library/members/member-auth/login` | No | Member login |
| 3 | GET | `/library/members/member-auth/profile` | Bearer | Get member profile |
| 4 | POST | `/library/members/member-auth/forgot-password` | No | Request password reset |
| 5 | POST | `/library/members/member-auth/reset-password` | No | Reset password with token |

### MODULE 3: members (7 API Endpoints - 2 controllers)

**Purpose:** Member management

**MembersController (5 endpoints):**
| # | Method | Endpoint | Auth | Role | Description |
|---|--------|----------|------|------|-------------|
| 1 | POST | `/library/members/members` | Bearer | admin | Create member |
| 2 | GET | `/library/members/members` | Bearer | admin | List all members |
| 3 | GET | `/library/members/members/:id` | Bearer | admin | Get member |
| 4 | PUT | `/library/members/members/:id` | Bearer | admin | Update member |
| 5 | DELETE | `/library/members/members/:id` | Bearer | admin | Delete member |

**UsersController (3 endpoints):**
| # | Method | Endpoint | Auth | Description |
|---|--------|----------|------|-------------|
| 1 | GET | `/library/members/users` | Bearer | List users |
| 2 | GET | `/library/members/users/me` | Bearer | Get my profile |
| 3 | PUT | `/library/members/users/me` | Bearer | Update my profile |

**Member Entity Fields:**
```typescript
memberId: string (unique, required, indexed)
name: string (required, 2-100 chars)
email: string (required, unique, validated)
phoneNumber: string (required, 10-20 chars)
address: string (max 500 chars)
password: string (required, min 6, hashed)
membershipDate: Date (default now)
isActive: boolean (default true, indexed)
reviews: Array of {bookId, rating(1-5), comment, createdAt}
borrowingHistory: Array of {bookId, bookTitle, borrowedAt, returnedAt, status}
createdAt, updatedAt (auto)
```

### MODULE 4: staff (6 API Endpoints)

**Purpose:** Library staff management

| # | Method | Endpoint | Auth | Roles | Description |
|---|--------|----------|------|-------|-------------|
| 1 | POST | `/library/members/staff/login` | No | - | Staff login |
| 2 | POST | `/library/members/staff` | Bearer | admin | Create staff |
| 3 | GET | `/library/members/staff` | Bearer | admin | List staff |
| 4 | GET | `/library/members/staff/:id` | Bearer | admin | Get staff |
| 5 | PUT | `/library/members/staff/:id` | Bearer | admin | Update staff |
| 6 | DELETE | `/library/members/staff/:id` | Bearer | admin | Delete staff |

**Staff Roles:** `admin`, `librarian`, `assistant`

### MODULE 5: users (3 API Endpoints)

**Purpose:** General user operations

| # | Method | Endpoint | Auth | Description |
|---|--------|----------|------|-------------|
| 1 | GET | `/library/members/users` | Bearer | List all users |
| 2 | GET | `/library/members/users/me` | Bearer | Get my profile |
| 3 | PUT | `/library/members/users/me` | Bearer | Update my profile |

### MODULE 6: activity-logs (7 API Endpoints)

**Purpose:** Track all system activities

| # | Method | Endpoint | Auth | Description |
|---|--------|----------|------|-------------|
| 1 | POST | `/library/members/activity-logs` | Bearer | Log activity |
| 2 | GET | `/library/members/activity-logs` | Bearer | All logs |
| 3 | GET | `/library/members/activity-logs/recent` | Bearer | Recent activities |
| 4 | GET | `/library/members/activity-logs/:id` | Bearer | Log by ID |
| 5 | GET | `/library/members/activity-logs/member/:memberId` | Bearer | Member logs |
| 6 | GET | `/library/members/activity-logs/book/:bookId` | Bearer | Book logs |
| 7 | DELETE | `/library/members/activity-logs/:id` | Bearer | Delete log |

**ActivityLog Entity:**
```typescript
userId: string (who did it)
action: string (what was done)
entityType: string (Book/Member/Issue/etc)
entityId: string (affected item)
details: object (extra info)
ipAddress: string
userAgent: string
timestamp: Date
```

### MODULE 7: notifications (10 API Endpoints)

**Purpose:** System notifications

| # | Method | Endpoint | Auth | Description |
|---|--------|----------|------|-------------|
| 1 | POST | `/library/members/notifications` | Bearer | Create notification |
| 2 | GET | `/library/members/notifications` | Bearer | All notifications |
| 3 | GET | `/library/members/notifications/member/my-notifications` | Bearer | My notifications |
| 4 | GET | `/library/members/notifications/member/unread` | Bearer | Unread count |
| 5 | GET | `/library/members/notifications/:id` | Bearer | Get notification |
| 6 | POST | `/library/members/notifications/:id/read` | Bearer | Mark as read |
| 7 | POST | `/library/members/notifications/mark-all-read` | Bearer | Mark all read |
| 8 | POST | `/library/members/notifications/send-due-reminders` | Bearer admin | Send due reminders |
| 9 | POST | `/library/members/notifications/send-overdue` | Bearer admin | Send overdue notifications |
| 10 | DELETE | `/library/members/notifications/:id` | Bearer | Delete notification |

### MODULE 8: member-dashboard (9 API Endpoints)

**Purpose:** Member personal dashboard

| # | Method | Endpoint | Auth | Role | Description |
|---|--------|----------|------|------|-------------|
| 1 | GET | `/library/members/member-dashboard/stats` | Bearer | member | Dashboard stats |
| 2 | GET | `/library/members/member-dashboard/overdue-books` | Bearer | member | My overdue |
| 3 | GET | `/library/members/member-dashboard/recent-requests` | Bearer | member | Recent requests |
| 4 | GET | `/library/members/member-dashboard/borrowed-books` | Bearer | member | Currently borrowed |
| 5 | GET | `/library/members/member-dashboard/my-books` | Bearer | member | All my books |
| 6 | GET | `/library/members/member-dashboard/book-details/:issueId` | Bearer | member | Book details |
| 7 | POST | `/library/members/member-dashboard/report-damage` | Bearer | member | Report damage |
| 8 | POST | `/library/members/member-dashboard/renew-book` | Bearer | member | Request renewal |
| 9 | POST | `/library/members/member-dashboard/submit-review` | Bearer | member | Submit review |

### MODULE 9: staff-dashboard (16 API Endpoints)

**Purpose:** Staff management dashboard

| # | Method | Endpoint | Auth | Role | Description |
|---|--------|----------|------|------|-------------|
| 1 | GET | `/library/members/staff-dashboard/stats` | Bearer | staff | Staff stats |
| 2 | GET | `/library/members/staff-dashboard/stat-cards` | Bearer | staff | Staff stat cards |
| 3 | GET | `/library/members/staff-dashboard/books-added-today` | Bearer | staff | Books added today |
| 4 | GET | `/library/members/staff-dashboard/recent-activities` | Bearer | staff | Recent activities |
| 5 | GET | `/library/members/staff-dashboard/rack-distribution` | Bearer | staff | Rack distribution |
| 6 | POST | `/library/members/staff-dashboard/books` | Bearer | staff | Create book |
| 7 | GET | `/library/members/staff-dashboard/my-activity-logs` | Bearer | staff | My activity logs |
| 8 | GET | `/library/members/staff-dashboard/my-profile` | Bearer | staff | My profile |
| 9 | GET | `/library/members/staff-dashboard/my-contribution` | Bearer | staff | My contribution |
| 10 | GET | `/library/members/staff-dashboard/books-by-category` | Bearer | staff | Books by category |
| 11 | GET | `/library/members/staff-dashboard/rack-utilization` | Bearer | staff | Rack utilization |
| 12 | GET | `/library/members/staff-dashboard/books-status-distribution` | Bearer | staff | Books status distribution |
| 13 | GET | `/library/members/staff-dashboard/recent-issues` | Bearer | staff | Recent issues |
| 14 | GET | `/library/members/staff-dashboard/overdue-books` | Bearer | staff | All overdue |
| 15 | GET | `/library/members/staff-dashboard/pending-requests` | Bearer | staff | Pending requests |
| 16 | GET | `/library/members/staff-dashboard/damage-reports` | Bearer | staff | Damage reports |

### MODULE 10: member-history (6 API Endpoints)

**Purpose:** Member activity history

| # | Method | Endpoint | Auth | Description |
|---|--------|----------|------|-------------|
| 1 | GET | `/library/members/member-history/history` | Bearer | Borrowing history |
| 2 | POST | `/library/members/member-history/request-again` | Bearer | Request again |
| 3 | GET | `/library/members/member-history/reviews` | Bearer | My reviews |
| 4 | POST | `/library/members/member-history/reviews` | Bearer | Add review |
| 5 | PUT | `/library/members/member-history/reviews/:id` | Bearer | Update review |
| 6 | DELETE | `/library/members/member-history/reviews/:id` | Bearer | Delete review |

**Total Members Service APIs: 71 endpoints**

---

## Service 3: Library Issues Service (DETAILED)

**📍 Location:** `services/library-issues-service/`  
**🌐 HTTP Port:** `3013`  
**📡 gRPC Port:** `5003`  
**🗄️ Database:** `library_issues`  

### Complete Folder Structure (EVERY FILE)

```
library-issues-service/
├── src/
│   ├── modules/                          ← 3 MODULES
│   │   │
│   │   ├── issues/                        📤 BOOK ISSUES MODULE
│   │   │   ├── controller/
│   │   │   │   └── issues.controller.ts   ← 6 endpoints
│   │   │   ├── service/
│   │   │   │   └── issues.service.ts
│   │   │   ├── dto/
│   │   │   │   └── create-issue.dto.ts
│   │   │   ├── entities/
│   │   │   │   └── issue-book.entity.ts  ← Issue schema (13 fields)
│   │   │   └── issues.module.ts
│   │   │
│   │   ├── renewals/                      🔄 RENEWALS MODULE
│   │   │   ├── controller/
│   │   │   │   └── renewals.controller.ts ← 6 endpoints
│   │   │   ├── service/
│   │   │   │   └── renewals.service.ts
│   │   │   ├── dto/
│   │   │   │   └── create-renewal.dto.ts
│   │   │   ├── entities/
│   │   │   │   └── book-renewal.entity.ts
│   │   │   └── renewals.module.ts
│   │   │
│   │   └── damage-reports/                💔 DAMAGE REPORTS
│   │       ├── controller/
│   │       │   └── damage-reports.controller.ts ← 6 endpoints
│   │       ├── service/
│   │       │   └── damage-reports.service.ts
│   │       ├── dto/
│   │       │   └── create-book-damage-report.dto.ts
│   │       ├── entities/
│   │       │   └── book-damage-report.entity.ts
│   │       └── damage-reports.module.ts
│   │
│   ├── app.module.ts
│   └── main.ts
│
├── proto/
│   └── issues.proto
│
├── .env
├── .env.example
├── Dockerfile
├── package.json
└── tsconfig.json
```

### MODULE 1: issues (6 API Endpoints)

**Purpose:** Book issuing and returns

| # | Method | Endpoint | Description |
|---|--------|----------|-------------|
| 1 | POST | `/library/issues` | Issue a book to member |
| 2 | GET | `/library/issues` | List all issued books |
| 3 | GET | `/library/issues/:id` | Get issue details |
| 4 | PUT | `/library/issues/:id` | Update issued book |
| 5 | PUT | `/library/issues/:id/return` | Return book + calculate fine |
| 6 | DELETE | `/library/issues/:id` | Delete issue record |

**IssueBook Entity Fields:**
```typescript
bookId: ObjectId (required, ref to Book)
memberId: ObjectId (required, ref to Member)
issueType: enum ('Reading Inside Library' | 'Taking Home')
numberOfDays: number (required, min 1)
issueDate: Date (default now)
dueDate: Date (required)
returnDate: Date (when returned)
status: enum ('Active' | 'Overdue' | 'Returned')
daysOverdue: number (default 0, calculated)
fine: number (default 0, calculated)
finePerDay: number (default 10)
createdAt, updatedAt (auto)
```

**Indexes:**
- `{ memberId: 1, status: 1 }` - Fast member queries
- `{ bookId: 1, status: 1 }` - Fast book queries
- `{ dueDate: 1, status: 1 }` - Overdue detection
- `{ issueDate: -1 }` - Recent issues first

### MODULE 2: renewals (6 API Endpoints)

**Purpose:** Book renewal requests

| # | Method | Endpoint | Description |
|---|--------|----------|-------------|
| 1 | POST | `/library/issues/renewals` | Request renewal |
| 2 | GET | `/library/issues/renewals` | List renewals |
| 3 | GET | `/library/issues/renewals/:id` | Get renewal |
| 4 | PUT | `/library/issues/renewals/:id/approve` | Approve renewal |
| 5 | PUT | `/library/issues/renewals/:id/reject` | Reject renewal |
| 6 | DELETE | `/library/issues/renewals/:id` | Delete renewal |

**BookRenewal Entity:**
```typescript
issueId: ObjectId (original issue)
memberId: ObjectId
bookId: ObjectId
requestedDays: number
reason: string
status: enum ('Pending' | 'Approved' | 'Rejected')
approvedBy: ObjectId (staff)
approvedAt: Date
requestedAt: Date (default now)
```

### MODULE 3: damage-reports (6 API Endpoints)

**Purpose:** Report damaged books

| # | Method | Endpoint | Description |
|---|--------|----------|-------------|
| 1 | POST | `/library/issues/damage-reports` | Report damage |
| 2 | GET | `/library/issues/damage-reports` | List reports |
| 3 | GET | `/library/issues/damage-reports/:id` | Get report |
| 4 | PUT | `/library/issues/damage-reports/:id/resolve` | Mark resolved |
| 5 | PUT | `/library/issues/damage-reports/:id/approve` | Approve report |
| 6 | PUT | `/library/issues/damage-reports/:id/reject` | Reject report |

**BookDamageReport Entity:**
```typescript
issueId: ObjectId
bookId: ObjectId
memberId: ObjectId
damageType: enum ('Minor' | 'Moderate' | 'Severe' | 'Lost')
description: string
fineAmount: number
images: string[] (URLs)
status: enum ('Reported' | 'Resolved')
reportedAt: Date
resolvedAt: Date
reportedBy: ObjectId
resolvedBy: ObjectId
```

**Total Issues Service APIs: 18 endpoints**

---

## Service 4: Library Requests Service (DETAILED)

**📍 Location:** `services/library-requests-service/`  
**🌐 HTTP Port:** `3014`  
**📡 gRPC Port:** `5004`  
**🗄️ Database:** `library_requests`  

### Complete Folder Structure (EVERY FILE)

```
library-requests-service/
├── src/
│   ├── modules/                          ← 1 MODULE
│   │   └── requests/                      📨 BOOK REQUESTS MODULE
│   │       ├── controller/
│   │       │   └── requests.controller.ts ← 8 endpoints
│   │       ├── service/
│   │       │   └── requests.service.ts
│   │       ├── dto/
│   │       │   └── create-book-request.dto.ts
│   │       ├── entities/
│   │       │   └── book-request.entity.ts  ← Request schema
│   │       └── requests.module.ts
│   │
│   ├── app.module.ts
│   └── main.ts
│
├── proto/
│   └── requests.proto
│
├── .env
├── .env.example
├── Dockerfile
├── package.json
└── tsconfig.json
```

### MODULE: requests (8 API Endpoints)

**Purpose:** Book requests from members

| # | Method | Endpoint | Description |
|---|--------|----------|-------------|
| 1 | POST | `/library/requests` | Create request |
| 2 | GET | `/library/requests` | List all requests |
| 3 | GET | `/library/requests/:id` | Get request |
| 4 | PUT | `/library/requests/:id` | Update request |
| 5 | PUT | `/library/requests/:id/cancel` | Cancel request |
| 6 | PUT | `/library/requests/:id/approve` | Approve |
| 7 | PUT | `/library/requests/:id/reject` | Reject |
| 8 | DELETE | `/library/requests/:id` | Delete |

**BookRequest Entity:**
```typescript
requestId: string (unique, required)
bookId: ObjectId (ref to Book)
memberId: ObjectId (ref to Member)
requestDate: Date (default now)
status: enum ('Pending' | 'Approved' | 'Rejected')
currentlyBorrowed: number (default 0)
totalHistory: number (default 0)
activeBookIds: ObjectId[] (active issues)
booklistBorrowed: string[] (history)
processedDate: Date
```

**Total Requests Service APIs: 8 endpoints**

---

## Complete API Endpoint List

### 📚 BOOKS SERVICE (47 endpoints)
**Base:** `http://localhost:3000/library/books`

#### Books Module (9 endpoints)
```
POST   /library/books                    - Create book
GET    /library/books                    - List books
GET    /library/books/search?q=...       - Search
GET    /library/books/category/:cat      - By category
GET    /library/books/:id               - Get one
PUT    /library/books/:id               - Update
DELETE /library/books/:id               - Delete
POST   /library/books/reviews           - Add review
GET    /library/books/reviews/:bookId   - Get reviews
```

#### Book Requests Module (9 endpoints)
```
POST   /library/books/requests                 - Create
GET    /library/books/requests                 - List
GET    /library/books/requests/member/my-requests - My requests
GET    /library/books/requests/:id             - Get
PUT    /library/books/requests/:id             - Update
PUT    /library/books/requests/:id/cancel      - Cancel
PUT    /library/books/requests/:id/approve      - Approve
PUT    /library/books/requests/:id/reject      - Reject
DELETE /library/books/requests/:id             - Delete
```

#### Racks Module (2 endpoints)
```
GET    /library/books/racks              - List racks
GET    /library/books/racks/:rackNumber  - Get rack by number
```

#### Reports Module (6 endpoints)
```
GET    /library/books/reports              - All reports summary
GET    /library/books/reports/daily-issue-return - Daily issue/return
GET    /library/books/reports/overdue      - Overdue report
GET    /library/books/reports/rack-inventory - Rack inventory
GET    /library/books/reports/rack-inventory/:rackNumber - Rack details
GET    /library/books/reports/member-activity - Member activity
```

#### Dashboard Module
```
GET    /library/books/dashboard/stats              - Stats
GET    /library/books/dashboard/books-by-category  - Chart data
GET    /library/books/dashboard/books-by-rack      - Chart data
GET    /library/books/dashboard/recent-books       - Recent
GET    /library/books/dashboard/stat-cards       - Stat cards data
GET    /library/books/dashboard/overdue-books   - Overdue books
GET    /library/books/dashboard/pending-requests - Pending requests
GET    /library/books/dashboard/pending          - Pending (alias)
```

#### Member Books Module (3 endpoints)
```
GET    /library/books/member-books/browse     - Browse books
GET    /library/books/member-books/:bookId    - Get book details
POST   /library/books/member-books/request    - Request book
```

#### Upload Module (1 endpoint)
```
POST   /library/books/upload              - Upload file
```

#### Util Module
```
GET    /library/books/util/categories     - Categories list
GET    /library/books/util/racks          - Racks list
GET    /library/books/util/isbn-lookup/:isbn - ISBN lookup
DELETE /library/books/util/clear-all  - Clear all books
```

---

### 👥 MEMBERS SERVICE (71 endpoints)
**Base:** `http://localhost:3000/library/members`

#### Auth Module
```
POST   /library/members/auth/register          - Register
POST   /library/members/auth/login             - Login
POST   /library/members/auth/refresh-token     - Refresh token
POST   /library/members/auth/logout            - Logout
```

#### Member Auth Module (5 endpoints)
```
POST   /library/members/member-auth/register       - Register
POST   /library/members/member-auth/login          - Login
GET    /library/members/member-auth/profile        - Get profile
POST   /library/members/member-auth/forgot-password - Request password reset
POST   /library/members/member-auth/reset-password  - Reset password with token
```

#### Members Module
```
POST   /library/members/members              - Create
GET    /library/members/members              - List
GET    /library/members/members/:id          - Get
PUT    /library/members/members/:id          - Update
DELETE /library/members/members/:id          - Delete
```

#### Users Module
```
GET    /library/members/users                - List users
GET    /library/members/users/me             - My profile
PUT    /library/members/users/me             - Update profile
```

#### Staff Module
```
POST   /library/members/staff/login          - Staff login
POST   /library/members/staff                - Create
GET    /library/members/staff                - List
GET    /library/members/staff/:id            - Get
PUT    /library/members/staff/:id            - Update
DELETE /library/members/staff/:id            - Delete
```

#### Activity Logs Module
```
POST   /library/members/activity-logs                    - Log
GET    /library/members/activity-logs                    - List
GET    /library/members/activity-logs/recent  - Recent activities
GET    /library/members/activity-logs/:id              - Get
GET    /library/members/activity-logs/member/:memberId  - Member logs
GET    /library/members/activity-logs/book/:bookId       - Book logs
DELETE /library/members/activity-logs/:id                - Delete
```

#### Notifications Module
```
POST   /library/members/notifications                    - Create
GET    /library/members/notifications                    - List
GET    /library/members/notifications/member/my-notifications  - My notifications
GET    /library/members/notifications/member/unread           - Unread count
GET    /library/members/notifications/:id                 - Get
POST   /library/members/notifications/:id/read            - Mark read
POST   /library/members/notifications/mark-all-read       - Mark all read
POST   /library/members/notifications/send-due-reminders  - Send due reminders
POST   /library/members/notifications/send-overdue      - Send overdue notifications
DELETE /library/members/notifications/:id                 - Delete
```

#### Member Dashboard Module
```
GET    /library/members/member-dashboard/stats            - Stats
GET    /library/members/member-dashboard/overdue-books    - Overdue
GET    /library/members/member-dashboard/recent-requests  - Recent requests
GET    /library/members/member-dashboard/borrowed-books   - Borrowed
GET    /library/members/member-dashboard/my-books          - My books
GET    /library/members/member-dashboard/book-details/:issueId - Details
POST   /library/members/member-dashboard/report-damage    - Report damage
POST   /library/members/member-dashboard/renew-book         - Renew
POST   /library/members/member-dashboard/submit-review     - Review
```

#### Staff Dashboard Module
```
GET    /library/members/staff-dashboard/stats             - Stats
GET    /library/members/staff-dashboard/stat-cards              - Staff stat cards
GET    /library/members/staff-dashboard/books-added-today       - Books added today
GET    /library/members/staff-dashboard/recent-activities       - Recent activities
GET    /library/members/staff-dashboard/rack-distribution       - Rack distribution
POST   /library/members/staff-dashboard/books                 - Create book
GET    /library/members/staff-dashboard/my-activity-logs        - My activity logs
GET    /library/members/staff-dashboard/my-profile             - My profile
GET    /library/members/staff-dashboard/my-contribution        - My contribution
GET    /library/members/staff-dashboard/books-by-category      - Books by category
GET    /library/members/staff-dashboard/rack-utilization        - Rack utilization
GET    /library/members/staff-dashboard/books-status-distribution - Books status distribution
GET    /library/members/staff-dashboard/recent-issues     - Recent issues
GET    /library/members/staff-dashboard/overdue-books       - All overdue
GET    /library/members/staff-dashboard/pending-requests    - Pending
GET    /library/members/staff-dashboard/damage-reports      - Damage reports
```

#### Member History Module
```
GET    /library/members/member-history/history         - History
POST   /library/members/member-history/request-again   - Request again
GET    /library/members/member-history/reviews         - My reviews
POST   /library/members/member-history/reviews         - Add review
PUT    /library/members/member-history/reviews/:id   - Update review
DELETE /library/members/member-history/reviews/:id     - Delete review
```

---

### 📤 ISSUES SERVICE (18 endpoints)
**Base:** `http://localhost:3000/library/issues`

#### Issues Module
```
POST   /library/issues                    - Issue book
GET    /library/issues                    - List
GET    /library/issues/:id                - Get
PUT    /library/issues/:id                - Update
PUT    /library/issues/:id/return         - Return
DELETE /library/issues/:id                - Delete
```

#### Renewals Module
```
POST   /library/issues/renewals             - Request
GET    /library/issues/renewals           - List
GET    /library/issues/renewals/:id       - Get
PUT    /library/issues/renewals/:id/approve - Approve
PUT    /library/issues/renewals/:id/reject   - Reject
DELETE /library/issues/renewals/:id          - Delete
```

#### Damage Reports Module
```
POST   /library/issues/damage-reports       - Report
GET    /library/issues/damage-reports     - List
GET    /library/issues/damage-reports/:id - Get
PUT    /library/issues/damage-reports/:id/resolve - Resolve
PUT    /library/issues/damage-reports/:id/approve - Approve
PUT    /library/issues/damage-reports/:id/reject  - Reject
```

---

### 📨 REQUESTS SERVICE (8 endpoints)
**Base:** `http://localhost:3000/library/requests`

```
POST   /library/requests              - Create
GET    /library/requests              - List
GET    /library/requests/:id          - Get
PUT    /library/requests/:id          - Update
PUT    /library/requests/:id/cancel   - Cancel
PUT    /library/requests/:id/approve - Approve
PUT    /library/requests/:id/reject  - Reject
DELETE /library/requests/:id          - Delete
```

---

## GRAND TOTAL: 139 API ENDPOINTS

| Service | Endpoints |
|---------|-----------|
| Books | 42 |
| Members | 71 |
| Issues | 18 |
| Requests | 8 |
| **TOTAL** | **139** |

---

## Newly Added APIs (22 Endpoints)

### Books Service - Dashboard Module (5 new endpoints)
```
GET    /library/books/dashboard/stat-cards       - Stat cards data
GET    /library/books/dashboard/recent-books     - Recent books
GET    /library/books/dashboard/overdue-books   - Overdue books
GET    /library/books/dashboard/pending-requests - Pending requests
GET    /library/books/dashboard/pending          - Pending requests (alias)
```

### Members Service - Staff Dashboard Module (11 new endpoints)
```
GET    /library/members/staff-dashboard/stat-cards              - Staff stat cards
GET    /library/members/staff-dashboard/books-added-today       - Books added today
GET    /library/members/staff-dashboard/recent-activities       - Recent activities
GET    /library/members/staff-dashboard/rack-distribution       - Rack distribution
POST   /library/members/staff-dashboard/books                 - Create book
GET    /library/members/staff-dashboard/my-activity-logs        - My activity logs
GET    /library/members/staff-dashboard/my-profile             - My profile
GET    /library/members/staff-dashboard/my-contribution        - My contribution
GET    /library/members/staff-dashboard/books-by-category      - Books by category
GET    /library/members/staff-dashboard/rack-utilization        - Rack utilization
GET    /library/members/staff-dashboard/books-status-distribution - Books status distribution
```

### Members Service - Notifications Module (2 new endpoints)
```
POST   /library/members/notifications/send-due-reminders  - Send due date reminders
POST   /library/members/notifications/send-overdue      - Send overdue notifications
```

### Members Service - Activity Logs Module (1 new endpoint)
```
GET    /library/members/activity-logs/recent  - Recent activities
```

### Books Service - Util Module (1 new endpoint)
```
DELETE /library/books/util/clear-all  - Clear all books
```

### Issues Service - Issues Module (1 new endpoint)
```
PUT    /library/issues/:id  - Update issued book
```

### Books Service - Book Requests Module (1 new endpoint)
```
PUT    /library/books/requests/:id  - Update book request
```

---

## GRAND TOTAL: 139 API ENDPOINTS

| Service | Endpoints |
|---------|-----------|
| Books | 42 |
| Members | 71 |
| Issues | 18 |
| Requests | 8 |
| **TOTAL** | **139** |

### Database per Service

| Service | Database | Collections |
|---------|----------|-------------|
| Books | `library_books` | books, bookreviews |
| Members | `library_members` | members, staffs, users, activitylogs, notifications |
| Issues | `library_issues` | issuebooks, bookrenewals, bookdamagereports |
| Requests | `library_requests` | bookrequests |

### Connection URI
```
mongodb+srv://librarymanagement:UB5K9mJzSEG6tsCq@cluster0.niuwpgk.mongodb.net/
```

### Mongoose Configuration
```typescript
// Each service app.module.ts
MongooseModule.forRoot(
  process.env.MONGODB_URI,
  { dbName: process.env.MONGODB_DB }
)
```

---

## Quick Commands

### Install Dependencies
```bash
cd services/library-books-service && npm install
cd services/library-members-service && npm install
cd services/library-issues-service && npm install
cd services/library-requests-service && npm install
cd api-gateway && npm install
```

### Run Development
```bash
# Terminal 1 - Books Service
cd services/library-books-service && npm run start:dev

# Terminal 2 - Members Service
cd services/library-members-service && npm run start:dev

# Terminal 3 - Issues Service
cd services/library-issues-service && npm run start:dev

# Terminal 4 - Requests Service
cd services/library-requests-service && npm run start:dev

# Terminal 5 - API Gateway
cd api-gateway && npm run start:dev
```

### Build Docker
```bash
# Build all services
cd services/library-books-service && docker build -t books-service .
cd services/library-members-service && docker build -t members-service .
cd services/library-issues-service && docker build -t issues-service .
cd services/library-requests-service && docker build -t requests-service .
cd api-gateway && docker build -t api-gateway .
```

### Run Docker
```bash
docker run -p 3000:3000 api-gateway
docker run -p 3001:3001 books-service
docker run -p 3012:3012 members-service
docker run -p 3013:3013 issues-service
docker run -p 3014:3014 requests-service
```

### Test Endpoints
```bash
# Register member
curl -X POST http://localhost:3000/library/members/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"123456"}'

# Login
curl -X POST http://localhost:3000/library/members/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"123456"}'

# Create book (with token)
curl -X POST http://localhost:3000/library/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"bookId":"B001","title":"Test Book","author":"Author","category":"Tech","rackNumber":"A1"}'

# Issue book
curl -X POST http://localhost:3000/library/issues \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"bookId":"B001","memberId":"M001","issueType":"Taking Home","numberOfDays":7}'
```

---

## Summary

**Architecture:** NestJS Microservices (HTTP + gRPC)  
**Total Services:** 4 (+ 1 Gateway)  
**Total Modules:** 23  
**Total Controllers:** 25  
**Total Entities:** 11  
**Total API Endpoints:** 139  
**Database:** MongoDB Atlas (Cloud)  
**Authentication:** JWT with Role-Based Access Control  
**Communication:** HTTP (external) + gRPC (internal)
