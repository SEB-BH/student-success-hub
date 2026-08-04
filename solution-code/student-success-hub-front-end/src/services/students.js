const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/students`

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

const show = async (studentId) => {
  const response = await fetch(`${BASE_URL}/${studentId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })

  const data = await response.json()

  if (!response.ok) throw new Error(data.err)

  return data
}

const create = async (studentData) => {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(studentData),
  })

  const data = await response.json()

  if (!response.ok) throw new Error(data.err)

  return data
}

const update = async (studentId, studentData) => {
  const response = await fetch(`${BASE_URL}/${studentId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(studentData),
  })

  const data = await response.json()

  if (!response.ok) throw new Error(data.err)

  return data
}

const deleteStudent = async (studentId) => {
  const response = await fetch(`${BASE_URL}/${studentId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })

  const data = await response.json()

  if (!response.ok) throw new Error(data.err)

  return data
}

const createCheckIn = async (studentId, checkInData) => {
  const response = await fetch(`${BASE_URL}/${studentId}/check-ins`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(checkInData),
  })

  const data = await response.json()

  if (!response.ok) throw new Error(data.err)

  return data
}

const assignInstructor = async (studentId, instructorId) => {
  const response = await fetch(`${BASE_URL}/${studentId}/assignment`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ instructorId: instructorId }),
  })

  const data = await response.json()

  if (!response.ok) throw new Error(data.err)

  return data
}

export {
  index,
  show,
  create,
  update,
  deleteStudent,
  createCheckIn,
  assignInstructor,
}
