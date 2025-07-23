import React, { useState } from "react";
import { FaWizardsOfTheCoast, FaUser, FaTrash } from "react-icons/fa";
import { CiUndo, CiRedo } from "react-icons/ci";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import Loader from "../../../Components/ui/Loader";
// import { useGetUsersQuery } from "../../../redux/api/userSlice";

const Users = () => {
  // Sample hardcoded data (replace with actual query later)
  const users = Array(45)
    .fill(0)
    .map((_, index) => ({
      id: `${index + 1}`,
      username: `User ${index + 1}`,
      email: `user${index + 1}@mail.com`,
      role: index === 1 ? "admin" : "student",
      isPro: true,
    }));

  const usersPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(users.length / usersPerPage);
  const paginatedUsers = users.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const goToPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  return (
    <div className="">
      {/* Header */}
      <div className="sticky top-28 backdrop-blur-xl flex justify-between p-3 rounded-b-lg shadow-lg">
        <span className="md:text-2xl text-lg font-normal text-gray-100">
          Users
        </span>
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 rounded-full border border-gray-300 text-white flex items-center justify-center">
            <CiUndo />
          </button>
          <button className="w-8 h-8 rounded-full border border-gray-300 text-white flex items-center justify-center">
            <CiRedo />
          </button>
          <button className="w-8 h-8 rounded-full border border-gray-300 text-white flex items-center justify-center">
            <HiOutlineAdjustmentsHorizontal />
          </button>
          <button className="px-4 py-2 bg-[#07032B] text-white rounded-full flex items-center gap-1">
            <span>Add user</span>
            <span>+</span>
          </button>
        </div>
      </div>

      {/* User List */}
      <div className="mt-6 w-full">
        <h2 className="text-gray-300 font-bold text-xl text-center mb-4">
          All Users ({users.length})
        </h2>

        <table className="w-full">
          <thead className="justify-between text-start w-full flex text-white">
            <td className="w-[6%]">icon</td>
            <td className="w-[36%] ">username</td>
            <td className="w-[36%] sm:inline hidden">email</td>
            <td className="w-[10%] ">user role</td>
            <td className="w-[6%]">pro</td>
            <td className="w-[6%] ">details</td>
          </thead>
          {paginatedUsers.map((user) => (
            <tr
              key={user.id}
              className=" items-center bg-[#19179B] my-3  p-3 rounded-lg justify-between w-full flex text-white"
            >
              <td className="w-[6%] text-gray-300">
                
                <FaUser size={28} />
              </td>
              <td className="w-[36%] font-semibold text-base">
                
              {user.username}
              </td>
             
              <td className="w-[36%] sm:inline hidden text-sm text-gray-200">
                {user.email}
              </td>
              <td className="w-[10%] text-sm text-gray-200">
                
                {user.role}
                </td>
              <td className="w-[6%]">
                
                {user.isPro && (
                  <span className=" bg-gradient-to-r from-purple-500 to-blue-400 text-xs text-white px-2 py-1 rounded-full">
                    pro
                  </span>
                )}
              </td>
              <td className="w-[6%] text-end  flex justify-end  ">
                
                <FaWizardsOfTheCoast  />
              </td>
            </tr>
          ))}

          {/* <tfoot className="w-full">
          <td className="w-[16%]">icon</td>
            <td className="w-[16%]">username</td>
            <td className="w-[16%]">user role</td>
            <td className="w-[16%]">email</td>
            <td className="w-[16%]">pro</td>
            <td className="w-[16%]">details</td>
          </tfoot> */}
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex justify-end mt-6 gap-1">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => goToPage(i + 1)}
            className={`w-6 h-6 rounded-sm text-sm font-semibold ${
              currentPage === i + 1
                ? "bg-white text-black"
                : "bg-[#19179B] text-white"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Users;
