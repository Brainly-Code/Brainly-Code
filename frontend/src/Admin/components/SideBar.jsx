import React from "react";
import { Link } from "react-router-dom";
import { FiHome } from "react-icons/fi";
import { FaRegUser, FaStar } from "react-icons/fa";
import { MdContacts } from "react-icons/md";
import { BsGraphUp } from "react-icons/bs";

const menu = [
  { name: "Dashboard", to: "/admin", icon: <FiHome size={22} /> },
  { name: "Users", to: "/admin/users", icon: <FaRegUser size={22} /> },
  { name: "Courses", to: "/admin/courses", icon: <MdContacts size={22} /> },
  { name: "Challenges", to: "/admin/challenges", icon: <BsGraphUp size={22} /> },
  { name: "Premium", to: "/admin/users/premium", icon: <FaStar size={22} /> },
];
const SideBar = () => {
  return (
    <div className="static">
      <div className=" sm:justify-start justify-center  bg-opacity-60 ml-[2rem] gap-4 w-[50px]  sm:w-[150px] flex flex-col  ">
        {menu.map((item) => (
         <Link to={item.to}>
          <button
            className="rounded-md w-full justify-center sm:justify-start shadow-xl bg-[#19179B] gap-2 text-white inline-flex items-center px-6 py-4 font-medium cursor-pointer hover:bg-blue-700 transition"
            style={{
              clipPath:
                "polygon(20% 0%, 80% 0%, 100% 0, 100% 79%, 79% 100%, 20% 100%, 0 100%, 0% 27%)",
            }}
          >
        <p className="">{item.icon}</p>
        <p className="sm:block hidden text-[15px]">{item.name}</p>
        
          </button></Link>
        ))}
      </div>
    </div>
  );
};

export default SideBar;
