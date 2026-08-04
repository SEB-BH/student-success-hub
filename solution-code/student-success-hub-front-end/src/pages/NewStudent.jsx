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
