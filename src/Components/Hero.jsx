import { Link } from "react-router-dom";
import BrainlyCodeIcon from "./BrainlyCodeIcon";
import Introductory from "./ui/Introductory";
import TextGenerateEffect from "./ui/TextGenerate";
import { FaArrowRight } from "react-icons/fa";
import Footer from "./ui/Footer";

export const Hero = () => {
  const navItems = [
    { name: "Home", link: "/", icon: "🏠" },
    { name: "Courses", link: "/", icon: "📚" },
    { name: "Playground", link: "/playground", icon: "🎮" },
    { name: "Challenges", link: "/challenges", icon: "🏆" },
  ];

  return (
    <div className="bg-[#070045] text-gray-50 min-h-screen">
      {/* Header */} 
      <section id="header" className="max-w-7xl mx-auto">
      <header className="flex flex-wrap md:flex-nowrap border-b-[1px] justify-between items-center gap-4 py-4 px-4 sm:px-6">
        {/* Logo */}
        <div className="flex-shrink-0">
          <BrainlyCodeIcon className="ml-2 sm:ml-7" />
        </div>

        {/* Buttons */}
        <ul className="flex gap-4 items-center text-sm sm:text-base">
          <li className="font-semibold text-gray-300">
            <Link to="/login"><button>Login</button></Link>
          </li>
          <li className="font-semibold bg-gradient-to-r from-[#00ffff] to-purple-400 rounded-3xl px-4 sm:px-5 py-2 text-gray-900 hover:opacity-90 transition">
            <Link to="/register">Signup</Link>
          </li>
        </ul>
      </header>


              {/* Hero Section */}
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 px-4 sm:px-6 py-12 sm:py-16">
        {/* Intro */}
        <div className="flex-1 min-w-[250px] md:min-w-[300px]">
          <Introductory />
        </div>

        {/* Code Box */}
        <div className="bg-[#121022] rounded-2xl p-4 w-full max-w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl min-h-[250px] sm:min-h-[400px] md:min-h-[500px] flex flex-col">
          <div className="bg-black rounded-xl bg-opacity-30 overflow-auto flex-grow flex flex-col">
            <TextGenerateEffect
               words={` // Welcome to fun
              // function learnToCode() {
                  const skills = ["HTML", "CSS"];
                  const fun = true;
                  if (fun) {
                      return "Learning to code is amazing.";
                  }
              }
              // Start your code
              learnToCode();`}
              className="text-xs sm:text-sm md:text-base lg:text-lg whitespace-pre-wrap my-[2rem] sm:my-[3rem] md:my-[5rem]"
            />
          </div>
        </div>
      </div>

      </section>

      {/* Why Brainly Code */}
      <section id="why-b-code" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 text-center">
        <h1 className="text-xl sm:text-2xl font-bold">Why Brainly Code?</h1>
        <p className="my-6 text-sm sm:text-base">
          Our learning platform makes learning to code engaging, interactive, and fun for everyone.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-8">
          {["Interactive Learning", "Gamified Practice", "Creative Projects"].map((title, index) => (
            <div key={index} className="bg-[#3D31A7] rounded-xl p-6 sm:p-8">
              <h2 className="text-base sm:text-lg font-bold mb-3">{title}</h2>
              <p className="text-xs sm:text-sm">
                Live code editor with real-time feedback. Practice what you learn immediately.
              </p>
            </div>
          ))}
        </div>
      </section>


      {/* Learning Paths */}
      <section className="max-w-7xl mx-auto px-6 py-12 text-center">
      <h1 className="text-xl sm:text-2xl font-bold mb-9">Learning Paths</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="rounded-md bg-gradient-to-r from-green-800 to-purple-950 w-64 h-44 flex justify-center items-center">
                <div className="rounded-full bg-blue-900 w-16 h-16 flex items-center justify-center">
                  <p className="font-bold text-lg">{"</>"}</p>
                </div>
              </div>
              <div className="bg-[#120b46] rounded-xl -mt-10 p-6 w-72">
                <span className="text-sm font-bold text-[#00CED1] bg-[#00CED1] bg-opacity-70 px-3 py-1 rounded-full">
                  Beginner
                </span>
                <h3 className="text-lg font-bold mt-4">Web Development Basics</h3>
                <p className="text-sm mt-2">Learn HTML, CSS, and JavaScript fundamentals through interactive lessons.</p>
                <div className="flex justify-between mt-5 text-sm">
                  <div>
                    <p>8 modules</p>
                    <p>8 lessons</p>
                  </div>
                  <button className="text-[#00ffee] flex items-center gap-2">
                    View Course
                    <FaArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>


      <Link to="/login">
        <button className="bg-gradient-to-l from-[#8F57EF] to-[#00FFFF] px-6 sm:px-8 py-2 sm:py-3 rounded-full mt-8 sm:mt-12 hover:opacity-90 transition text-sm sm:text-base">
          View All Courses
        </button>
      </Link>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};
