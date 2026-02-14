import { useState, useEffect } from "react";
import img4 from "../../assets/logo1.svg";
import "./Navbar.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Navbar({ onToggleSidebar, isSidebarOpen }) {
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState({ name: "", email: "", role: "" });

  const handleLogout = async (reason = "expired") => {
    try {
      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout request failed", err);
    }

    if (reason === "expired") {
      toast.error("Session expired. Please log in again.", {
        position: "top-right",
        autoClose: 3000,
      });
    } else if (reason === "manual") {
      toast.success("You have been logged out successfully.", {
        position: "top-right",
        autoClose: 1000,
      });
    }

    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/profile", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Unauthorized");
        }

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Auth failed:", err);
        handleLogout("expired");
      }
    };

    fetchUser();
  }, []);

  const toggleProfile = () => setShowProfile(!showProfile);

  return (
    <>
      <header className="navbar">
        <button className="sidebar-toggle" onClick={onToggleSidebar}>
          {isSidebarOpen ? "✖" : "☰"}
        </button>
        <div className="navbar-title">
          <h1 className="navbar-img"><img className="nav-img" src={img4} alt=" logo" /></h1>
          <h2>Excel Analysis Platform</h2>
        </div>

        <div className="user-icon" onClick={toggleProfile}>👤</div>

        {showProfile && (
          <div className="user-profile">
            <p><strong>Name:</strong>{user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <button onClick={() => handleLogout("manual")}>Logout</button>
          </div>
        )}
      </header>
      <ToastContainer />
    </>
  );
}
