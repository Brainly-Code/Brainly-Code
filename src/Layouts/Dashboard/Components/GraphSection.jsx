// Import necessary libraries
import React, { useEffect, useState, useContext } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart,
} from "recharts";
import { useGetGraphStatsQuery } from "../../../redux/api/AdminSlice.jsx";
import Loader from "../../../Components/ui/Loader.jsx";
import { ThemeContext } from "../../../Contexts/ThemeContext.jsx"; // import ThemeContext

// Fallback data in case backend is not ready
const fallbackData = [
  { month: "Jan", Users: 50 },
  { month: "Feb", Users: 45 },
  { month: "Mar", Users: 60 },
  { month: "Apr", Users: 80 },
  { month: "May", Users: 60 },
  { month: "Jun", Users: 40 },
  { month: "Jul", Users: 50 },
  { month: "Aug", Users: 75 },
  { month: "Sep", Users: 65 },
  { month: "Oct", Users: 70 },
  { month: "Nov", Users: 55 },
];

const GraphSection = () => {
  const { theme } = useContext(ThemeContext); // get theme
  const { data: graphStats, isLoading, isError } = useGetGraphStatsQuery();

  const [data, setData] = useState([]);

  useEffect(() => {
    if (graphStats && Array.isArray(graphStats)) {
      const formattedData = graphStats.map((item, idx) => ({
        id: idx,
        month: item.month,
        Users: item.users,
      }));
      setData(formattedData);
    } else {
      setData(fallbackData);
    }
  }, [graphStats]);

  if (isLoading) return <Loader />;
  if (isError)
    return (
      <p
        className={`text-center font-semibold ${
          theme === "dark" ? "text-red-400" : "text-red-600"
        }`}
      >
        Failed to fetch graph data
      </p>
    );

  const chartColors = {
    background: theme === "dark" ? "#0D0056" : "#FFFFFF",
    text: theme === "dark" ? "#E0E0E0" : "#333333",
    grid: theme === "dark" ? "#3A3A6A" : "#E0E0E0",
    bar: theme === "dark" ? "#00FFFF" : "#6366F1",
    line: theme === "dark" ? "#FFFFFF" : "#0D0056",
  };

  return (
    <div
      className={`rounded-xl p-6 mt-6 shadow-md transition-all duration-500 ${
        theme === "dark"
          ? "bg-[#0D0056]/80 text-white"
          : "bg-white text-gray-800"
      }`}
    >
      <h2
        className={`text-xl text-center font-bold mb-4 ${
          theme === "dark" ? "text-white" : "text-gray-700"
        }`}
      >
        User Growth per month
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart
          data={data}
          style={{
            background: chartColors.background,
            borderRadius: "0.75rem",
            transition: "background 0.5s ease",
          }}
        >
          <CartesianGrid
            stroke={chartColors.grid}
            strokeDasharray="3 3"
            opacity={0.5}
          />
          <XAxis
            dataKey="month"
            stroke={chartColors.text}
            tick={{ fill: chartColors.text }}
          />
          <YAxis
            stroke={chartColors.text}
            tick={{ fill: chartColors.text }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor:
                theme === "dark" ? "#1E1B4B" : "#F9FAFB",
              color: chartColors.text,
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
          <Legend
            wrapperStyle={{
              color: chartColors.text,
              fontSize: "0.9rem",
              marginTop: "10px",
            }}
          />
          <Bar
            dataKey="Users"
            fill={chartColors.bar}
            radius={[6, 6, 0, 0]}
            barSize={30}
          />
          <Line
            type="monotone"
            dataKey="Users"
            stroke={chartColors.line}
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraphSection;
