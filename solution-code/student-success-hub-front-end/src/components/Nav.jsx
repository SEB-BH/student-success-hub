import { Link } from 'react-router'
import * as authService from '../services/auth'

const Nav = (props) => {
  const handleSignOut = () => {
    authService.signOut()
    props.setUser(null)
  }

  return (
    <nav className='nav'>
      <Link className='brand' to='/'>Student Success Hub</Link>

      {props.user ? (
        <ul>
          <li><Link to='/'>Dashboard</Link></li>
          <li><Link to='/students'>Students</Link></li>
          {props.user.role === 'admin' && (
            <li><Link to='/assignments'>Assignments</Link></li>
          )}
          <li><Link to='/shop'>Rewards</Link></li>
          <li><Link to='/cart'>Cart ({props.cart.length})</Link></li>
          <li>
            <Link to='/' onClick={handleSignOut}>Sign Out</Link>
          </li>
        </ul>
      ) : (
        <ul>
          <li><Link to='/'>Home</Link></li>
          <li><Link to='/sign-in'>Sign In</Link></li>
          <li><Link to='/sign-up'>Sign Up</Link></li>
        </ul>
      )}
    </nav>
  )
}

export default Nav
