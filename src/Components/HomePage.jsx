import React from 'react';
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
} from 'react-icons/fa';
import Footer from './ui/Footer';
import Header from './ui/Header';
import BgLoader from './ui/BgLoader';
import { useGetChallengesQuery } from '../redux/api/challengeSlice';

export default function HomePage() {
  const getIconForCourse = (title) => {
    const key = title.toLowerCase();
    if (key.includes('js')) return <FaJs color="orange" size={30} />;
    if (key.includes('react')) return <FaReact color="blue" size={30} />;
    if (key.includes('node')) return <FaNodeJs color="green" size={30} />;
    if (key.includes('python')) return <FaPython color="green" size={30} />;
    if (key.includes('html') || key.includes('css')) return <FaHtml5 color="red" size={30} />;
    if (key.includes('data structure') || key.includes('algorithm'))
      return <FaAccessibleIcon color="purple" size={30} />;
    return <FaAccessibleIcon color="gray" size={30} />; // Default icon
  };

  const { data: likedCourseIds, refetch } = useGetUserLikedCoursesQuery();
  const { data: courses, error, isLoading } = useGetCoursesQuery();
  const [likeCourse] = useLikeCourseMutation();

  const { data: challenges , isLoading: gettingChallenges} = useGetChallengesQuery();
  const [localLikes, setLocalLikes] = React.useState({});

  React.useEffect(() => {
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

  if (error) toast.error(error);

  const [filterLevel, setFilterLevel] = React.useState('ALL');

  const filteredCourses =
    filterLevel === 'ALL' ? courses : courses?.filter((course) => course.level === filterLevel);

  if (isLoading) return <BgLoader />;

  return (
    <div className="bg-[#070045] min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative text-center py-20 px-6 bg-gradient-to-r from-[#070045] via-[#0d0066] to-[#070045]">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row md:justify-center md:items-center gap-4 mb-6">
            <span className="text-[#00ffee] text-2xl lg:text-5xl font-bold">Interactive</span>
            <TextGenerateEffect
              className="text-white text-2xl lg:text-5xl font-extrabold whitespace-nowrap"
              words={'Coding Courses'}
            />
          </div>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-6">
            Learn to code through hands-on projects, interactive exercises, and real-world
            applications. Start your programming journey today!
          </p>
          <Link to="#courses">
            <button className="px-8 py-3 rounded-full bg-gradient-to-r from-[#00ffee] to-purple-500 text-white font-semibold text-lg shadow-lg hover:scale-105 transition-transform">
              Explore Courses
            </button>
          </Link>
        </div>
      </section>

      {/* Filter Section */}
            <section id="courses" className="mt-12">
              <div className="flex flex-wrap justify-center gap-4 px-6">
                {['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setFilterLevel(level)}
                    className={`px-5 py-2 rounded-full transition-all duration-200 font-medium text-sm sm:text-base shadow-md ${
                      filterLevel === level
                        ? 'bg-gradient-to-r from-[#00ffee] to-purple-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
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
                      key={course._id || course.id}
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
                        <img
                          src={isLiked(course.id) ? liked : like}
                          alt="like"
                          className="h-6 w-6 cursor-pointer hover:scale-110 transition-transform"
                          onClick={() => handleLike(course.id)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Explore Challenges Section */}
      <section className="relative py-20 px-6 bg-gradient-to-r from-[#0d0066] via-[#070045] to-[#0d0066] text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-8">Explore Challenges</h2>
        <p className="text-gray-300 max-w-2xl mx-auto mb-12">
          Sharpen your coding skills with hands-on challenges across different levels. 
          Compete, practice, and grow while learning from real-world problems.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {challenges?.map((challenge, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-2xl bg-gradient-to-r ${challenge?.color} text-white shadow-lg hover:scale-105 transition-transform`}
            >
              <h3 className="text-xl font-bold mb-2">{challenge?.title}</h3>
              <span className="text-sm font-medium bg-black/30 px-3 py-1 rounded-full">
                {challenge?.level}
              </span>
            </div>
          ))}
        </div>

        <Link to="/user/challenges">
          <button className="mt-10 px-8 py-3 rounded-full bg-gradient-to-r from-[#00ffee] to-purple-500 text-white font-semibold text-lg shadow-lg hover:scale-105 transition-transform">
            View All Challenges
          </button>
        </Link>
      </section>

      {/* Our Community Section */}
      <section className="py-20 px-6 bg-[#070045] text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-8">Our Community</h2>
        <p className="text-gray-300 max-w-2xl mx-auto mb-12">
          Join a vibrant community of coders, learners, and mentors who help each other 
          grow every single day.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
          <div className="p-6 bg-white/5 backdrop-blur-lg rounded-2xl shadow-md">
            <h3 className="text-3xl font-bold text-[#00ffee]">10k+</h3>
            <p className="text-gray-300">Active Learners</p>
          </div>
          <div className="p-6 bg-white/5 backdrop-blur-lg rounded-2xl shadow-md">
            <h3 className="text-3xl font-bold text-purple-400">500+</h3>
            <p className="text-gray-300">Coding Challenges</p>
          </div>
          <div className="p-6 bg-white/5 backdrop-blur-lg rounded-2xl shadow-md">
            <h3 className="text-3xl font-bold text-green-400">200+</h3>
            <p className="text-gray-300">Expert Mentors</p>
          </div>
        </div>

        <Link to="/user/community">
          <button className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-500 to-[#00ffee] text-white font-semibold text-lg shadow-lg hover:scale-105 transition-transform">
            Join Our Community
          </button>
        </Link>
      </section>


      <Footer />
    </div>
  );
}
