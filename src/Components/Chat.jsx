import React, { useEffect, useState, useRef, useContext } from "react";
import { socket } from "../socket";
import userAvatar from "../assets/user.png";
import send from "../assets/send.png";
import {
  useGetMessagesQuery,
  useSendMessageMutation,
  useGetUnreadCountsQuery,
  useReadMessagesMutation,
} from "../redux/api/messageSlice";
import { useGetCommunityUsersQuery, useGetProfileImagesQuery, useGetUserByIdQuery } from "../redux/api/userSlice";
import { useNotification } from "./ui/UseNotification";
import { useSelector } from "react-redux";
import { ThemeContext } from "../Contexts/ThemeContext";

export const Chat = ({ chatWith }) => {
  const { theme } = useContext(ThemeContext);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const sidebarRef = useRef(null);
  const searchRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchHints, setShowSearchHints] = useState(false);
  const messagesPerPage = 20;
  const { data: users = [], isLoading: usersLoading } = useGetCommunityUsersQuery();
  const { user } = useSelector((state) => state.auth);
  const userId = user?.id;

  const { data: unreadCounts = [], refetch: refetchUnread } = useGetUnreadCountsQuery(userId, { skip: !userId });
  const [readMessages] = useReadMessagesMutation();
  const { data: currentUser, isLoading: currentUserLoading } = useGetUserByIdQuery(userId, { skip: !userId });
  const {data: images} = useGetProfileImagesQuery();

  const findProfileImage = (id) => {
    const profileImage = images?.find(image => image.userId===id);

    return profileImage?.path || userAvatar ;
  }

  const filteredUsers = users
    .filter((u) => u.id !== userId)
    .filter((u) => u.username.toLowerCase().includes(searchTerm.toLowerCase()));

  const [selectedUser, setSelectedUser] = useState(
    chatWith || (filteredUsers.length > 0 ? filteredUsers[0] : null)
  );

  const { data: fetchedMessages, isFetching: isFetchingMessages } = useGetMessagesQuery(
    selectedUser
      ? { userId: selectedUser.id, otherUserId: userId, page, limit: messagesPerPage }
      : { userId: null, otherUserId: null },
    { skip: !selectedUser || !userId }
  );

  const [sendMessage] = useSendMessageMutation();
  const notify = useNotification();

  // Update selected user when chatWith changes
  useEffect(() => {
    if (chatWith) setSelectedUser(chatWith);
  }, [chatWith]);

  // Handle fetched messages and pagination
  useEffect(() => {
    if (fetchedMessages) {
      setMessages((prev) => {
        const newMessages = fetchedMessages.filter((msg) => !prev.some((m) => m.id === msg.id));
        return page === 1 ? newMessages : [...newMessages, ...prev];
      });
      setHasMore(fetchedMessages.length === messagesPerPage);
    } else if (page === 1) {
      setMessages([]);
      setHasMore(true);
    }
  }, [fetchedMessages, page]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (!chatContainerRef.current) return;
    const chatContainer = chatContainerRef.current;
    const isScrolledToBottom = chatContainer.scrollHeight - chatContainer.scrollTop <= chatContainer.clientHeight + 50;

    if (isScrolledToBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Handle scroll for pagination and scroll-to-bottom button
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (!chatContainer) return;

    const handleScroll = () => {
      const isScrolledToBottom = chatContainer.scrollHeight - chatContainer.scrollTop <= chatContainer.clientHeight + 50;
      setShowScrollButton(!isScrolledToBottom);

      if (chatContainer.scrollTop < 100 && hasMore && !isFetchingMessages) {
        setPage((prev) => prev + 1);
      }
    };

    chatContainer.addEventListener("scroll", handleScroll);
    return () => chatContainer.removeEventListener("scroll", handleScroll);
  }, [hasMore, isFetchingMessages]);

  // Reset pagination and scroll when switching users
  useEffect(() => {
    if (selectedUser && chatContainerRef.current) {
      setPage(1);
      setHasMore(true);
      setMessages([]);
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setShowScrollButton(false);
    }
  }, [selectedUser]);

  // Handle WebSocket events
  useEffect(() => {
    if (!selectedUser || !userId) return;
    const roomId = [userId, selectedUser.id].sort().join("-");
    socket.emit("joinRoom", roomId);

    const handleNewMessage = (msg) => {
      if (
        (msg.senderId === userId && msg.receiverId === selectedUser.id) ||
        (msg.senderId === selectedUser.id && msg.receiverId === userId)
      ) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });

        if (msg.senderId !== userId) {
          notify("📩 New Message", {
            body: `${selectedUser?.username}: ${msg.content}`,
            icon: selectedUser?.photo || userAvatar,
          });
        }
      }
    };

    socket.on("newDM", handleNewMessage);
    return () => {
      socket.emit("leaveRoom", roomId);
      socket.off("newDM", handleNewMessage);
    };
  }, [selectedUser, userId, notify]);

  // Send message
  const handleSend = async () => {
    if (!newMessage.trim() || !selectedUser || !userId) return;

    const msgData = {
      senderId: userId,
      receiverId: selectedUser.id,
      content: newMessage.trim(),
      type: "text",
    };

    try {
      socket.emit("sendDM", msgData);
      await sendMessage(msgData).unwrap();
      setNewMessage("");
    } catch (error) {
      notify("Error", { body: "Failed to send message. Please try again.", icon: userAvatar });
    }
  };

  // Handle Enter key for sending messages
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (newMessage.trim()) handleSend();
    }
  };

  // Mark messages as read
  useEffect(() => {
    if (selectedUser && userId) {
      readMessages({ userId, otherUserId: selectedUser.id }).then(() => {
        refetchUnread();
      });
    }
  }, [selectedUser, userId, readMessages, refetchUnread]);

  // Get unread message count for a user
  const getUnreadForUser = (uid) => {
    const found = unreadCounts?.find((u) => u.senderId === uid);
    return found ? found._count.id : 0;
  };

  // Close sidebar on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowScrollButton(false);
  };

  // Format timestamp
  const formatTimestamp = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Handle search key down
  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      setShowSearchHints(false);
    }
  };

  if (usersLoading || currentUserLoading || !userId) {
    return <div className="text-white text-center">Loading...</div>;
  }

  return (
    <div className="bg-[#0D0056] h-full flex flex-col">
      <div
        className={`${
          theme === "light" ? "bg-white" : "bg-[#1a2b3c]"
        } flex flex-col sm:flex-row h-full w-full rounded-lg shadow-lg overflow-hidden`}
      >
        {/* Sidebar */}
        <div
          ref={sidebarRef}
          className={`${
            sidebarOpen ? "block" : "hidden"
          } ${
            theme === "light" ? "bg-gray-100" : "bg-[#1a2b3c]"
          } sm:block w-full sm:w-1/4 text-white p-4 space-y-3 border-r border-gray-700 h-[calc(100vh-2rem)] overflow-y-auto`}
        >
          <h3
            className={`font-bold pt-12 pl-[35%] ${
              theme === "light" ? "text-gray-700" : "text-gray-200"
            }`}
          >
            Chats
          </h3>
          <div ref={searchRef} className="flex w-full flex-col items-center mt-10 mb-2">
            <input
              type="text"
              className="w-[50rem] md:w-1/2 px-4 py-2 bg-[#6B5EDD] bg-opacity-70 focus:bg-opacity-10 text-black rounded-lg border border-[#6B5EDD] focus:outline-none focus:ring-2 focus:ring-[#2a28d4]"
              placeholder="Search users by username..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSearchHints(true);
              }}
              onKeyDown={handleSearchKeyDown}
            />
            {showSearchHints && (
              <div className="mt-0.3 p-2 z-10">
                {searchTerm.trim() && filteredUsers?.length > 0 && (
                  <div className="w-full md:w-[10rem] bg-[#6B5EDD] bg-opacity-70 rounded-lg shadow mt-2 p-2 z-10">
                    <span className="text-gray-400 text-sm font-semibold">Suggestions:</span>
                    <ul>
                      {filteredUsers.slice(0, 5).map((user) => (
                        <li
                          key={user.id}
                          className="cursor-pointer px-2 py-1 hover:bg-[#6B5EDD] rounded text-gray-200"
                          onClick={() => {
                            setSearchTerm(user.username);
                            setSelectedUser(user);
                            setShowSearchHints(false);
                            setSidebarOpen(false);
                          }}
                        >
                          {user.username}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {searchTerm.trim() && filteredUsers?.length === 0 && (
                  <div className="w-full md:w-1/2 bg-[#6B5EDD] bg-opacity-70 rounded-lg shadow mt-2 p-2 z-10">
                    <span className="text-gray-300 text-sm">No users found.</span>
                  </div>
                )}
              </div>
            )}
          </div>
          {filteredUsers.map((u) => (
            <div
              key={u.id}
              onClick={() => {
                setSelectedUser(u);
                setSidebarOpen(false);
                setSearchTerm("");
                setShowSearchHints(false);
              }}
              className={`${
                theme === "light" ? "text-gray-900 hover:text-gray-100" : "text-gray-100"
              } flex items-center gap-3 p-2 rounded-lg cursor-pointer transition ${
                selectedUser?.id === u.id ? "bg-[#6B5EDD]" : "hover:bg-[#2a3b4c]"
              }`}
            >
              <img
                src={findProfileImage(u?.id)}
                className="bg-white rounded-full h-[40px] w-[40px]"
                alt={u.username}
              />
              <span className="truncate">{u.username}</span>
              {getUnreadForUser(u.id) > 0 && selectedUser?.id !== u.id && (
                <span className="ml-auto bg-red-500 text-white rounded-full px-2 py-0.5 text-xs font-bold">
                  {getUnreadForUser(u.id)}
                </span>
              )}
            </div>
          ))}
        </div>
        {/* Chat Window */}
        <div className="flex-1 flex flex-col relative">
          {selectedUser ? (
            <div
              className={`${
                theme === "light" ? "text-[#0A1C2B] bg-gray-200" : "text-gray-100 bg-[#101b2d]"
              } flex flex-col h-full`}
            >
              <div
                className={`${
                  theme === "light" ? "bg-white" : "bg-[#0A1C2B]"
                } flex items-center justify-between p-4 border-b border-gray-700 sticky top-0 z-10`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={findProfileImage(selectedUser?.id)}
                    className="bg-white rounded-full h-12 w-12"
                    alt={selectedUser?.username}
                  />
                  <h4
                    className={`${
                      theme === "light" ? "text-black" : "text-gray-100"
                    } text-lg font-semibold`}
                  >
                    {selectedUser?.username}
                  </h4>
                </div>
                <button
                  className="sm:hidden bg-[#6B5EDD] px-3 py-1 rounded-lg text-white"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                  {sidebarOpen ? "Close" : "Chats"}
                </button>
              </div>
              <div
                ref={chatContainerRef}
                className={`${
                  theme === "light" ? "text-[#0A1C2B] bg-gray-200" : "text-gray-100 bg-[#101b2d]"
                } flex-1 p-4 overflow-y-auto space-y-4 max-h-[calc(100vh-140px)] scroll-smooth`}
              >
                {isFetchingMessages && page > 1 && (
                  <div className="text-center text-gray-400 text-sm">Loading older messages...</div>
                )}
                {messages.length > 0 ? (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex items-end gap-2 ${
                        msg.senderId === userId ? "justify-end" : "justify-start"
                      }`}
                    >
                      {msg.senderId !== userId && (
                        <img
                          src={findProfileImage(msg?.senderId)}
                          className="bg-white rounded-full h-8 w-8"
                          alt="avatar"
                        />
                      )}
                      <div
                        className={`px-4 py-2 rounded-2xl max-w-xs text-sm text-white shadow-md ${
                          msg.senderId === userId ? "bg-[#6B5EDD] rounded-br-none" : "bg-gray-800 rounded-bl-none"
                        }`}
                      >
                        {msg.content}
                        <div className="text-xs text-gray-400 mt-1">
                          {msg.createdAt && formatTimestamp(msg?.createdAt)}
                        </div>
                      </div>
                      {msg.senderId === userId && (
                        <img
                          src={findProfileImage(msg?.senderId)}
                          className="bg-white rounded-full h-8 w-8"
                          alt="avatar"
                        />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center text-center h-full text-gray-400">
                    <img
                      src={findProfileImage(selectedUser?.id)}
                      className="bg-white rounded-full h-20 w-20 mb-3"
                      alt=""
                    />
                    <p className="text-white text-lg">No messages yet</p>
                    <p>Start the conversation 🎉</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              {showScrollButton && (
                <button
                  onClick={scrollToBottom}
                  className="absolute bottom-16 right-4 bg-[#6B5EDD] p-2 rounded-full shadow-md hover:bg-[#5a4dd3] transition"
                >
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </button>
              )}
              <div
                className={`${
                  theme === "light" ? "text-[#0A1C2B] bg-gray-200" : "text-gray-100 bg-[#101b2d]"
                } p-3 flex items-center gap-2 border-t border-gray-700 sticky bottom-0`}
              >
                <textarea
                  className="flex-1 rounded-lg p-2 text-sm bg-white text-black resize-none focus:outline-none h-10"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  onClick={handleSend}
                  className="bg-[#6B5EDD] p-2 rounded-lg hover:bg-[#5a4dd3] transition disabled:opacity-50"
                  disabled={!newMessage.trim()}
                >
                  <img src={send} className="w-5 h-5" alt="send" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-300">
              <h2 className="text-white text-2xl font-semibold mb-2">Welcome 👋</h2>
              <p>Select a friend from the sidebar to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;