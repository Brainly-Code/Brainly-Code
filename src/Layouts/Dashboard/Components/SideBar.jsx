import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FiHome } from "react-icons/fi";
import { FaRegUser } from "react-icons/fa";
import { MdContacts, MdOutlineReviews } from "react-icons/md";
import { BsGraphUp } from "react-icons/bs";
import { ThemeContext } from '../../../Contexts/ThemeContext.jsx'; // Import ThemeContext

const menu = [
  { name: "Dashboard", to: "/admin", icon: <FiHome size={22} /> },
  { name: "Users", to: "/admin/users", icon: <FaRegUser size={22} /> },
  { name: "Courses", to: "/admin/courses", icon: <MdContacts size={22} /> },
  { name: "Challenges", to: "/admin/challenges", icon: <BsGraphUp size={22} /> },
  { name: "Reviews", to: "/admin/reviews", icon: <MdOutlineReviews size={22} /> },
];

const SideBar = () => {
  const location = useLocation();
  const { theme } = React.useContext(ThemeContext); // Access theme from ThemeContext

  return (
    <div className="fixed flex flex-col justify-center mt-[6rem]">
      <div className="ml-[1rem] md:ml-[2rem] flex flex-col gap-4 w-[50px] md:w-[160px]">
        {menu.map((item, i) => {
          const isActive = location.pathname === item.to;

          return (
            <Link key={i} to={item.to}>
              <button
                className={`w-full justify-center md:justify-start inline-flex items-center gap-2 px-5 py-4 rounded-md shadow-lg font-medium transition-all duration-300 ${
                  theme === "dark"
                    ? isActive
                      ? "bg-gradient-to-r from-[#19179B] to-[#2A28C7] text-white shadow-[0_0_20px_rgba(25,23,155,0.7)] scale-[1.02]"
                      : "bg-gradient-to-r from-[#0B052A] to-[#19179B] text-gray-300 hover:shadow-[0_0_15px_rgba(25,23,155,0.4)] hover:scale-[1.02]"
                    : isActive
                    ? "bg-gradient-to-r from-blue-400 to-purple-400 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)] scale-[1.02]"
                    : "bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:scale-[1.02]"
                }`}
                style={{
                  clipPath:
                    "polygon(20% 0%, 80% 0%, 100% 0, 100% 79%, 79% 100%, 20% 100%, 0 100%, 0% 27%)",
                }}
              >
                <p
                  className={`${
                    isActive
                      ? "text-white"
                      : theme === "dark" ? "text-gray-300" : "text-gray-600"
                  } transition-colors`}
                >
                  {item.icon}
                </p>
                <p
                  className={`md:block hidden text-[15px] ${
                    isActive
                      ? "text-white font-semibold"
                      : theme === "dark" ? "text-gray-300" : "text-gray-600"
                  } transition-all`}
                >
                  {item.name}
                </p>
              </button>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default SideBar;