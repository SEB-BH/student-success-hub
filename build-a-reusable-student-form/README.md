<h1>
  <span class="headline">Student Success Hub</span>
  <span class="subhead">Build a Reusable Student Form</span>
</h1>

**Learning objective:** By the end of this lesson, students will be able to reuse one controlled form component for creating and updating students.

## Create the form component

Create the reusable component:

```bash
touch src/components/StudentForm.jsx
```

Add the form:

```javascript
// src/components/StudentForm.jsx

import { useState } from 'react'

const StudentForm = (props) => {
  const initialState = {
    name: props.student ? props.student.name : '',
    email: props.student ? props.student.email : '',
    favoriteFood: props.student ? props.student.favoriteFood : '',
    status: props.student ? props.student.status : 'active',
    attendance: props.student ? props.student.attendance : 100,
    skills: props.student ? props.student.skills.join(', ') : '',
  }

  const [formData, setFormData] = useState(initialState)
  const [message, setMessage] = useState('')

  const handleChange = (event) => {
    setMessage('')
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const studentData = {
      name: formData.name,
      email: formData.email,
      favoriteFood: formData.favoriteFood,
      status: formData.status,
      attendance: Number(formData.attendance),
      skills: formData.skills
        .split(',')
        .map((skill) => skill.trim())
        .filter((skill) => skill),
    }

    try {
      await props.handleSubmit(studentData)
    } catch (err) {
      setMessage(err.message)
    }
  }

  return (
    <form className='form-card' onSubmit={handleSubmit}>
      <p>{message}</p>

      <label htmlFor='name'>Name</label>
      <input
        id='name'
        name='name'
        value={formData.name}
        onChange={handleChange}
        required
      />

      <label htmlFor='email'>Email</label>
      <input
        id='email'
        name='email'
        type='email'
        value={formData.email}
        onChange={handleChange}
        required
      />

      <label htmlFor='favoriteFood'>Favorite Food</label>
      <input
        id='favoriteFood'
        name='favoriteFood'
        value={formData.favoriteFood}
        onChange={handleChange}
      />

      <label htmlFor='status'>Status</label>
      <select
        id='status'
        name='status'
        value={formData.status}
        onChange={handleChange}
      >
        <option value='active'>Active</option>
        <option value='needs support'>Needs Support</option>
        <option value='completed'>Completed</option>
      </select>

      <label htmlFor='attendance'>Attendance Percentage</label>
      <input
        id='attendance'
        name='attendance'
        type='number'
        min='0'
        max='100'
        value={formData.attendance}
        onChange={handleChange}
        required
      />

      <label htmlFor='skills'>Skills</label>
      <input
        id='skills'
        name='skills'
        value={formData.skills}
        onChange={handleChange}
        placeholder='HTML, CSS, JavaScript'
      />

      <button type='submit'>{props.buttonText}</button>
    </form>
  )
}

export default StudentForm
```

The input uses a comma-separated string because a text input cannot directly edit an array. Before submission, the string is split, trimmed, and filtered.

## Add create, update, and delete services

Add these functions to `src/services/students.js`:

```javascript
const create = async (studentData) => {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(studentData),
  })

  const data = await response.json()

  if (!response.ok) throw new Error(data.err)

  return data
}

const update = async (studentId, studentData) => {
  const response = await fetch(`${BASE_URL}/${studentId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(studentData),
  })

  const data = await response.json()

  if (!response.ok) throw new Error(data.err)

  return data
}

const deleteStudent = async (studentId) => {
  const response = await fetch(`${BASE_URL}/${studentId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })

  const data = await response.json()

  if (!response.ok) throw new Error(data.err)

  return data
}
```

Export the new functions.

## Add shared handler functions

In `App.jsx`, add:

```javascript
const handleAddStudent = async (studentData) => {
  const newStudent = await studentService.create(studentData)
  setStudents([newStudent, ...students])
  return newStudent
}

const handleUpdateStudent = async (studentId, studentData) => {
  const updatedStudent = await studentService.update(studentId, studentData)

  setStudents(students.map((student) => {
    if (student._id === studentId) return updatedStudent
    return student
  }))

  return updatedStudent
}

const handleDeleteStudent = async (studentId) => {
  await studentService.deleteStudent(studentId)
  setStudents(students.filter((student) => student._id !== studentId))
}
```

## Build the create page

Create `src/pages/NewStudent.jsx`:

```javascript
import { useNavigate } from 'react-router'
import StudentForm from '../components/StudentForm'

const NewStudent = (props) => {
  const navigate = useNavigate()

  const handleSubmit = async (studentData) => {
    const newStudent = await props.handleAddStudent(studentData)
    navigate(`/students/${newStudent._id}`)
  }

  return (
    <main>
      <h1>Add Student</h1>
      <StudentForm
        handleSubmit={handleSubmit}
        buttonText='Add Student'
      />
    </main>
  )
}

export default NewStudent
```

## Build the edit page

Create `src/pages/EditStudent.jsx`:

```javascript
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import StudentForm from '../components/StudentForm'
import * as studentService from '../services/students'

const EditStudent = (props) => {
  const { studentId } = useParams()
  const navigate = useNavigate()
  const [student, setStudent] = useState(null)

  useEffect(() => {
    const fetchStudent = async () => {
      const studentData = await studentService.show(studentId)
      setStudent(studentData)
    }

    fetchStudent()
  }, [studentId])

  const handleSubmit = async (studentData) => {
    await props.handleUpdateStudent(studentId, studentData)
    navigate(`/students/${studentId}`)
  }

  if (!student) return <main><p>Loading student...</p></main>

  return (
    <main>
      <h1>Edit Student</h1>
      <StudentForm
        student={student}
        handleSubmit={handleSubmit}
        buttonText='Save Changes'
      />
    </main>
  )
}

export default EditStudent
```

We wait for the student before rendering `StudentForm`. This ensures the form's initial state uses the fetched data.

## Add admin routes

Import both pages and `Navigate` in `App.jsx`. Then add:

```javascript
<Route
  path='/students/new'
  element={
    user.role === 'admin'
      ? <NewStudent handleAddStudent={handleAddStudent} />
      : <Navigate to='/students' />
  }
/>

<Route
  path='/students/:studentId/edit'
  element={
    user.role === 'admin'
      ? <EditStudent handleUpdateStudent={handleUpdateStudent} />
      : <Navigate to='/students' />
  }
/>
```

## Add delete to the details page

Import `useNavigate`, then add:

```javascript
const navigate = useNavigate()

const handleDelete = async () => {
  await props.handleDeleteStudent(studentId)
  navigate('/students')
}
```

Place the button with the admin controls:

```javascript
<button className='danger' onClick={handleDelete}>
  Delete Student
</button>
```

Pass `handleDeleteStudent` to the `StudentDetails` route in `App.jsx`.

> 🚨 These React checks improve navigation, but the back-end `isAdmin` middleware is still the real protection.
