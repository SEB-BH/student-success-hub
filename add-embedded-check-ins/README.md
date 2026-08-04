<h1>
  <span class="headline">Student Success Hub</span>
  <span class="subhead">Add Embedded Check-Ins</span>
</h1>

**Learning objective:** By the end of this lesson, students will be able to create a nested route that adds an embedded subdocument to a student.

## The nested route

A check-in cannot exist without a student, so its route includes the parent student's id:

```plaintext
POST /students/:studentId/check-ins
```

This route requires a signed-in user, but it does not require an admin. Instructors need to record check-ins.

## Add the route

In `controllers/students.js`, add this route above `module.exports`:

```javascript
router.post('/:studentId/check-ins', verifyToken, async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId)

    if (!student) {
      return res.status(404).json({ err: 'Student not found.' })
    }

    const checkInData = {
      confidence: req.body.confidence,
      note: req.body.note,
      needsSupport: req.body.needsSupport,
      createdBy: req.user._id,
    }

    student.checkIns.push(checkInData)
    await student.save()

    await student.populate('checkIns.createdBy', 'username role')

    const newCheckIn = student.checkIns[student.checkIns.length - 1]

    res.status(201).json(newCheckIn)
  } catch (err) {
    res.status(400).json({ err: err.message })
  }
})
```

## Follow the data

The route performs these steps:

1. Find the parent student.
2. Build a check-in object from the expected form fields.
3. Add the signed-in user's id as `createdBy`.
4. Push the new object into `student.checkIns`.
5. Save the parent student.
6. Populate the check-in authors.
7. Return the newly created check-in.

The browser should never choose `createdBy`. The verified token tells the server who is making the request.

## Test the route

Send a `POST` request to:

```plaintext
http://localhost:3000/students/<student-id>/check-ins
```

Include a Bearer token and this JSON body:

```json
{
  "confidence": 4,
  "note": "Understands components and props.",
  "needsSupport": false
}
```

The response should contain the new check-in. Its `createdBy` property should be a user object with a username.

Now send `GET /students/:studentId`. The same check-in should appear inside the student's `checkIns` array.

## Embedded data reminder

We did not write this:

```javascript
CheckIn.create(req.body)
```

There is no `CheckIn` model. We find and save the parent student because the check-in is embedded inside that document.

## Optional test

Try submitting a confidence value of `8` or a note longer than 300 characters. Mongoose should reject the data based on the embedded schema's validation rules.
