import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetCoursesQuery, useGetUserLikedCoursesQuery, useLikeCourseMutation } from '../redux/api/coursesSlice';
import { toast } from 'react-toastify';
import TextGenerateEffect from './ui/TextGenerate';
import like from '../assets/like.png';
import liked from '../assets/liked.png';
import {
  FaJs,
  FaReact,
  FaNodeJs,
  FaPython,
  FaHtml5,
  FaAccessibleIcon,
  FaRegCheckCircle,
  FaCheck,
} from 'react-icons/fa';
import Footer from './ui/Footer';
import Header from './ui/Header';
import BgLoader from './ui/BgLoader';
import { ThemeContext } from '../Contexts/ThemeContext';

export default function UserCourses() {
  const getIconForCourse = (title) => {
    const key = title.toLowerCase();
    if (key.includes('js')) return <FaJs color="orange" size={30} />;
    if (key.includes('react')) return <FaReact color="blue" size={30} />;
    if (key.includes('node')) return <FaNodeJs color="green" size={30} />;
    if (key.includes('python')) return <FaPython color="green" size={30} />;
    if (key.includes('html') || key.includes('css')) return <FaHtml5 color="red" size={30} />;
    if (key.includes('data structure') || key.includes('algorithm'))
      return <FaAccessibleIcon color="purple" size={30} />;
    return <FaAccessibleIcon color="gray" size={30} />;
  };

  const {theme} = useContext(ThemeContext);

  const { data: likedCourseIds, refetch } = useGetUserLikedCoursesQuery();
  const { data: courses, error, isLoading } = useGetCoursesQuery();
  const [likeCourse] = useLikeCourseMutation();

  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchHints, setShowSearchHints] = useState(false);
  const searchRef = useRef();

  const [localLikes, setLocalLikes] = useState({});

  useEffect(() => {
    if (likedCourseIds) {
      const initialLikes = {};
      likedCourseIds.forEach((id) => (initialLikes[id] = true));
      setLocalLikes(initialLikes);
    }
  }, [likedCourseIds]);

  const isLiked = (courseId) => {
    return courseId in localLikes ? localLikes[courseId] : likedCourseIds?.includes(courseId);
  };

  const handleLike = async (courseId) => {
    try {
      await likeCourse(courseId).unwrap();
      setLocalLikes((prev) => ({
        ...prev,
        [courseId]: !prev[courseId],
      }));
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to toggle like status');
    }
  };

  // Filtered courses based on search
  let filteredBySearch = courses || [];
  if (searchTerm.trim()) {
    filteredBySearch = filteredBySearch.filter((course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchHints(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Hide suggestions on Enter
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      setShowSearchHints(false);
    }
  };

  if (error) toast.error(error);

  const [filterLevel, setFilterLevel] = useState('ALL');

  const filteredCourses =
    filterLevel === 'ALL'
      ? filteredBySearch
      : filteredBySearch?.filter((course) => course.level === filterLevel);

  if (isLoading) return <BgLoader />;

  return (
    <div className={`${theme === "light" ? "from-white via-gray-300 to-white" : "from-[#070045] via-[#0d0066] to-[#070045]"} bg-gradient-to-r min-h-screen flex flex-col`}>
      <Header />

      {/* Hero Section with Search */}
      <section className={`${theme === "light" ? "from-white via-gray-300 to-white" : "from-[#070045] via-[#0d0066] to-[#070045]"} relative text-center py-20 px-6 bg-gradient-to-r from-[#070045] via-[#0d0066] to-[#070045]`}>
        <div ref={searchRef} className="flex w-[40%] mx-auto mb-[5rem] flex-col items-center">
          <input
            type="text"
            className={`${theme === "light" ? "": "bg-[#6B5EDD]"} w-full md:w-1/2 px-4 py-2 bg-opacity-70 focus:bg-opacity-10 text-gray-50 rounded-lg border border-[#6B5EDD] focus:outline-none focus:ring-2 focus:ring-[#2a28d4]`}
            placeholder="Search courses by title..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSearchHints(true);
            }}
            onKeyDown={handleSearchKeyDown}
          />

          {/* Search suggestions */}
          {showSearchHints && (
            <div className="w-full md:w-1/2 mt-1 p-2 z-10">
              {searchTerm.trim() && filteredBySearch?.length > 0 && (
                <div className="bg-[#6B5EDD] bg-opacity-70 rounded-lg shadow mt-2 p-2 z-10">
                  <span className="text-gray-400 text-sm font-semibold">Suggestions:</span>
                  <ul>
                    {filteredBySearch.slice(0, 5).map((course) => (
                      <li
                        key={course.id}
                        className="cursor-pointer px-2 py-1 hover:bg-[#6B5EDD] rounded text-gray-200"
                        onClick={() => {
                          setSearchTerm(course.title);
                          setShowSearchHints(false);
                        }}
                      >
                        {course.title}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {searchTerm.trim() && filteredBySearch?.length === 0 && (
                <div className="rounded-lg shadow mt-2 p-2 z-10">
                  <span className="text-gray-300 text-sm">No courses with that title found.</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row md:justify-center md:items-center gap-4 mb-6">
            <span className="text-[#00ffee] text-2xl lg:text-5xl font-bold">Interactive</span>
            <TextGenerateEffect
              className="text-white text-2xl lg:text-5xl font-extrabold whitespace-nowrap"
              words={'Coding Courses'}
            />
          </div>
          <p className={`${theme === "light" ? "text-gray-800" : "text-gray-300"} text-lg md:text-xl max-w-2xl mx-auto mb-6`}>
            Learn to code through hands-on projects, interactive exercises, and real-world
            applications. Start your programming journey today!
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section id="courses" className="mt-12 bg-opacity-10">
        <div className="flex flex-wrap justify-center gap-4 px-6">
          {['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map((level) => (
            <button
              key={level}
              onClick={() => setFilterLevel(level)}
              className={`px-5 py-2 rounded-full transition-all duration-200 font-medium text-sm sm:text-base shadow-md ${
                filterLevel === level
                  ? 'bg-gradient-to-r from-[#00ffee] to-purple-500 text-white '
                  : 'bg-transparent hover:bg-gray-600'
              } ${theme === "light" ? "text-gray-700": "text-gray-300"}`}
            >
              {level === 'ALL' ? 'All Courses' : level}
            </button>
          ))}
        </div>

        {/* Course Grid */}
        <div className="mt-16 mb-20 px-6 sm:px-10 lg:px-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredCourses?.map((course) => (
              <div
                key={course.id || course.id}
                className="group bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:shadow-[0_8px_20px_rgba(0,0,0,0.4)] transition duration-300"
              >
                <div className="flex justify-between items-center mb-4">
                  {getIconForCourse(course.title)}
                  <span
                    className={`font-semibold text-sm ${
                      course.level === 'BEGINNER'
                        ? 'text-blue-400'
                        : course.level === 'INTERMEDIATE'
                        ? 'text-purple-400'
                        : course.level === 'ADVANCED'
                        ? 'text-green-400'
                        : 'text-gray-400'
                    }`}
                  >
                    {course.level.charAt(0) + course.level.slice(1).toLowerCase()}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white mb-2">{course.title}</h2>
                <p className="text-gray-400 text-sm line-clamp-3">{course.description}</p>

                <div className="flex justify-between items-center mt-6">
                  <Link to={`/user/module/${course.id}`}>
                    <button className="px-6 py-2 rounded-full bg-gradient-to-r from-[#00ffee] to-purple-500 text-white font-semibold text-sm shadow hover:scale-105 transition-transform">
                      Enroll Now
                    </button>
                  </Link>
                  {isLiked(course.id) ? (
                    <FaCheck
                      size={24}
                      className="cursor-pointer hover:scale-110 transition-transform text-green-400"
                      onClick={() => handleLike(course.id)}
                    />
                  ) : (
                    <FaRegCheckCircle
                      size={24}
                      className="cursor-pointer hover:scale-110 transition-transform text-gray-400"
                      onClick={() => handleLike(course.id)}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

