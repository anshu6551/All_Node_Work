# Institute Management System — v2 (Class-Based MVC)

Node.js / Express / MongoDB (Mongoose) backend. Restructured per spec:

- Everything except `.env`, `app.js`, `uploads/`, and `swagger.js` lives inside `app/`.
- Controllers are **classes**; every handler is bound in the constructor.
- A single **`indexRoute`** (`app/routes/index.route.js`) parents every feature router — `app.js` only mounts that one router.
- Only **two** middlewares exist: `authMiddleware` (JWT verification) and `authCheckMiddleware` (role-based access).
- The error boundary (404 handler + global error handler) lives in `app/utils/errorBoundary.js`, not in `middlewares/`, and is wired directly into `app.js`.
- Email verification is sent via **Nodemailer** (`app/utils/sendEmail.js`).

## Project Structure

```
institute-management-system/
├── .env.example
├── app.js                     # root: express setup, DB connect, mounts indexRoute, error boundary, server start
├── swagger.js                 # root: swagger-jsdoc spec, served at /api-docs
├── package.json
├── uploads/                   # root: static-served upload storage (profile pictures, etc.)
└── app/
    ├── config/
    │   └── db.js               # MongoDB connection
    ├── models/                 # Mongoose schemas
    │   ├── User.js
    │   ├── Role.js
    │   ├── Course.js
    │   ├── Batch.js
    │   ├── Enrollment.js
    │   ├── Attendance.js
    │   └── Exam.js
    ├── controllers/            # class-based, methods bound in the constructor
    │   ├── AuthController.js
    │   ├── UserController.js
    │   ├── CourseController.js
    │   ├── BatchController.js
    │   ├── EnrollmentController.js
    │   ├── AttendanceController.js
    │   ├── ExamController.js
    │   └── ReportController.js
    ├── routes/
    │   ├── index.route.js      # parents all routers below — the ONLY router app.js mounts
    │   ├── auth.route.js
    │   ├── user.route.js
    │   ├── course.route.js
    │   ├── batch.route.js
    │   ├── enrollment.route.js
    │   ├── attendance.route.js
    │   ├── exam.route.js
    │   └── report.route.js
    ├── middlewares/             # exactly two
    │   ├── authMiddleware.js       # verifies JWT, sets req.user
    │   └── authCheckMiddleware.js  # authCheckMiddleware('Admin', 'Teacher', ...) role gate
    └── utils/
        ├── asyncHandler.js      # wraps controller methods for centralized error propagation
        ├── errorBoundary.js     # notFound + errorHandler (moved out of middlewares/)
        ├── generateToken.js
        ├── sendEmail.js         # Nodemailer transporter + send()
        ├── emailTemplates.js    # verification email + student report table HTML
        └── seedRoles.js
```

## Controller Pattern

Every controller is a class whose handlers are bound in the constructor, then the class is exported as a singleton instance:

```js
class AuthController {
  constructor() {
    this.signup = this.signup.bind(this);
    this.verifyEmail = this.verifyEmail.bind(this);
    this.login = this.login.bind(this);
  }

  async signup(req, res) { /* ... */ }
  async verifyEmail(req, res) { /* ... */ }
  async login(req, res) { /* ... */ }
}

module.exports = new AuthController();
```

Route files wrap each bound method with `asyncHandler` so thrown/rejected errors flow to the error boundary:

```js
router.post('/signup', asyncHandler(authController.signup));
```

## indexRoute Pattern

`app.js` mounts a single router:

```js
const indexRoute = require('./app/routes/index.route');
app.use('/api', indexRoute);
```

`index.route.js` parents every feature router:

```js
router.use('/auth', authRoute);
router.use('/users', userRoute);
router.use('/courses', courseRoute);
router.use('/batches', batchRoute);
router.use('/enrollments', enrollmentRoute);
router.use('/attendance', attendanceRoute);
router.use('/exams', examRoute);
router.use('/reports', reportRoute);
```

## The Two Middlewares

| Middleware | Purpose | Usage |
|---|---|---|
| `authMiddleware` | Verifies the JWT in `Authorization: Bearer <token>`, loads the user, sets `req.user` | `router.use(authMiddleware)` at the top of a route file, or per-route |
| `authCheckMiddleware(...roles)` | Confirms `req.user.role` is in the allowed list | `authCheckMiddleware('Admin')`, `authCheckMiddleware('Admin', 'Teacher')` |

`authCheckMiddleware` must run after `authMiddleware`, since it reads `req.user`.

Routes where a resource can be viewed either by its owner (a student) or by staff (Teacher/Admin) — e.g. attendance, exam results, reports — only apply `authMiddleware`; the "self or staff" check is done inside the controller against `req.user`, since that logic is data-dependent (needs the `:studentId` param), not a static role list.

## Error Boundary (in utils, not middlewares)

`app/utils/errorBoundary.js` exports `{ notFound, errorHandler }`. `app.js` wires them in directly as the last two `app.use()` calls, after `indexRoute`:

```js
const { notFound, errorHandler } = require('./app/utils/errorBoundary');
app.use('/api', indexRoute);
app.use(notFound);
app.use(errorHandler);
```

## Email Verification (Nodemailer)

Signup (`AuthController.signup`) generates a hashed verification token, saves it on the `User` document, and calls `sendEmail()` (`app/utils/sendEmail.js`, a Nodemailer transporter) with the `verificationEmailTemplate`. The user clicks the link → `GET /api/auth/verify-email/:token` → `AuthController.verifyEmail` marks `isVerified: true`.

## Setup

```bash
npm install
cp .env.example .env      # fill in MONGO_URI, JWT_SECRET, SMTP_* (Nodemailer), CLIENT_URL
npm run seed:roles        # optional: seeds the Roles collection
npm run dev                # nodemon app.js  (or `npm start`)
```

Swagger UI: `http://localhost:5000/api-docs`
Uploaded files served from: `http://localhost:5000/uploads/<filename>`

---

## API Reference

All protected routes require header: `Authorization: Bearer <token>`

### User Management (`/api/auth`, `/api/users`)

| # | Method & Route | Access | Description |
|---|------------------|--------|-------------|
| 1 | `POST /api/auth/signup` | Public | Sign up (name, email, password, role=Student/Teacher); sends Nodemailer verification email |
| 1b | `GET /api/auth/verify-email/:token` | Public | Verify email via emailed link |
| 2 | `POST /api/auth/login` | Public | Login with email & password → JWT |
| 3 | `GET /api/users/profile` | Private | Get own profile |
| 4 | `PUT /api/users/profile` | Private | Update profile (name, profilePicture, phone, address) |
| 5 | `GET /api/users?role=Student` | Admin | List all users, filterable by role |

### Course Management (`/api/courses`)

| # | Method & Route | Access | Description |
|---|------------------|--------|-------------|
| 1 | `POST /api/courses` | Admin | Add course (name, description, duration, fees) |
| 2 | `PUT /api/courses/:id` | Admin | Edit course |
| 3 | `DELETE /api/courses/:id` | Admin | Delete course |
| 4 | `GET /api/courses` | Public | List courses with totalBatches & totalEnrolledStudents |

### Batch Management (`/api/batches`)

| # | Method & Route | Access | Description |
|---|------------------|--------|-------------|
| 1 | `POST /api/batches` | Admin/Teacher | Add batch (name, course, startDate, endDate, teacher) |
| 2 | `POST /api/batches/:id/assign-students` | Admin | Assign students (`studentIds: []`) to a batch |
| 3 | `GET /api/batches?course=<id>` | Public/Private | List batches with total students & teacher |
| 4 | `PUT /api/batches/:id` | Admin/Teacher | Update batch (schedule, teacher, dates) |
| 5 | `DELETE /api/batches/:id` | Admin | Delete batch |

### Enrollment & Attendance (`/api/enrollments`, `/api/attendance`)

| # | Method & Route | Access | Description |
|---|------------------|--------|-------------|
| 1 | `POST /api/enrollments` | Student/Admin | Enroll student (`studentId`, `courseId`) |
| 2 | `POST /api/attendance` | Teacher | Mark attendance (`batchId`, `date`, `presentStudentIds[]`, `absentStudentIds[]`) |
| 3a | `GET /api/attendance/student/:studentId?course=&batch=` | Student(self)/Teacher/Admin | Attendance history & % for a student |
| 3b | `GET /api/attendance/batch/:batchId` | Teacher/Admin | Attendance % for all students in a batch |

### Exam Management (`/api/exams`)

| # | Method & Route | Access | Description |
|---|------------------|--------|-------------|
| 1 | `POST /api/exams` | Admin/Teacher | Create exam (name, batch, date, duration, totalMarks) |
| 2 | `POST /api/exams/:id/marks` | Teacher | Assign marks (`marks: [{student, marksObtained}]`) |
| 3a | `GET /api/exams/results/student/:studentId?batch=` | Student(self)/Teacher/Admin | Individual results |
| 3b | `GET /api/exams/results/batch/:batchId?examId=` | Teacher/Admin | All results for a batch |
| 4 | `PUT /api/exams/:id` | Teacher/Admin | Update exam details |

### Reports (`/api/reports`)

| # | Method & Route | Access | Description |
|---|------------------|--------|-------------|
| 1 | `GET /api/reports/courses-enrollments` | Admin | Courses with total enrollments |
| 2 | `GET /api/reports/batch/:batchId` | Admin/Teacher | Batch attendance % + average exam performance |
| 3 | `GET /api/reports/student/:studentId` | Student(self)/Teacher/Admin | Student's overall attendance % & average marks |
| 4 | `POST /api/reports/student/:studentId/email` | Student(self)/Teacher/Admin | Emails the student a performance report (Nodemailer, HTML table) |

---

## Example: Signup → Verify → Login

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com","password":"secret123","role":"Student"}'

# user clicks the Nodemailer-sent verification link (or hit it directly):
curl http://localhost:5000/api/auth/verify-email/<token>

curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jane@example.com","password":"secret123"}'
```
