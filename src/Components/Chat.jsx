

import React, { useEffect, useState,useRef } from "react";
import { socket } from "../socket.ts"; // your socket instance
import userAvatar from "../assets/user.png";
import send from "../assets/send.png";
import {
  useGetMessagesQuery,
  useSendMessageMutation,
} from "../redux/api/messageSlice";
import { useGetUsersQuery } from "../redux/api/AdminSlice.jsx";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";

export const Chat = () => {
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {data: users = [], isLoading, error} = useGetUsersQuery();
  const { userInfo } = useSelector((state) => state.auth);
  const token = jwtDecode(userInfo.access_token);
  const userId = token.sub;

  const filteredUsers = users.filter(u => u.id !== userId);
  
  const [selectedUser, setSelectedUser] = useState(
    filteredUsers.length > 0 ? filteredUsers[0] : null
  );

  useEffect(() => {
  if (messagesEndRef.current) {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Auto-select first user when users load 
  useEffect(() => {
    if (!selectedUser && users.length > 0) {
      setSelectedUser(filteredUsers[0]);
    }
  }, [users, selectedUser]);
  // RTK Query: fetch messages between currentUser and selectedUser
  const { data: fetchedMessages, refetch } = useGetMessagesQuery(
    selectedUser
      ? { userId:selectedUser.id, otherUserId: userId }
      : { userId: null, otherUserId: null },
    { skip: !selectedUser }
  );

  const [sendMessage] = useSendMessageMutation();

  // Update messages when fetched from RTK Query
  useEffect(() => {
    if (fetchedMessages) setMessages(fetchedMessages);
  }, [fetchedMessages]);


  // Join socket room and listen for new messages
  useEffect(() => {
    if (!selectedUser) return;

    const roomId = [userId, selectedUser.id].sort().join("-");
    socket.emit("joinRoom", roomId);

    const handleNewMessage = (msg) => {
      if (
        (msg.senderId === userId && msg.receiverId === selectedUser.id) ||
        (msg.senderId === selectedUser.id && msg.receiverId === userId)
      ) {
        setMessages((prev) => [...prev, msg]);
        refetch(); // optional: refetch RTK Query cache
      }
    };

    socket.on("newDM", handleNewMessage);
    return () => socket.off("newDM", handleNewMessage);
  }, [selectedUser, userId, refetch]);

  console.log(selectedUser)

const handleSend = async () => {
  if (!newMessage.trim() || !selectedUser) return;

    const msgData = {
      senderId: userId,
      receiverId: selectedUser.id,
      content: newMessage,
      type: "text",
    };

    // Emit via socket
    socket.emit("sendDM", msgData);

    // Persist using RTK mutation
    await sendMessage(msgData);
    console.log("message sent")

    setNewMessage("");
  };

  return (
    <div className="bg-[#0D0056] h-full flex flex-col">
      <div className="flex flex-col sm:flex-row h-full w-full bg-[#0A1C2B] rounded-lg shadow-lg overflow-hidden">
        {/* Sidebar */}
        <div
          className={`${
            sidebarOpen ? "block" : "hidden"
          } sm:block w-full sm:w-1/4 bg-[#1a2b3c] text-white p-4 space-y-3 border-r border-gray-700 h-[calc(100vh-2rem)] overflow-y-auto`}
        >
          <h3 className="font-bold text-lg mb-4">Chats</h3>
          {filteredUsers.map((u) => (
            <div
              key={u.id}
              onClick={() => {
                setSelectedUser(u);
                setSidebarOpen(false);
              }}
              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition ${
                selectedUser?.id === u.id ? "bg-[#6B5EDD]" : "hover:bg-[#2a3b4c]"
              }`}
            >
              <img
                src={u.avatar || userAvatar}
                className="bg-white rounded-full h-[40px] w-[40px]"
                alt={u.username}
              />
              <span className="truncate">{u.username}</span>
            </div>
          ))}
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
          {/* Header */} 
          <div className="flex items-center justify-between gap-4 p-4 border-b border-gray-700 flex-shrink-0">
            <div className="flex items-center gap-4">
              <img
                src={selectedUser?.avatar || userAvatar}
                className="bg-white rounded-full h-[50px] w-[50px] sm:h-[60px] sm:w-[60px]"
                alt={selectedUser?.username}
              />
              <h4 className="text-white text-lg sm:text-xl font-semibold">
                {selectedUser?.username || "Select a chat"}
              </h4>
            </div>

            {/* Toggle sidebar on mobile */}
            <button
              className="sm:hidden bg-[#6B5EDD] px-3 py-1 rounded-lg text-white"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? "Close" : "Chats"}
            </button>
          </div>

          {/* Messages */}
          <div className="bg-[#6B5EDD] bg-opacity-60 flex-1 p-3 sm:p-5 overflow-y-auto space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-end gap-2 sm:gap-3 ${
                  msg.senderId === userId ? "justify-end" : "justify-start"
                }`}
              >
                {msg.senderId !== userId && (
                  <img
                    src={selectedUser?.avatar || userAvatar}
                    className="bg-white rounded-full h-[30px] w-[30px] sm:h-[40px] sm:w-[40px]"
                    alt="avatar"
                  />
                )}
                <div
                  className={`px-3 py-2 rounded-lg max-w-[75%] sm:max-w-xs text-white text-sm sm:text-base ${
                    msg.senderId === userId
                      ? "bg-black rounded-br-none"
                      : "bg-gray-900 rounded-bl-none"
                  }`}
                >
                  {msg.content}
                </div>
                {msg.senderId === userId && (
                  <img
                    src={userAvatar}
                    className="bg-white rounded-full h-[30px] w-[30px] sm:h-[40px] sm:w-[40px]"
                    alt="avatar"
                  />
                )}
              </div>
            ))}
               <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 sm:p-4 flex justify-center bg-[#6B5EDD]">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <textarea
                className="flex-1 sm:w-72 h-10 sm:h-12 rounded-lg p-2 text-sm sm:text-base focus:outline-none resize-none bg-white text-black"
                placeholder="Type something..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  !e.shiftKey &&
                  (e.preventDefault(), handleSend())
                }
              />
              <button
                onClick={handleSend}
                className="bg-white p-2 sm:p-3 rounded-lg hover:bg-gray-200 transition"
              >
                <img
                  src={send}
                  className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px]"
                  alt="send"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;