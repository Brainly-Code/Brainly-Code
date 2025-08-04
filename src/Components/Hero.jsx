import { Link } from "react-router-dom";
import BrainlyCodeIcon from "./BrainlyCodeIcon";
import { FloatingNav } from "./ui/FloatingNav";
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
        <header className="flex flex-wrap border-b-[1px] justify-between items-center gap-4 py-4">
          {/* Left: Logo */}
          <div className="flex-shrink-0">
            <BrainlyCodeIcon className="ml-2 sm:ml-7" />
          </div>

          <ul className="flex gap-4 items-center">
            <li className="font-semibold text-gray-300 text-sm">
              <Link to="/login">
                <button>Login</button>
              </Link>
            </li>
            <li className="font-semibold bg-gradient-to-r from-[#00ffff] to-purple-400 rounded-3xl px-5 py-2 text-gray-900 hover:opacity-90 transition text-sm">
              <Link to="/register">Signup</Link>
            </li>
          </ul>

        </header>

              {/* Hero Section */}
        {/* Hero Section */}
        <div className="flex flex-wrap md:flex-nowrap justify-between items-center gap-8 py-16">

          {/* Introductory Section */}
          <div className="flex-1 min-w-[300px]">
            <Introductory />
          </div>

        {/* TextGenerateEffect Section */}
        <div className="bg-[#121022] rounded-2xl p-4 w-full md:w-auto max-w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl min-h-[300px] sm:min-h-[400px] md:min-h-[500px] flex flex-col">

        <div className="bg-black rounded-xl bg-opacity-30 overflow-x-auto overflow-y-auto flex-grow flex flex-col h-full">

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
                className="text-xs sm:text-sm md:text-base lg:text-lg w-full h-full whitespace-pre-wrap my-[5rem]"
            />
          </div>

        </div>

        </div>
      </section>

      {/* Why Brainly Code */}
      <section id="why-b-code" className="max-w-7xl mx-auto px-6 py-12 text-center">
        <h1 className="text-2xl font-bold">Why Brainly Code?</h1>
        <p className="my-6">
          Our learning platform makes learning to code engaging, interactive, and fun for everyone.
        </p>
        <div className="flex flex-wrap justify-center gap-8 mt-8">
          {["Interactive Learning", "Gamified Practice", "Creative Projects"].map((title, index) => (
            <div key={index} className="bg-[#3D31A7] rounded-xl p-8 max-w-xs">
              <h2 className="text-lg font-bold text-center mb-4">{title}</h2>
              <p className="text-center text-sm">
                Live code editor with real-time feedback. Practice what you learn immediately.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Learning Paths */}
      <section className="max-w-7xl mx-auto px-6 py-12 text-center">
        <h1 className="text-2xl font-bold mb-9">Learning Paths</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
          <button className="bg-gradient-to-l from-[#8F57EF] to-[#00FFFF] px-8 py-3 rounded-full mt-12 hover:opacity-90 transition">
            View All Courses
          </button>
        </Link>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};
