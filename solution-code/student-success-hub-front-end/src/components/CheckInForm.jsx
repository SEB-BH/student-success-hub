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
      {message && <p className='message error'>{message}</p>}

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
