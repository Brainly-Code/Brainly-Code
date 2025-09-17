import { Link } from "react-router-dom";
import BrainlyCodeIcon from "./BrainlyCodeIcon";
import Introductory from "./ui/Introductory";
import TextGenerateEffect from "./ui/TextGenerate";
import { FaArrowRight } from "react-icons/fa";
import Footer from "./ui/Footer";
import { motion } from "framer-motion";
import { Button } from "./ui/Button";
import { useGetCoursesQuery } from "../redux/api/coursesSlice";
import Loader from "./ui/Loader";
import { toast } from "react-toastify";

export const Hero = () => {
  const navItems = [
    { name: "Home", link: "/", icon: "🏠" },
    { name: "Courses", link: "/", icon: "📚" },
    { name: "Playground", link: "/playground", icon: "🎮" },
    { name: "Challenges", link: "/challenges", icon: "🏆" },
  ];

  const {data: courses, isLoading, isError} = useGetCoursesQuery();


  if(isLoading) {
    return <Loader />
  }

  if(isError) {
    toast.error("Sorry Cannot get the courses!")
  }


  return (
    <div className="bg-[#0D0056] text-gray-50 min-h-screen">
      <header className="flex w-full backdrop-blur-xl fixed px-[3rem] flex-wrap justify-between items-center gap-8 py-4">
          {/* Left: Logo */}
          <div className="mt-4 flex-shrink-0">
            <BrainlyCodeIcon className="sm:ml-7" />
          </div>
          <ul className="lg:flex md:flex hidden gap-4 items-center">
            <li className="font-medium text-gray-400 hover:text-gray-200 p-4 hover:underline text-sm">
              <a href={"/#why-b-code"}>About Us</a>
            </li>
            <li className="font-medium text-gray-400 hover:text-gray-200 p-4 hover:underline text-sm">
              <a href={"/#paths"}>Paths</a>
            </li>
            <li className="font-medium text-gray-400 hover:text-gray-200 p-4 hover:underline text-sm">
              <a href={"/user/community"}>Community</a>
            </li>
            <li className="font-medium text-gray-400 hover:text-gray-200 p-4 hover:underline text-sm">
              <a href={"/user/community"}>Contact us</a>
            </li>
          </ul>

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


      {/* Header */} 
      <section id="header" className="max-w-7xl pt-[3rem] mx-auto">
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
          {courses?.map((course, index) => (
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
                <h3 className="text-lg font-bold mt-4">{course?.title}</h3>
                <p className="text-sm mt-2">{course?.description}</p>
                <div className="flex justify-between mt-5 text-sm">
                  <div>
                    <p>{course?.modules?.length || "10+ courses"}</p>
                    <p>& lessons</p>
                  </div>
                  <Link to="/user/courses" className="flex items-center gap-2">
                    <button className="bg-gradient-to-l flex items-center gap-2 from-[#8F57EF] w-[10rem] to-[#00FFFF] pl-6 py-3 rounded-full hover:opacity-90 transition text-sm sm:text-base">
                      View Course
                      <FaArrowRight size={18} className="" />
                    </button>
                  </Link>
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

      <section className="container mx-auto py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.03] p-8 md:p-12 backdrop-blur"
      >
        <div className="absolute -top-16 -left-16 h-64 w-64 rounded-full bg-gradient-to-r from-cyan-500/30 to-violet-500/30 blur-3xl" />
        <div className="absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-gradient-to-r from-fuchsia-500/30 to-violet-500/30 blur-3xl" />
        <div className="relative z-10">
          <h3 className="text-2xl md:text-3xl font-bold text-white">Ready to start your coding journey?</h3>
          <p className="mt-2 max-w-2xl text-white/70">Join thousands of learners building real projects with BrainlyCode. New lessons every week and a friendly community to support you.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg" className="hover:bg-gradient-to-l hover:from-[#8F57EF] hover:to-[#00FFFF] rounded-full text-white animate-shimmer">
              <Link to="/login">Create Free Account</Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
              <Link to="user/community">Join the Community</Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};
