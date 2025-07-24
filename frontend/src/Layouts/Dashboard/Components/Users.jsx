import React, { useContext, useState, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import { CiUndo, CiRedo } from "react-icons/ci";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import { BsThreeDotsVertical } from "react-icons/bs";
import Loader from "../../../Components/ui/Loader";
import { userRoleContext } from "../DashboardLayout";
import { toast } from "react-toastify";
import { X } from 'lucide-react';
import { useGetUsersQuery } from "../../../redux/api/AdminSlice";
import { useGetProfileImageQuery } from "../../../redux/api/userSlice";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import profileFallback from "../../../assets/profile.png";


const Users = () => {
  const role = useContext(userRoleContext);
  const { data: usersData, isLoading, isError } = useGetUsersQuery();

  const {userInfo} = useSelector(state => state.auth);
  const token = jwtDecode(userInfo.access_token);

  const { data: image, isLoading: loadingImage } = useGetProfileImageQuery(token.sub);
  

  const imagePath =
    image?.path && image.path.startsWith("http")
      ? image.path
      : profileFallback;

  const [users, setUsers] = useState(usersData || []);
  const [userHistory, setUserHistory] = useState([usersData || []]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const usersPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("ALL");
  const [selectedProFilter, setSelectedProFilter] = useState("ALL");

  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserData, setNewUserData] = useState({
    username: "",
    email: "",
    role: "USER",
    isPremium: false,
  });

  const [showViewUserModal, setShowViewUserModal] = useState(false);
  const [userToView, setUserToView] = useState(null);

  const [showActionsDropdownForUser, setShowActionsDropdownForUser] = useState(null);

  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Update users and history when API data changes
  useEffect(() => {
    if (usersData) {
      setUsers(usersData);
      setUserHistory([usersData]);
      setHistoryIndex(0);
    }
  }, [usersData]);

  const addStateToHistory = (newState) => {
    const newHistory = userHistory.slice(0, historyIndex + 1);
    setUserHistory([...newHistory, newState]);
    setHistoryIndex(newHistory.length);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setUsers(userHistory[newIndex]);
      toast.info("Undo successful!");
    } else {
      toast.warn("Nothing to undo.");
    }
  };

  const handleRedo = () => {
    if (historyIndex < userHistory.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setUsers(userHistory[newIndex]);
      toast.info("Redo successful!");
    } else {
      toast.warn("Nothing to redo.");
    }
  };

  const handleAddUserClick = () => {
    setShowAddUserModal(true);
  };

  const handleCloseAddUserModal = () => {
    setShowAddUserModal(false);
    setNewUserData({
      username: "",
      email: "",
      role: "USER",
      isPremium: false,
    });
  };

  const handleNewUserInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewUserData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCreateNewUser = (e) => {
    e.preventDefault();
    if (!newUserData.username || !newUserData.email) {
      toast.error("Username and Email are required.");
      return;
    }

    const newUser = {
      id: Date.now(), // Temporary ID; in a real app, this would come from the API
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...newUserData,
      courseId: 1, // Default courseId; adjust as needed
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    addStateToHistory(updatedUsers);
    toast.success(`User "${newUser.username}" added successfully!`);
    handleCloseAddUserModal();
  };

  const toggleFilterDropdown = () => {
    setShowFilterDropdown((prev) => !prev);
  };

  const applyRoleFilter = (filterRole) => {
    setSelectedRoleFilter(filterRole);
    setShowFilterDropdown(false);
    setCurrentPage(1);
  };

  const applyProFilter = (filterPro) => {
    setSelectedProFilter(filterPro);
    setShowFilterDropdown(false);
    setCurrentPage(1);
  };

  const filteredUsers = users?.filter((user) => {
    const matchesRole = selectedRoleFilter === "ALL" || user.role === selectedRoleFilter;
    const matchesPro =
      selectedProFilter === "ALL" ||
      (selectedProFilter === "PRO" && user.isPremium) ||
      (selectedProFilter === "NON_PRO" && !user.isPremium);
    return matchesRole && matchesPro;
  });

  const totalPages = Math.ceil(filteredUsers?.length / usersPerPage);
  const paginatedUsers = filteredUsers?.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const goToPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  const toggleActionsDropdown = (userId) => {
    setShowActionsDropdownForUser(showActionsDropdownForUser === userId ? null : userId);
  };

  const handleViewUser = (user) => {
    setUserToView(user);
    setShowViewUserModal(true);
    setShowActionsDropdownForUser(null);
  };

  const handleChangeUserRole = (userId, newRole) => {
    const loggedInUser = users?.find((u) => u.role === "SUPERADMIN");
    if (loggedInUser && loggedInUser.id === userId && newRole !== "SUPERADMIN") {
      toast.error("A SuperAdmin cannot demote themselves!");
      return;
    }

    const updatedUsers = users?.map((user) =>
      user.id === userId ? { ...user, role: newRole } : user
    );
    setUsers(updatedUsers);
    addStateToHistory(updatedUsers);
    toast.success(`User "${users?.find((u) => u.id === userId)?.username}'s role updated to ${newRole}`);
    setShowActionsDropdownForUser(null);
  };

  const handleDeleteUserClick = (user) => {
    setUserToDelete(user);
    setShowDeleteConfirmModal(true);
    setShowActionsDropdownForUser(null);
  };

  const confirmDeleteUser = () => {
    if (userToDelete) {
      const loggedInUser = users?.find((u) => u.role === "SUPERADMIN");
      if (loggedInUser && loggedInUser.id === userToDelete.id) {
        toast.error("A SuperAdmin cannot delete themselves!");
        setShowDeleteConfirmModal(false);
        setUserToDelete(null);
        return;
      }

      const updatedUsers = users?.filter((user) => user.id !== userToDelete.id);
      setUsers(updatedUsers);
      addStateToHistory(updatedUsers);
      toast.success(`User "${userToDelete.username}" deleted successfully!`);
      setShowDeleteConfirmModal(false);
      setUserToDelete(null);
    }
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showFilterDropdown && !event.target.closest('.filter-dropdown-container')) {
        setShowFilterDropdown(false);
      }
      if (showActionsDropdownForUser && !event.target.closest('.actions-dropdown-container')) {
        setShowActionsDropdownForUser(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFilterDropdown, showActionsDropdownForUser]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full h-full text-center text-white font-bold text-3xl flex justify-center items-center">
        Error loading Users.
      </div>
    );
  }

  if(loadingImage) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <div>
      <div className="sticky top-28 backdrop-blur-xl flex justify-between p-3 rounded-b-lg shadow-lg mb-8">
        <span className="md:text-2xl text-lg font-normal text-gray-100">
          Users
        </span>
        <div className="flex items-center gap-2 relative">
          <button
            onClick={handleUndo}
            disabled={historyIndex === 0}
            className={`w-8 h-8 flex items-center justify-center cursor-pointer rounded-full border border-gray-300 text-white transition-colors ${
              historyIndex === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-700"
            }`}
            title="Undo Last Action"
          >
            <CiUndo />
          </button>

          <button
            onClick={handleRedo}
            disabled={historyIndex === userHistory.length - 1}
            className={`w-8 h-8 flex items-center justify-center cursor-pointer rounded-full border border-gray-300 text-white transition-colors ${
              historyIndex === userHistory.length - 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-700"
            }`}
            title="Redo Last Action"
          >
            <CiRedo />
          </button>

          <div className="relative filter-dropdown-container">
            <button
              onClick={toggleFilterDropdown}
              className="w-8 h-8 flex items-center justify-center cursor-pointer rounded-full border border-gray-300 text-white hover:bg-gray-700 transition-colors"
              aria-haspopup="true"
              aria-expanded={showFilterDropdown ? "true" : "false"}
              title="Filter Users"
            >
              <HiOutlineAdjustmentsHorizontal />
            </button>

            {showFilterDropdown && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-[#07032B] border border-[#3A3A5A] rounded-lg shadow-lg overflow-hidden z-50">
                <div className="px-4 py-2 text-gray-400 text-xs uppercase font-bold border-b border-[#3A3A5A]">Filter by Role</div>
                <button
                  onClick={() => applyRoleFilter("ALL")}
                  className="block w-full text-left px-4 py-2 text-gray-200 hover:bg-[#3A3A5A] transition-colors text-sm"
                >
                  All Roles
                </button>
                <button
                  onClick={() => applyRoleFilter("USER")}
                  className="block w-full text-left px-4 py-2 text-gray-200 hover:bg-[#3A3A5A] transition-colors text-sm"
                >
                  Users
                </button>
                <button
                  onClick={() => applyRoleFilter("ADMIN")}
                  className="block w-full text-left px-4 py-2 text-gray-200 hover:bg-[#3A3A5A] transition-colors text-sm"
                >
                  Admins
                </button>
                <button
                  onClick={() => applyRoleFilter("SUPERADMIN")}
                  className="block w-full text-left px-4 py-2 text-gray-200 hover:bg-[#3A3A5A] transition-colors text-sm"
                >
                  SuperAdmins
                </button>
                <div className="border-t border-[#3A3A5A]"></div>
                <div className="px-4 py-2 text-gray-400 text-xs uppercase font-bold border-b border-[#3A3A5A]">Filter by Pro Status</div>
                <button
                  onClick={() => applyProFilter("ALL")}
                  className="block w-full text-left px-4 py-2 text-gray-200 hover:bg-[#3A3A5A] transition-colors text-sm"
                >
                  All (Pro & Non-Pro)
                </button>
                <button
                  onClick={() => applyProFilter("PRO")}
                  className="block w-full text-left px-4 py-2 text-gray-200 hover:bg-[#3A3A5A] transition-colors text-sm"
                >
                  Pro Users
                </button>
                <button
                  onClick={() => applyProFilter("NON_PRO")}
                  className="block w-full text-left px-4 py-2 text-gray-200 hover:bg-[#3A3A5A] transition-colors text-sm"
                >
                  Non-Pro Users
                </button>
              </div>
            )}
          </div>

          {role === "SUPERADMIN" && (
            <button
              onClick={handleAddUserClick}
              className="px-4 py-2 bg-gradient-to-r from-[#00ffee] to-purple-500 text-white rounded-full flex items-center gap-1 font-semibold shadow-md hover:from-purple-500 hover:to-[#00ffee] transition-all duration-300"
              title="Add New User"
            >
              <span>Add User</span>
              <span>+</span>
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 w-full overflow-x-auto custom-scrollbar">
        <h2 className="text-gray-300 font-bold text-xl text-center mb-4">
          All Users ({filteredUsers?.length})
        </h2>

        <table className="w-full text-white border-separate border-spacing-y-3">
          <thead className="text-sm text-left">
            <tr>
              <th className="p-3 w-[6%]">Icon</th>
              <th className="p-3 w-[35%]">Username</th>
              <th className="p-3 w-[36%] sm:table-cell hidden">Email</th>
              <th className="p-3 w-[10%]">Role</th>
              <th className="p-3 w-[18%]">Pro</th>
              {(role === "SUPERADMIN" || role === "ADMIN") && (
                <th className="p-3 w-[5%] text-right">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedUsers?.map((user) => (
              <tr
                key={user.id}
                className="bg-[#19179B] text-sm hover:bg-[#2c28b8] transition cursor-pointer"
                onClick={() => handleViewUser(user)}
              >
                <td className="p-3 align-middle first:rounded-l-lg">
                  {/* <FaUser size={24} /> */}
                  <img src={imagePath} className='rounded-full h-10 w-10 object-cover mr-3' alt="Profile" />
                </td>
                <td className="p-3 align-middle font-medium">{user.username}</td>
                <td className="p-3 align-middle sm:table-cell hidden">{user.email}</td>
                <td className="p-3 align-middle">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      user.role === "SUPERADMIN"
                        ? "bg-red-700 text-white"
                        : user.role === "ADMIN"
                        ? "bg-blue-700 text-white"
                        : "bg-gray-700 text-white"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="p-3 align-middle">
                  {user.isPremium && (
                    <span className="bg-gradient-to-r from-purple-500 to-blue-400 text-xs px-2 py-1 rounded-full">
                      PRO
                    </span>
                  )}
                </td>
                {(role === "SUPERADMIN" || role === "ADMIN") && (
                  <td className="p-3 align-middle text-right last:rounded-r-lg relative actions-dropdown-container">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleActionsDropdown(user.id);
                      }}
                      className="text-gray-300 hover:text-white"
                      title="More options"
                    >
                      <BsThreeDotsVertical size={20} />
                    </button>
                    {showActionsDropdownForUser === user.id && (
                      <div className="absolute right-0 mt-2 w-40 bg-[#07032B] border border-[#3A3A5A] rounded-md shadow-lg z-50 overflow-hidden">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewUser(user);
                          }}
                          className="block w-full text-left px-4 py-2 text-gray-200 hover:bg-[#3A3A5A] transition-colors text-sm"
                        >
                          View
                        </button>
                        {role === "SUPERADMIN" && (
                          <>
                            <div className="border-t border-[#3A3A5A]"></div>
                            <div className="px-4 py-2 text-gray-200 text-sm">
                              Change Role:
                              <select
                                className="w-full mt-1 rounded-md px-2 py-1 border border-[#3A3A5A] text-gray-100 bg-[#07032B] focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm"
                                value={user.role}
                                onChange={(e) => handleChangeUserRole(user.id, e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <option value="USER">User</option>
                                <option value="ADMIN">Admin</option>
                                <option value="SUPERADMIN">SuperAdmin</option>
                              </select>
                            </div>
                            <div className="border-t border-[#3A3A5A]"></div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteUserClick(user);
                              }}
                              className="block w-full text-left px-4 py-2 text-red-500 hover:bg-red-900 transition-colors text-sm"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-6 gap-1">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => goToPage(i + 1)}
            className={`w-8 h-8 rounded-md text-sm font-semibold flex items-center justify-center transition-colors ${
              currentPage === i + 1
                ? "bg-gradient-to-r from-purple-500 to-blue-400 text-white"
                : "bg-[#19179B] text-white hover:bg-[#2c28b8]"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {showAddUserModal && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4">
          <div className="bg-[#070045] w-full max-w-md p-6 rounded-2xl shadow-2xl border border-[#3A3A5A] relative">
            <button
              type="button"
              onClick={handleCloseAddUserModal}
              className="absolute top-4 right-4 p-2 cursor-pointer text-gray-400 hover:bg-[#3A3A5A] rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-white mb-6 text-center">Add New User</h2>

            <form onSubmit={handleCreateNewUser} className="space-y-4">
              <div>
                <label htmlFor="username" className="block mb-1 font-medium text-gray-300 text-sm">
                  Username *
                </label>
                <input
                  id="username"
                  type="text"
                  name="username"
                  value={newUserData.username}
                  onChange={handleNewUserInputChange}
                  placeholder="e.g., Jane Doe"
                  required
                  className="w-full rounded-md px-3 py-2 border border-[#3A3A5A] text-gray-100 bg-[#07032B] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm"
                />
              </div>
              <div>
                <label htmlFor="email" className="block mb-1 font-medium text-gray-300 text-sm">
                  Email *
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={newUserData.email}
                  onChange={handleNewUserInputChange}
                  placeholder="e.g., jane.doe@example.com"
                  required
                  className="w-full rounded-md px-3 py-2 border border-[#3A3A5A] text-gray-100 bg-[#07032B] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm"
                />
              </div>
              <div>
                <label htmlFor="role" className="block mb-1 font-medium text-gray-300 text-sm">
                  Role *
                </label>
                <select
                  id="role"
                  name="role"
                  value={newUserData.role}
                  onChange={handleNewUserInputChange}
                  required
                  className="w-full rounded-md px-3 py-2 border border-[#3A3A5A] text-gray-100 bg-[#07032B] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm"
                >
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                  {role === "SUPERADMIN" && <option value="SUPERADMIN">SuperAdmin</option>}
                </select>
              </div>
              <div className="flex items-center">
                <input
                  id="isPremium"
                  type="checkbox"
                  name="isPremium"
                  checked={newUserData.isPremium}
                  onChange={handleNewUserInputChange}
                  className="mr-2 h-4 w-4 text-purple-600 border-gray-600 rounded focus:ring-purple-500 bg-[#07032B]"
                />
                <label htmlFor="isPremium" className="font-medium text-gray-300 text-sm">
                  Is Pro User
                </label>
              </div>

              <div className="flex justify-center gap-3 mt-6 pt-4 border-t border-[#3A3A5A]">
                <button
                  type="button"
                  onClick={handleCloseAddUserModal}
                  className="px-5 py-2.5 rounded-full cursor-pointer bg-gradient-to-r from-gray-700 to-gray-800 text-white font-medium hover:from-gray-800 hover:to-gray-900 transition-all duration-300 border border-gray-600 shadow-md text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-full cursor-pointer bg-gradient-to-r from-[#00ffee] to-purple-500 text-white font-semibold hover:from-purple-500 hover:to-[#00ffee] transition-all duration-300 shadow-lg text-sm"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showViewUserModal && userToView && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4">
          <div className="bg-[#070045] w-full max-w-lg p-6 rounded-2xl shadow-2xl border border-[#3A3A5A] relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button
              type="button"
              onClick={() => {
                setUserToView(null);
                setShowViewUserModal(false);
              }}
              className="absolute top-4 right-4 p-2 cursor-pointer text-gray-400 hover:bg-[#3A3A5A] rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-white mb-6 text-center">User Details: {userToView.username}</h2>

            <div className="space-y-4 text-gray-300">
              <p><strong>Username:</strong> {userToView.username}</p>
              <p><strong>Email:</strong> {userToView.email}</p>
              <p>
                <strong>Role:</strong>{" "}
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    userToView.role === "SUPERADMIN"
                      ? "bg-red-700 text-white"
                      : userToView.role === "ADMIN"
                      ? "bg-blue-700 text-white"
                      : "bg-gray-700 text-white"
                  }`}
                >
                  {userToView.role}
                </span>
              </p>
              <p>
                <strong>Pro User:</strong>{" "}
                {userToView.isPremium ? (
                  <span className="bg-gradient-to-r from-purple-500 to-blue-400 text-xs px-2 py-1 rounded-full">
                    YES (PRO)
                  </span>
                ) : (
                  <span className="bg-gray-700 text-white text-xs px-2 py-1 rounded-full">NO</span>
                )}
              </p>
              <p><strong>Created At:</strong> {new Date(userToView.createdAt).toLocaleDateString()} at {new Date(userToView.createdAt).toLocaleTimeString()}</p>
              <p><strong>Updated At:</strong> {new Date(userToView.updatedAt).toLocaleDateString()} at {new Date(userToView.updatedAt).toLocaleTimeString()}</p>
              <p><strong>Course ID:</strong> {userToView.courseId}</p>
            </div>

            <div className="flex justify-center mt-6 pt-4 border-t border-[#3A3A5A]">
              <button
                type="button"
                onClick={() => {
                  setUserToView(null);
                  setShowViewUserModal(false);
                }}
                className="px-5 py-2.5 rounded-full cursor-pointer bg-gradient-to-r from-gray-700 to-gray-800 text-white font-medium hover:from-gray-800 hover:to-gray-900 transition-all duration-300 border border-gray-600 shadow-md text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirmModal && userToDelete && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4">
          <div className="bg-[#070045] w-full max-w-sm p-6 rounded-2xl shadow-2xl border border-[#3A3A5A] relative">
            <button
              type="button"
              onClick={() => {
                setShowDeleteConfirmModal(false);
                setUserToDelete(null);
              }}
              className="absolute top-4 right-4 p-2 cursor-pointer text-gray-400 hover:bg-[#3A3A5A] rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-white mb-6 text-center">Confirm Deletion</h2>
            <p className="text-gray-300 text-center mb-6">
              Are you sure you want to delete user "<strong>{userToDelete.username}</strong>"? This action cannot be undone.
            </p>

            <div className="flex justify-center gap-3 mt-6 pt-4 border-t border-[#3A3A5A]">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteConfirmModal(false);
                  setUserToDelete(null);
                }}
                className="px-5 py-2.5 rounded-full cursor-pointer bg-gradient-to-r from-gray-700 to-gray-800 text-white font-medium hover:from-gray-800 hover:to-gray-900 transition-all duration-300 border border-gray-600 shadow-md text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteUser}
                className="px-5 py-2.5 rounded-full cursor-pointer bg-red-600 text-white font-semibold hover:bg-red-700 transition-all duration-300 shadow-lg text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;