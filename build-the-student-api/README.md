<h1>
  <span class="headline">Student Success Hub</span>
  <span class="subhead">Build the Student API</span>
</h1>

**Learning objective:** By the end of this lesson, students will be able to create protected CRUD routes for the `Student` model.

## Create the router

Create a new controller file in the Express app:

```bash
touch controllers/students.js
```

Add the imports and router:

```javascript
// controllers/students.js

const express = require('express')
const router = express.Router()

const Student = require('../models/student')
const verifyToken = require('../middleware/verify-token')
const isAdmin = require('../middleware/is-admin')
```

Every student route will require a valid token. Create, update, and delete will also require the admin role.

## Index students

```javascript
router.get('/', verifyToken, async (req, res) => {
  try {
    const students = await Student.find()
      .populate('assignedInstructor', 'username role')
      .sort({ createdAt: -1 })

    res.json(students)
  } catch (err) {
    res.status(500).json({ err: err.message })
  }
})
```

The second argument to `populate()` selects the user fields we want to return. We need the instructor's username and role, but we never need their password.

## Show one student

```javascript
router.get('/:studentId', verifyToken, async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId)
      .populate('assignedInstructor', 'username role')
      .populate('checkIns.createdBy', 'username role')

    if (!student) {
      return res.status(404).json({ err: 'Student not found.' })
    }

    res.json(student)
  } catch (err) {
    res.status(500).json({ err: err.message })
  }
})
```

The second `populate()` reaches into the embedded array and populates the user who created each check-in.

## Create a student

```javascript
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const student = await Student.create(req.body)
    res.status(201).json(student)
  } catch (err) {
    res.status(400).json({ err: err.message })
  }
})
```

`400 Bad Request` is useful here because validation errors normally mean the submitted data is not valid.

## Update a student

```javascript
router.put('/:studentId', verifyToken, isAdmin, async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.studentId,
      req.body,
      { new: true, runValidators: true }
    ).populate('assignedInstructor', 'username role')

    if (!student) {
      return res.status(404).json({ err: 'Student not found.' })
    }

    res.json(student)
  } catch (err) {
    res.status(400).json({ err: err.message })
  }
})
```

- `new: true` returns the updated document.
- `runValidators: true` applies schema rules to the update.

## Delete a student

```javascript
router.delete('/:studentId', verifyToken, isAdmin, async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(
      req.params.studentId
    )

    if (!deletedStudent) {
      return res.status(404).json({ err: 'Student not found.' })
    }

    res.json(deletedStudent)
  } catch (err) {
    res.status(500).json({ err: err.message })
  }
})
```

Export the router at the bottom of the file:

```javascript
module.exports = router
```

## Connect the router to the server

Import the router in `server.js`:

```javascript
const studentsRouter = require('./controllers/students')
```

Mount it with the other routes:

```javascript
app.use('/students', studentsRouter)
```

## Test with Postman

First sign in and copy the token. In each protected request, select **Bearer Token** in the Authorization tab and paste the token.

Create an admin user before testing admin routes.

Send a `POST` request to `http://localhost:3000/students`:

```json
{
  "name": "Maya Ali",
  "email": "maya@example.com",
  "favoriteFood": "Pasta",
  "status": "active",
  "attendance": 94,
  "skills": ["HTML", "CSS"]
}
```

Then test:

- `GET /students`
- `GET /students/:studentId`
- `PUT /students/:studentId`
- `DELETE /students/:studentId`

Use a regular instructor token with `POST`, `PUT`, or `DELETE`. The expected response is `403 Forbidden`.
