import { useState } from 'react'

const Cart = (props) => {
  const [selectedStudentId, setSelectedStudentId] = useState('')
  const [message, setMessage] = useState('')

  const totalPoints = props.cart.reduce((total, reward) => {
    return total + reward.points
  }, 0)

  const handleCheckout = (event) => {
    event.preventDefault()

    const selectedStudent = props.students.find((student) => {
      return student._id === selectedStudentId
    })

    if (!selectedStudent) {
      setMessage('Choose a student before submitting the request.')
      return
    }

    if (!props.cart.length) {
      setMessage('Add at least one reward to the cart.')
      return
    }

    setMessage(
      `Reward request submitted for ${selectedStudent.name}: `
      + `${totalPoints} points.`
    )

    props.handleClearCart()
    setSelectedStudentId('')
  }

  return (
    <main>
      <h1>Reward Cart</h1>
      {message && <p className='message success'>{message}</p>}

      {!props.cart.length ? (
        <p>Your cart is empty.</p>
      ) : (
        <section>
          {props.cart.map((reward) => (
            <article className='card cart-row' key={reward._id}>
              <div>
                <h2>{reward.name}</h2>
                <p>{reward.points} points</p>
              </div>
              <button
                className='danger'
                onClick={() => props.handleRemoveFromCart(reward._id)}
              >
                Remove
              </button>
            </article>
          ))}
        </section>
      )}

      <form className='form-card' onSubmit={handleCheckout}>
        <label htmlFor='student'>Request rewards for</label>
        <select
          id='student'
          value={selectedStudentId}
          onChange={(event) => setSelectedStudentId(event.target.value)}
        >
          <option value=''>Choose a student</option>
          {props.students.map((student) => (
            <option key={student._id} value={student._id}>
              {student.name}
            </option>
          ))}
        </select>

        <p className='cart-total'>Total: {totalPoints} points</p>
        <button type='submit'>Submit Reward Request</button>
      </form>
    </main>
  )
}

export default Cart
