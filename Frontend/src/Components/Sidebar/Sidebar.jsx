import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar({ isOpen }) {
  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <nav className="sidebar-menu">
        <Link to="/dashboard" className="sidebar-link">🏠 Dashboard</Link>
        <Link to="/history" className="sidebar-link">📜 History</Link>
        {/* <Link to="/settings" className="sidebar-link">⚙️ Settings</Link> */}
      </nav>
    </div>
  );
}
