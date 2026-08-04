import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import * as authService from '../services/auth'

const SignUpForm = (props) => {
  const navigate = useNavigate()

  const initialState = {
    username: '',
    password: '',
    confirmPassword: '',
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

    try {
      const newUser = await authService.signUp(formData)
      props.setUser(newUser)
      setFormData(initialState)
      navigate('/')
    } catch (err) {
      setMessage(err.message)
    }
  }

  const isFormValid = () => {
    return formData.username
      && formData.password
      && formData.password === formData.confirmPassword
  }

  return (
    <main className='auth-page'>
      <form className='form-card' onSubmit={handleSubmit}>
        <h1>Sign Up</h1>
        {message && <p className='message error'>{message}</p>}

        <label htmlFor='username'>Username</label>
        <input
          id='username'
          name='username'
          value={formData.username}
          onChange={handleChange}
          required
        />

        <label htmlFor='password'>Password</label>
        <input
          id='password'
          name='password'
          type='password'
          value={formData.password}
          onChange={handleChange}
          required
        />

        <label htmlFor='confirmPassword'>Confirm Password</label>
        <input
          id='confirmPassword'
          name='confirmPassword'
          type='password'
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <button type='submit' disabled={!isFormValid()}>
          Create Account
        </button>
        <p>Already have an account? <Link to='/sign-in'>Sign in</Link>.</p>
      </form>
    </main>
  )
}

export default SignUpForm
