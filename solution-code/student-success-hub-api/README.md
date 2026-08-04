# Student Success Hub API

This is the complete back-end reference solution for the Student Success Hub lesson.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Add real values to `.env` before starting the server.

Seed rewards after the database is connected:

```bash
npm run seed
```

Public sign-up creates an instructor. To create an admin for class, sign up normally, change that user's role to `admin` in MongoDB Atlas or Compass, then sign out and sign in again.

## Routes

| Method | Path | Access |
| --- | --- | --- |
| `POST` | `/auth/sign-up` | Public |
| `POST` | `/auth/sign-in` | Public |
| `GET` | `/students` | Signed-in |
| `GET` | `/students/:studentId` | Signed-in |
| `POST` | `/students` | Admin |
| `PUT` | `/students/:studentId` | Admin |
| `DELETE` | `/students/:studentId` | Admin |
| `POST` | `/students/:studentId/check-ins` | Signed-in |
| `PUT` | `/students/:studentId/assignment` | Admin |
| `GET` | `/users` | Admin |
| `GET` | `/rewards` | Signed-in |
