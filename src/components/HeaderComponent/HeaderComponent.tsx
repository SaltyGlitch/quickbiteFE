import './HeaderComponent.css'
import { useNavigate } from 'react-router-dom'

function HeaderComponent () {
  const navigate = useNavigate()
  const handleLogout = async () => {
    const response = await fetch('http://localhost:5242/Auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    })

    if (response.ok) {
      navigate('/login')
    } else {
      console.log('What can I do?')
    }
  }
  return (
    <main className="header-main">
      <img className="header-img" src="./assets/logo.png" alt="logo" />
      <h1 className="header-h1">uickbite</h1>
      {/* <Link to="/"> */}
        <button className="header-button" onClick={handleLogout}>Logout</button>
      {/* </Link> */}
    </main>
  )
}
export default HeaderComponent
