import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'

import CheckInForm from '../components/CheckInForm'
import * as studentService from '../services/students'

const StudentDetails = (props) => {
  const { studentId } = useParams()
  const navigate = useNavigate()
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

  const handleDelete = async () => {
    await props.handleDeleteStudent(studentId)
    navigate('/students')
  }

  if (message) return <main><p className='message error'>{message}</p></main>
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
          <div className='button-row'>
            <Link
              className='button-link secondary'
              to={`/students/${studentId}/edit`}
            >
              Edit Student
            </Link>
            <button className='danger' onClick={handleDelete}>
              Delete Student
            </button>
          </div>
        )}
      </section>

      <CheckInForm handleAddCheckIn={handleAddCheckIn} />

      <section>
        <h2>Check-In History</h2>
        {!student.checkIns.length ? (
          <p>No check-ins yet.</p>
        ) : (
          <div className='check-in-list'>
            {student.checkIns.map((checkIn) => (
              <article className='card' key={checkIn._id}>
                <h3>Confidence: {checkIn.confidence}/5</h3>
                <p>{checkIn.note}</p>
                <p>
                  Needs support: {checkIn.needsSupport ? 'Yes' : 'No'}
                </p>
                <p>
                  Recorded by: {checkIn.createdBy.username}
                </p>
                <small>
                  {new Date(checkIn.createdAt).toLocaleDateString()}
                </small>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default StudentDetails
