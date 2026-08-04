import { Link } from 'react-router'

const Landing = () => {
  return (
    <main className='landing'>
      <p className='eyebrow'>Student support, clearly organized</p>
      <h1>Turn check-ins into useful next steps.</h1>
      <p>
        Manage student records, track progress, coordinate assignments,
        and recognize growth from one simple hub.
      </p>
      <div className='button-row'>
        <Link className='button-link' to='/sign-in'>Sign In</Link>
        <Link className='button-link secondary' to='/sign-up'>Create Account</Link>
      </div>
    </main>
  )
}

export default Landing
