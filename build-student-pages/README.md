<h1>
  <span class="headline">Student Success Hub</span>
  <span class="subhead">Build Student Pages</span>
</h1>

**Learning objective:** By the end of this lesson, students will be able to display an API-backed student list and fetch one student for a details page.

## Build the student list

Replace the temporary `StudentList` content:

```javascript
// src/pages/StudentList.jsx

import { Link } from 'react-router'

const StudentList = (props) => {
  return (
    <main>
      <header className='page-header'>
        <div>
          <p className='eyebrow'>Student records</p>
          <h1>Students</h1>
        </div>

        {props.user.role === 'admin' && (
          <Link className='button-link' to='/students/new'>
            Add Student
          </Link>
        )}
      </header>

      {!props.students.length ? (
        <p>No students have been added yet.</p>
      ) : (
        <section className='card-grid'>
          {props.students.map((student) => (
            <article className='card' key={student._id}>
              <h2>{student.name}</h2>
              <p>{student.email}</p>
              <p>Status: {student.status}</p>
              <p>Attendance: {student.attendance}%</p>
              <p>
                Instructor:{' '}
                {student.assignedInstructor
                  ? student.assignedInstructor.username
                  : 'Unassigned'}
              </p>
              <Link to={`/students/${student._id}`}>View Student</Link>
            </article>
          ))}
        </section>
      )}
    </main>
  )
}

export default StudentList
```

Pass `user` through the route in `App.jsx`:

```javascript
<Route
  path='/students'
  element={<StudentList students={students} user={user} />}
/>
```

## Add the show service

In `src/services/students.js`, add:

```javascript
const show = async (studentId) => {
  const response = await fetch(`${BASE_URL}/${studentId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.err)
  }

  return data
}
```

Export it:

```javascript
export { index, show }
```

## Create the details page

```bash
touch src/pages/StudentDetails.jsx
```

Add the component:

```javascript
// src/pages/StudentDetails.jsx

import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import * as studentService from '../services/students'

const StudentDetails = (props) => {
  const { studentId } = useParams()
  const [student, setStudent] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const studentData = await studentService.show(studentId)
        setStudent(studentData)
      } catch (err) {
        setMessage(err.message)
      }
    }

    fetchStudent()
  }, [studentId])

  if (message) return <main><p>{message}</p></main>
  if (!student) return <main><p>Loading student...</p></main>

  return (
    <main>
      <Link to='/students'>Back to Students</Link>

      <section className='card student-details'>
        <p className='eyebrow'>{student.status}</p>
        <h1>{student.name}</h1>
        <p>Email: {student.email}</p>
        <p>Favorite food: {student.favoriteFood || 'Not added'}</p>
        <p>Attendance: {student.attendance}%</p>
        <p>
          Skills:{' '}
          {student.skills.length ? student.skills.join(', ') : 'None added'}
        </p>
        <p>
          Assigned instructor:{' '}
          {student.assignedInstructor
            ? student.assignedInstructor.username
            : 'Unassigned'}
        </p>

        {props.user.role === 'admin' && (
          <Link to={`/students/${studentId}/edit`}>Edit Student</Link>
        )}
      </section>

      <section>
        <h2>Check-In History</h2>
        {!student.checkIns.length ? (
          <p>No check-ins yet.</p>
        ) : (
          student.checkIns.map((checkIn) => (
            <article className='card' key={checkIn._id}>
              <h3>Confidence: {checkIn.confidence}/5</h3>
              <p>{checkIn.note}</p>
              <p>
                Needs support: {checkIn.needsSupport ? 'Yes' : 'No'}
              </p>
              <p>
                Recorded by: {checkIn.createdBy.username}
              </p>
            </article>
          ))
        )}
      </section>
    </main>
  )
}

export default StudentDetails
```

## Add the route

Import the page in `App.jsx`:

```javascript
import StudentDetails from './pages/StudentDetails'
```

Add the route:

```javascript
<Route
  path='/students/:studentId'
  element={<StudentDetails user={user} />}
/>
```

Click a student card and confirm that the correct student and embedded check-ins are displayed.

> 💡 The details page fetches its own student because it needs freshly populated check-in authors. The list uses the shared `students` array because several pages need that summary data.
