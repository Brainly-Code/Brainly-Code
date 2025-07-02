import { Link } from "react-router-dom";
import BrainlyCodeIcon from "./BrainlyCodeIcon";
import { FloatingNav } from "./ui/FloatingNav";
import Introductory from "./ui/Introductory";
import TextGenerateEffect from "./ui/TextGenerate";
// import Loader from "./ui/Loader";
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
    <div className="bg-[#070045] text-gray-50 p-7 w-full">
      <section id="header" className="">
        <header className="flex text-white justify-between">
          <FloatingNav navItems={navItems} />
          <BrainlyCodeIcon className="ml-7"/>
          <ul className="ml-auto">
            <li className="font-semibold inline text-gray-300">
                <Link to="/login">
                  <button>Login</button>
                </Link>
            </li>
            <li className="font-semibold inline bg-gradient-to-r from-[#00ffff] rounded-md ml-5 to-purple-400 px-5 py-2 text-gray-300">
              <Link to="/register">Signup</Link>
            </li>
          </ul>
        </header>

        <div className="w-[70rem] flex">
          <Introductory />
          <div className="m-[3rem]  inline rounded-md bg-[#0b0c33] w-[30rem] grid-cols-2 p-4">
            <div className='bg-[#121022] rounded-md p-4'>
              <div className='inline bg-[#36368b] rounded  '>
                <TextGenerateEffect words={` // Welcome to fun
                // function learnToCode() {
            
                    const skills = ["HTML", "CSS"];
            
                    const fun = true;
            
                    if (fun) {
                return "Learning to code is amazing.";
            
                    }
                }
            
                // Start your code
            
                learnToCode();`} className={"bg-black text-sm w-[40rem] h-[10rem]"} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="items-center" id="why-b-code">
         <div className="">
           <h1 className="text-center text-2xl font-bold">Why Brainly Code</h1>
           <p className="text-center my-6">Our learning platform makes learning to code  engaging, interactive and fun for everyone.</p>
           <div className="container flex">
            <div className="rounded-xl bg-[#3D31A7] ml-[2rem] mr-[3rem] w-[20rem] p-6">
              <h2 className=" text-md font-bold text-center mt-11 mb-6 ">Interactive Learning</h2>
              <p className="text-center text-xs">Live code editor with real-time  
                    feedback. Practice what you 
                   learn immediately.
              </p>
            </div>
            <div className="rounded-xl bg-[#3D31A7] ml-[2rem] mr-[3rem] w-[20rem] p-6">
              <h2 className=" text-md font-bold text-center mt-11 mb-6 ">Interactive Learning</h2>
              <p className="text-center text-xs">Live code editor with real-time  
                feedback. Practice what you 
                learn immediately.
              </p>
            </div>
            <div className="rounded-xl bg-[#3D31A7] ml-[2rem] mr-[3rem] w-[20rem] p-6">
              <h2 className=" text-md font-bold text-center mt-11 mb-6 ">Interactive Learning</h2>
              <p className="text-center text-xs">Live code editor with real-time  
                feedback. Practice what you 
                learn immediately.
              </p>
            </div>
           </div>
         </div>

      </section>

      <section>
        <div>
          <h1 className="text-2xl my-9 text-center  font-bold">Learning Paths</h1>
          <div className="grid grid-cols-3">
            <div className="grid grid-rows-2 w-[10%]">
              <div className="rounded-md bg-gradient-to-r block from-green-800 pt-2 pl- to-purple-950 w-[16rem] ml-[4rem] h-[10rem]">
                <div className="rounded-full mx-auto items-center bg-blue-900 mt-[2rem] w-[4rem] h-[4rem] ">
                  <p className="items-center ml-4 font-bold text-lg">{"</>"}</p>
                </div>
              </div>
              <div className="rounded-xl bg-[#120b46] block h-[18rem] p-[1.5rem] ml-[2rem] -mt-20 w-[20rem]">
                  <span className="text-xl mx-auto font-bold text-[#00CED1] bg-[#00CED1] p-2 bg-opacity-70 rounded-full">Begginer</span>
                  <div className="mt-7">
                    <h3 className="text-sm mb-5 font-bold">Web Development Basics</h3>
              
                    <p className="w-[9rem] text-sm ">
                      Learn HTML,CSS and
                      JavaScript fundamentals
                      through interactive lessons.</p>
                   <div className="mt-5 flex">
                    <div className="text-sm justify-start w-[7rem]">
                      <p>8 modules</p>
                      <p>8 lessons</p>
                    </div>
                    <div>
                      <button className="text-[#00ffee]">
                        View Course
                        <FaArrowRight style={{color: "#00ffee", display: "inline", marginLeft: "1rem",}} size={28} />
                      </button>
                    </div>
                   </div>
                  </div>
              </div>
              </div>
            <div className="grid grid-rows-2 w-[10%]">
              <div className="rounded-md bg-gradient-to-r block from-green-800 pt-2 pl- to-purple-950 w-[16rem] ml-[4rem] h-[10rem]">
                <div className="rounded-full mx-auto items-center bg-blue-900 mt-[2rem] w-[4rem] h-[4rem] ">
                  <p className="items-center ml-4 font-bold text-lg">{"</>"}</p>
                </div>
              </div>
              <div className="rounded-xl bg-[#120b46] block h-[18rem] p-[1.5rem] ml-[2rem] -mt-20 w-[20rem]">
                  <span className="text-xl mx-auto font-bold text-[#00CED1] bg-[#00CED1] p-2 bg-opacity-70 rounded-full">Begginer</span>
                  <div className="mt-7">
                    <h3 className="text-sm mb-5 font-bold">Web Development Basics</h3>
              
                    <p className="w-[9rem] text-sm ">
                      Learn HTML,CSS and
                      JavaScript fundamentals
                      through interactive lessons.</p>
                   <div className="mt-5 flex">
                    <div className="text-sm justify-start w-[7rem]">
                      <p>8 modules</p>
                      <p>8 lessons</p>
                    </div>
                    <div>
                      <button className="text-[#00ffee]">
                        View Course
                        <FaArrowRight style={{color: "#00ffee", display: "inline", marginLeft: "1rem",}} size={28} />
                      </button>
                    </div>
                   </div>
                  </div>
              </div>
              </div>
            <div className="grid grid-rows-2 w-[10%]">
              <div className="rounded-md bg-gradient-to-r block from-green-800 pt-2 pl- to-purple-950 w-[16rem] ml-[4rem] h-[10rem]">
                <div className="rounded-full mx-auto items-center bg-blue-900 mt-[2rem] w-[4rem] h-[4rem] ">
                  <p className="items-center ml-4 font-bold text-lg">{"</>"}</p>
                </div>
              </div>
              <div className="rounded-xl bg-[#120b46] block h-[18rem] p-[1.5rem] ml-[2rem] -mt-20 w-[20rem]">
                  <span className="text-xl mx-auto font-bold text-[#00CED1] bg-[#00CED1] p-2 bg-opacity-70 rounded-full">Begginer</span>
                  <div className="mt-7">
                    <h3 className="text-sm mb-5 font-bold">Web Development Basics</h3>
              
                    <p className="w-[9rem] text-sm ">
                      Learn HTML,CSS and
                      JavaScript fundamentals
                      through interactive lessons.</p>
                   <div className="mt-5 flex">
                    <div className="text-sm justify-start w-[7rem]">
                      <p>8 modules</p>
                      <p>8 lessons</p>
                    </div>
                    <div>
                      <button className="text-[#00ffee]">
                        View Course
                        <FaArrowRight style={{color: "#00ffee", display: "inline", marginLeft: "1rem",}} size={28} />
                      </button>
                    </div>
                   </div>
                  </div>
              </div>
              </div>
              </div>
            </div>
            <Link to="/login">
            <button className="bg-blue-400 px-8 hover:bg-gradient-to-l hover:from-blue-700 hover:to-blue-500 bg-gradient-to-l to-[#00FFFF] rounded-full ml-[40%] mt-[2rem] from-[#8F57EF] py-2">View All Courses</button>
            </Link>
      </section>

      <Footer />
    </div>
  )
}


