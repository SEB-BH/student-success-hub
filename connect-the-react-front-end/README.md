<h1>
  <span class="headline">Student Success Hub</span>
  <span class="subhead">Connect the React Front End</span>
</h1>

**Learning objective:** By the end of this lesson, students will be able to fetch protected student data and store it in shared React state.

## Create the student service

In the React app, create a service file:

```bash
touch src/services/students.js
```

Add the base URL and an `index()` function:

```javascript
// src/services/students.js

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/students`

const index = async () => {
  const response = await fetch(BASE_URL, {
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

export { index }
```

The token is required because `GET /students` uses the `verifyToken` middleware on the back end.

## Add student state to `App.jsx`

Import the hooks and service:

```javascript
import { useEffect, useState } from 'react'
import * as studentService from './services/students'
```

Keep the existing `user` state from the auth lesson. Add a new state variable:

```javascript
const [students, setStudents] = useState([])
```

## Fetch students after sign-in

Add this effect inside `App`:

```javascript
useEffect(() => {
  const fetchStudents = async () => {
    try {
      const studentsData = await studentService.index()
      setStudents(studentsData)
    } catch (err) {
      console.log(err)
    }
  }

  if (user) {
    fetchStudents()
  } else {
    setStudents([])
  }
}, [user])
```

The effect responds to the authentication state:

- When `user` exists, fetch protected data.
- When the user signs out, clear the old student data.

## Check the data

Temporarily add:

```javascript
console.log(students)
```

Sign in and confirm that the array from the API appears in the browser console. Remove the log afterward.

## Add a student page route

Create a page:

```bash
touch src/pages/StudentList.jsx
```

Start with a simple component:

```javascript
// src/pages/StudentList.jsx

const StudentList = (props) => {
  return (
    <main>
      <h1>Students</h1>
      <p>{props.students.length} students loaded.</p>
    </main>
  )
}

export default StudentList
```

Import it into `App.jsx`:

```javascript
import StudentList from './pages/StudentList'
```

Add the protected route inside the section that only renders when `user` exists:

```javascript
<Route
  path='/students'
  element={<StudentList students={students} />}
/>
```

Finally, add a **Students** link to the signed-in section of the nav:

```javascript
<li><Link to='/students'>Students</Link></li>
```

The page should now display the number of students returned by the API.
