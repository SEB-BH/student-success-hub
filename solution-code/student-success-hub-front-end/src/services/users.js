const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/users`

const index = async () => {
  const response = await fetch(BASE_URL, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })

  const data = await response.json()

  if (!response.ok) throw new Error(data.err)

  return data
}

export { index }
