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

const GraphSection = () => {

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

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const { data: users } = useGetUsersQuery();


  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ensure the data is in the correct format
        const formattedData = Array.isArray(users)
          ? users.map()
          : fallbackData;
        setData(formattedData);
      } catch (error) {
        console.error(
          "Failed to fetch data from backend, using fallback",
          error
        );
        setData(fallbackData);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [ users ]);

  if (loading) {
    return (
      <div className="w-full h-[270px] p-4 rounded-xl">
        <Skeleton width="w-full" height="h-[270px]" rounded="rounded-xl" />
      </div>
    );
  }

  return (
  <div className="overflow-visible md:pl-6 md:pt-6 sm:pl-3 lg:pl-8 lg:pt-8 sm:pt-3 rounded-xl bg-[#FFFFFF10]  w-full ">
      <div className="w-full  bg-[#090048] h-[370px] p-4 rounded-xl">
      <h2 className="text-lg font-semibold text-white mb-6">Users Overview</h2>
      <ResponsiveContainer width="100%" height="80%">
        <ComposedChart
          data={data}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        >
          <CartesianGrid strokeDasharray="1 5" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 13, fill: "#888" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            yAxisId="left"
            orientation="left"
            tick={{ fontSize: 12, fill: "#888" }}
            axisLine={false}
            tickLine={false}
            label={{
              value: "Users",
              angle: -90,
              position: "insideLeft",
              offset: 20,
              fontWeight: "normal",
              fill: "#fff",
              fontSize: 12,
            }}
          />

          <Tooltip contentStyle={{ borderRadius: 8, fontSize: 13 }} />
          <Legend
            iconType="circle"
            iconSize={8}
            layout="horizontal"
            verticalAlign="top"
            align="right"
            wrapperStyle={{
              top: -45,
              left: 200,
              fontSize: 14,
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          />
          <Bar
            yAxisId="left"
            dataKey="Users"
            fill="#19179B"
            name="Users"
            radius={[1, 1, 0, 0]}
            barSize={30}
          />
          <Line
            yAxisId="right"
            type="natural"
            dataKey="Users"
            stroke="#fff"
            strokeWidth={2}
            dot={{ r: 0, stroke: "#0f172a", strokeWidth: 0, fill: "#fff" }}
            
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  </div>
  );
};

export default GraphSection;
