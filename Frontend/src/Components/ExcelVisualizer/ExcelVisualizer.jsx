import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";
import "./ExcelVisualizer.css";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import { Chart as GoogleChart } from "react-google-charts";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function ExcelVisualizer({ onFileSelect, onUpload, onAxisChange, onGetAIInsights }) {
  const [excelData, setExcelData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [is3D, setIs3D] = useState(false);
  const [selectedChartType, setSelectedChartType] = useState("");

  // Chart refs
  const barRef = useRef(null);
  const lineRef = useRef(null);
  const donutRef = useRef(null);
  const bar3DRef = useRef(null);
  const line3DRef = useRef(null);
  const donut3DRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Send file back up to Dashboard
    if (onFileSelect) {
      onFileSelect(file);
    }
    const reader = new FileReader();

    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const workbook = XLSX.read(bstr, { type: "binary" });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);

      setExcelData(data);
      if (data.length > 0) {
        setColumns(Object.keys(data[0]));
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleUpload = () => {
    if (excelData.length === 0) {
      alert("Please upload a valid Excel file first.");
    } else {
      alert("File uploaded and data processed successfully!");
    }
  };

  const generateChartData = () => {
    if (!xAxis || !yAxis) return null;

    const labels = excelData.map((row) => {
      const value = row[xAxis];
      if (typeof value === "number" && value > 40000) {
        const date = new Date((value - 25569) * 86400 * 1000);
        return date.toISOString().split("T")[0];
      }
      return value;
    });

    const values = excelData.map((row) => {
      const val = Number(row[yAxis]);
      return isNaN(val) ? 0 : val;
    });

    return {
      labels,
      datasets: [
        {
          label: `${yAxis} vs ${xAxis}`,
          data: values,
          backgroundColor: [
            "rgba(192, 128, 75, 0.6)",
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
            "#C9CBCF",
            "#8ED1FC",
            "#FF8A65",
            "#BA68C8"
          ],
          borderColor: "rgba(58, 5, 248, 1)",
          borderWidth: 1,
        },
      ],
    };
  };

  const getGoogleChartData = () => {
    if (!xAxis || !yAxis) return null;
    const data = [
      [xAxis, yAxis],
      ...excelData.map((row) => [row[xAxis], Number(row[yAxis])]),
    ];
    return data;
  };

  const downloadChart = (ref, name, isGoogle = false) => {
    if (ref.current) {
      try {
        const link = document.createElement("a");
        link.href = isGoogle ? ref.current.getImageURI() : ref.current.toBase64Image();
        link.download = `${name}-${new Date().toISOString().split("T")[0]}.png`;
        link.click();
      } catch (err) {
        console.error("Download failed:", err);
        alert("Failed to download chart. Please try again.");
      }
    } else {
      alert("Chart is not ready yet. Please wait a moment.");
    }
  };

  const chartData = generateChartData();

  return (
    <div className="excel-visualizer">

      <div className="upload-section">
        <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
        <span className="upload-text">Upload Excel File</span>
        <button className="upload-button" onClick={onUpload}>
          Upload
        </button>
      </div>

      {columns.length > 0 && (
        <div className="select-section">
          <label>
            X-Axis:
            <select
              onChange={(e) => {
                const val = e.target.value;
                setXAxis(val);
                if (onAxisChange) onAxisChange(val, yAxis);
              }}
              value={xAxis}
              className="dropdown"
            >
              <option value="">Select</option>
              {columns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </label>

          <label>
            Y-Axis:
            <select
              onChange={(e) => {
                const val = e.target.value;
                setYAxis(val);
                if (onAxisChange) onAxisChange(xAxis, val);
              }}
              value={yAxis}
              className="dropdown"
            >
              <option value="">Select</option>
              {columns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </label>

          <label>
            Chart Type:
            <select
              onChange={(e) => setSelectedChartType(e.target.value)}
              value={selectedChartType}
              className="dropdown"
            >
              <option value="">Select Type</option>
              <option value="Bar Chart">Bar Chart</option>
              <option value="Line Chart">Line Chart</option>
              <option value="Donut Chart">Donut Chart</option>
            </select>
          </label>

          <button
            className={`three-d-toggle ${is3D ? 'active' : ''}`}
            onClick={() => setIs3D(!is3D)}
          >
            {is3D ? "Disable 3D" : "Enable 3D"}
          </button>
        </div >
      )
      }

      {
        chartData && selectedChartType && (
          <div className="chart-container">
            {selectedChartType === "Bar Chart" && (
              <div className={`chart-box ${is3D ? 'three-d-mode' : ''}`}>
                <h4>📊 Bar Chart</h4>
                {is3D ? (
                  <GoogleChart
                    chartType="ColumnChart"
                    width="100%"
                    height="300px"
                    data={getGoogleChartData()}
                    options={{
                      title: `${yAxis} vs ${xAxis}`,
                      is3D: true,
                      backgroundColor: 'transparent',
                    }}
                    chartEvents={[
                      {
                        eventName: "ready",
                        callback: ({ chartWrapper }) => {
                          bar3DRef.current = chartWrapper.getChart();
                        },
                      },
                    ]}
                  />
                ) : (
                  <Bar data={chartData} ref={barRef} />
                )}
                <div className="chart-actions">
                  <button
                    className="download-btn"
                    onClick={() => is3D ? downloadChart(bar3DRef, "bar-chart", true) : downloadChart(barRef, "bar-chart")}
                  >
                    ⬇️ Download
                  </button>
                  <button
                    className="ai-insights-btn"
                    onClick={() => onGetAIInsights("Bar Chart")}
                  >
                    🤖 AI Insights
                  </button>
                </div>
              </div>
            )}

            {selectedChartType === "Line Chart" && (
              <div className={`chart-box ${is3D ? 'three-d-mode' : ''}`}>
                <h4>📈 Line Chart</h4>
                {is3D ? (
                  <GoogleChart
                    chartType="LineChart"
                    width="100%"
                    height="300px"
                    data={getGoogleChartData()}
                    options={{
                      title: `${yAxis} vs ${xAxis}`,
                      curveType: "function",
                      backgroundColor: 'transparent',
                    }}
                    chartEvents={[
                      {
                        eventName: "ready",
                        callback: ({ chartWrapper }) => {
                          line3DRef.current = chartWrapper.getChart();
                        },
                      },
                    ]}
                  />
                ) : (
                  <Line data={chartData} ref={lineRef} />
                )}
                <div className="chart-actions">
                  <button
                    className="download-btn"
                    onClick={() => is3D ? downloadChart(line3DRef, "line-chart", true) : downloadChart(lineRef, "line-chart")}
                  >
                    ⬇️ Download
                  </button>
                  <button
                    className="ai-insights-btn"
                    onClick={() => onGetAIInsights("Line Chart")}
                  >
                    🤖 AI Insights
                  </button>
                </div>
              </div>
            )}

            {selectedChartType === "Donut Chart" && (
              <div className={`chart-box ${is3D ? 'three-d-mode' : ''}`}>
                <h4>🍩 Donut Chart</h4>
                {is3D ? (
                  <GoogleChart
                    chartType="PieChart"
                    width="100%"
                    height="300px"
                    data={getGoogleChartData()}
                    options={{
                      title: `${yAxis} vs ${xAxis}`,
                      is3D: true,
                      backgroundColor: 'transparent',
                      pieHole: 0.4,
                    }}
                    chartEvents={[
                      {
                        eventName: "ready",
                        callback: ({ chartWrapper }) => {
                          donut3DRef.current = chartWrapper.getChart();
                        },
                      },
                    ]}
                  />
                ) : (
                  <Doughnut data={chartData} ref={donutRef} />
                )}
                <div className="chart-actions">
                  <button
                    className="download-btn"
                    onClick={() => is3D ? downloadChart(donut3DRef, "donut-chart", true) : downloadChart(donutRef, "donut-chart")}
                  >
                    ⬇️ Download
                  </button>
                  <button
                    className="ai-insights-btn"
                    onClick={() => onGetAIInsights("Donut Chart")}
                  >
                    🤖 AI Insights
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      }
    </div >
  );
}
