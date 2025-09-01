import React, { useState, useRef, useEffect } from 'react'
import Header from './ui/Header'
import user from '../assets/whiteUser.png'
import messenger from '../assets/messenger.png'
import Footer from './ui/Footer'
import conversation from '../assets/conversation.png'
import Chat from './Chat'
import { useGetUsersQuery } from '../redux/api/AdminSlice'
import { toast } from 'react-toastify'
import BgLoader from './ui/BgLoader'
import { jwtDecode } from 'jwt-decode'
import { useSelector } from 'react-redux'

export const Community = () => {
  const [selectedUser, setSelectedUser] = useState();
  const [openChat, setOpenChat] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 3;

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchHints, setShowSearchHints] = useState(true);
  const searchRef = useRef(null);

  const { userInfo } = useSelector(state => state.auth);
  const token = jwtDecode(userInfo.access_token);
  const currentUserId = token.sub;

  // Comment section state
  const [comment, setComment] = useState("");

  const messangerHandler = (communityUser) => {
    setOpenChat(true);
    setSelectedUser(communityUser);
  }

  const { data: communityUsers, isLoading, error } = useGetUsersQuery();

  const roleProvision = (role) => {
    if (role === "USER") {
      return "Student";
    } else {
      return "Instructor";
    }
  }

  if (error) {
    toast.error("Sorry could not load the community users");
    return (
      <div className="bg-[#0D0056] min-h-screen flex flex-col items-center justify-center">
        <Header />
        <h1 className="text-white text-2xl font-bold">Failed to load community users.</h1>
        <Footer />
      </div>
    );
  }

  // Filter out current user
  let filteredUsers = communityUsers?.filter(user => user.id !== currentUserId);

  // Apply search filter
  if (searchTerm.trim()) {
    filteredUsers = filteredUsers?.filter(user =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Pagination logic
  const totalPages = Math.ceil((filteredUsers?.length || 0) / usersPerPage);
  const paginatedUsers = filteredUsers?.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  // Comment handler
  const handleSendComment = () => {
    if (!comment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    // TODO: Implement API call to send comment
    toast.success("Comment sent!");
    setComment("");
  };

  // Hide search hints when clicking outside
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

  // Hide search hints on Enter
  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      setShowSearchHints(false);
    }
  };

  return (
    <div className="bg-[#0D0056] min-h-screen flex flex-col relative">
      {!openChat && <Header />}

      <div className='flex gap-10 pl-[40rem]'>
        {/* Title */}
        <h1 className="text-center  text-white mt-10 font-bold text-2xl md:text-3xl">
          Community
        </h1>
        {/* Search Bar */}
        <div ref={searchRef} className="flex w-full flex-col items-center mt-10 mb-2">
          <input
            type="text"
            className="w-full md:w-1/2 px-4 py-2 bg-[#6B5EDD] bg-opacity-70 focus:bg-opacity-10 text-gray-50 rounded-lg border border-[#6B5EDD] focus:outline-none focus:ring-2 focus:ring-[#2a28d4]"
            placeholder="Search users by username..."
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
              setShowSearchHints(true);
            }}
            onKeyDown={handleSearchKeyDown}
            />
          {/* Hints below search bar */}
          {showSearchHints && (
            <div className='w-full md:w-1/2 mt-0.3 p-2 z-10'>
            {searchTerm.trim() && filteredUsers?.length > 0 && (
              <div className="w-full md:w-1/2 bg-[#6B5EDD] bg-opacity-70 rounded-lg shadow mt-2 p-2 z-10">
                <span className="text-gray-400 text-sm font-semibold">Suggestions:</span>
                <ul>
                  {filteredUsers.slice(0, 5).map(user => (
                    <li
                      key={user.id}
                      className="cursor-pointer px-2 py-1 hover:bg-[#6B5EDD] rounded text-gray-200"
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
              <div className="w-full md:w-1/2  rounded-lg shadow mt-2 p-2 z-10">
                <span className="text-gray-300 text-sm">No users with that username found.</span>
              </div>
            )}
          </div>
            )}
        </div>
      </div>
      <h5 className="text-white ml-6 md:ml-16 mt-10 font-bold text-lg">
        Need help?
      </h5>

      {/* Cards Section */}
      <div className="flex flex-col md:flex-row flex-wrap justify-center items-center m-6 md:m-16 gap-6 md:gap-12">
        {
          isLoading ?
            <BgLoader />
            : (
              paginatedUsers?.map((communityUser, i) => (
                <div
                  key={i}
                  className="text-white bg-[#6B5EDD] flex flex-col w-full sm:w-[80%] md:w-[30%] p-6 md:p-8 rounded-xl shadow-md"
                >
                  {/* Profile Image */}
                  <div className="bg-[#0A1C2B] rounded-full w-[120px] h-[120px] mx-auto">
                    <img
                      src={!communityUser?.photo ? user : communityUser?.photo}
                      alt="profile"
                      className="mx-auto object-cover rounded-full h-[120px] w-[120px]"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex flex-col mt-4 mb-4">
                    <span className="text-center text-lg font-medium">{communityUser?.username}</span>
                    <span className="text-center text-sm">{roleProvision(communityUser?.role)}</span>
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
              )
              ))}
      </div>

      {/* Pagination */}
      <div className="text-white font-semibold flex flex-row mx-auto my-6 justify-around gap-3">
        {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((n) => (
          <div
            key={n}
            className={`bg-[#19179B] px-3 py-1 rounded-md cursor-pointer hover:bg-[#2a28d4] transition ${currentPage === n ? "bg-[#2a28d4]" : ""}`}
            onClick={() => setCurrentPage(n)}
          >
            {n}
          </div>
        ))}
      </div>

      {/* Comment Section */}
      <div className="text-white flex flex-col gap-4 m-6 md:m-16">
        <h5 className="text-center font-semibold text-lg">Leave a comment</h5>
        <textarea
          className="bg-[#6B5EDD] h-[180px] md:h-[240px] w-full md:w-3/4 mx-auto p-3 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[#2a28d4]"
          placeholder="Write your comment..."
          value={comment}
          onChange={e => setComment(e.target.value)}
        />
        <button
          className="bg-[#6B5EDD] hover:bg-[#2a28d4] w-1/2 md:w-1/6 mx-auto p-3 rounded-lg font-semibold transition"
          onClick={handleSendComment}
        >
          Send
        </button>
      </div>

      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <img
          src={conversation}
          alt="chat"
          className="w-14 h-14 cursor-pointer hover:scale-110 transition  p-2"
          onClick={() => {
            setOpenChat(true);
            setSelectedUser(undefined); // Open general chat
          }}
        />
      </div>

      <Footer />

      {/* Chat Modal */}
      {openChat && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 overflow-hidden">
          <div className="relative w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 h-[90vh] bg-[#0D0056] rounded-xl shadow-2xl flex flex-col">
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-white text-xl font-bold hover:text-gray-300"
              onClick={() => setOpenChat(false)}
            >
              ✕
            </button>

            {/* Chat Component */}
            <Chat chatWith={selectedUser}/>
          </div>
        </div>
      )}
    </div>
  )
}

export default Community