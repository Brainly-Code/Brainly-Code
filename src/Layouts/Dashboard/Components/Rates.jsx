import React from "react";
import { Link, Navigate } from "react-router-dom";
import {
  FaJs,
  FaReact,
  FaNodeJs,
  FaPython,
  FaHtml5,
  FaAccessibleIcon,
} from "react-icons/fa";
import { useGetChallengesQuery } from "../../../redux/api/challengeSlice";
import { useGetCoursesQuery } from "../../../redux/api/coursesSlice";

// const Rates = { 
//   courses: [
//     {
//       id: "1",
//       context: "watched",
//       level: "BEGGINER",
//       title: "Web Development using python",
//       description:
//         "Learn HTML, CSS, and JavaScript fundamentals through interactive lessons.",
//       modules: "0",
//       lessons: "0",
//       viewers: "20",
//       completions: "10",
//       likes: "20",
//     },
//     {
//       id: "2",
//       context: "liked",
//       level: "INTERMEDIATE",
//       title: "Web Development using js",
//       description:
//         "Learn HTML, CSS, and JavaScript fundamentals through interactive lessons.",
//       modules: "0",
//       lessons: "0",
//       viewers: "20",
//       completions: "20",
//       likes: "20",
//     },
//   ],
//   challenge: [
//     {
//       id: "1",
//       difficulty: "Easy",
//       title: "Palindrome Checker",
//       description:
//         "Write a function to check if a string is a palindrome (reads the same forward and backward).",
//       likes: "10",
//     },
//   ],
// };

const getIconForCourse = (title) => {
  const key = title.toLowerCase();
  if (key.includes("js")) return <FaJs color="orange" size={30} />;
  if (key.includes("react")) return <FaReact color="blue" size={30} />;
  if (key.includes("node")) return <FaNodeJs color="green" size={30} />;
  if (key.includes("python")) return <FaPython color="green" size={30} />;
  if (key.includes("html") || key.includes("css"))
    return <FaHtml5 color="red" size={30} />;
  if (key.includes("data structure") || key.includes("algorithm"))
    return <FaAccessibleIcon color="purple" size={30} />;
  return <FaAccessibleIcon color="gray" size={30} />; // Default icon
};

const Challenge = () => {
  const {data: courses} = useGetCoursesQuery();
  const sortedCourses = courses ?
  [...courses].sort((a, b) => Number(b.likes) - Number(a.likes)) : [];

  const sortedViews = courses ? [...courses].sort((a, b) => Number(b.users) - Number(a.users)) : [];

  const  {data: challenges } = useGetChallengesQuery();
  const mostLikedChallenge = challenges && challenges.length > 0
    ? challenges.reduce((prev, curr) => {
        return Number(curr.likes) > Number(prev.likes) ? curr : prev;
      }, challenges[0]) // Provide initial value
    : null;


  const Rates = [
    sortedCourses[0],
    sortedViews[0]
  ].filter(Boolean);

  return (
    <div>
      <div className="text-center">
        <h1 className="text-xl font-semibold mx-auto text-white text-center my-8">Rates</h1>
      </div>
      <div className="flex justify-center  flex-col lg:flex-row  gap-5 ">
        <div className="flex mx-auto flex-col justify-center h-full">
          <h2 className="text-xl font-semibold mx-auto text-white text-center mb-4">
            Most Liked Challenge
          </h2>

          { mostLikedChallenge && (
            <div
              key={mostLikedChallenge.id}
              className=" max-w-[25rem]  flex flex-col gap-6 justify-between bg-[#070045] h-[17rem]  rounded-2xl border border-[#3A3A5A] p-6"
            >
              <div className="flex justify-between mb-2">
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    mostLikedChallenge.difficulty === "Easy"
                      ? "bg-[rgba(63,101,58,0.69)] text-[#01FE01]"
                      : mostLikedChallenge.difficulty === "Medium"
                      ? "bg-[rgba(255,208,51,0.57)] text-[#FFA500]"
                      : mostLikedChallenge.difficulty === "Hard"
                      ? "bg-[#F59898] text-[rgba(255,0,0,0.89)]"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {mostLikedChallenge.difficulty}
                </span>
                <span className="text-xs text-gray-300">
                  {mostLikedChallenge.category || "Strings"}
                </span>
              </div>

              <div className=" ">
                <h3 className="text-xl font-semibold mx-auto text-white text-center mb-4">
                  {mostLikedChallenge.title}
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                  {mostLikedChallenge.description}
                </p>
              </div>

              <div className="flex  justify-between text-xs text-gray-400 mb-4">
                <div className="flex flex-col text-xs text-gray-400 mb-4">
                  <div className="inline">
                    <p>Est. Time: {mostLikedChallenge.estimatedTime || "30 Minutes"}</p>
                  </div>
                  <div className="flex gap-2">
                    <p>{mostLikedChallenge.likes} Likes</p>
                    <p>{mostLikedChallenge.completions || "500"} Completions</p>
                  </div>
                </div>
                <div className="">
                  <Link to={`/admin/editChallenge/${mostLikedChallenge.id}`}>
                    <button
                      className="py-2 px-2 rounded-md bg-[#06325B]"
                      onClick={() =>
                        Navigate(`/challenge/module/${mostLikedChallenge.id}`)
                      }
                    >
                      view
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          )
          }
        </div>
        <div className="flex mx-auto  flex-col lg:flex-row gap-5">
          {Rates?.map((course) => (
            <div key={course.id} className="max-w-[30rem]">
              <div className="">
              <h1 className="text-xl font-semibold mx-auto text-white text-center mb-4">
                {/* {course.context === "liked"
                  ? "Most liked course"
                  : "Most view course"} */}Most Liked
              </h1>
              </div>
              <div className="max-w-[25rem] bg-[#070045] h-[17rem] rounded-2xl border border-[#3A3A5A] p-6">
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

                <div className="">
                  <h1 className="text-xl font-semibold mx-auto text-white text-center mb-4">
                    {course.title}
                  </h1>
                  <p className="text-sm text-gray-400 mb-4">
                    {course.description}
                  </p>
                </div>

                <div className="flex  justify-between text-xs text-gray-400 mb-4">
                  <div className="flex justify-start flex-col">
                    <p>
                      {course.modules} modules {course.lessons} lessons
                    </p>

                    <p>
                      {course.completions || "500"} Completions {course.likes}{" "}
                      Likes
                    </p>
                  </div>
                  <div className="">
                    <Link to={`/admin/module/${course.id}`}>
                      <button className="py-2 px-2 rounded-md bg-[#06325B]">
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
