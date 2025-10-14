import { useEffect } from "react";
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
import {
  useGetDashboardStatsQuery,
  useGetGraphStatsQuery,
} from "../../../redux/api/AdminSlice";

const DashboardStats = () => {
  const { data: stats } = useGetDashboardStatsQuery();

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

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      instanceRef.current?.next();
    }, 5000);
    return () => clearInterval(interval);
  }, [instanceRef]);

  const statCards = [
    {
      label: "Premium",
      value: `${stats?.premiumCount ?? "--"}`,
      icon: <FaStar className="text-2xl text-white" />,
      iconBg: "bg-yellow-500",
    },
    {
      label: "Students",
      value: `${stats?.studentCount || "--"}`,
      icon: <PiStudentDuotone className="text-2xl text-white" />,
      iconBg: "bg-gray-700",
    },
    {
      label: "Challenges",
      value: `${stats?.challengeCount || "--"}`,
      icon: <FaChartLine className="text-2xl text-white" />,
      iconBg: "bg-blue-500",
    },
    {
      label: "Courses",
      value: `${stats?.courseNumber || "--"}`,
      icon: <FaMoneyBillWave className="text-2xl text-white" />,
      iconBg: "bg-[#19179B]",
    },
  ];

  return (
    <div className="w-full max-w-7xl lg:pl-[6%] mx-auto mb-12">
      <div ref={sliderRef} className="keen-slider">
        {statCards.map((card, index) => (
          <div
            key={index}
            className={`keen-slider__slide 
              !w-[180px] sm:!w-[200px] md:!w-[220px] 
              p-4 rounded-2xl flex-shrink-0 flex flex-col justify-center items-center
              bg-gradient-to-b from-[#0B052A] to-[#07032B] shadow-[0_0_15px_rgba(25,23,155,0.4)]
              hover:shadow-[0_0_25px_rgba(25,23,155,0.8)] transition-all duration-300`}
          >
            <div
              className={`p-3 rounded-full shadow-inner mb-2 ${card.iconBg} 
                flex items-center justify-center w-12 h-12 shadow-[0_0_12px_rgba(25,23,155,0.6)]`}
            >
              {card.icon}
            </div>
            <p className="text-sm font-medium text-gray-200">{card.label}</p>
            <p className="text-2xl font-bold text-white">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardStats;
