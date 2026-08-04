<h1>
  <span class="headline">Student Success Hub</span>
  <span class="subhead">Protect Admin Actions</span>
</h1>

**Learning objective:** By the end of this lesson, students will be able to distinguish front-end conditional rendering from back-end authorization.

## Two different jobs

React and Express both check the role, but they do different jobs.

| Layer | Job |
| --- | --- |
| React | Show the correct links, buttons, and pages |
| Express | Allow or refuse the database action |

Hiding a button does not stop someone from making a request through Postman, the browser console, or another front end.

## Review the protected routes

The back-end routes that change student records should use both middleware functions:

```javascript
router.post('/', verifyToken, isAdmin, createStudent)
router.put('/:studentId', verifyToken, isAdmin, updateStudent)
router.delete('/:studentId', verifyToken, isAdmin, deleteStudent)
router.put(
  '/:studentId/assignment',
  verifyToken,
  isAdmin,
  assignInstructor
)
```

Your route callbacks may be written inline instead of named controller functions. The important part is the middleware order.

Check-ins use only `verifyToken`:

```javascript
router.post('/:studentId/check-ins', verifyToken, createCheckIn)
```

Both roles are allowed to record them.

## Review the React checks

Admin controls use conditional rendering:

```javascript
{user.role === 'admin' && (
  <Link to='/students/new'>Add Student</Link>
)}
```

Admin pages can redirect other roles:

```javascript
<Route
  path='/assignments'
  element={
    user.role === 'admin'
      ? <Assignments />
      : <Navigate to='/' />
  }
/>
```

This creates a clearer interface. It is still not the security boundary.

## Test an attempted bypass

1. Sign in as an instructor.
2. Confirm the **Add Student** link is hidden.
3. Copy the instructor's JWT.
4. In Postman, send `POST /students` with that token and valid student data.

The server should return:

```json
{
  "err": "Admin access required."
}
```

The expected status is `403 Forbidden`.

This proves that the API remains protected even when the request does not come from the React interface.

## `401` versus `403`

- `401 Unauthorized` means the request does not have a valid identity. Despite the name, it is mainly an authentication response.
- `403 Forbidden` means the server knows who the user is, but that user does not have permission for this action.

## Final role checklist

### Instructor

- Can sign in and sign out
- Can view students and the dashboard
- Can add check-ins
- Can use the rewards cart
- Cannot create, edit, delete, or assign students

### Admin

- Can do everything an instructor can do
- Can create, edit, and delete students
- Can assign and unassign instructors

## JWT role reminder

The role is copied into the JWT when the user signs in. If you change a role directly in MongoDB, the user must sign out and sign in again to receive a new token.
