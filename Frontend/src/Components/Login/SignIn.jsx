import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import API_BASE_URL from "../api/api";
import loginImg from "../../assets/login.png";

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.msg || "Login failed");
        setLoading(false);
        return;
      }

      // Success
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      alert("Server error");
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Left Side Section */}
        <div className="auth-left">
          <img src={loginImg} alt="Excel Analyst" className="auth-illustration-img" />
          <h1 className="auth-left-title">Excel Analysis Hub</h1>
          <p className="auth-left-subtitle">
            Unleash the full potential of your spreadsheets with our advanced analysis platform.
          </p>
          <div className="auth-dots">
            <span className="dot"></span>
            <span className="dot active"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        </div>

        {/* Right Side Section */}
        <div className="auth-right">
          <div className="auth-brand">
            <div className="auth-brand-name">
              EXCEL <span>ANALYST</span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="auth-form">
            <div className="auth-input-group">
              <label className="auth-label">Username or email</label>
              <input
                type="email"
                placeholder="johnsmith007"
                className="auth-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="auth-input-group">
              <label className="auth-label">Password</label>
              <input
                type="password"
                placeholder="••••••••••••"
                className="auth-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <a href="#" className="auth-forgot-link">Forgot password?</a>

            <button type="submit" className="auth-button-primary" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>




          </form>

          <p className="auth-footer-text">
            Are you new?
            <button className="auth-switch-link" onClick={() => navigate("/signup")}>
              Create an Account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
