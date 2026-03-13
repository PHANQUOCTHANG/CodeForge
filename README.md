# 🚀 CodeForge

**CodeForge** is a modern **online programming learning platform** that allows users to learn coding through structured courses, solve coding challenges, and track their learning progress.  

The platform integrates an **online code execution environment**, **course management system**, and **secure payment gateway** for a complete e-learning experience.

---

# 📌 Features

### 👤 User Management
- User registration and login
- JWT authentication with refresh tokens
- Password reset via email
- User roles: **Student, Instructor, Admin**
- Profile management

### 📚 Course Management
- Create, update, delete courses
- Course categorization
- Free and paid courses
- Course reviews and ratings
- Student enrollment tracking

### 📖 Lesson System
Courses are structured into **Modules → Lessons**.

Supported lesson types:
- 🎬 **Video Lessons**
- 📝 **Text Lessons**
- ❓ **Quiz Lessons**
- 💻 **Coding Exercises**

### 💻 Integrated Coding Environment
- **Monaco Editor** (same editor used in VS Code)
- **Judge0 API** for secure code execution
- Multiple programming languages supported:
  - C++
  - Python
  - Java
  - JavaScript
  - Go
  - Ruby
  - PHP
- Automated test case validation
- Real-time execution results
- Submission history

### 💳 Online Payments
- VNPay payment gateway integration
- Automatic enrollment after successful payment
- Payment history and invoice support
- Secure webhook verification

### 📊 Dashboards & Analytics
**Student Dashboard**
- Enrolled courses
- Learning progress tracking
- Completed lessons
- Coding submissions

**Instructor Dashboard**
- Course management
- Student statistics
- Engagement analytics

**Admin Dashboard**
- User management
- Course management
- Revenue analytics
- System overview

### 🖼 File & Media Management
- Course image uploads
- Cloudinary integration
- Automatic image optimization

### 📧 Email Notifications
- Registration confirmation
- Password reset emails
- Enrollment confirmation
- Payment notifications

---

# 🏗 System Architecture

```
Frontend (React + Vite)
│
├── Pages
├── Feature Modules
├── Redux Store
└── API Clients
        │
        ▼
Backend (ASP.NET Core)
│
├── Controllers
├── Services
├── Repositories
└── Middleware
        │
        ▼
Database (SQL Server)
```

External Services:

- Judge0 → Code Execution  
- VNPay → Payments  
- Cloudinary → Media Storage  
- SMTP → Email Services  

---

# 🛠 Tech Stack

## Backend
- **ASP.NET Core 8**
- **Entity Framework Core**
- **SQL Server 2022**
- **JWT Authentication**
- **RESTful API**
- **Swagger / OpenAPI**

## Frontend
- **React 18**
- **TypeScript**
- **Vite**
- **Redux Toolkit**
- **React Query**
- **Ant Design**
- **Monaco Editor**
- **SCSS**

## DevOps
- Docker
- Docker Compose
- Nginx

---

# 💾 Database Overview

Core entities:

```
Users
Profiles
Courses
Modules
Lessons
Enrollments
Problems
TestCases
Submissions
Payments
Reviews
```

Relationships:

```
Users
 ├── Profiles
 ├── Enrollments
 └── Submissions

Courses
 ├── Modules
 │    └── Lessons
 └── Enrollments

Problems
 ├── TestCases
 └── Submissions
```

---

# ⚙️ Installation

## 1. Clone Repository

```bash
git clone https://github.com/PHANQUOCTHANG/CodeForge.git
cd CodeForge
```

## 2. Install Docker

Verify installation:

```bash
docker --version
docker run hello-world
```

## 3. Create `.env`

```env
SA_PASSWORD=YourStrongPassword123

JWT_SECRET=your-secret-key
JWT_ISSUER=CodeForge
JWT_AUDIENCE=CodeForgeApp

FRONTEND_URL=http://localhost:3000
```

## 4. Run Application

Development mode:

```bash
docker-compose -f docker-compose.dev.yml up --build
```

Access services:

Frontend

```
http://localhost:3000
```

Backend API

```
http://localhost:5000/api
```

Swagger API Docs

```
http://localhost:5000/swagger
```

---

# 📁 Project Structure

## Backend

```
CodeForge_BE/
│
├── Api
│   ├── Controllers
│   ├── DTOs
│   └── Middleware
│
├── Core
│   ├── Entities
│   ├── Services
│   └── Interfaces
│
└── Infrastructure
    ├── Data
    └── Repositories
```

## Frontend

```
CodeForge_FE/src
│
├── api
├── app
├── features
│   ├── auth
│   ├── course
│   ├── dashboard
│   └── practice
│
├── pages
├── layouts
└── styles
```

---

# 🔌 API Endpoints

### Authentication

```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh-token
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

### Courses

```
GET    /api/courses
GET    /api/courses/{id}
POST   /api/courses
PUT    /api/courses/{id}
DELETE /api/courses/{id}
```

### Learning

```
POST /api/enrollments
GET  /api/lessons/{id}
POST /api/submissions
GET  /api/submissions/user/{id}
```

### Payments

```
POST /api/payments
POST /api/payments/webhook
GET  /api/payments/user/{id}
```

Full API documentation available at:

```
http://localhost:5000/swagger
```

---

# 🔄 Workflow

## Authentication

```
Login → Validate Credentials → Generate JWT → Return Token
```

## Course Enrollment

```
Browse Courses
→ Select Course
→ Payment (if required)
→ Enrollment
→ Start Learning
```

## Coding Submission

```
Write Code
→ Submit
→ Judge0 Execution
→ Validate Test Cases
→ Save Submission
```

---

# 👨‍💻 Development

Run development environment:

```bash
docker-compose -f docker-compose.dev.yml up
```

Install frontend dependency:

```bash
npm install axios
```

Install backend dependency:

```bash
dotnet add package Newtonsoft.Json
```

---

# 📏 Code Standards

### Naming Conventions

| Type | Convention |
|-----|------------|
Folders | lowercase-with-dash |
Components | PascalCase |
Services / Hooks | camelCase |
Constants | UPPER_SNAKE_CASE |

Example:

```
CourseCard.tsx
useCourse.ts
courseService.ts
```

---

# 🤝 Contributing

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/new-feature
```

3. Commit changes

```bash
git commit -m "feat: add new feature"
```

4. Push branch

```bash
git push origin feature/new-feature
```

5. Open a Pull Request

---

# 📄 License

Educational project.

---

