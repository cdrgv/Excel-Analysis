import { useState, useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import img3 from "../../assets/dash.png";
import Navbar from "../Navbar/Navbar";
import "./Dashboard.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ExcelVisualizer from "../ExcelVisualizer/ExcelVisualizer";
import API_BASE_URL from "../api/api";

export default function Dashboard() {
  const [user, setUser] = useState({ name: "", email: "", role: "" });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);

  // NEW: AI state
  const [aiInsights, setAIInsights] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");


  useEffect(() => {

    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/profile`, {
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
      }
    };
    fetchUser();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // eslint-disable-next-line no-unused-vars
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.warn("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch(`${API_BASE_URL}/api/files/upload`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(`Uploaded: ${data.file}`);
        setSelectedFile(null);
      } else {
        toast.error(data.message || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Upload error occurred.");
    }
  };

  // NEW: Handle AI Insights request
  const handleGetAIInsights = async (chartType = "graph") => {
    if (!selectedFile) {
      toast.error("Please upload an Excel file first");
      return;
    }
    try {
      setLoadingAI(true);
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("xAxis", xAxis);
      formData.append("yAxis", yAxis);
      formData.append("chartType", chartType);

      const res = await fetch(`${API_BASE_URL}/api/analyze-ai`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.error) {
        toast.error(data.error);
      } else {
        setAIInsights(data.insights);
        toast.success(`AI Insights for ${chartType} generated successfully`);
      }
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      toast.error("Failed to get AI insights");
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="dash-wrapper">
      <Sidebar isOpen={sidebarOpen} />
      <div className="dash-main-content">
        <Navbar onToggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />

        <div className="dash-body">
          <h2 className="dash-welcome-title">
            Welcome to the Dashboard, <strong className="dash-username">{user.name}</strong>
          </h2>

          <div className="dash-info-card">
            <div className="dash-info-text">
              <h1 className="dash-greeting">Hello, {user.name}</h1>
              <p className="dash-intro">

                Welcome to your Excel Analytics Dashboard, where data meets clarity.
                Upload your Excel files and turn rows and columns into meaningful visual insights.
                Navigate your performance, trends, and summaries—all in one place.
              </p>
            </div>
            <div className="dash-info-image">
              <img src={img3} alt="Dashboard Illustration" className="dash-image" />
            </div>
          </div>

          <div className="upload-direction">
            <span className="arrow">⬇</span>
            <p className="arrow-text">Scroll down to upload your Excel file</p>
          </div>

          <div className="dash-upload-section">
            {/* <div className="dash-upload-box">
              <img src={img2} className="dash-upload-icon" alt="Upload Icon" />
              <p className="dash-upload-text">Drag and Drop or Upload</p>
            </div> */}
            <ExcelVisualizer
              onFileSelect={setSelectedFile}
              onUpload={handleUpload}
              onGetAIInsights={handleGetAIInsights}
              onAxisChange={(x, y) => {
                setXAxis(x);
                setYAxis(y);
              }}
            />

            {/* NEW: AI Insights Section */}
            {aiInsights && (
              <div style={{ marginTop: "20px", background: "#f4f4f4", padding: "15px", borderRadius: "8px" }}>
                <h3>AI Insights</h3>
                <pre style={{ whiteSpace: "pre-wrap" }}>{aiInsights}</pre>
              </div>
            )}
          </div>
          <div>
            {/* NEW: Get AI Insights button */}
            <button
              onClick={handleGetAIInsights}
              disabled={loadingAI}
              style={{
                backgroundColor: "#007BFF",
                color: "white",
                padding: "8px 14px",
                borderRadius: "5px",
                border: "none",
                cursor: "pointer",
              }}
            >
              {loadingAI ? "Processing..." : "Get AI Insights"}
            </button>
          </div>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
}