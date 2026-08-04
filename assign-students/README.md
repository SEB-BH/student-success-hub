<h1>
  <span class="headline">Student Success Hub</span>
  <span class="subhead">Assign Students</span>
</h1>

**Learning objective:** By the end of this lesson, students will be able to assign a referenced user to a student and populate that reference.

## Why use a reference?

An instructor is already stored as a `User`. We only need to store that user's ObjectId on the student:

```javascript
assignedInstructor: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  default: null,
}
```

One instructor can be referenced by many student documents.

## Return a list of instructors

Open the existing `controllers/users.js` file. Import the admin middleware:

```javascript
const isAdmin = require('../middleware/is-admin')
```

Update the index route so it returns instructor accounts for the assignment page:

```javascript
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const instructors = await User.find({ role: 'instructor' })
      .select('username role')
      .sort({ username: 1 })

    res.json(instructors)
  } catch (err) {
    res.status(500).json({ err: err.message })
  }
})
```

Only admins need the full instructor list because only admins can assign students.

## Add the assignment route

Import `User` in `controllers/students.js`:

```javascript
const User = require('../models/user')
```

Add the route:

```javascript
router.put(
  '/:studentId/assignment',
  verifyToken,
  isAdmin,
  async (req, res) => {
    try {
      let assignedInstructor = null

      if (req.body.instructorId) {
        const instructor = await User.findOne({
          _id: req.body.instructorId,
          role: 'instructor',
        })

        if (!instructor) {
          return res.status(400).json({ err: 'Instructor not found.' })
        }

        assignedInstructor = instructor._id
      }

      const student = await Student.findByIdAndUpdate(
        req.params.studentId,
        { assignedInstructor: assignedInstructor },
        { new: true, runValidators: true }
      ).populate('assignedInstructor', 'username role')

      if (!student) {
        return res.status(404).json({ err: 'Student not found.' })
      }

      res.json(student)
    } catch (err) {
      res.status(400).json({ err: err.message })
    }
  }
)
```

An empty `instructorId` removes the assignment by saving `null`.

When an id is provided, the route first checks that it belongs to a real instructor. This prevents an admin user or an unrelated ObjectId from being assigned by mistake.

## Test the relationship

1. Create at least one regular instructor account.
2. Use an admin token to request `GET /users`.
3. Copy an instructor's `_id`.
4. Send a `PUT` request to `/students/:studentId/assignment`.

Use this body:

```json
{
  "instructorId": "paste-the-instructor-id-here"
}
```

The response should show a populated object:

```javascript
assignedInstructor: {
  _id: '...',
  username: 'instructor-one',
  role: 'instructor'
}
```

To unassign the student, send:

```json
{
  "instructorId": ""
}
```

The response should contain `assignedInstructor: null`.
