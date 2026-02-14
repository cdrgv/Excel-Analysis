import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import "./upload.css";
import { toast } from "react-toastify";
import API_BASE_URL from "../api/api";

function HistoryPage() {
  const [uploadHistory, setUploadHistory] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);


  const fetchUploadHistory = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/files/history`, {
        credentials: "include",
      });
      const data = await res.json();
      setUploadHistory(data.uploads);
    } catch (err) {
      console.error("Failed to fetch upload history:", err);
      toast.error("Unable to load upload history");
    }
  };

  useEffect(() => {
    fetchUploadHistory();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="history-dashboard-container">
      <Sidebar isOpen={sidebarOpen} />
      <div className="history-main-content">
        <Navbar onToggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />
        <div className="history-body">
          <h2 className="history-title">Upload History</h2>
          {Array.isArray(uploadHistory) && uploadHistory.length > 0 ? (
            <ul className="history-list">
              {uploadHistory.map((file, index) => (
                <li key={index} className="history-item">
                  <p><strong>File:</strong> {file.filename}</p>
                  <p><strong>Size:</strong> {(file.size / 1024).toFixed(2)} KB</p>
                  <p><strong>Uploaded:</strong> {new Date(file.createdAt).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-history">No uploads yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default HistoryPage;
