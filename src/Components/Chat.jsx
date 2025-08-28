import React, { useEffect, useState } from "react";
import user from "../assets/user.png";
import send from "../assets/send.png";
import { useGetUsersQuery } from "../redux/api/AdminSlice";
import { useGetCurrentUserQuery } from "../redux/api/userSlice";

export const Chat = (props) => {
  const { userId } = props;

  const { data: friends = [] } = useGetUsersQuery();
  const { data: frnd } = useGetCurrentUserQuery(userId);

  // Use first friend as default if no userId
  const initialUser =
    userId && friends.length
      ? friends.find((u) => u.id === userId) || friends[0]
      : friends[0];

  const [selectedUser, setSelectedUser] = useState(initialUser || {});
  const [messages, setMessages] = useState({
    1: [
      { id: 1, text: "Hello Christian!", sender: "them" },
      { id: 2, text: "Hey! How are you?", sender: "me" },
    ],
    2: [
      { id: 1, text: "Yo John 👋", sender: "me" },
      { id: 2, text: "Hey there!", sender: "them" },
    ],
    3: [
      { id: 1, text: "Hi Jane!", sender: "me" },
      { id: 2, text: "Hi, long time!", sender: "them" },
    ],
  });
  const [newMessage, setNewMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (userId && friends.length) {
      const found = friends.find((u) => u.id === userId);
      setSelectedUser(found || friends[0]);
    } else if (friends.length) {
      setSelectedUser(friends[0]);
    }
  }, [userId, friends]);

  const handleSend = () => {
    if (!newMessage.trim() || !selectedUser?.id) return;
    const newMsg = { id: Date.now(), text: newMessage, sender: "me" };
    setMessages({
      ...messages,
      [selectedUser.id]: [...(messages[selectedUser.id] || []), newMsg],
    });
    setNewMessage("");
  };

  if (!friends.length) {
    return (
      <div className="flex items-center justify-center h-full text-white">
        No users available for chat.
      </div>
    );
  }

  return (
    <div className="bg-[#0D0056] h-full flex flex-col">
      <div className="w-full h-full mx-auto flex flex-col sm:flex-row bg-[#0A1C2B] rounded-lg shadow-lg overflow-hidden">
        {/* Sidebar */}
        <div
          className={`${
            sidebarOpen ? "block" : "hidden"
          } sm:block w-full sm:w-1/4 bg-[#1a2b3c] text-white p-4 space-y-3 border-r border-gray-700`}
        >
          <h3 className="font-bold text-lg mb-4">Chats</h3>
          {friends.map((u) => (
            <div
              key={u.id}
              onClick={() => {
                setSelectedUser(u);
                setSidebarOpen(false);
              }}
              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition ${
                selectedUser?.id === u.id
                  ? "bg-[#6B5EDD]"
                  : "hover:bg-[#2a3b4c]"
              }`}
            >
              <img
                src={!u?.photo ? user : u?.photo}
                className="bg-white rounded-full h-[40px] w-[40px]"
                alt={u.username}
              />
              <span className="truncate text-lg font-medium">{u.username}</span>
            </div>
          ))}
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between gap-4 p-4 border-b border-gray-700">
            <div className="flex items-center gap-4">
              <img
                src={selectedUser?.photo ? selectedUser?.photo : user}
                className="bg-white rounded-full h-[50px] w-[50px] sm:h-[60px] sm:w-[60px]"
                alt={selectedUser?.username}
              />
              <h4 className="text-white text-lg sm:text-xl font-semibold">
                {selectedUser?.username || "General Chat"}
              </h4>
            </div>
            {/* Toggle button (mobile only) */}
            <button
              className="sm:hidden bg-[#6B5EDD] px-3 py-1 rounded-lg text-white"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? "Close" : "Chats"}
            </button>
          </div>

          {/* Messages */}
          <div className="bg-[#6B5EDD] flex-1 p-3 sm:p-5 overflow-y-auto space-y-4">
            {(messages[selectedUser?.id] || []).map((msg) => (
              <div
                key={msg.id}
                className={`flex items-end gap-2 sm:gap-3 ${
                  msg.sender === "me" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "them" && (
                  <img
                    src={selectedUser?.photo ? selectedUser?.photo : user}
                    className="bg-white rounded-full h-[30px] w-[30px] sm:h-[40px] sm:w-[40px]"
                    alt="avatar"
                  />
                )}
                <div
                  className={`px-3 py-2 rounded-lg max-w-[75%] sm:max-w-xs text-white text-sm sm:text-base ${
                    msg.sender === "me"
                      ? "bg-black rounded-br-none"
                      : "bg-gray-900 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
                {msg.sender === "me" && (
                  <img
                    src={user}
                    className="bg-white rounded-full h-[30px] w-[30px] sm:h-[40px] sm:w-[40px]"
                    alt="avatar"
                  />
                )}
              </div>
            ))}
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
                <img src={send} className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px]" alt="send" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;