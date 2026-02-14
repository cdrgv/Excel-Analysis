import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";// Adjust the path as needed
import loginImg from "../../assets/login.png";
import API_BASE_URL from "../api/api";

const SignUp = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name,
          email,
          password,
          role: "user",
        }),
      });

      const data = await res.json();
      console.log("Signup response:", data);

      if (!res.ok) {
        alert(data.msg || data.message || "Signup failed");
        setLoading(false);
        return;
      }

      // Success
      alert("Signup successful!");
      navigate("/dashboard");

    } catch (err) {
      console.error("Fetch error:", err);
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
            <span className="dot"></span>
            <span className="dot active"></span>
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

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-input-group">
              <label className="auth-label">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="auth-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="auth-input-group">
              <label className="auth-label">Email Address</label>
              <input
                type="email"
                placeholder="name@example.com"
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

            <button type="submit" className="auth-button-primary" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </button>


          </form>

          <p className="auth-footer-text">
            Already have an account?
            <button className="auth-switch-link" onClick={() => navigate("/login")}>
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
