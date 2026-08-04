import { Link } from 'react-router'

const StudentList = (props) => {
  return (
    <main>
      <header className='page-header'>
        <div>
          <p className='eyebrow'>Student records</p>
          <h1>Students</h1>
        </div>

        {props.user.role === 'admin' && (
          <Link className='button-link' to='/students/new'>
            Add Student
          </Link>
        )}
      </header>

      {!props.students.length ? (
        <p>No students have been added yet.</p>
      ) : (
        <section className='card-grid'>
          {props.students.map((student) => (
            <article className='card' key={student._id}>
              <h2>{student.name}</h2>
              <p>{student.email}</p>
              <p>Status: {student.status}</p>
              <p>Attendance: {student.attendance}%</p>
              <p>
                Instructor:{' '}
                {student.assignedInstructor
                  ? student.assignedInstructor.username
                  : 'Unassigned'}
              </p>
              <Link to={`/students/${student._id}`}>View Student</Link>
            </article>
          ))}
        </section>
      )}
    </main>
  )
}

export default StudentList
