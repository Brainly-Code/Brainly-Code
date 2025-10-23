import React, { useState, useRef, useEffect, useContext } from 'react';
import Header from './ui/Header';
import profile from '../assets/whiteUser.png';
import messenger from '../assets/messenger.png';
import Footer from './ui/Footer';
import conversation from '../assets/conversation.png';
import Chat from './Chat';
import { useGetUsersQuery } from '../redux/api/AdminSlice';
import { useGetUnreadCountsQuery } from '../redux/api/messageSlice';
import { toast } from 'react-toastify';
import BgLoader from './ui/BgLoader';
import { jwtDecode } from 'jwt-decode';
import { useSelector } from 'react-redux';
import { useAddCommentMutation } from "../redux/api/commentsSlice";
import { useGetCommunityUsersQuery, useGetProfileImagesQuery } from '../redux/api/userSlice';
import { ThemeContext } from '../Contexts/ThemeContext';

export const Community = () => {
  const { theme } = useContext(ThemeContext);
  const [selectedUser, setSelectedUser] = useState();
  const [openChat, setOpenChat] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 3;

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchHints, setShowSearchHints] = useState(true);
  const searchRef = useRef(null);

  const { user } = useSelector((state) => state.auth);
  const currentUserId = user?.id;

  const { data: unreadCounts } = useGetUnreadCountsQuery(currentUserId);
  const { data: images } = useGetProfileImagesQuery();
  const findProfileImage = (id) => {
    const profileImage = images?.find(image => image.userId === id);
    return profileImage?.path || profile;
  };
  const totalUnread = unreadCounts?.reduce((sum, u) => sum + u._count.id, 0);

  // Comment section state
  const [comment, setComment] = useState("");

  const messangerHandler = (communityUser) => {
    setOpenChat(true);
    setSelectedUser(communityUser);
  };

  const { data: communityUsers, isLoading, error } = useGetCommunityUsersQuery();

  const roleProvision = (role) => {
    if (role === "USER") {
      return "Student";
    } else {
      return "Instructor";
    }
  };

  if (error) {
    toast.error("Sorry could not load the community users");
    setHasError(true);
    return (
      <div
        className={`${
          theme === "light" ? "bg-gray-100" : "bg-[#0D0056]"
        } min-h-screen flex flex-col items-center justify-center`}
      >
        <Header />
        <h1
          className={`text-2xl font-bold ${
            theme === "light" ? "text-gray-800" : "text-white"
          }`}
        >
          Failed to load community users.
        </h1>
        <Footer />
      </div>
    );
  }

  // Filter out current user
  let filteredUsers = communityUsers?.filter(user => user.id !== currentUserId);

  if (searchTerm.trim()) {
    filteredUsers = filteredUsers?.filter(user =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Pagination
  const totalPages = Math.ceil((filteredUsers?.length || 0) / usersPerPage);
  const paginatedUsers = filteredUsers?.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const [addComment, { isLoading: isAdding }] = useAddCommentMutation();

  // Comment handling
  const handleSendComment = async () => {
    if (!comment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      await addComment({ message: comment, userId: currentUserId }).unwrap();
      toast.success("Comment sent!");
      setComment("");
    } catch (err) {
      toast.error("Failed to send comment");
    }
  };

  // Hiding search hints when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setShowSearchHints(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Hiding search hints on Enter click
  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      setShowSearchHints(false);
    }
  };

  return (
    <div
      className={`${
        theme === "light"
          ? "bg-gray-100"
          : "bg-gradient-to-r from-[#070045] via-[#0d0066] to-[#070045]"
      } w-full h-full flex flex-col min-h-screen`}
    >
      {!openChat && <Header />}
      {hasError ? (
        <>
          <Header />
          <h1
            className={`text-2xl font-bold ${
              theme === "light" ? "text-gray-800" : "text-white"
            }`}
          >
            Failed to load community users.
          </h1>
        </>
      ) : (
        <>
        </>
      )}

      <div className="flex gap-10 pl-[40rem]">
        {/* Title */}
        <h1
          className={`text-center mt-10 font-bold text-2xl md:text-3xl ${
            theme === "light" ? "text-gray-800" : "text-white"
          }`}
        >
          Community
        </h1>

        {/* Search Bar */}
        <div ref={searchRef} className="flex w-full flex-col items-center mt-10 mb-2">
          <input
            type="text"
            className={`w-full md:w-1/2 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${
              theme === "light"
                ? "bg-white text-gray-800 border-gray-300 focus:ring-blue-500"
                : "bg-[#6B5EDD] bg-opacity-70 text-gray-50 border-[#6B5EDD] focus:ring-[#2a28d4]"
            }`}
            placeholder="Search users by username..."
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
              setShowSearchHints(true);
            }}
            onKeyDown={handleSearchKeyDown}
          />

          {/* To show hints below search bar */}
          {showSearchHints && (
            <div className="w-full md:w-1/2 mt-0.3 p-2 z-10">
              {searchTerm.trim() && filteredUsers?.length > 0 && (
                <div
                  className={`w-full md:w-1/2 rounded-lg shadow mt-2 p-2 ${
                    theme === "light" ? "bg-white" : "bg-[#6B5EDD] bg-opacity-70"
                  }`}
                >
                  <span
                    className={`text-sm font-semibold ${
                      theme === "light" ? "text-gray-600" : "text-gray-400"
                    }`}
                  >
                    Suggestions:
                  </span>
                  <ul>
                    {filteredUsers.slice(0, 5).map(user => (
                      <li
                        key={user.id}
                        className={`cursor-pointer px-2 py-1 rounded ${
                          theme === "light"
                            ? "hover:bg-gray-100 text-gray-800"
                            : "hover:bg-[#6B5EDD] text-gray-200"
                        }`}
                        onClick={() => {
                          setSearchTerm(user.username);
                          setCurrentPage(1);
                          setShowSearchHints(false);
                        }}
                      >
                        {user.username}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {searchTerm.trim() && filteredUsers?.length === 0 && (
                <div
                  className={`w-full md:w-1/2 rounded-lg shadow mt-2 p-2 z-10 ${
                    theme === "light" ? "bg-white" : "bg-[#6B5EDD] bg-opacity-70"
                  }`}
                >
                  <span
                    className={`text-sm ${
                      theme === "light" ? "text-gray-500" : "text-gray-300"
                    }`}
                  >
                    No users with that username found.
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <h5
        className={`ml-6 md:ml-16 mt-10 font-bold text-lg ${
          theme === "light" ? "text-gray-800" : "text-white"
        }`}
      >
        Need help?
      </h5>

      {/* Cards Section */}
      <div className="flex flex-col md:flex-row flex-wrap justify-center items-center m-6 md:m-16 gap-6 md:gap-12">
        {isLoading ? (
          <BgLoader />
        ) : (
          paginatedUsers?.map((communityUser, i) => {
            const unreadForUser = unreadCounts?.find(u => u.senderId === communityUser.id)?._count.id || 0;
            return (
              <div
                key={i}
                className={`text-white flex flex-col w-full sm:w-[80%] md:w-[30%] p-6 md:p-8 rounded-xl shadow-md ${
                  theme === "light" ? "bg-white text-gray-800" : "bg-[#6B5EDD]"
                }`}
              >
                {/* Profile Image */}
                <div
                  className={`rounded-full w-[120px] h-[120px] mx-auto ${
                    theme === "light" ? "bg-gray-200" : "bg-[#0A1C2B]"
                  }`}
                >
                  <img
                    src={findProfileImage(communityUser?.id)}
                    alt="profile"
                    className="mx-auto object-cover rounded-full h-[120px] w-[120px]"
                  />
                </div>

                {/* Info */}
                <div className="flex flex-col mt-4 mb-4">
                  <span className="text-center text-lg font-medium">
                    {communityUser?.username}
                  </span>
                  <span
                    className={`text-center text-sm ${
                      theme === "light" ? "text-gray-600" : "text-gray-300"
                    }`}
                  >
                    {roleProvision(communityUser?.role)}
                  </span>
                  {unreadForUser > 0 && (
                    <span className="text-center text-xs bg-red-500 text-white rounded-full px-2 py-0.5 mt-1">
                      {unreadForUser} unread
                    </span>
                  )}
                </div>

                {/* Messenger Icon */}
                <div>
                  <img
                    src={messenger}
                    alt="chat"
                    className="w-10 mx-auto cursor-pointer hover:scale-110 transition"
                    onClick={() => messangerHandler(communityUser)}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      <div
        className={`font-semibold flex w-full max-w-[70rem] mx-auto my-6 gap-3 overflow-x-auto whitespace-nowrap ${
          theme === "light" ? "text-gray-800" : "text-white"
        }`}
      >
        {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((n) => (
          <div
            key={n}
            role="button"
            aria-label={`Go to page ${n}`}
            className={`px-3 py-1 rounded-md cursor-pointer transition ${
              theme === "light"
                ? `bg-gray-200 hover:bg-blue-300 ${
                    currentPage === n ? "bg-blue-500 text-white" : ""
                  }`
                : `bg-[#19179B] hover:bg-[#2a28d4] ${
                    currentPage === n ? "bg-[#2a28d4]" : ""
                  }`
            }`}
            onClick={() => setCurrentPage(n)}
          >
            {n}
          </div>
        ))}
      </div>

      {/* Comment Section */}
      <div
        className={`flex flex-col gap-4 m-6 md:m-16 ${
          theme === "light" ? "text-gray-800" : "text-white"
        }`}
      >
        <h5 className="text-center font-semibold text-lg">Leave a comment</h5>
        <textarea
          className={`h-[180px] md:h-[240px] w-full md:w-3/4 mx-auto p-3 rounded-md resize-none focus:outline-none focus:ring-2 ${
            theme === "light"
              ? "bg-white text-gray-800 border-gray-300 focus:ring-blue-500"
              : "bg-[#6B5EDD] text-gray-50 border-[#6B5EDD] focus:ring-[#2a28d4]"
          }`}
          placeholder="Write your comment..."
          value={comment}
          onChange={e => setComment(e.target.value)}
        />
        <button
          disabled={isAdding}
          className={`w-1/2 md:w-1/6 mx-auto p-3 rounded-lg font-semibold transition disabled:opacity-50 ${
            theme === "light"
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-[#6B5EDD] hover:bg-[#2a28d4] text-white"
          }`}
          onClick={handleSendComment}
        >
          {isAdding ? "Sending..." : "Send"}
        </button>
      </div>

      {/* Floating Chat Button */}
      <div className="fixed lg:bottom-6 bottom-[27rem] right-20 lg:right-6 lg:z-40">
        <div className="relative">
          <img
            src={conversation}
            alt="chat"
            className="w-14 h-14 cursor-pointer hover:scale-110 transition p-2"
            onClick={() => {
              setOpenChat(true);
              setSelectedUser(undefined);
            }}
          />
          {unreadCounts?.length > 0 && (
            <span className="absolute top-1 -right-0 bg-red-500 text-white rounded-full px-2 py-1 text-xs font-bold">
              {totalUnread}
            </span>
          )}
        </div>
      </div>

      <Footer />

      {/* Chat Modal */}
      {openChat && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 overflow-hidden">
          <div
            className={`relative w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 h-[90vh] rounded-xl shadow-2xl flex flex-col ${
              theme === "light" ? "bg-white" : "bg-[#0D0056]"
            }`}
          >
            {/* Close Button */}
            <button
              className={`absolute -top-8 text-3xl right-3 text-xl font-bold hover:text-gray-300 ${
                theme === "light" ? "text-gray-800" : "text-white"
              }`}
              onClick={() => setOpenChat(false)}
            >
              ✕
            </button>

            {/* Chat Component */}
            <Chat chatWith={selectedUser} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;