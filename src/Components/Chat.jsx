import React, { useEffect, useState, useRef } from "react";
import { socket } from "../socket.ts";
import userAvatar from "../assets/user.png";
import send from "../assets/send.png";
import {
  useGetMessagesQuery,
  useSendMessageMutation,
  useGetUnreadCountsQuery,
  useReadMessagesMutation,
} from "../redux/api/messageSlice";
import { useGetUsersQuery } from "../redux/api/AdminSlice.jsx";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { useGetUserByIdQuery } from "../redux/api/userSlice.jsx";

export const Chat = ({ chatWith }) => {
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: users = [] } = useGetUsersQuery();
  const { userInfo } = useSelector((state) => state.auth);
  const token = jwtDecode(userInfo.access_token);
  const userId = token.sub;

  const { data: unreadCounts = [], refetch: refetchUnread } = useGetUnreadCountsQuery(userId);
  const [readMessages] = useReadMessagesMutation();
  const { data: currentUser } = useGetUserByIdQuery(userId);

  const filteredUsers = users.filter((u) => u.id !== userId);
  const [selectedUser, setSelectedUser] = useState(
    chatWith ? chatWith : filteredUsers.length > 0 ? filteredUsers[0] : null
  );

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
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("newDM", handleNewMessage);
    return () => socket.off("newDM", handleNewMessage);
  }, [selectedUser, userId]);

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    const msgData = {
      senderId: userId,
      receiverId: selectedUser.id,
      content: newMessage,
      type: "text",
    };

    socket.emit("sendDM", msgData);
    setNewMessage("");

    await sendMessage(msgData);
    refetch();
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

  return (
    <div className="bg-[#0D0056] h-screen flex">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0 fixed sm:static top-0 left-0 h-full w-64 bg-[#1a2b3c] border-r border-gray-700 text-white p-4 transition-transform duration-300 overflow-y-auto z-20`}
      >
        <h3 className="font-bold text-xl mb-6 text-center">Chats</h3>
        {filteredUsers.map((u) => (
          <div
            key={u.id}
            onClick={() => {
              setSelectedUser(u);
              setSidebarOpen(false);
            }}
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${
              selectedUser?.id === u.id ? "bg-[#6B5EDD]" : "hover:bg-[#2a3b4c]"
            }`}
          >
            <img
              src={u?.photo || userAvatar}
              className="bg-white rounded-full h-10 w-10"
              alt={u.username}
            />
            <span className="truncate">{u.username}</span>
            {getUnreadForUser(u.id) > 0 && selectedUser?.id !== u.id && (
              <span className="ml-auto bg-red-500 text-white rounded-full px-2 text-xs font-bold">
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
            {/* Header */}
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

            {/* Messages */}
            <div className="flex-1 bg-[#101b2d] p-4 overflow-y-auto space-y-4">
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
                        src={selectedUser?.photo || userAvatar}
                        className="bg-white rounded-full h-8 w-8"
                        alt="avatar"
                      />
                    )}
                    <div
                      className={`px-4 py-2 rounded-2xl max-w-xs text-sm text-white shadow-md ${
                        msg.senderId === userId
                          ? "bg-[#6B5EDD] rounded-br-none"
                          : "bg-gray-800 rounded-bl-none"
                      }`}
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

            {/* Input */}
            <div className="p-3 bg-[#0A1C2B] flex items-center gap-2 border-t border-gray-700 sticky bottom-0">
              <textarea
                className="flex-1 rounded-lg p-2 text-sm bg-white text-black resize-none focus:outline-none h-10"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())
                }
              />
              <button
                onClick={handleSend}
                className="bg-[#6B5EDD] p-2 rounded-lg hover:bg-[#5a4dd3] transition"
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
  );
};

export default Chat;
