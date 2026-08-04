const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/auth`

const getUser = () => {
  const token = localStorage.getItem('token')

  if (!token) return null

  try {
    return JSON.parse(atob(token.split('.')[1])).payload
  } catch (err) {
    localStorage.removeItem('token')
    return null
  }
}

const signUp = async (formData) => {
  const response = await fetch(`${BASE_URL}/sign-up`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.err)
  }

  localStorage.setItem('token', data.token)
  return JSON.parse(atob(data.token.split('.')[1])).payload
}

const signIn = async (formData) => {
  const response = await fetch(`${BASE_URL}/sign-in`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.err)
  }

  localStorage.setItem('token', data.token)
  return JSON.parse(atob(data.token.split('.')[1])).payload
}

const signOut = () => {
  localStorage.removeItem('token')
}

export { getUser, signUp, signIn, signOut }
