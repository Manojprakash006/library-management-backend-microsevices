# 📚 Library Management System - Team Guide

> **Quick Reference for Developers & Team Members**

---

## 🎯 What Is This?

A **Library Management System** split into 4 independent microservices:

```
┌─────────────────┐
│  API Gateway    │ ← Single entry point (Port 3000)
│  (Routes traffic)
└────────┬────────┘
         │
    ┌────┴────┬────────┬────────┐
    ▼         ▼        ▼        ▼
┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐
│ 📚    │ │ 👤    │ │ 📤    │ │ 📨    │
│ Books │ │Members│ │ Issues│ │Requests│
│:3001  │ │:3012  │ │:3013  │ │:3014  │
└───────┘ └───────┘ └───────┘ └───────┘
```

**Each service has its own database and can run independently.**

---

## 📊 Services Overview

| Service | Port | Database | What It Does | Modules |
|---------|------|----------|--------------|---------|
| **Books** | 3001 | `library_books` | Book catalog, reviews, racks | 8 |
| **Members** | 3012 | `library_members` | Users, auth, staff, dashboards | 11 |
| **Issues** | 3013 | `library_issues` | Book lending, returns, fines | 3 |
| **Requests** | 3014 | `library_requests` | Book reservations | 1 |

**Total: 23 modules | 126 API endpoints**

---

## 🌐 How to Call APIs

### URL Pattern
```
http://localhost:3000/library/[service]/[endpoint]
                        │       │         │
                        │       │         └── books, members, auth, etc.
                        │       └── books | members | issues | requests
                        └── Always 3000 (Gateway)
```

### Examples

| Action | URL | Method |
|--------|-----|--------|
| Get all books | `GET /library/books` | GET |
| Create member | `POST /library/members` | POST |
| Login | `POST /library/members/auth/login` | POST |
| Issue book | `POST /library/issues` | POST |
| Request book | `POST /library/requests` | POST |

---

## 📚 SERVICE 1: Books Service (Port 3001)

### What It Manages
- 📖 Book catalog (title, author, ISBN, category, etc.)
- ⭐ Book reviews & ratings
- 📦 Physical storage (racks, shelves)
- 📊 Reports & statistics
- 📁 File uploads (book covers)

### Folder Structure
```
modules/
├── books/              ← 📖 Book CRUD (10 APIs)
├── book-requests/      ← 📝 Reserve books (7 APIs)
├── racks/              ← 📦 Rack management (3 APIs)
├── reports/            ← 📊 Analytics (7 APIs)
├── dashboard/          ← 📈 Stats (4 APIs)
├── member-books/       ← 👤 Member books (4 APIs)
├── upload/             ← ⬆️ File upload (2 APIs)
└── util/               ← 🔧 Utilities (3 APIs)
```

### Key APIs

| Module | Endpoint | Description |
|--------|----------|-------------|
| **books** | `POST /library/books` | Add new book |
| **books** | `GET /library/books` | List all books |
| **books** | `GET /library/books/search?q=java` | Search books |
| **books** | `POST /library/books/reviews` | Add review |
| **racks** | `GET /library/books/racks` | List racks |
| **reports** | `GET /library/books/reports/popular` | Popular books |

### Book Entity Fields
```typescript
bookId, isbn, title, author, publisher, publishYear,
category, edition, language, pages, price,
rackNumber, shelfNumber, bookType, condition,
description, quantity, coverUrl
```

---

## 👤 SERVICE 2: Members Service (Port 3012)

### What It Manages
- 👥 Library members (borrowers)
- 👔 Library staff (librarians, admins)
- 🔐 Authentication & login
- 🔔 Notifications
- 📋 Activity logs
- 🏠 Member dashboards
- 🏢 Staff dashboards

### Folder Structure
```
modules/
├── auth/               ← 🔐 User login/register (4 APIs)
├── member-auth/        ← 👤 Member login (4 APIs)
├── members/            ← 👥 Members CRUD (9 APIs)
├── staff/              ← 👔 Staff management (7 APIs)
├── users/              ← 🧑 User profiles (4 APIs)
├── activity-logs/      ← 📋 Activity tracking (7 APIs)
├── notifications/      ← 🔔 Notifications (8 APIs)
├── member-dashboard/   ← 🏠 Member view (10 APIs)
├── staff-dashboard/    ← 🏢 Staff view (5 APIs)
└── member-history/     ← 📜 History (7 APIs)
```

### Key APIs

| Module | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| **auth** | `POST /library/members/auth/login` | ❌ | Login |
| **auth** | `POST /library/members/auth/register` | ❌ | Register |
| **members** | `GET /library/members` | ✅ | List members |
| **members** | `POST /library/members` | ✅ | Create member |
| **staff** | `POST /library/members/staff/login` | ❌ | Staff login |
| **staff** | `GET /library/members/staff` | ✅ Admin | List staff |
| **notifications** | `GET /library/members/notifications/member/my-notifications` | ✅ | My notifications |
| **member-dashboard** | `GET /library/members/member-dashboard/stats` | ✅ Member | Dashboard stats |
| **staff-dashboard** | `GET /library/members/staff-dashboard/overdue-books` | ✅ Staff | All overdue books |

### Entity Fields

**Member:**
```typescript
memberId, name, email, phoneNumber, address, password,
membershipDate, isActive, reviews, borrowingHistory
```

**Staff:**
```typescript
staffId, name, email, phoneNumber, password,
role (admin/librarian/assistant), department, isActive
```

---

## 📤 SERVICE 3: Issues Service (Port 3013)

### What It Manages
- 📤 Book issuing (lending to members)
- ↩️ Book returns
- 💰 Fine calculation (for late returns)
- 🔄 Renewal requests
- 💔 Damage reports

### Folder Structure
```
modules/
├── issues/              ← 📤 Issue/Return books (5 APIs)
├── renewals/            ← 🔄 Renew books (5 APIs)
└── damage-reports/      ← 💔 Report damage (4 APIs)
```

### Key APIs

| Module | Endpoint | Description |
|--------|----------|-------------|
| **issues** | `POST /library/issues` | Issue book to member |
| **issues** | `GET /library/issues` | List all issued books |
| **issues** | `PUT /library/issues/:id/return` | Return book + calculate fine |
| **renewals** | `POST /library/issues/renewals` | Request renewal |
| **renewals** | `PUT /library/issues/renewals/:id/approve` | Approve renewal |
| **damage-reports** | `POST /library/issues/damage-reports` | Report damage |

### IssueBook Entity
```typescript
bookId, memberId, issueType (Reading/Taking Home),
numberOfDays, issueDate, dueDate, returnDate,
status (Active/Overdue/Returned), fine, finePerDay
```

**Auto-calculates:**
- Days overdue
- Fine amount (₹10/day default)

---

## 📨 SERVICE 4: Requests Service (Port 3014)

### What It Manages
- 📨 Members request unavailable books
- ✅ Approve/reject requests
- 📊 Track request status

### Folder Structure
```
modules/
└── requests/            ← 📨 Book requests (7 APIs)
```

### Key APIs

| Endpoint | Description |
|----------|-------------|
| `POST /library/requests` | Create request |
| `GET /library/requests` | List requests |
| `PUT /library/requests/:id/approve` | Approve |
| `PUT /library/requests/:id/reject` | Reject |

### BookRequest Entity
```typescript
requestId, bookId, memberId, requestDate,
status (Pending/Approved/Rejected),
currentlyBorrowed, totalHistory
```

---

## 🔐 Authentication Guide

### Getting a Token
```bash
# 1. Register
curl -X POST http://localhost:3000/library/members/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"123456"}'

# 2. Login
curl -X POST http://localhost:3000/library/members/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"123456"}'

# Response: {"token":"eyJhbG..."}
```

### Using the Token
```bash
# Add to all protected requests
curl -H "Authorization: Bearer eyJhbG..." \
     http://localhost:3000/library/books
```

### Roles
| Role | Access |
|------|--------|
| `admin` | Full access (create staff, view all) |
| `staff` | Manage books, issues, approve requests |
| `member` | View own data, borrow books, submit reviews |

---

## 🚀 Quick Start Commands

### 1. Install Dependencies
```bash
cd services/library-books-service && npm install
cd services/library-members-service && npm install
cd services/library-issues-service && npm install
cd services/library-requests-service && npm install
cd api-gateway && npm install
```

### 2. Start All Services (5 terminals)
```bash
# Terminal 1 - Gateway
cd api-gateway && npm run start:dev

# Terminal 2 - Books
cd services/library-books-service && npm run start:dev

# Terminal 3 - Members
cd services/library-members-service && npm run start:dev

# Terminal 4 - Issues
cd services/library-issues-service && npm run start:dev

# Terminal 5 - Requests
cd services/library-requests-service && npm run start:dev
```

### 3. Test APIs
```bash
# Register
curl -X POST http://localhost:3000/library/members/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"123456","role":"member"}'

# Login
curl -X POST http://localhost:3000/library/members/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'

# Create book (with token)
curl -X POST http://localhost:3000/library/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"bookId":"B001","title":"Sample Book","author":"Author","category":"Tech","rackNumber":"A1"}'

# Issue book
curl -X POST http://localhost:3000/library/issues \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"bookId":"BOOK_ID","memberId":"MEMBER_ID","issueType":"Taking Home","numberOfDays":7}'
```

---

## 🐳 Docker Guide

### Build Images
```bash
cd services/library-books-service && docker build -t books-service .
cd services/library-members-service && docker build -t members-service .
cd services/library-issues-service && docker build -t issues-service .
cd services/library-requests-service && docker build -t requests-service .
cd api-gateway && docker build -t api-gateway .
```

### Run Containers
```bash
docker run -p 3000:3000 api-gateway
docker run -p 3001:3001 books-service
docker run -p 3012:3012 members-service
docker run -p 3013:3013 issues-service
docker run -p 3014:3014 requests-service
```

---

## 📋 Complete API List

### Books Service (40 APIs)
**Base:** `http://localhost:3000/library/books`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | POST, GET | Create/List books |
| `/search?q=...` | GET | Search |
| `/category/:cat` | GET | By category |
| `/:id` | GET, PUT, DELETE | Get/Update/Delete |
| `/reviews` | POST, GET | Add/Get reviews |
| `/requests` | All | Book requests |
| `/racks` | All | Rack management |
| `/reports/*` | All | Reports |
| `/dashboard/*` | All | Dashboard |
| `/upload/cover` | POST | Upload cover |

### Members Service (65 APIs)
**Base:** `http://localhost:3000/library/members`

| Endpoint | Auth | Description |
|----------|------|-------------|
| `/auth/*` | ❌ | Login, register, logout |
| `/members/*` | ✅ | Member CRUD |
| `/staff/*` | ✅ Admin | Staff management |
| `/notifications/*` | ✅ | Notifications |
| `/member-dashboard/*` | ✅ Member | Member view |
| `/staff-dashboard/*` | ✅ Staff | Staff view |
| `/activity-logs/*` | ✅ | Activity tracking |

### Issues Service (14 APIs)
**Base:** `http://localhost:3000/library/issues`

| Endpoint | Description |
|----------|-------------|
| `/` | Issue/Return books |
| `/:id/return` | Return + fine calc |
| `/renewals/*` | Renewals |
| `/damage-reports/*` | Damage reports |

### Requests Service (7 APIs)
**Base:** `http://localhost:3000/library/requests`

| Endpoint | Description |
|----------|-------------|
| `/` | Create/List |
| `/:id/approve` | Approve |
| `/:id/reject` | Reject |

---

## 🗄️ Database Info

| Service | Database | Collections |
|---------|----------|-------------|
| Books | `library_books` | books, bookreviews |
| Members | `library_members` | members, staffs, users, activitylogs, notifications |
| Issues | `library_issues` | issuebooks, bookrenewals, bookdamagereports |
| Requests | `library_requests` | bookrequests |

**Connection:**
```
mongodb+srv://librarymanagement:UB5K9mJzSEG6tsCq@cluster0.niuwpgk.mongodb.net/
```

---

## ❓ Common Questions

**Q: Why 4 separate services?**  
A: Each handles one domain. Can be developed/deployed independently.

**Q: Why port 3000 for all APIs?**  
A: Gateway routes to correct service. Clients only need to know 1 port.

**Q: What's gRPC for?**  
A: Fast internal communication between services (optional, HTTP also works).

**Q: How is auth handled?**  
A: JWT tokens. Get token at login, send in `Authorization: Bearer <token>` header.

**Q: Can I run just one service?**  
A: Yes! Each service is independent with its own database.

---

## 📞 Need Help?

1. Check if service is running: `curl http://localhost:3000/library/books`
2. Check logs in terminal
3. Verify MongoDB connection in `.env`
4. Ensure JWT token is valid (not expired)

**Total: 4 Services | 23 Modules | 126 APIs | 11 Entities**
