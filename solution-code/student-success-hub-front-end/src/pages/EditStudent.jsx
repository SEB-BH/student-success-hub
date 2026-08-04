import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import StudentForm from '../components/StudentForm'
import * as studentService from '../services/students'

const EditStudent = (props) => {
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

  const handleSubmit = async (studentData) => {
    await props.handleUpdateStudent(studentId, studentData)
    navigate(`/students/${studentId}`)
  }

  if (message) return <main><p className='message error'>{message}</p></main>
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
