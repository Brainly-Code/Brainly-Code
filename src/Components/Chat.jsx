import React, { useEffect, useState, useRef } from "react";
import { socket } from "../socket"; // Update extension if needed
import userAvatar from "../assets/user.png";
import send from "../assets/send.png";
import {
  useGetMessagesQuery,
  useSendMessageMutation,
  useGetUnreadCountsQuery,
  useReadMessagesMutation,
} from "../redux/api/messageSlice";
import { useGetUsersQuery } from "../redux/api/AdminSlice";
import { useGetUserByIdQuery } from "../redux/api/userSlice";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";

export const Chat = ({ chatWith }) => { // Add chatWith as a prop
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: users = [], isLoading: usersLoading } = useGetUsersQuery();
  const { userInfo } = useSelector((state) => state.auth);
  const token = jwtDecode(userInfo.access_token);
  const userId = token.sub;

  const { data: unreadCounts = [], refetch: refetchUnread } = useGetUnreadCountsQuery(userId);
  const [readMessages] = useReadMessagesMutation();
  const { data: currentUser, isLoading: currentUserLoading } = useGetUserByIdQuery(userId);

  const filteredUsers = users.filter((u) => u.id !== userId);
  const [selectedUser, setSelectedUser] = useState(chatWith || (filteredUsers.length > 0 ? filteredUsers[0] : null));

  useEffect(() => {
    if (chatWith) setSelectedUser(chatWith);
  }, [chatWith]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const { data: fetchedMessages, refetch } = useGetMessagesQuery(
    selectedUser ? { userId: selectedUser.id, otherUserId: userId } : { userId: null, otherUserId: null },
    { skip: !selectedUser }
  );

  const [sendMessage] = useSendMessageMutation();

  useEffect(() => {
    if (fetchedMessages) {
      setMessages(fetchedMessages);
    } else {
      setMessages([]);
    }
  }, [fetchedMessages]);

  useEffect(() => {
    if (!selectedUser) return;
    const roomId = [userId, selectedUser.id].sort().join("-");
    socket.emit("joinRoom", roomId);

    const handleNewMessage = (msg) => {
      if (
        (msg.senderId === userId && msg.receiverId === selectedUser.id) ||
        (msg.senderId === selectedUser.id && msg.receiverId === userId)
      ) {
        setMessages((prev) => {
          // Avoid duplicates by checking if message already exists
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
      }
    };

    socket.on("newDM", handleNewMessage);
    return () => {
      socket.emit("leaveRoom", roomId); // Clean up room
      socket.off("newDM", handleNewMessage);
    };
  }, [selectedUser, userId]);

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    const msgData = {
      senderId: userId,
      receiverId: selectedUser.id,
      content: newMessage.trim(),
      type: "text",
    };

    socket.emit("sendDM", msgData);
    setNewMessage("");
    await sendMessage(msgData);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (newMessage.trim()) handleSend();
    }
  };

  useEffect(() => {
    if (selectedUser) {
      readMessages({ userId, otherUserId: selectedUser.id }).then(() => {
        refetchUnread();
      });
    }
  }, [selectedUser, userId, readMessages, refetchUnread]);

  const getUnreadForUser = (uid) => {
    const found = unreadCounts.find((u) => u.senderId === uid);
    return found ? found._count.id : 0;
  };

  // Close sidebar on outside click (for mobile)
  const sidebarRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (usersLoading || currentUserLoading) {
    return <div className="text-white text-center">Loading...</div>;
  }

  return (
    <div className="bg-[#0D0056] h-full flex flex-col">
      <div className="flex flex-col sm:flex-row h-full w-full bg-[#0A1C2B] rounded-lg shadow-lg overflow-hidden">
        {/* Sidebar */}
        <div
          ref={sidebarRef}
          className={`${sidebarOpen ? "block" : "hidden"} sm:block w-full sm:w-1/4 bg-[#1a2b3c] text-white p-4 space-y-3 border-r border-gray-700 h-[calc(100vh-2rem)] overflow-y-auto`}
        >
          <h3 className="font-bold pt-12 pl-[35%] text-lg">Chats</h3>
          {filteredUsers.map((u) => (
            <div
              key={u.id}
              onClick={() => {
                setSelectedUser(u);
                setSidebarOpen(false);
              }}
              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition ${selectedUser?.id === u.id ? "bg-[#6B5EDD]" : "hover:bg-[#2a3b4c]"}`}
            >
              <img
                src={u?.photo || userAvatar}
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
        <div className="flex-1 flex flex-col">
          {selectedUser ? (
            <>
              <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-[#0A1C2B] sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedUser?.photo || userAvatar}
                    className="bg-white rounded-full h-12 w-12"
                    alt={selectedUser?.username}
                  />
                  <h4 className="text-white text-lg font-semibold">{selectedUser?.username}</h4>
                </div>
                <button
                  className="sm:hidden bg-[#6B5EDD] px-3 py-1 rounded-lg text-white"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                  {sidebarOpen ? "Close" : "Chats"}
                </button>
              </div>
              <div className="flex-1 bg-[#101b2d] p-4 overflow-y-auto space-y-4">
                {messages.length > 0 ? (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex items-end gap-2 ${msg.senderId === userId ? "justify-end" : "justify-start"}`}
                    >
                      {msg.senderId !== userId && (
                        <img
                          src={selectedUser?.photo || userAvatar}
                          className="bg-white rounded-full h-8 w-8"
                          alt="avatar"
                        />
                      )}
                      <div
                        className={`px-4 py-2 rounded-2xl max-w-xs text-sm text-white shadow-md ${msg.senderId === userId ? "bg-[#6B5EDD] rounded-br-none" : "bg-gray-800 rounded-bl-none"}`}
                      >
                        {msg.content}
                      </div>
                      {msg.senderId === userId && (
                        <img
                          src={currentUser?.photo || userAvatar}
                          className="bg-white rounded-full h-8 w-8"
                          alt="avatar"
                        />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center text-center h-full text-gray-400">
                    <img
                      src={selectedUser?.photo || userAvatar}
                      className="bg-white rounded-full h-20 w-20 mb-3"
                      alt=""
                    />
                    <p className="text-white text-lg">No messages yet</p>
                    <p>Start the conversation 🎉</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              <div className="p-3 bg-[#0A1C2B] flex items-center gap-2 border-t border-gray-700 sticky bottom-0">
                <textarea
                  className="flex-1 rounded-lg p-2 text-sm bg-white text-black resize-none focus:outline-none h-10"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  onClick={handleSend}
                  className="bg-[#6B5EDD] p-2 rounded-lg hover:bg-[#5a4dd3] transition"
                  disabled={!newMessage.trim()}
                >
                  <img src={send} className="w-5 h-5" alt="send" />
                </button>
              </div>
            </>
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