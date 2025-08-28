import React, { useState } from 'react'
import Header from './ui/Header'
import user from '../assets/whiteUser.png'
import messenger from '../assets/messenger.png'
import Footer from './ui/Footer'
import conversation from '../assets/conversation.png'
import Chat from './Chat' // ✅ import Chat component

export const Community = () => {
  const [openChat, setOpenChat] = useState(false) // ✅ modal state

  return (
    <div className="bg-[#0D0056] min-h-screen flex flex-col relative">
        {!openChat && <Header />}


      {/* Title */}
      <h1 className="text-center text-white mt-6 font-bold text-2xl md:text-3xl">
        Community
      </h1>
      <h5 className="text-white ml-6 md:ml-16 mt-10 font-bold text-lg">
        Need help?
      </h5>

      {/* Cards Section */}
      <div className="flex flex-col md:flex-row flex-wrap justify-center items-center m-6 md:m-16 gap-6 md:gap-12">
        {[1, 2, 3].map((_, i) => (
          <div
            key={i}
            className="text-white bg-[#6B5EDD] flex flex-col w-full sm:w-[80%] md:w-[30%] p-6 md:p-8 rounded-xl shadow-md"
          >
            {/* Profile Image */}
            <div className="bg-[#0A1C2B] rounded-full w-[120px] h-[120px] mx-auto">
              <img
                src={user}
                alt="profile"
                className="mx-auto object-cover rounded-full h-[120px] w-[120px]"
              />
            </div>

            {/* Info */}
            <div className="flex flex-col mt-4 mb-4">
              <span className="text-center">Nshuti Christian</span>
              <span className="text-center text-sm">Teacher</span>
            </div>

            {/* Messenger Icon */}
            <div>
              <img
                src={messenger}
                alt="chat"
                className="w-10 mx-auto cursor-pointer hover:scale-110 transition"
                onClick={() => setOpenChat(true)} // ✅ open modal
              />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="text-white font-semibold flex flex-row mx-auto my-6 justify-around gap-3">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="bg-[#19179B] px-3 py-1 rounded-md cursor-pointer hover:bg-[#2a28d4] transition"
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
        />
        <button className="bg-[#6B5EDD] hover:bg-[#2a28d4] w-1/2 md:w-1/6 mx-auto p-3 rounded-lg font-semibold transition">
          Send
        </button>
      </div>

      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <img
          src={conversation}
          alt="chat"
          className="w-14 h-14 cursor-pointer hover:scale-110 transition  p-2"
          onClick={() => setOpenChat(true)} // ✅ open modal
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
            <Chat />
          </div>
        </div>
      )}
    </div>
  )
}

export default Community
