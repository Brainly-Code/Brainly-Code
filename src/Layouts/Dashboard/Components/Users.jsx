import React, { useContext, useState, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import { CiUndo, CiRedo } from "react-icons/ci";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import { BsThreeDotsVertical } from "react-icons/bs";
import { userRoleContext } from "../../../Contexts/UserRoleContext";
import { toast } from "react-toastify";
import { Loader2, X } from "lucide-react";
import { useDeleteUserMutation, useGetUsersQuery } from "../../../redux/api/AdminSlice";
import profileFallback from "../../../assets/profile.png";
import { SearchContext } from "../../../Contexts/SearchContext";
import { ThemeContext } from '../../../Contexts/ThemeContext.jsx'; // Import ThemeContext
import { useGetProfileImagesQuery, useRegisterMutation, useUpdateUserMutation } from "../../../redux/api/userSlice";
import BgLoader from "../../../Components/ui/BgLoader";
import { useDispatch } from "react-redux";

const Users = () => {
  const role = useContext(userRoleContext);
  const { searchQuery } = useContext(SearchContext);
  const { theme } = useContext(ThemeContext); // Access theme from ThemeContext

  const {
    data: usersData,
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
    refetch: refetchUsers,
  } = useGetUsersQuery();

  const { data: images, isLoading: isLoadingImages, isError: errorFetchingImages } = useGetProfileImagesQuery(usersData?.id);
  const findImagePath = (imageId) => {
    if (!images?.length) return profileFallback;
    if (isLoadingImages || errorFetchingImages) return profileFallback;
    const image = images?.find((image) => image?.userId === imageId);
    return image?.path || profileFallback;
  };

  const [updateUser] = useUpdateUserMutation();
  const [register] = useRegisterMutation();
  const [deleteUser] = useDeleteUserMutation();
  const dispatch = useDispatch();

  const [users, setUsers] = useState(usersData || []);
  const [userHistory, setUserHistory] = useState([usersData || []]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [usersPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("ALL");
  const [selectedProFilter, setSelectedProFilter] = useState("ALL");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newUserRole, setNewUserRole] = useState("");
  const [addingUser, setAddingUser] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showViewUserModal, setShowViewUserModal] = useState(false);
  const [userToView, setUserToView] = useState(null);
  const [showActionsDropdownForUser, setShowActionsDropdownForUser] = useState(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    if (usersData) {
      setUsers(usersData);
      setUserHistory([usersData]);
      setHistoryIndex(0);
    }
  }, [usersData]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showFilterDropdown && !event.target.closest(".filter-dropdown-container")) {
        setShowFilterDropdown(false);
      }
      if (showActionsDropdownForUser && !event.target.closest(".actions-dropdown-container")) {
        setShowActionsDropdownForUser(null);
      }
      if (showAddUserModal || showViewUserModal || showDeleteConfirmModal) {
        if (!event.target.closest(".modal-content")) {
          setShowAddUserModal(false);
          setShowViewUserModal(false);
          setShowDeleteConfirmModal(false);
          setUserToDelete(null);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showFilterDropdown, showActionsDropdownForUser, showAddUserModal, showViewUserModal, showDeleteConfirmModal]);

  const addStateToHistory = (newState) => {
    const newHistory = userHistory.slice(0, historyIndex + 1);
    setUserHistory([...newHistory, newState]);
    setHistoryIndex(newHistory.length);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1);
      setUsers(userHistory[historyIndex - 1]);
      toast.info("Undo successful!");
    } else {
      toast.warn("Nothing to undo.");
    }
  };

  const handleRedo = () => {
    if (historyIndex < userHistory.length - 1) {
      setHistoryIndex((prev) => prev + 1);
      setUsers(userHistory[historyIndex + 1]);
      toast.info("Redo successful!");
    } else {
      toast.warn("Nothing to redo.");
    }
  };

  const handleAddUserClick = () => setShowAddUserModal(true);

  const handleCloseAddUserModal = () => {
    setShowAddUserModal(false);
    setUsername("");
    setEmail("");
    setPassword("");
    setNewUserRole("");
  };

  const handleCreateNewUser = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      toast.error("Username, Email, and Password are required.");
      return;
    }
    try {
      setAddingUser(true);
      const response = await register({
        username,
        email,
        password,
        role: newUserRole,
      }).unwrap();
      setAddingUser(false);
      refetchUsers();
      toast.success(`User "${username}" added successfully!`);
      handleCloseAddUserModal();
    } catch (err) {
      toast.error("Failed to add user!");
    }
  };

  const toggleFilterDropdown = () => setShowFilterDropdown((prev) => !prev);

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

  const getFilteredAndSearchedUsers = () => {
    let currentFilteredUsers = [...users] || [];
    if (selectedRoleFilter !== "ALL") {
      currentFilteredUsers = currentFilteredUsers.filter(
        (user) => user?.role === selectedRoleFilter
      );
    }
    if (selectedProFilter !== "ALL") {
      currentFilteredUsers = currentFilteredUsers.filter(
        (user) =>
          (selectedProFilter === "PRO" && user.isPremium) ||
          (selectedProFilter === "NON_PRO" && !user.isPremium)
      );
    }
    if (searchQuery) {
      const lowerCaseSearchQuery = searchQuery.toLowerCase();
      currentFilteredUsers = currentFilteredUsers.filter(
        (user) =>
          user.username.toLowerCase().includes(lowerCaseSearchQuery) ||
          user.email.toLowerCase().includes(lowerCaseSearchQuery) ||
          user.role.toLowerCase().includes(lowerCaseSearchQuery)
      );
    }
    return currentFilteredUsers;
  };

  const filteredUsers = getFilteredAndSearchedUsers();
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const goToPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) setCurrentPage(pageNum);
  };

  const toggleActionsDropdown = (userId) =>
    setShowActionsDropdownForUser((prev) => (prev === userId ? null : userId));

  const handleViewUser = (user) => {
    setUserToView(user);
    setShowViewUserModal(true);
    setShowActionsDropdownForUser(null);
  };

  const handleChangeUserRole = async (userId, newRole) => {
    const loggedInUser = users.find((u) => u.role === "SUPERADMIN");
    if (loggedInUser && loggedInUser.id === userId && newRole !== "SUPERADMIN") {
      toast.error("A SuperAdmin cannot demote themselves!");
      return;
    }
    try {
      await updateUser({ id: userId, role: newRole }).unwrap();
      const updatedUsers = users.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
      );
      setUsers(updatedUsers);
      addStateToHistory(updatedUsers);
      toast.success(
        `User "${users.find((u) => u.id === userId)?.username}" role updated to ${newRole}`
      );
    } catch (error) {
      toast.error("Failed to update role");
    }
    setShowActionsDropdownForUser(null);
  };

  const handleDeleteUserClick = (user) => {
    setUserToDelete(user);
    setShowDeleteConfirmModal(true);
    setShowActionsDropdownForUser(null);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    const loggedInUser = users.find((u) => u.role === "SUPERADMIN");
    if (loggedInUser && loggedInUser.id === userToDelete.id) {
      toast.error("A SuperAdmin cannot delete themselves!");
      setShowDeleteConfirmModal(false);
      setUserToDelete(null);
      return;
    }
    try {
      await deleteUser(userToDelete.id).unwrap();
      const updatedUsers = users.filter((user) => user.id !== userToDelete.id);
      setUsers(updatedUsers);
      addStateToHistory(updatedUsers);
      toast.success(`User "${userToDelete.username}" deleted successfully!`);
    } catch (err) {
      toast.error(`Failed to delete user: ${err.message || "Unknown error"}`);
    } finally {
      setShowDeleteConfirmModal(false);
      setUserToDelete(null);
    }
  };

  if (isLoadingUsers || isLoadingImages) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <BgLoader />
      </div>
    );
  }

  if (isErrorUsers) {
    return (
      <div className={`w-full h-full text-center font-bold text-3xl flex justify-center items-center ${
        theme === "dark" ? "text-white" : "text-gray-800"
      }`}>
        Error loading Users.
      </div>
    );
  }

  return (
    <div className={`p-4 sm:p-6 lg:p-8 ${theme === "dark" ? "bg-[#0D0056]/90" : "bg-gray-100"} transition-all duration-500`}>
      <div className={`sticky top-28 backdrop-blur-xl flex justify-between p-3 rounded-b-lg shadow-lg mb-8 ${
        theme === "dark" ? "bg-[#07032B]/90 border-[#3A3A5A]" : "bg-white border-gray-200"
      }`}>
        <span className={`md:text-2xl text-lg font-normal ${
          theme === "dark" ? "text-gray-100" : "text-gray-800"
        }`}>
          Users
        </span>
        <div className="flex items-center gap-2 relative">
          <button
            onClick={handleUndo}
            disabled={historyIndex === 0}
            className={`w-8 h-8 flex items-center justify-center cursor-pointer rounded-full border transition-colors ${
              theme === "dark"
                ? `border-gray-300 text-white ${historyIndex === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-700"}`
                : `border-gray-200 text-gray-800 ${historyIndex === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"}`
            }`}
            title="Undo Last Action"
          >
            <CiUndo />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex === userHistory.length - 1}
            className={`w-8 h-8 flex items-center justify-center cursor-pointer rounded-full border transition-colors ${
              theme === "dark"
                ? `border-gray-300 text-white ${historyIndex === userHistory.length - 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-700"}`
                : `border-gray-200 text-gray-800 ${historyIndex === userHistory.length - 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"}`
            }`}
            title="Redo Last Action"
          >
            <CiRedo />
          </button>
          <div className="relative filter-dropdown-container">
            <button
              onClick={toggleFilterDropdown}
              className={`w-8 h-8 flex items-center justify-center cursor-pointer rounded-full border transition-colors ${
                theme === "dark"
                  ? "border-gray-300 text-white hover:bg-gray-700"
                  : "border-gray-200 text-gray-800 hover:bg-gray-200"
              }`}
              aria-haspopup="true"
              aria-expanded={showFilterDropdown ? "true" : "false"}
              title="Filter Users"
            >
              <HiOutlineAdjustmentsHorizontal />
            </button>
            {showFilterDropdown && (
              <div className={`absolute top-full right-0 mt-2 w-48 rounded-lg shadow-lg overflow-hidden z-50 ${
                theme === "dark" ? "bg-[#07032B] border-[#3A3A5A]" : "bg-white border-gray-200"
              }`}>
                <div className={`px-4 py-2 text-xs uppercase font-bold border-b ${
                  theme === "dark" ? "text-gray-400 border-[#3A3A5A]" : "text-gray-600 border-gray-200"
                }`}>
                  Filter by Role
                </div>
                {["ALL", "USER", "ADMIN", "SUPERADMIN"].map((role) => (
                  <button
                    key={role}
                    onClick={() => applyRoleFilter(role)}
                    className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                      theme === "dark" ? "text-gray-200 hover:bg-[#3A3A5A]" : "text-gray-800 hover:bg-gray-100"
                    }`}
                  >
                    {role === "ALL" ? "All Roles" : role}
                  </button>
                ))}
                <div className={`border-t ${theme === "dark" ? "border-[#3A3A5A]" : "border-gray-200"}`}></div>
                <div className={`px-4 py-2 text-xs uppercase font-bold border-b ${
                  theme === "dark" ? "text-gray-400 border-[#3A3A5A]" : "text-gray-600 border-gray-200"
                }`}>
                  Filter by Pro Status
                </div>
                {["ALL", "PRO", "NON_PRO"].map((pro) => (
                  <button
                    key={pro}
                    onClick={() => applyProFilter(pro)}
                    className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                      theme === "dark" ? "text-gray-200 hover:bg-[#3A3A5A]" : "text-gray-800 hover:bg-gray-100"
                    }`}
                  >
                    {pro === "ALL" ? "All (Pro & Non-Pro)" : pro === "PRO" ? "Pro Users" : "Non-Pro Users"}
                  </button>
                ))}
              </div>
            )}
          </div>
          {role === "SUPERADMIN" && (
            <button
              onClick={handleAddUserClick}
              className={`px-4 py-2 rounded-full flex items-center gap-1 font-semibold shadow-md transition-all duration-300 ${
                theme === "dark"
                  ? "bg-gradient-to-r from-[#00ffee] to-purple-500 text-white hover:from-purple-500 hover:to-[#00ffee]"
                  : "bg-gradient-to-r from-blue-400 to-purple-400 text-white hover:from-purple-400 hover:to-blue-400"
              }`}
              title="Add New User"
            >
              <span>Add User</span>
              <span>+</span>
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 w-full overflow-x-auto custom-scrollbar">
        <h2 className={`font-bold text-xl text-center mb-4 ${
          theme === "dark" ? "text-gray-300" : "text-gray-800"
        }`}>
          All Users ({filteredUsers.length})
        </h2>
        <table className={`w-full border-separate border-spacing-y-3 ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
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
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => (
                <tr
                  key={user.id}
                  className={`text-sm transition cursor-pointer ${
                    theme === "dark"
                      ? "bg-[#19179B] hover:bg-[#2c28b8]"
                      : "bg-white hover:bg-gray-100 shadow-md"
                  }`}
                  onClick={() => handleViewUser(user)}
                >
                  <td className="p-3 align-middle first:rounded-l-lg">
                    <img
                      src={findImagePath(user?.id) || (user?.photo ? user?.photo : profileFallback)}
                      className="rounded-full h-10 w-10 object-cover mr-3"
                      alt="Profile"
                    />
                  </td>
                  <td className="p-3 align-middle font-medium">{user.username}</td>
                  <td className="p-3 align-middle sm:table-cell hidden">{user.email}</td>
                  <td className="p-3 align-middle">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        user.role === "SUPERADMIN"
                          ? theme === "dark"
                            ? "bg-red-700 text-white"
                            : "bg-red-100 text-red-700"
                          : user.role === "ADMIN"
                          ? theme === "dark"
                            ? "bg-blue-700 text-white"
                            : "bg-blue-100 text-blue-700"
                          : theme === "dark"
                          ? "bg-gray-700 text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="p-3 align-middle">
                    {user.isPremium ? (
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        theme === "dark"
                          ? "bg-gradient-to-r from-purple-500 to-blue-400"
                          : "bg-gradient-to-r from-purple-400 to-blue-300"
                      }`}>
                        PRO
                      </span>
                    ) : (
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-800"
                      }`}>
                        NO
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
                        className={theme === "dark" ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-800"}
                        title="More options"
                      >
                        <BsThreeDotsVertical size={20} />
                      </button>
                      {showActionsDropdownForUser === user.id && (
                        <div className={`absolute right-0 mt-2 w-40 rounded-md shadow-lg z-50 overflow-hidden ${
                          theme === "dark" ? "bg-[#07032B] border-[#3A3A5A]" : "bg-white border-gray-200"
                        }`}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewUser(user);
                            }}
                            className={`block w-full text-left px-4 py-2 text-sm ${
                              theme === "dark" ? "text-gray-200 hover:bg-[#3A3A5A]" : "text-gray-800 hover:bg-gray-100"
                            }`}
                          >
                            View
                          </button>
                          {role === "SUPERADMIN" && (
                            <>
                              <div className={`border-t ${theme === "dark" ? "border-[#3A3A5A]" : "border-gray-200"}`}></div>
                              <div className={`px-4 py-2 text-sm ${
                                theme === "dark" ? "text-gray-200" : "text-gray-800"
                              }`}>
                                Change Role:
                                <select
                                  value={user.role}
                                  onChange={(e) => handleChangeUserRole(user.id, e.target.value)}
                                  onClick={(e) => e.stopPropagation()}
                                  className={`w-full mt-1 rounded-md px-2 py-1 border text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 ${
                                    theme === "dark"
                                      ? "bg-[#07032B] border-[#3A3A5A] text-gray-100"
                                      : "bg-white border-gray-300 text-gray-800"
                                  }`}
                                >
                                  <option value="USER">User</option>
                                  <option value="ADMIN">Admin</option>
                                  <option value="SUPERADMIN">SuperAdmin</option>
                                </select>
                              </div>
                              <div className={`border-t ${theme === "dark" ? "border-[#3A3A5A]" : "border-gray-200"}`}></div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteUserClick(user);
                                }}
                                className={`block w-full text-left px-4 py-2 text-sm ${
                                  theme === "dark" ? "text-red-500 hover:bg-red-900" : "text-red-600 hover:bg-red-100"
                                }`}
                                disabled={isLoadingUsers}
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
              ))
            ) : (
              <tr>
                <td colSpan="6" className={`text-center text-xl py-10 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}>
                  No users found matching your filters and search query.
                </td>
              </tr>
            )}
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
                ? theme === "dark"
                  ? "bg-gradient-to-r from-purple-500 to-blue-400 text-white"
                  : "bg-gradient-to-r from-purple-400 to-blue-300 text-white"
                : theme === "dark"
                ? "bg-[#19179B] text-white hover:bg-[#2c28b8]"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {showAddUserModal && (
        <div className={`fixed inset-0 flex justify-center items-center z-50 p-4 ${
          theme === "dark" ? "bg-black/70" : "bg-black/30"
        }`}>
          <div className={`w-full max-w-md p-6 rounded-2xl shadow-2xl border relative modal-content ${
            theme === "dark" ? "bg-[#070045] border-[#3A3A5A]" : "bg-white border-gray-200"
          }`}>
            <button
              type="button"
              onClick={handleCloseAddUserModal}
              className={`absolute top-4 right-4 p-2 cursor-pointer rounded-full transition-colors ${
                theme === "dark" ? "text-gray-400 hover:bg-[#3A3A5A]" : "text-gray-600 hover:bg-gray-200"
              }`}
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className={`text-2xl font-bold mb-6 text-center ${
              theme === "dark" ? "text-white" : "text-gray-800"
            }`}>
              Add New User
            </h2>
            <form onSubmit={handleCreateNewUser} className="space-y-4">
              <div>
                <label htmlFor="username" className={`block mb-1 font-medium text-sm ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}>
                  Username *
                </label>
                <input
                  id="username"
                  type="text"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g., Jane Doe"
                  required
                  className={`w-full rounded-md px-3 py-2 border text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                    theme === "dark"
                      ? "bg-[#07032B] border-[#3A3A5A] text-gray-100"
                      : "bg-white border-gray-300 text-gray-800"
                  }`}
                />
              </div>
              <div>
                <label htmlFor="email" className={`block mb-1 font-medium text-sm ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}>
                  Email *
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g., jane.doe@example.com"
                  required
                  className={`w-full rounded-md px-3 py-2 border text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                    theme === "dark"
                      ? "bg-[#07032B] border-[#3A3A5A] text-gray-100"
                      : "bg-white border-gray-300 text-gray-800"
                  }`}
                />
              </div>
              <div>
                <label htmlFor="password" className={`block mb-1 font-medium text-sm ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}>
                  Password *
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  className={`w-full rounded-md px-3 py-2 border text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                    theme === "dark"
                      ? "bg-[#07032B] border-[#3A3A5A] text-gray-100"
                      : "bg-white border-gray-300 text-gray-800"
                  }`}
                />
              </div>
              <div>
                <label htmlFor="role" className={`block mb-1 font-medium text-sm ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}>
                  Role *
                </label>
                <select
                  id="role"
                  name="role"
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  required
                  className={`w-full rounded-md px-3 py-2 border text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                    theme === "dark"
                      ? "bg-[#07032B] border-[#3A3A5A] text-gray-100"
                      : "bg-white border-gray-300 text-gray-800"
                  }`}
                >
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                  {role === "SUPERADMIN" && <option value="SUPERADMIN">SuperAdmin</option>}
                </select>
              </div>
              <div className="flex justify-center gap-3 mt-6 pt-4 border-t border-[#3A3A5A]">
                <button
                  type="button"
                  onClick={handleCloseAddUserModal}
                  className={`px-5 py-2.5 rounded-full cursor-pointer font-medium transition-all duration-300 border shadow-md text-sm ${
                    theme === "dark"
                      ? "bg-gradient-to-r from-gray-700 to-gray-800 text-white hover:from-gray-800 hover:to-gray-900 border-gray-600"
                      : "bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 hover:from-gray-300 hover:to-gray-400 border-gray-300"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2.5 rounded-full cursor-pointer font-semibold transition-all duration-300 shadow-lg text-sm ${
                    theme === "dark"
                      ? "bg-gradient-to-r from-[#00ffee] to-purple-500 text-white hover:from-purple-500 hover:to-[#00ffee]"
                      : "bg-gradient-to-r from-blue-400 to-purple-400 text-white hover:from-purple-400 hover:to-blue-400"
                  }`}
                  disabled={isLoadingUsers || addingUser}
                >
                  {addingUser ? "Adding User" : "Add User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showViewUserModal && userToView && (
        <div className={`fixed inset-0 flex justify-center items-center z-50 p-4 ${
          theme === "dark" ? "bg-black/70" : "bg-black/30"
        }`}>
          <div className={`w-full max-w-lg p-6 rounded-2xl shadow-2xl border relative max-h-[90vh] overflow-y-auto custom-scrollbar modal-content ${
            theme === "dark" ? "bg-[#070045] border-[#3A3A5A]" : "bg-white border-gray-200"
          }`}>
            <button
              type="button"
              onClick={() => {
                setUserToView(null);
                setShowViewUserModal(false);
              }}
              className={`absolute top-4 right-4 p-2 cursor-pointer rounded-full transition-colors ${
                theme === "dark" ? "text-gray-400 hover:bg-[#3A3A5A]" : "text-gray-600 hover:bg-gray-200"
              }`}
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className={`text-2xl font-bold mb-6 text-center ${
              theme === "dark" ? "text-white" : "text-gray-800"
            }`}>
              User Details: {userToView.username}
            </h2>
            <div className={`space-y-4 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
              <p><strong>Username:</strong> {userToView.username}</p>
              <p><strong>Email:</strong> {userToView.email}</p>
              <p>
                <strong>Role:</strong>{" "}
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    userToView.role === "SUPERADMIN"
                      ? theme === "dark"
                        ? "bg-red-700 text-white"
                        : "bg-red-100 text-red-700"
                      : userToView.role === "ADMIN"
                      ? theme === "dark"
                        ? "bg-blue-700 text-white"
                        : "bg-blue-100 text-blue-700"
                      : theme === "dark"
                      ? "bg-gray-700 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {userToView.role}
                </span>
              </p>
              <p>
                <strong>Pro User:</strong>{" "}
                {userToView.isPremium ? (
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    theme === "dark"
                      ? "bg-gradient-to-r from-purple-500 to-blue-400"
                      : "bg-gradient-to-r from-purple-400 to-blue-300"
                  }`}>
                    YES (PRO)
                  </span>
                ) : (
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-800"
                  }`}>
                    NO
                  </span>
                )}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(userToView.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Updated At:</strong>{" "}
                {new Date(userToView.updatedAt).toLocaleString()}
              </p>
              <p><strong>Course ID:</strong> {userToView.courseId || "N/A"}</p>
            </div>
            <div className="flex justify-center mt-6 pt-4 border-t border-[#3A3A5A]">
              <button
                type="button"
                onClick={() => {
                  setUserToView(null);
                  setShowViewUserModal(false);
                }}
                className={`px-5 py-2.5 rounded-full cursor-pointer font-medium transition-all duration-300 border shadow-md text-sm ${
                  theme === "dark"
                    ? "bg-gradient-to-r from-gray-700 to-gray-800 text-white hover:from-gray-800 hover:to-gray-900 border-gray-600"
                    : "bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 hover:from-gray-300 hover:to-gray-400 border-gray-300"
                }`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirmModal && userToDelete && (
        <div className={`fixed inset-0 flex justify-center items-center z-50 p-4 ${
          theme === "dark" ? "bg-black/70" : "bg-black/30"
        }`}>
          <div className={`w-full max-w-sm p-6 rounded-2xl shadow-2xl border relative modal-content ${
            theme === "dark" ? "bg-[#070045] border-[#3A3A5A]" : "bg-white border-gray-200"
          }`}>
            <button
              type="button"
              onClick={() => {
                setShowDeleteConfirmModal(false);
                setUserToDelete(null);
              }}
              className={`absolute top-4 right-4 p-2 cursor-pointer rounded-full transition-colors ${
                theme === "dark" ? "text-gray-400 hover:bg-[#3A3A5A]" : "text-gray-600 hover:bg-gray-200"
              }`}
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className={`text-2xl font-bold mb-6 text-center ${
              theme === "dark" ? "text-white" : "text-gray-800"
            }`}>
              Confirm Deletion
            </h2>
            <p className={`text-center mb-6 ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}>
              Are you sure you want to delete user "<strong>{userToDelete.username}</strong>"? This
              action cannot be undone.
            </p>
            <div className="flex justify-center gap-3 mt-6 pt-4 border-t border-[#3A3A5A]">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteConfirmModal(false);
                  setUserToDelete(null);
                }}
                className={`px-5 py-2.5 rounded-full cursor-pointer font-medium transition-all duration-300 border shadow-md text-sm ${
                  theme === "dark"
                    ? "bg-gradient-to-r from-gray-700 to-gray-800 text-white hover:from-gray-800 hover:to-gray-900 border-gray-600"
                    : "bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 hover:from-gray-300 hover:to-gray-400 border-gray-300"
                }`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteUser}
                className={`px-5 py-2.5 rounded-full cursor-pointer font-semibold transition-all duration-300 shadow-lg text-sm ${
                  theme === "dark" ? "bg-red-600 text-white hover:bg-red-700" : "bg-red-500 text-white hover:bg-red-600"
                }`}
                disabled={isLoadingUsers}
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