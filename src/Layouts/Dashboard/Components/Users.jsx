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
import { useGetProfileImagesQuery, useRegisterMutation } from "../../../redux/api/userSlice";
import BgLoader from "../../../Components/ui/BgLoader";
import { useDispatch } from "react-redux";

const Users = () => {
  const role = useContext(userRoleContext);
  const { searchQuery } = useContext(SearchContext);

  const {
    data: usersData,
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
    refetch: refetchUsers,
  } = useGetUsersQuery();

  const {
    data: imagesData = {},
    isLoading: isLoadingImages,
  } = useGetProfileImagesQuery(undefined, {
    skip: !usersData, // Only fetch images if users are loaded
  });

  const {data: images} = useGetProfileImagesQuery(usersData?.id);
  const findImagePath = (imageId) => {
    if (!images?.length) return profileFallback;
  
    const image = images.find(img => img.id === imageId);
    if (!image?.path || !image.path.startsWith("http")) return profileFallback;
  
    return image.path;
  };

  const [register] = useRegisterMutation();
  const [deleteUser] = useDeleteUserMutation();

  const dispatch = useDispatch();


  const [users, setUsers] = useState(usersData || []);
  const [userHistory, setUserHistory] = useState([usersData || []]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const usersPerPage = 10;
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

  // Sync users state with API data
  useEffect(() => {
    if (usersData) {
      setUsers(usersData);
      setUserHistory([usersData]);
      setHistoryIndex(0);
    }
  }, [usersData]);

  // Handle outside clicks for dropdowns and modals
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
    setNewUserData({ username: "", email: "", role: "USER", password: "" });
  };

  // const handleNewUserInputChange = (e) => {
  //   const { name, value, type, checked } = e.target;
  //   setNewUserData((prev) => ({
  //     ...prev,
  //     [name]: type === "checkbox" ? checked : value,
  //   }));
  // };

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
        role: newUserRole
      }).unwrap();
      setAddingUser(false);
      refetchUsers();
      // addStateToHistory([...users, response]);
      toast.success(`User "${username}" added successfully!`);
      handleCloseAddUserModal();
    } catch (err) {
      // toast.error(`Failed to add user!`);
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

  const handleChangeUserRole = (userId, newRole) => {
    const loggedInUser = users.find((u) => u.role === "SUPERADMIN");
    if (loggedInUser && loggedInUser.id === userId && newRole !== "SUPERADMIN") {
      toast.error("A SuperAdmin cannot demote themselves!");
      return;
    }

    const updatedUsers = users.map((user) =>
      user.id === userId ? { ...user, role: newRole } : user
    );
    setUsers(updatedUsers);
    addStateToHistory(updatedUsers);
    toast.success(
      `User "${users.find((u) => u.id === userId)?.username}'s role updated to ${newRole}"`
    );
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
      <div className="w-full h-full text-center text-white font-bold text-3xl flex justify-center items-center">
        Error loading Users.
      </div>
    );
  }

  return (
    <div>
      <div className="sticky top-28 backdrop-blur-xl flex justify-between p-3 rounded-b-lg shadow-lg mb-8">
        <span className="md:text-2xl text-lg font-normal text-gray-100">Users</span>
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
                <div className="px-4 py-2 text-gray-400 text-xs uppercase font-bold border-b border-[#3A3A5A]">
                  Filter by Role
                </div>
                {["ALL", "USER", "ADMIN", "SUPERADMIN"].map((role) => (
                  <button
                    key={role}
                    onClick={() => applyRoleFilter(role)}
                    className="block w-full text-left px-4 py-2 text-gray-200 hover:bg-[#3A3A5A] transition-colors text-sm"
                  >
                    {role === "ALL" ? "All Roles" : role}
                  </button>
                ))}
                <div className="border-t border-[#3A3A5A]"></div>
                <div className="px-4 py-2 text-gray-400 text-xs uppercase font-bold border-b border-[#3A3A5A]">
                  Filter by Pro Status
                </div>
                {["ALL", "PRO", "NON_PRO"].map((pro) => (
                  <button
                    key={pro}
                    onClick={() => applyProFilter(pro)}
                    className="block w-full text-left px-4 py-2 text-gray-200 hover:bg-[#3A3A5A] transition-colors text-sm"
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
          All Users ({filteredUsers.length})
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
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => (
              
                <tr
                  key={user.id}
                  className="bg-[#19179B] text-sm hover:bg-[#2c28b8] transition cursor-pointer"
                  onClick={() => handleViewUser(user)}
                >
                  <td className="p-3 align-middle first:rounded-l-lg">
                    <img src={findImagePath(user?.id) || (user?.photo ? user?.photo : profileFallback)} className='rounded-full h-10 w-10 object-cover mr-3' alt="Profile" />
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
                    {user.isPremium ? (
                      <span className="bg-gradient-to-r from-purple-500 to-blue-400 text-xs px-2 py-1 rounded-full">
                        PRO
                      </span>
                    ) : (
                      <span className="bg-gray-700 text-white text-xs px-2 py-1 rounded-full">
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
                                  value={user.role}
                                  onChange={(e) => handleChangeUserRole(user.id, e.target.value)}
                                  onClick={(e) => e.stopPropagation()}
                                  className="w-full mt-1 rounded-md px-2 py-1 border border-[#3A3A5A] text-gray-100 bg-[#07032B] focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm"
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
                                disabled={isLoadingUsers} // Prevent deletion during loading
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
                <td colSpan="6" className="text-center text-gray-400 text-xl py-10">
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
          <div className="bg-[#070045] w-full max-w-md p-6 rounded-2xl shadow-2xl border border-[#3A3A5A] relative modal-content">
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
                  value={username}
                  onChange={e => setUsername(e.target.value)}
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
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="e.g., jane.doe@example.com"
                  required
                  className="w-full rounded-md px-3 py-2 border border-[#3A3A5A] text-gray-100 bg-[#07032B] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm"
                />
              </div>
              <div>
                <label htmlFor="password" className="block mb-1 font-medium text-gray-300 text-sm">
                  Password *
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={password}
                  onChange={e=>setPassword(e.target.value)}
                  placeholder="Enter password"
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
                  value={newUserRole}
                  onChange={e => setNewUserRole(e.target.value)}
                  required
                  className="w-full rounded-md px-3 py-2 border border-[#3A3A5A] text-gray-100 bg-[#07032B] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm"
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
                  className="px-5 py-2.5 rounded-full cursor-pointer bg-gradient-to-r from-gray-700 to-gray-800 text-white font-medium hover:from-gray-800 hover:to-gray-900 transition-all duration-300 border border-gray-600 shadow-md text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-full cursor-pointer bg-gradient-to-r from-[#00ffee] to-purple-500 text-white font-semibold hover:from-purple-500 hover:to-[#00ffee] transition-all duration-300 shadow-lg text-sm"
                  disabled={isLoadingUsers}
                >
                  { addingUser ? "Adding User" : "Add User" }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showViewUserModal && userToView && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4">
          <div className="bg-[#070045] w-full max-w-lg p-6 rounded-2xl shadow-2xl border border-[#3A3A5A] relative max-h-[90vh] overflow-y-auto custom-scrollbar modal-content">
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
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              User Details: {userToView.username}
            </h2>
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
                  <span className="bg-gray-700 text-white text-xs px-2 py-1 rounded-full">
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
          <div className="bg-[#070045] w-full max-w-sm p-6 rounded-2xl shadow-2xl border border-[#3A3A5A] relative modal-content">
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
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Confirm Deletion
            </h2>
            <p className="text-gray-300 text-center mb-6">
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
                className="px-5 py-2.5 rounded-full cursor-pointer bg-gradient-to-r from-gray-700 to-gray-800 text-white font-medium hover:from-gray-800 hover:to-gray-900 transition-all duration-300 border border-gray-600 shadow-md text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteUser}
                className="px-5 py-2.5 rounded-full cursor-pointer bg-red-600 text-white font-semibold hover:bg-red-700 transition-all duration-300 shadow-lg text-sm"
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