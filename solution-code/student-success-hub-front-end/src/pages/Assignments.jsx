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
      {message && <p className='message error'>{message}</p>}

      {!props.students.length ? (
        <p>Add students before creating assignments.</p>
      ) : (
        <section className='assignment-list'>
          {props.students.map((student) => (
            <article className='card assignment-row' key={student._id}>
              <div>
                <h2>{student.name}</h2>
                <p>{student.status}</p>
              </div>

              <div>
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
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  )
}

export default Assignments
