import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LoginDto } from "../../types/Types";
import "./LoginPage.css";
function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data: LoginDto = { email, password };
    const response = await fetch("http://localhost:5242/Auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });
    if (response.ok) {
      navigate("/home");
    } else {
      setError("Failed to login");
    }
  };
  return (
    <main className="login-main">
      <h1 className="login-h1">Quickbite</h1>
      <img className="login-img" src="./assets/logo.png" alt="logo" />
      <section className="login-section">
        <h2 className="login-h2">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="login-div">
            <img
              src="./assets/email-logo.png"
              alt="email"
            />
            <input
              className="login-input"
              placeholder="Email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <br />
          <div className="login-div">
            <img
              className="login-img-logo"
              src="./assets/password-logo.png"
              alt="password"
            />
          <input
            className="login-input-password"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          </div>
          <br />
          {error && <p className="login-error">{error}</p>}
          <button className="login-button" type="submit">
            Login
          </button>
        </form>
        <p className="login-p-white">
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </section>
    </main>
  );
}
export default LoginPage;
