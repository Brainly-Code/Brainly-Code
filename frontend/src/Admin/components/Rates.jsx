import React from "react";
import { Link } from "react-router-dom";
import { FaJs,FaReact,FaNodeJs,FaPython,FaHtml5,FaAccessibleIcon } from "react-icons/fa";

const courses = [
  {
    id:"1",
    level: "BEGGINER",
    title: "Web Development using python",
    description:
      "Learn HTML, CSS, and JavaScript fundamentals through interactive lessons.",
    modules: "0",
    lessons: "0",
    viewers: "20",
    completions:"10",
    likes:"20"
  },
  {
    id:"1",
    level: "BEGGINER",
    title: "Web Development using js",
    description:
      "Learn HTML, CSS, and JavaScript fundamentals through interactive lessons.",
    modules: "0",
    lessons: "0",
    viewers: "20",
    completions:"20",
    likes:"20"
  },

];

const getIconForCourse = (title) => {
    const key = title.toLowerCase();
    if (key.includes("js")) return <FaJs color="orange" size={30} />;
    if (key.includes("react")) return <FaReact color="blue" size={30} />;
    if (key.includes("node")) return <FaNodeJs color="green" size={30} />;
    if (key.includes("python")) return <FaPython color="green" size={30} />;
    if (key.includes("html") || key.includes("css")) return <FaHtml5 color="red" size={30} />;
    if (key.includes("data structure") || key.includes("algorithm"))
      return <FaAccessibleIcon color="purple" size={30} />;
    return <FaAccessibleIcon color="gray" size={30} />; // Default icon
  };
const challenges = [
  {
    id: "1",
    difficulty: "Easy",
    title: "Palindrome Checker",
    description:
      "Write a function to check if a string is a palindrome (reads the same forward and backward).",
      likes:"10"
  },
];

const Challenge = () => {
  return (
    <div>
      {/* Most Liked Challenge */}
      <div className="flex w-fullgrid flex-col lg:flex-row  gap-5 ">
        <div className="flex flex-col justify-center h-full">
          <h2 className="text-xl font-semibold mb-4">Most Liked Challenge</h2>

          {challenges?.map((challenge) => (
            <div
              key={challenge._id || challenge.id}
              className="mx-auto max-w-sm bg-[#070045]  rounded-2xl border border-[#3A3A5A] p-6"
            >
              <div className="flex justify-between mb-2">
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    challenge.difficulty === "Easy"
                      ? "bg-[rgba(63,101,58,0.69)] text-[#01FE01]"
                      : challenge.difficulty === "Medium"
                      ? "bg-[rgba(255,208,51,0.57)] text-[#FFA500]"
                      : challenge.difficulty === "Hard"
                      ? "bg-[#F59898] text-[rgba(255,0,0,0.89)]"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {challenge.difficulty}
                </span>
                <span className="text-xs text-gray-300">
                  {challenge.category || "Strings"}
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                {challenge.title}
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                {challenge.description}
              </p>

              <div className="flex justify-between text-xs text-gray-400 mb-4">
                <p>Est. Time: {challenge.estimatedTime || "30 Minutes"}</p>
                <p>{challenge.likes} Likes</p>
                <p>{challenge.completions || "500"} Completions</p>
              </div>

              <button className="py-2 px-2 rounded-md bg-[#06325B]">view</button>
            </div>
          ))}
        </div>
        <div className="flex w-fullgrid flex-col lg:flex-row  gap-5">
        {courses.map(course=>(
          <div key={course._id || course.id} className='h-full'>
            <h1 className="text-xl font-semibold mb-4">Most liked course</h1>
          <div className="mx-auto max-w-sm bg-[#070045] rounded-2xl border border-[#3A3A5A] p-6">
            <div className="flex justify-between items-center mb-4">
              {getIconForCourse(course.title)}
              <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    course.level === "BEGGINER"
                      ? "bg-[rgba(63,101,58,0.69)] text-[#01FE01]"
                      : course.level === "INTERMEDITE"
                      ? "bg-[rgba(255,208,51,0.57)] text-[#FFA500]"
                      : course.level === "ADVANCED"
                      ? "bg-[#F59898] text-[rgba(255,0,0,0.89)]"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {course.level}
                </span>
            </div>

            <h1 className="text-lg sm:text-xl font-bold text-white mb-2">
              {course.title}
            </h1>
            <p className="text-sm text-gray-400 mb-4">{course.description}</p>

            <div className="flex justify-center mt-6">
              
            </div>
            <div className="flex  justify-between text-xs text-gray-400 mb-4">
                <div className="flex justify-start flex-col">
                <p>{course.modules} modules{" "} {course.lessons} lessons </p>
              
              <p>{course.completions || "500"} Completions {course.likes} Likes</p>
                </div>
                <div className="">
                <Link to={`/user/module/${course.id}`}>
                <button className="py-2 px-2 rounded-md bg-[#06325B]"  onClick={()=>navigate(`/user/module/${course.id}`)}>
                  view
                </button>
              </Link>
                </div>
              </div>
          </div>
        </div>
    ))}

        </div>

      </div>
    </div>
  );
};

export default Challenge;
