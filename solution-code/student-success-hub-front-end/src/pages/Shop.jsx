const Shop = (props) => {
  return (
    <main>
      <p className='eyebrow'>Spend imaginary points</p>
      <h1>Rewards Shop</h1>

      {!props.rewards.length ? (
        <p>No rewards are available. Ask an admin to run the seed.</p>
      ) : (
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
      )}
    </main>
  )
}

export default Shop
