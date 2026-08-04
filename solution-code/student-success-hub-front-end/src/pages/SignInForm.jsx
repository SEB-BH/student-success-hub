import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import * as authService from '../services/auth'

const SignInForm = (props) => {
  const navigate = useNavigate()

  const initialState = {
    username: '',
    password: '',
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
      const signedInUser = await authService.signIn(formData)
      props.setUser(signedInUser)
      setFormData(initialState)
      navigate('/')
    } catch (err) {
      setMessage(err.message)
    }
  }

  return (
    <main className='auth-page'>
      <form className='form-card' onSubmit={handleSubmit}>
        <h1>Sign In</h1>
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

        <button type='submit'>Sign In</button>
        <p>Need an account? <Link to='/sign-up'>Sign up</Link>.</p>
      </form>
    </main>
  )
}

export default SignInForm
