import { Link } from "react-router-dom"

function Navbar() {
  return (
    <nav style={styles.nav}>
      <h2>Campus Freelance</h2>
      <div>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/login" style={styles.link}>Login</Link>
        <Link to="/signup" style={styles.button}>Signup</Link>
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px 40px",
    background: "#111",
    color: "#fff",
    alignItems: "center"
  },
  link: {
    marginRight: "20px",
    color: "#fff",
    textDecoration: "none"
  },
  button: {
    background: "#00adb5",
    padding: "8px 16px",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "5px"
  }
}

export default Navbar