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
