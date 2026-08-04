<h1>
  <span class="headline">Student Success Hub</span>
  <span class="subhead">Build the Assignment Page</span>
</h1>

**Learning objective:** By the end of this lesson, students will be able to use a controlled select to update a referenced relationship.

## Create the user service

Create `src/services/users.js`:

```javascript
const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/users`

const index = async () => {
  const response = await fetch(BASE_URL, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })

  const data = await response.json()

  if (!response.ok) throw new Error(data.err)

  return data
}

export { index }
```

## Add the assignment service

In `src/services/students.js`, add:

```javascript
const assignInstructor = async (studentId, instructorId) => {
  const response = await fetch(`${BASE_URL}/${studentId}/assignment`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ instructorId: instructorId }),
  })

  const data = await response.json()

  if (!response.ok) throw new Error(data.err)

  return data
}
```

Export `assignInstructor`.

## Create the assignment page

Create `src/pages/Assignments.jsx`:

```javascript
import { useEffect, useState } from 'react'
import * as studentService from '../services/students'
import * as userService from '../services/users'

const Assignments = (props) => {
  const [instructors, setInstructors] = useState([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const instructorData = await userService.index()
        setInstructors(instructorData)
      } catch (err) {
        setMessage(err.message)
      }
    }

    fetchInstructors()
  }, [])

  const handleChange = async (studentId, instructorId) => {
    try {
      setMessage('')
      const updatedStudent = await studentService.assignInstructor(
        studentId,
        instructorId
      )
      props.handleAssignmentUpdate(updatedStudent)
    } catch (err) {
      setMessage(err.message)
    }
  }

  return (
    <main>
      <h1>Student Assignments</h1>
      <p>{message}</p>

      <section className='assignment-list'>
        {props.students.map((student) => (
          <article className='card assignment-row' key={student._id}>
            <div>
              <h2>{student.name}</h2>
              <p>{student.status}</p>
            </div>

            <label htmlFor={`assignment-${student._id}`}>
              Assigned Instructor
            </label>
            <select
              id={`assignment-${student._id}`}
              value={student.assignedInstructor?._id || ''}
              onChange={(event) => {
                handleChange(student._id, event.target.value)
              }}
            >
              <option value=''>Unassigned</option>
              {instructors.map((instructor) => (
                <option key={instructor._id} value={instructor._id}>
                  {instructor.username}
                </option>
              ))}
            </select>
          </article>
        ))}
      </section>
    </main>
  )
}

export default Assignments
```

The `select` is controlled by the student's current `assignedInstructor`. When a different option is selected, the app immediately sends the new id to the API.

## Update shared student state

Add this function to `App.jsx`:

```javascript
const handleAssignmentUpdate = (updatedStudent) => {
  setStudents(students.map((student) => {
    if (student._id === updatedStudent._id) return updatedStudent
    return student
  }))
}
```

This function does not make the API request. The page already did that. It only replaces the old object in shared state.

## Add the admin route and nav link

Import `Assignments`, then add:

```javascript
<Route
  path='/assignments'
  element={
    user.role === 'admin'
      ? (
        <Assignments
          students={students}
          handleAssignmentUpdate={handleAssignmentUpdate}
        />
      )
      : <Navigate to='/' />
  }
/>
```

Show the nav link only to admins:

```javascript
{props.user.role === 'admin' && (
  <li><Link to='/assignments'>Assignments</Link></li>
)}
```

Assign and unassign a few students. Confirm that the dashboard and student list update without a page refresh.
