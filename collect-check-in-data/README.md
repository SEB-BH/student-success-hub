<h1>
  <span class="headline">Student Success Hub</span>
  <span class="subhead">Collect Check-In Data</span>
</h1>

**Learning objective:** By the end of this lesson, students will be able to submit an embedded check-in and update a student object in React state.

## Add the service function

In `src/services/students.js`, add:

```javascript
const createCheckIn = async (studentId, checkInData) => {
  const response = await fetch(`${BASE_URL}/${studentId}/check-ins`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(checkInData),
  })

  const data = await response.json()

  if (!response.ok) throw new Error(data.err)

  return data
}
```

Export `createCheckIn`.

## Build the controlled form

Create the component:

```bash
touch src/components/CheckInForm.jsx
```

Add:

```javascript
// src/components/CheckInForm.jsx

import { useState } from 'react'

const CheckInForm = (props) => {
  const initialState = {
    confidence: 3,
    note: '',
    needsSupport: false,
  }

  const [formData, setFormData] = useState(initialState)
  const [message, setMessage] = useState('')

  const handleChange = (event) => {
    setMessage('')

    let value = event.target.value

    if (event.target.type === 'checkbox') {
      value = event.target.checked
    }

    setFormData({
      ...formData,
      [event.target.name]: value,
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const checkInData = {
      confidence: Number(formData.confidence),
      note: formData.note,
      needsSupport: formData.needsSupport,
    }

    try {
      await props.handleAddCheckIn(checkInData)
      setFormData(initialState)
    } catch (err) {
      setMessage(err.message)
    }
  }

  return (
    <form className='form-card' onSubmit={handleSubmit}>
      <h2>New Check-In</h2>
      <p>{message}</p>

      <label htmlFor='confidence'>Confidence</label>
      <select
        id='confidence'
        name='confidence'
        value={formData.confidence}
        onChange={handleChange}
      >
        <option value='1'>1 - Very low</option>
        <option value='2'>2 - Low</option>
        <option value='3'>3 - Developing</option>
        <option value='4'>4 - Confident</option>
        <option value='5'>5 - Very confident</option>
      </select>

      <label htmlFor='note'>Note</label>
      <textarea
        id='note'
        name='note'
        value={formData.note}
        onChange={handleChange}
        maxLength='300'
        required
      />

      <label className='checkbox-row'>
        <input
          type='checkbox'
          name='needsSupport'
          checked={formData.needsSupport}
          onChange={handleChange}
        />
        Student needs additional support
      </label>

      <button type='submit'>Add Check-In</button>
    </form>
  )
}

export default CheckInForm
```

Checkboxes use `checked` instead of `value`. The `handleChange()` function checks the input type so it can handle both regular form fields and the checkbox.

## Use the form on the details page

Import the component in `StudentDetails.jsx`:

```javascript
import CheckInForm from '../components/CheckInForm'
```

Add the handler:

```javascript
const handleAddCheckIn = async (checkInData) => {
  const newCheckIn = await studentService.createCheckIn(
    studentId,
    checkInData
  )

  setStudent({
    ...student,
    checkIns: [...student.checkIns, newCheckIn],
  })

  props.handleCheckInAdded(studentId, newCheckIn)
}
```

The local update refreshes the details page. We should also update the shared
`students` array so the dashboard changes when we navigate back to it.

Add this handler in `App.jsx`:

```javascript
const handleCheckInAdded = (studentId, newCheckIn) => {
  setStudents(students.map((student) => {
    if (student._id === studentId) {
      return {
        ...student,
        checkIns: [...student.checkIns, newCheckIn],
      }
    }

    return student
  }))
}
```

Pass it to the `StudentDetails` route:

```javascript
<StudentDetails
  user={user}
  handleDeleteStudent={handleDeleteStudent}
  handleCheckInAdded={handleCheckInAdded}
/>
```

Render the form above the check-in history:

```javascript
<CheckInForm handleAddCheckIn={handleAddCheckIn} />
```

## Follow the state update

The student is an object in state. We copy its existing properties:

```javascript
{ ...student }
```

Then we replace only the `checkIns` property with a new array:

```javascript
checkIns: [...student.checkIns, newCheckIn]
```

The page re-renders immediately, so the new check-in appears without a refresh.

## Test

Submit check-ins with different confidence values and support choices. Refresh the page and confirm they were saved in MongoDB, not only in React state.
