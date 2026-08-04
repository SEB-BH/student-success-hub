<h1>
  <span class="headline">Student Success Hub</span>
  <span class="subhead">Expand the Student Model</span>
</h1>

**Learning objective:** By the end of this lesson, students will be able to build a Mongoose model that uses validation, defaults, arrays, a reference, and an embedded schema.

## Create the model

In the Express app, create `models/student.js`:

```bash
touch models/student.js
```

Add the following:

```javascript
// models/student.js

const mongoose = require('mongoose')

const checkInSchema = new mongoose.Schema({
  confidence: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  note: {
    type: String,
    required: true,
    trim: true,
    maxlength: 300,
  },
  needsSupport: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true })

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  favoriteFood: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['active', 'needs support', 'completed'],
    default: 'active',
  },
  attendance: {
    type: Number,
    min: 0,
    max: 100,
    default: 100,
  },
  skills: [{
    type: String,
    trim: true,
  }],
  assignedInstructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  checkIns: [checkInSchema],
}, { timestamps: true })

const Student = mongoose.model('Student', studentSchema)

module.exports = Student
```

## What this schema demonstrates

| Option or pattern | Example | Purpose |
| --- | --- | --- |
| Required data | `required: true` | Rejects missing values |
| String cleanup | `trim`, `lowercase` | Normalizes text before saving |
| Restricted choices | `enum` | Prevents unexpected status values |
| Number validation | `min`, `max` | Keeps attendance and confidence in range |
| Default value | `default` | Supplies a starting value |
| Array | `skills` | Stores several strings |
| Reference | `assignedInstructor` | Points to an existing user |
| Embedded schema | `checkIns` | Stores related history inside a student |
| Automatic dates | `timestamps` | Adds `createdAt` and `updatedAt` |

## Why check-ins come first

`checkInSchema` must be declared before `studentSchema` because the student schema uses it here:

```javascript
checkIns: [checkInSchema]
```

We do not call `mongoose.model()` for check-ins. A check-in is a subdocument that must be created through its parent student.

## Example document

After we add routes, a student document may look like this:

```javascript
{
  name: 'Maya Ali',
  email: 'maya@example.com',
  favoriteFood: 'Pasta',
  status: 'active',
  attendance: 94,
  skills: ['HTML', 'CSS'],
  assignedInstructor: '66a123...',
  checkIns: [
    {
      confidence: 4,
      note: 'Understands components and props.',
      needsSupport: false,
      createdBy: '66a456...'
    }
  ]
}
```

The database stores references as ObjectIds. Later, `populate()` will replace selected ObjectIds with useful user data in the JSON response.
