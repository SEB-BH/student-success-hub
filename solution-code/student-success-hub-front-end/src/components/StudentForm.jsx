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
      {message && <p className='message error'>{message}</p>}

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
