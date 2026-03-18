import { useEffect, useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { BarChart3, PieChart as PieIcon } from "lucide-react";
import { fetchAnalytics } from "../services/api";

const PIE_COLORS = ["#f87171", "#34d399"];

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(Number(value) || 0);
}

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
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAnalytics = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await fetchAnalytics();
      setAnalytics(data);
    } catch (err) {
      setError(err?.message || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    async function initLoad() {
      setLoading(true);
      setError("");

      try {
        const data = await fetchAnalytics();
        if (!active) return;
        setAnalytics(data);
      } catch (err) {
        if (!active) return;
        setError(err?.message || "Failed to load analytics");
      } finally {
        if (active) setLoading(false);
      }
    }

    initLoad();
    return () => {
      active = false;
    };
  }, []);

  const fakeCount = Number(analytics?.fake_vs_real?.fake || 0);
  const realCount = Number(analytics?.fake_vs_real?.real || 0);
  const totalCount = fakeCount + realCount;

  const distributionData = useMemo(
    () => [
      { name: "Fake News", value: fakeCount },
      { name: "Real News", value: realCount },
    ],
    [fakeCount, realCount]
  );

  const topicsData = useMemo(() => {
    const items = Array.isArray(analytics?.top_topics) ? analytics.top_topics : [];
    return items.map((item) => ({
      topic: item.topic,
      count: Number(item.count || 0),
    }));
  }, [analytics]);

  const stats = useMemo(() => {
    const fakeShare = totalCount > 0 ? ((fakeCount / totalCount) * 100).toFixed(1) : "0.0";
    const realShare = totalCount > 0 ? ((realCount / totalCount) * 100).toFixed(1) : "0.0";

    return [
      { label: "Total Analyzed", value: formatNumber(totalCount) },
      { label: "Fake Articles", value: formatNumber(fakeCount) },
      { label: "Real Articles", value: formatNumber(realCount) },
      { label: "Fake Share", value: `${fakeShare}% (Real ${realShare}%)` },
    ];
  }, [fakeCount, realCount, totalCount]);

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Page header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">
            Analytics <span className="text-gradient">Dashboard</span>
          </h1>
          <p className="dashboard-subtitle">
            Live dataset analytics from the backend pipeline.
          </p>
          <div style={{ marginTop: "1rem" }}>
            <button className="btn-secondary" type="button" onClick={loadAnalytics} disabled={loading}>
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* Summary stat cards */}
        <div className="stats-grid">
          {stats.map((stat) => (
            <div key={stat.label} className="stat-card glass-card">
              <p className="stat-label">{stat.label}</p>
              <p className="stat-value">{stat.value}</p>
            </div>
          ))}
        </div>

        {loading && (
          <div className="chart-card chart-card-wide glass-card">
            <p className="dashboard-subtitle">Loading analytics...</p>
          </div>
        )}

        {!loading && error && (
          <div className="chart-card chart-card-wide glass-card">
            <p className="dashboard-subtitle">Unable to load analytics: {error}</p>
          </div>
        )}

        {/* Charts grid */}
        {!loading && !error && <div className="charts-grid">
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
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {distributionData.map((entry, index) => (
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

          {/* Bar chart — Top topics */}
          <div className="chart-card glass-card">
            <div className="chart-card-header">
              <BarChart3 size={18} className="chart-icon" />
              <h2 className="chart-card-title">Top Topics</h2>
            </div>

            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={topicsData} barSize={32}>
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
                    name="Articles"
                    fill="#f87171"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>}
      </div>
    </div>
  );
}

export default Dashboard;
