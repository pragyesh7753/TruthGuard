import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { BarChart3, TrendingUp, PieChart as PieIcon } from "lucide-react";

/* =========================================
   Mock Data
   Replace with real API data when backend
   is connected.
   ========================================= */

/** Fake vs Real distribution for pie chart */
const DISTRIBUTION_DATA = [
  { name: "Fake News", value: 42 },
  { name: "Real News", value: 58 },
];

const PIE_COLORS = ["#f87171", "#34d399"];

/** Top fake news topics for bar chart */
const TOPICS_DATA = [
  { topic: "Politics", count: 340 },
  { topic: "Health", count: 280 },
  { topic: "Science", count: 190 },
  { topic: "Finance", count: 150 },
  { topic: "Tech", count: 120 },
  { topic: "Climate", count: 95 },
];

/** Monthly trend for line chart */
const TREND_DATA = [
  { month: "Jan", fake: 120, real: 200 },
  { month: "Feb", fake: 150, real: 210 },
  { month: "Mar", fake: 180, real: 190 },
  { month: "Apr", fake: 140, real: 230 },
  { month: "May", fake: 200, real: 220 },
  { month: "Jun", fake: 250, real: 240 },
  { month: "Jul", fake: 210, real: 260 },
  { month: "Aug", fake: 190, real: 250 },
  { month: "Sep", fake: 230, real: 270 },
  { month: "Oct", fake: 260, real: 280 },
  { month: "Nov", fake: 220, real: 290 },
  { month: "Dec", fake: 240, real: 310 },
];

/** Summary metric cards */
const STATS = [
  { label: "Total Analyzed", value: "12,847", change: "+12%" },
  { label: "Fake Detected", value: "5,396", change: "+8%" },
  { label: "Accuracy Rate", value: "96.2%", change: "+0.5%" },
  { label: "Avg. Response", value: "1.4s", change: "-0.2s" },
];

/* =========================================
   Custom Tooltip
   Shared dark-styled tooltip for all charts.
   ========================================= */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="chart-tooltip">
      {label && <p className="chart-tooltip-label">{label}</p>}
      {payload.map((entry) => (
        <p key={entry.name} className="chart-tooltip-value" style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
}

/* =========================================
   Dashboard Page
   ========================================= */
function Dashboard() {
  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Page header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">
            Analytics <span className="text-gradient">Dashboard</span>
          </h1>
          <p className="dashboard-subtitle">
            Overview of fake news detection metrics and trends.
          </p>
        </div>

        {/* Summary stat cards */}
        <div className="stats-grid">
          {STATS.map((stat) => (
            <div key={stat.label} className="stat-card glass-card">
              <p className="stat-label">{stat.label}</p>
              <p className="stat-value">{stat.value}</p>
              <span className="stat-change">{stat.change}</span>
            </div>
          ))}
        </div>

        {/* Charts grid */}
        <div className="charts-grid">
          {/* Pie chart — Fake vs Real distribution */}
          <div className="chart-card glass-card">
            <div className="chart-card-header">
              <PieIcon size={18} className="chart-icon" />
              <h2 className="chart-card-title">News Distribution</h2>
            </div>

            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={DISTRIBUTION_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {DISTRIBUTION_DATA.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={PIE_COLORS[index]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    formatter={(value) => (
                      <span style={{ color: "#94a3b8", fontSize: "0.85rem" }}>
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar chart — Top fake news topics */}
          <div className="chart-card glass-card">
            <div className="chart-card-header">
              <BarChart3 size={18} className="chart-icon" />
              <h2 className="chart-card-title">Top Fake News Topics</h2>
            </div>

            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={TOPICS_DATA} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis
                    dataKey="topic"
                    tick={{ fill: "#64748b", fontSize: 12 }}
                    axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#64748b", fontSize: 12 }}
                    axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="count"
                    name="Fake Articles"
                    fill="#f87171"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Line chart — Monthly trend (full width) */}
          <div className="chart-card chart-card-wide glass-card">
            <div className="chart-card-header">
              <TrendingUp size={18} className="chart-icon" />
              <h2 className="chart-card-title">Fake News Trend Over Time</h2>
            </div>

            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={TREND_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "#64748b", fontSize: 12 }}
                    axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#64748b", fontSize: 12 }}
                    axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    iconType="circle"
                    formatter={(value) => (
                      <span style={{ color: "#94a3b8", fontSize: "0.85rem" }}>
                        {value}
                      </span>
                    )}
                  />
                  <Line
                    type="monotone"
                    dataKey="fake"
                    name="Fake News"
                    stroke="#f87171"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#f87171" }}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="real"
                    name="Real News"
                    stroke="#34d399"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#34d399" }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
