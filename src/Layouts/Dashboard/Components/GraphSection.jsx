// Import necessary libraries
import React, { useEffect, useState } from "react";

import Skeleton from "./Skeleton.jsx";
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
import { useGetUsersQuery } from "../../../redux/api/AdminSlice.jsx";
import Loader from "../../../Components/ui/Loader.jsx";

  
  // Fallback data in case backend is not ready
  const fallbackData = [
    { month: "Jan", Users: 50 },
    { month: "Feb", Users: 45,},
    { month: "Mar", Users: 60,},
    { month: "Apr", Users: 80,},
    { month: "May", Users: 60,},
    { month: "Jun", Users: 40,},
    { month: "Jul", Users: 50,},
    { month: "Aug", Users: 75,},
    { month: "Sep", Users: 65,},
    { month: "Oct", Users: 70,}, 
    { month: "Nov", Users: 55,},
  ];


const GraphSection = () => {
  const {
    data: graphStats,
    isLoading,
    isError,
  } = useGetUsersQuery(); // only call once!

  const [data, setData] = useState([]);

  useEffect(() => {
    if (graphStats && Array.isArray(graphStats)) {
      const formattedData = graphStats.map((item, idx) => ({
        id: idx,
        month: item.month,
        Users: item.Users,
      }));
      setData(formattedData);
    } else {
      setData(fallbackData);
    }
  }, [graphStats]);

  if (isLoading) return <Loader />;
  if (isError) return <p className="text-red-500">Failed to fetch graph data</p>;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={data}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Users" fill="#19179B" />
        <Line type="natural" dataKey="Users" stroke="#fff" />
      </ComposedChart>
    </ResponsiveContainer>
  );
};


export default GraphSection;
