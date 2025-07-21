import { useEffect, useState } from "react";
import axios from "axios";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

// Icons
import {
  FaMoneyBillWave,
  FaStar,
  FaGraduationCap,
  FaChartLine,
} from "react-icons/fa";
import { PiStudentDuotone } from "react-icons/pi";

const DashboardStats = () => {
  const [stats, setStats] = useState(null);

  // Fetch stats from backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("/api/dashboard-stats");
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      }
    };
    fetchStats();
  }, []);

  // KeenSlider setup
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    mode: "snap",
    renderMode: "performance",
    slides: {
      origin: "auto",
      spacing: 15,
      perView: "auto",
    },
  });

  // Auto-slide
  useEffect(() => {
    const interval = setInterval(() => {
      instanceRef.current?.next();
    }, 5000);
    return () => clearInterval(interval);
  }, [instanceRef]);

  // Cards
  const statCards = [
    {
      label: "Premium",
      value: `${stats?.rating ?? "--"}`,
      icon: <FaStar className="text-2xl text-white" />,
      bg: "bg-yellow-50",
      iconBg: "bg-yellow-500",
    },
  
    {
      label: "Students",
      value: `${stats?.courses ?? "--"} `,
      icon: <PiStudentDuotone className="text-2xl text-white" />,
      bg: "bg-slate-100",
      iconBg: "bg-gray-700",
    },
    {
      label: "Challenges",
      value: `${stats?.averageScore ?? "--"}`,
      icon: <FaChartLine className="text-2xl text-white" />,
      bg: "bg-blue-50",
      iconBg: "bg-blue-500",
    },
  
    {
      label: "Courses",
      value: `${stats?.revenue ?? "--"} `,
      icon: <FaMoneyBillWave className="text-2xl text-white" />,
      
      iconBg: "[#19179B]",
    },
  ];

  return (
    <div className="w-full  max-w-7xl lg:pl-[6%] mx-auto mb-12">
      <div ref={sliderRef} className="keen-slider">
        {statCards.map((card, index) => (
          <div
            key={index}
            className={`keen-slider__slide !w-[180px] sm:!w-[200px] md:!w-[220px] p-4 rounded-xl flex-shrink-0 flex flex-col justify-center  items-center bg-[#07032B]`}
          >
            <div className={`p-3 rounded-full shadow-inner mb-2  bg-[#19179B]`}>
              {card.icon}
            </div>
            <p className="text-sm font-medium text-gray-100">{card.label}</p>
            <p className="text-xl font-bold text-gray-800">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardStats;
