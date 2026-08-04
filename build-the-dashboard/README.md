<h1>
  <span class="headline">Student Success Hub</span>
  <span class="subhead">Build the Dashboard</span>
</h1>

**Learning objective:** By the end of this lesson, students will be able to calculate dashboard summaries from fetched data using array methods.

## Keep the first dashboard on the front end

The `students` array already contains the data we need. We can use `filter()`, `map()`, and `reduce()` before adding a new back-end endpoint or MongoDB aggregation.

## Create a dashboard card

Create `src/components/DashboardCard.jsx`:

```javascript
const DashboardCard = (props) => {
  return (
    <article className='dashboard-card'>
      <p>{props.title}</p>
      <strong>{props.value}</strong>
    </article>
  )
}

export default DashboardCard
```

## Update the dashboard page

Replace the temporary dashboard from the auth lesson:

```javascript
// src/pages/Dashboard.jsx

import { Link } from 'react-router'
import DashboardCard from '../components/DashboardCard'

const Dashboard = (props) => {
  const getLatestCheckIn = (student) => {
    if (!student.checkIns.length) return null
    return student.checkIns[student.checkIns.length - 1]
  }

  const activeStudents = props.students.filter((student) => {
    return student.status === 'active'
  })

  const studentsNeedingSupport = props.students.filter((student) => {
    const latestCheckIn = getLatestCheckIn(student)

    return student.status === 'needs support'
      || latestCheckIn?.needsSupport
  })

  const unassignedStudents = props.students.filter((student) => {
    return !student.assignedInstructor
  })

  let averageAttendance = 0

  if (props.students.length) {
    const attendanceTotal = props.students.reduce((total, student) => {
      return total + student.attendance
    }, 0)

    averageAttendance = attendanceTotal / props.students.length
  }

  const latestConfidenceScores = props.students
    .map((student) => {
      const latestCheckIn = getLatestCheckIn(student)
      return latestCheckIn ? latestCheckIn.confidence : null
    })
    .filter((confidence) => confidence !== null)

  let averageConfidence = 0

  if (latestConfidenceScores.length) {
    const confidenceTotal = latestConfidenceScores.reduce((total, score) => {
      return total + score
    }, 0)

    averageConfidence = confidenceTotal / latestConfidenceScores.length
  }

  const myStudents = props.students.filter((student) => {
    return student.assignedInstructor?._id === props.user._id
  })

  return (
    <main>
      <p className='eyebrow'>Welcome, {props.user.username}</p>
      <h1>Student Success Dashboard</h1>

      <section className='dashboard-grid'>
        <DashboardCard
          title='Active Students'
          value={activeStudents.length}
        />
        <DashboardCard
          title='Need Support'
          value={studentsNeedingSupport.length}
        />
        <DashboardCard
          title='Unassigned'
          value={unassignedStudents.length}
        />
        <DashboardCard
          title='Average Attendance'
          value={`${averageAttendance.toFixed(1)}%`}
        />
        <DashboardCard
          title='Latest Confidence'
          value={`${averageConfidence.toFixed(1)}/5`}
        />
      </section>

      <section className='card'>
        <h2>My Assigned Students</h2>
        {!myStudents.length ? (
          <p>No students are currently assigned to you.</p>
        ) : (
          <ul>
            {myStudents.map((student) => (
              <li key={student._id}>
                <Link to={`/students/${student._id}`}>
                  {student.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}

export default Dashboard
```

## Pass dashboard props

Update the `/` route in `App.jsx`:

```javascript
<Route
  path='/'
  element={
    user
      ? <Dashboard user={user} students={students} />
      : <Landing />
  }
/>
```

## Why the empty-array checks matter

Dividing by zero produces `NaN`. Before calculating an average, the code checks whether the array has items.

This dashboard also uses the latest check-in instead of averaging every historical check-in. That gives a simple snapshot of each student's current confidence.

## Test the calculations

Try these changes and predict the dashboard before refreshing:

1. Add a student with `80` attendance.
2. Change a student's status to `needs support`.
3. Add a check-in with `needsSupport: true`.
4. Assign a student to your instructor account.

The cards should respond to the fetched data rather than hard-coded values.
