<h1>
  <span class="headline">Student Success Hub</span>
  <span class="subhead">Build the Shopping Cart</span>
</h1>

**Learning objective:** By the end of this lesson, students will be able to lift cart state, update an array without mutating it, and calculate a point total.

## Decide where cart state belongs

The shop adds rewards. The cart removes rewards and checks out. The nav displays the number of rewards.

All three need the same state, so place it in their closest shared parent: `App.jsx`.

## Add cart state and handlers

In `App.jsx`:

```javascript
const [cart, setCart] = useState([])

const handleAddToCart = (reward) => {
  const alreadyInCart = cart.some((cartReward) => {
    return cartReward._id === reward._id
  })

  if (alreadyInCart) return

  setCart([...cart, reward])
}

const handleRemoveFromCart = (rewardId) => {
  setCart(cart.filter((reward) => reward._id !== rewardId))
}

const handleClearCart = () => {
  setCart([])
}
```

Also clear the cart when the user signs out:

```javascript
if (!user) {
  setCart([])
}
```

## Build the shop page

Create `src/pages/Shop.jsx`:

```javascript
const Shop = (props) => {
  return (
    <main>
      <p className='eyebrow'>Spend imaginary points</p>
      <h1>Rewards Shop</h1>

      <section className='card-grid'>
        {props.rewards.map((reward) => {
          const alreadyInCart = props.cart.some((cartReward) => {
            return cartReward._id === reward._id
          })

          return (
            <article className='card' key={reward._id}>
              <p className='eyebrow'>{reward.category}</p>
              <h2>{reward.name}</h2>
              <p>{reward.description}</p>
              <strong>{reward.points} points</strong>
              <button
                disabled={alreadyInCart}
                onClick={() => props.handleAddToCart(reward)}
              >
                {alreadyInCart ? 'In Cart' : 'Add to Cart'}
              </button>
            </article>
          )
        })}
      </section>
    </main>
  )
}

export default Shop
```

The cart allows one of each reward. This keeps the first array update easy to follow.

## Build the cart page

Create `src/pages/Cart.jsx`:

```javascript
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
      <p>{message}</p>

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
```

The checkout is simulated. It shows a confirmation and clears the cart, but it does not create an order in MongoDB.

## Add routes

Import `Shop` and `Cart` into `App.jsx`, then add protected routes:

```javascript
<Route
  path='/shop'
  element={
    <Shop
      rewards={rewards}
      cart={cart}
      handleAddToCart={handleAddToCart}
    />
  }
/>

<Route
  path='/cart'
  element={
    <Cart
      cart={cart}
      students={students}
      handleRemoveFromCart={handleRemoveFromCart}
      handleClearCart={handleClearCart}
    />
  }
/>
```

## Update the nav

Pass `cart` to the nav:

```javascript
<Nav user={user} setUser={setUser} cart={cart} />
```

Add links for signed-in users:

```javascript
<li><Link to='/shop'>Rewards</Link></li>
<li><Link to='/cart'>Cart ({props.cart.length})</Link></li>
```

## Test the state flow

1. Add two rewards.
2. Confirm the nav count changes.
3. Remove one reward.
4. Confirm the total changes.
5. Choose a student and submit.
6. Confirm the cart clears.
7. Refresh with rewards in the cart and observe that they disappear.

The final behavior is expected because the cart is only stored in React state. Persisting it is a Level Up.
