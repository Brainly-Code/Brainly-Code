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

// Function to select icon dynamically
const getIconForCourse = (title) => {
  const key = title.toLowerCase();
  if (key.includes("js")) return <FaJs color="#F7E018" size={30} />;
  if (key.includes("react")) return <FaReact color="#61DBFB" size={30} />;
  if (key.includes("node")) return <FaNodeJs color="#3C873A" size={30} />;
  if (key.includes("python")) return <FaPython color="#3776AB" size={30} />;
  if (key.includes("html") || key.includes("css"))
    return <FaHtml5 color="#E34C26" size={30} />;
  if (key.includes("data structure") || key.includes("algorithm"))
    return <FaAccessibleIcon color="#A855F7" size={30} />;
  return <FaAccessibleIcon color="gray" size={30} />;
};

const Challenge = () => {
  const { data: courses } = useGetCoursesQuery();
  const sortedCourses = courses
    ? [...courses].sort((a, b) => Number(b.likes) - Number(a.likes))
    : [];
  const sortedViews = courses
    ? [...courses].sort((a, b) => Number(b.users) - Number(a.users))
    : [];

  const { data: challenges } = useGetChallengesQuery();
  const mostLikedChallenge =
    challenges && challenges.length > 0
      ? challenges.reduce((prev, curr) =>
          Number(curr.likes) > Number(prev.likes) ? curr : prev
        )
      : null;

  const Rates = [sortedCourses[0], sortedViews[0]].filter(Boolean);

  return (
    <div className="min-h-screen w-full rounded-3xl bg-[#07032B] py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-semibold text-white tracking-wide">
          Top Rated Challenges & Courses
        </h1>
        <p className="text-gray-400 mt-2 text-sm">
          Explore your most loved courses and trending challenges.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row justify-center items-start gap-10">
        {/* --- Most Liked Challenge --- */}
        <div className="flex-1 max-w-[25rem] mx-auto">
          <h2 className="text-xl font-semibold text-center text-white mb-4">
            Most Liked Challenge
          </h2>

          {mostLikedChallenge && (
            <div
              key={mostLikedChallenge.id}
              className="rounded-2xl p-6 bg-gradient-to-b from-[#0B052A] to-[#07032B]
                         border border-[#19179B] shadow-[0_0_20px_rgba(25,23,155,0.4)]
                         hover:shadow-[0_0_25px_rgba(25,23,155,0.8)] transition-all duration-300"
            >
              <div className="flex justify-between mb-4">
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
                <span className="text-xs text-gray-400">
                  {mostLikedChallenge.category || "General"}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white text-center mb-3">
                {mostLikedChallenge.title}
              </h3>
              <p className="text-sm text-gray-400 mb-6 text-center">
                {mostLikedChallenge.description}
              </p>

              <div className="flex justify-between text-xs text-gray-400">
                <div>
                  <p>
                    ⏱ Est. Time:{" "}
                    {mostLikedChallenge.estimatedTime || "30 Minutes"}
                  </p>
                  <p>
                    ❤️ {mostLikedChallenge.likes} Likes •{" "}
                    {mostLikedChallenge.completions || "500"} Completions
                  </p>
                </div>
                <Link to={`/admin/editChallenge/${mostLikedChallenge.id}`}>
                  <button className="px-4 py-2 rounded-md bg-[#19179B] text-white text-xs hover:bg-[#2A28C7] transition-all duration-300">
                    View
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* --- Top Rated Courses --- */}
        <div className="flex-1 flex flex-col gap-8">
          {Rates?.map((course) => (
            <div
              key={course.id}
              className="rounded-2xl p-6 bg-gradient-to-b from-[#0B052A] to-[#07032B]
                         border border-[#19179B] shadow-[0_0_20px_rgba(25,23,155,0.4)]
                         hover:shadow-[0_0_25px_rgba(25,23,155,0.8)] transition-all duration-300"
            >
              <div className="flex justify-between items-center mb-4">
                {getIconForCourse(course.title)}
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    course.level === "BEGGINER"
                      ? "bg-[rgba(63,101,58,0.69)] text-[#01FE01]"
                      : course.level === "INTERMEDIATE"
                      ? "bg-[rgba(255,208,51,0.57)] text-[#FFA500]"
                      : course.level === "ADVANCED"
                      ? "bg-[#F59898] text-[rgba(255,0,0,0.89)]"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {course.level}
                </span>
              </div>

              <h1 className="text-xl font-semibold text-white text-center mb-3">
                {course.title}
              </h1>
              <p className="text-sm text-gray-400 mb-6 text-center">
                {course.description}
              </p>

              <div className="flex justify-between text-xs text-gray-400">
                <div>
                  <p>
                    {course.modules} Modules • {course.lessons} Lessons
                  </p>
                  <p>
                    {course.completions || "500"} Completions • ❤️{" "}
                    {course.likes} Likes
                  </p>
                </div>
                <Link to={`/admin/module/${course.id}`}>
                  <button className="px-4 py-2 rounded-md bg-[#19179B] text-white text-xs hover:bg-[#2A28C7] transition-all duration-300">
                    View
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Challenge;
