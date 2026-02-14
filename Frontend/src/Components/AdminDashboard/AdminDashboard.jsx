import { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} />

      {/* Main Content */}
      <div className="main-content">
        {/* Navbar with toggle */}
        <Navbar onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

        <div className="admin-content">
          <h1>👑 Admin Dashboard</h1>
          <p>Welcome, Admin! You have full access to manage the platform.</p>
          {/* Add admin-specific controls/components here */}
        </div>
      </div>
    </div>
  );
}
