import React, { useState, useEffect, useContext } from "react"; // Import useContext
import Loader from "../../../Components/ui/Loader";
import { Link, useNavigate } from "react-router-dom";
import { CiUndo, CiRedo } from "react-icons/ci";
import { useCreateCourseMutation } from '../../../redux/api/AdminSlice';
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";

import {
  FaUser,
  FaJs,
  FaReact,
  FaNodeJs,
  FaPython,
  FaHtml5,
  FaAccessibleIcon,
} from "react-icons/fa";
import { toast } from "react-toastify";
// import { X } from "lucide-react";
import { useDeleteCourseMutation, useGetCoursesQuery } from "../../../redux/api/coursesSlice";
import { SearchContext } from '../../../Contexts/SearchContext'; // Import the SearchContext

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
  return <FaAccessibleIcon color="gray" size={30} />;
};

const initialMockCourses = [
  {
    _id: "65e64d39f6c0d6b5e7f8a9c1",
    title: "Introduction to JavaScript",
    description: "Learn the fundamentals of JavaScript, from variables to functions and DOM manipulation. This comprehensive course covers everything from basic syntax to advanced concepts like asynchronous JavaScript and modern ES6 features, preparing you for front-end and back-end development.",
    level: "BEGINNER",
    viewers: 1250,
    completions: 800,
    likes: 620,
  },
  {
    _id: "65e64d39f6c0d6b5e7f8a9c2",
    title: "React.js: Build Dynamic UIs",
    description: "Master React.js and build modern, interactive user interfaces with components and hooks. Explore state management (Context API, Redux), routing (React Router), and deployment strategies for production-ready single-page applications.",
    level: "INTERMEDIATE",
    viewers: 980,
    completions: 550,
    likes: 410,
  },
  {
    _id: "65e64d39f6c0d6b5e7f8a9c3",
    title: "Node.js and Express for Backend",
    description: "Develop robust backend APIs with Node.js, Express, and MongoDB. Learn RESTful principles, user authentication (JWT), error handling, and deployment strategies for scalable server-side applications.",
    level: "ADVANCED",
    viewers: 720,
    completions: 380,
    likes: 290,
  },
  {
    _id: "65e64d39f6c0d6b5e7f8a9c4",
    title: "Python for Data Science",
    description: "Dive into data analysis, visualization, and machine learning using Python and its powerful libraries like Pandas, NumPy, Scikit-learn, and Matplotlib. Ideal for aspiring data scientists and analysts looking to kickstart their career.",
    level: "INTERMEDIATE",
    viewers: 1500,
    completions: 950,
    likes: 780,
  },
  {
    _id: "65e64d39f6c0d6b5e7f8a9c5",
    title: "HTML5 & CSS3: Responsive Web Design",
    description: "Build beautiful and responsive websites from scratch using modern HTML5 and CSS3 techniques. Learn about semantic HTML, Flexbox, CSS Grid, and media queries to make your sites look great on any device, from mobile to desktop.",
    level: "BEGINNER",
    viewers: 2100,
    completions: 1800,
    likes: 1500,
  },
  {
    _id: "65e64d39f6c0d6b5e7f8a9c6",
    title: "Algorithms and Data Structures",
    description: "Understand core algorithms and data structures to write efficient and optimized code. Covers sorting, searching, trees, graphs, and dynamic programming, essential for competitive programming and technical interviews at top tech companies.",
    level: "ADVANCED",
    viewers: 600,
    completions: 300,
    likes: 200,
  },
  {
    _id: "65e64d39f6c0d6b5e7f8a9c7",
    title: "Vue.js Fundamentals",
    description: "Get started with Vue.js, a progressive framework for building user interfaces. Learn component basics, reactivity, state management (Vuex/Pinia), and integrate with a simple API to build a full-featured application.",
    level: "BEGINNER",
    viewers: 450,
    completions: 280,
    likes: 190,
  },
  {
    _id: "65e64d39f6c0d6b5e7f8a9c8",
    title: "Django Web Development",
    description: "Build powerful web applications with the Django framework and Python. Explore models, views, templates, and the Django ORM for rapid, secure, and scalable web development, including user authentication and CRUD operations.",
    level: "INTERMEDIATE",
    viewers: 700,
    completions: 400,
    likes: 320,
  },
  {
    _id: "65e64d39f6c0d6b5e7f8a9c9",
    title: "TypeScript for JavaScript Developers",
    description: "Enhance your JavaScript projects with static typing using TypeScript. Improve code quality, catch errors early, and scale your applications with confidence by adding type definitions and understanding advanced TypeScript features.",
    level: "INTERMEDIATE",
    viewers: 850,
    completions: 500,
    likes: 390,
  },
];

const Courses = () => {
  // Access the search query from the context
  const { searchQuery } = useContext(SearchContext);

  const { data: coursesData = [], isLoading, isError, refetch } = useGetCoursesQuery();
  const [createCourse, { isLoading: isCreating }] = useCreateCourseMutation();
  const [deleteCourse, { isLoading: isDeleting }] = useDeleteCourseMutation();
  const [openDropdownCourseId, setOpenDropdownCourseId] = useState(null);
  const navigate = useNavigate();
  
  const handleDelete = async (id) => {

  try {
    await deleteCourse(id).unwrap();
    await refetch(); 
 
  } catch (err) {
    console.error("Delete failed:", err);

  }
};
  // Use a local state for courses if you're mixing mock data and API data,
  // or if you want to enable undo/redo on the displayed list.
  // For now, let's assume `coursesData` from RTK Query is the source of truth,
  // and `initialMockCourses` is just for initial setup if API is not used.
  // If you want undo/redo to work on the fetched data, you'd initialize
  // `courses` state with `coursesData` and update it when `coursesData` changes.
  const [courses, setCourses] = useState(initialMockCourses); // Initialize with mock data

  // Update local courses state when RTK Query data changes
  useEffect(() => {
    if (coursesData && coursesData.length > 0) {
      setCourses(coursesData);
      // Also update history if you want undo/redo to apply to fetched data
      setCourseHistory([coursesData]);
      setHistoryIndex(0);
    } else if (!isLoading && !isError) {
      // If no data from API, ensure local state is also empty or handles it
      setCourses([]);
      setCourseHistory([[]]);
      setHistoryIndex(0);
    }
  }, [coursesData, isLoading, isError]);


  const [courseHistory, setCourseHistory] = useState([initialMockCourses]);

  const [historyIndex, setHistoryIndex] = useState(0);


  const [showAddCourseModal, setShowAddCourseModal] = useState(false);

  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const [selectedLevelFilter, setSelectedLevelFilter] = useState("ALL");


  const [newCourseData, setNewCourseData] = useState({
    title: "",
    level: "BEGINNER",
    description: "",
    category: "",     // added     // added
  });

  const [previewIcon, setPreviewIcon] = useState(null);


  useEffect(() => {
    setPreviewIcon(getIconForCourse(newCourseData.title));
  }, [newCourseData.title]);




  // const addStateToHistory = (newCoursesState) => {
  //   const newHistory = courseHistory.slice(0, historyIndex + 1);
  //   setCourseHistory([...newHistory, newCoursesState]);
  //   setHistoryIndex(newHistory.length);
  // };

  // console.log(addStateToHistory) // This console.log will always show the function definition, not its effect.

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCourses(courseHistory[newIndex]);
      toast.info("Undo successful!");
    } else {
      toast.warn("Nothing to undo.");
    }
  };


  const handleRedo = () => {
    if (historyIndex < courseHistory.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCourses(courseHistory[newIndex]);
      toast.info("Redo successful!");
    } else {
      toast.warn("Nothing to redo.");
    }
  };

  // Combined filtering logic for both level and search query
  const getFilteredAndSearchedCourses = () => {
    let currentFilteredCourses = courses;

    // Apply level filter
    if (selectedLevelFilter !== "ALL") {
      currentFilteredCourses = currentFilteredCourses.filter(
        (course) => course.level === selectedLevelFilter
      );
    }

    // Apply search query filter
    if (searchQuery) {
      const lowerCaseSearchQuery = searchQuery.toLowerCase();
      currentFilteredCourses = currentFilteredCourses.filter(
        (course) =>
          course.title.toLowerCase().includes(lowerCaseSearchQuery) ||
          course.description.toLowerCase().includes(lowerCaseSearchQuery) ||
          (course.category && course.category.toLowerCase().includes(lowerCaseSearchQuery)) || // Check for category existence
          course.level.toLowerCase().includes(lowerCaseSearchQuery)
      );
    }
    return currentFilteredCourses;
  };

  const filteredCourses = getFilteredAndSearchedCourses();

const toggleDropdown = (courseId) => {
  if (openDropdownCourseId === courseId) {
      setOpenDropdownCourseId(null); // close if same one is clicked again
    } else {
      setOpenDropdownCourseId(courseId);
    }
  };

  const handleAddCourseClick = () => {
    setShowAddCourseModal(true);
  };


  const handleCloseAddCourseModal = () => {
    setShowAddCourseModal(false);
    setNewCourseData({
      title: "",
      level: "BEGINNER",
      description: "",
      category: "",
      duration: "",
    });
  };


  const handleNewCourseInputChange = (e) => {
    const { name, value, type } = e.target;
    setNewCourseData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };



  const handleCreateNewCourse = async (e) => {
    e.preventDefault();

    if (!newCourseData.title || !newCourseData.description || !newCourseData.level) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      await createCourse(newCourseData).unwrap();
      toast.success(`Course "${newCourseData.title}" created successfully!`);
      handleCloseAddCourseModal();
      refetch(); // refetch updated list
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || "Failed to create course.");
    }
  };


  const toggleFilterDropdown = () => {
    setShowFilterDropdown((prev) => !prev);
  };


  const applyFilter = (level) => {
    setSelectedLevelFilter(level);
    setShowFilterDropdown(false);
  };

  if (isCreating) {
    return <Loader />
  }

  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Loader />
      </div>
    );
  }


  if (isError) {
    return (
      <div className="w-full h-full text-center text-white font-bold text-3xl flex justify-center items-center">
        Error loading courses. Please try again.
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">

      <div className="z-40 sticky top-28 backdrop-blur-xl flex items-center justify-between p-3 rounded-b-lg shadow-lg mb-8">
        <span className="md:text-2xl text-lg font-normal text-gray-100">
          Courses
        </span>
        <div className="flex items-center gap-2 relative">

          <button
            onClick={handleUndo}
            disabled={historyIndex === 0}
            className={`w-8 h-8 flex items-center justify-center cursor-pointer rounded-full border border-gray-300 text-white transition-colors ${
              historyIndex === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-700"
            }`}
            title="Undo Last Action"
          >
            <CiUndo />
          </button>

          <button
            onClick={handleRedo}
            disabled={historyIndex === courseHistory.length - 1} // Disable if at the end of history
            className={`w-8 h-8 flex items-center justify-center cursor-pointer rounded-full border border-gray-300 text-white transition-colors ${
              historyIndex === courseHistory.length - 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-700"
            }`}
            title="Redo Last Action"
          >
            <CiRedo />
          </button>

          <button
            onClick={toggleFilterDropdown}
            className="w-8 h-8 flex items-center justify-center cursor-pointer rounded-full border border-gray-300 text-white hover:bg-gray-700 transition-colors"
            aria-haspopup="true"
            aria-expanded={showFilterDropdown ? "true" : "false"}
            title="Filter Courses"
          >
            <HiOutlineAdjustmentsHorizontal />
          </button>


          {showFilterDropdown && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-[#07032B] border border-[#3A3A5A] rounded-lg shadow-lg overflow-hidden z-50">
              <button
                onClick={() => applyFilter("ALL")}
                className="block w-full text-left px-4 py-2 text-gray-200 hover:bg-[#3A3A5A] transition-colors text-sm"
              >
                All Levels
              </button>
              <button
                onClick={() => applyFilter("BEGINNER")}
                className="block w-full text-left px-4 py-2 text-gray-200 hover:bg-[#3A3A5A] transition-colors text-sm"
              >
                Beginner
              </button>
              <button
                onClick={() => applyFilter("INTERMEDIATE")}
                className="block w-full text-left px-4 py-2 text-gray-200 hover:bg-[#3A3A5A] transition-colors text-sm"
              >
                Intermediate
              </button>
              <button
                onClick={() => applyFilter("ADVANCED")}
                className="block w-full text-left px-4 py-2 text-gray-200 hover:bg-[#3A3A5A] transition-colors text-sm"
              >
                Advanced
              </button>
            </div>
          )}

          <button
            onClick={handleAddCourseClick}
            className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-[#00ffee] to-purple-500 text-white rounded-full font-semibold shadow-md hover:from-purple-500 hover:to-[#00ffee] transition-all duration-300"
            title="Add New Course"
          >
            <span>Add</span>
            <span>+</span>
          </button>
        </div>
      </div>

      {/* Main content area for displaying all courses */}
      <div className="flex-1">
        <h1 className="text-gray-300 font-bold mb-8 text-xl text-center ">
          All Courses {`(${filteredCourses.length || "0"})`}
        </h1>

        <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1 justify-center gap-2 md:gap-6">
          {filteredCourses.map((course) => (
            <div key={course._id || course.id} className="flex justify-center">
              <div className="sm:min-w-[20rem] max-w-[20rem] w-full bg-[#070045] min-h-[19rem] rounded-2xl border border-[#3A3A5A] p-6 flex flex-col justify-between">
                  <div className="relative group ">
                  <div className="flex justify-end">
                    <button
                      className="text-white hover:text-gray-400"
                      onClick={() => toggleDropdown(course.id)}
                    >
                      ⋮
                    </button>
                  </div>
                    <div className={openDropdownCourseId === course.id 
                      ? "block absolute right-0 mt-2 w-28 bg-[#070045] border border-[#3A3A5A] rounded shadow-lg z-50"
                      : "hidden"}>
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#3A3A5A]"
                        onClick={() => navigate(`/admin/courseModules/${course.id}`)}
                      >
                        Edit
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[#3A3A5A]"
                        onClick={() => handleDelete(course.id)}
                        disabled={isDeleting}
                      >
                        {isDeleting ? "Deleting..." : "Remove"}
                      </button>
                    </div>
                  </div>
                <div>
                  <div className="flex justify-between items-center mb-4">
                    {getIconForCourse(course.title)}
                    <span
                      className={`font-bold text-sm px-3 py-1 rounded-full ${
                        course.level === "BEGINNER"
                          ? "bg-blue-900/50 text-blue-300"
                          : course.level === "INTERMEDIATE"
                          ? "bg-purple-900/50 text-purple-300"
                          : course.level === "ADVANCED"
                          ? "bg-green-900/50 text-green-300"
                          : "bg-gray-700/50 text-gray-300"
                      }`}
                    >
                      {course.level}
                    </span>
   
                  </div>

                  <div className="mb-4">
                    <h1 className="text-2xl font-bold text-neutral-300 dark:text-neutral-200 mb-2">
                      {course.title}
                    </h1>
                    <p className="text-gray-400 text-base line-clamp-3">
                      {course.description}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex text-white my-2 justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <FaUser size={12} className="text-gray-400" /> {course.viewers}
                    </span>
                    <span className="flex items-center gap-1">
                      {course.completions} completions
                    </span>
                    <span className="flex items-center gap-1">
                      {course.likes} likes
                    </span>
                  </div>
                  <div className="flex justify-center mt-4">
                    <Link to={`/admin/courseModules/${course.id}`}>
                      <button
                        className="rounded-full bg-gradient-to-r from-[#00ffee] to-purple-500 px-8 py-3 text-white font-bold text-sm shadow-lg hover:from-purple-500 hover:to-[#00ffee] transition-all duration-300"
                      >
                        View Course
                      </button>
                      
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filteredCourses.length === 0 && (
            <div className="col-span-full text-center text-gray-400 text-xl mt-10">
              No courses found matching your filters and search query.
            </div>
          )}
        </div>
      </div>

      {/* Add Course Modal (Conditionally rendered) */}
      {showAddCourseModal && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-start z-50 px-4 py-10 overflow-y-auto">
          <div className="bg-[#070045] mx-auto w-full max-w-xl p-6 rounded-2xl shadow-2xl border border-[#3A3A5A] relative max-h-[90vh] overflow-y-auto scrollbar-hide">
            <button
              type="button"
              onClick={handleCloseAddCourseModal}
              className="absolute top-4 right-4 p-2 cursor-pointer text-gray-400 hover:bg-[#3A3A5A] rounded-full transition-colors"
              aria-label="Close"
            >
              {/* <X className="w-6 h-6" /> */}
            </button>

            <h2 className="text-2xl font-bold text-white mb-6 text-center">Create New Course</h2>

            <form onSubmit={handleCreateNewCourse} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <div>
                  <label htmlFor="course-title" className="block mb-1 font-medium text-gray-300 text-sm">
                    Course Title *
                  </label>
                  <input
                    id="course-title"
                    type="text"
                    name="title"
                    value={newCourseData.title}
                    onChange={handleNewCourseInputChange}
                    placeholder="e.g., Advanced React Hooks"
                    maxLength={50}
                    required
                    className="w-full rounded-md px-3 py-2 border border-[#3A3A5A] text-gray-100 bg-[#07032B] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">Max {50 - newCourseData.title.length} characters remaining.</p>
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-300 text-sm">
                    Auto-generated Icon Preview
                  </label>
                  <div className="w-full rounded-md px-3 py-2 border border-[#3A3A5A] text-gray-100 bg-[#07032B] flex items-center gap-2 h-full text-sm">
                    {previewIcon}
                    <span className="text-gray-400 text-xs">Icon based on title.</span>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="course-level" className="block mb-1 font-medium text-gray-300 text-sm">
                  Course Level *
                </label>
                <select
                  id="course-level"
                  name="level"
                  value={newCourseData.level}
                  onChange={handleNewCourseInputChange}
                  required
                  className="w-full rounded-md px-3 py-2 border border-[#3A3A5A] text-gray-100 bg-[#07032B] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm"
                >
                  <option value="BEGINNER">BEGINNER</option>
                  <option value="INTERMEDIATE">INTERMEDIATE</option>
                  <option value="ADVANCED">ADVANCED</option>
                </select>
              </div>

              <div>
                <label htmlFor="course-category" className="block mb-1 font-medium text-gray-300 text-sm">
                  Course Category
                </label>
                <select
                  id="course-category"
                  name="category"
                  value={newCourseData.category}
                  onChange={handleNewCourseInputChange}
                  className="w-full rounded-md px-3 py-2 border border-[#3A3A5A] text-gray-100 bg-[#07032B] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm"
                >
                  <option value="">Select category</option>
                  <option value="Normal">Normal</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>


              <div>
                <label htmlFor="course-description" className="block mb-1 font-medium text-gray-300 text-sm">
                  Course Description *
                </label>
                <textarea
                  id="course-description"
                  name="description"
                  value={newCourseData.description}
                  onChange={handleNewCourseInputChange}
                  placeholder="Describe what students will learn..."
                  maxLength={250}
                  rows={4}
                  required
                  className="w-full rounded-md px-3 py-2 border border-[#3A3A5A] text-gray-100 bg-[#07032B] resize-y focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm"
                />
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-500">
                    {newCourseData.description.length}/250 characters
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#3A3A5A] text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-500/10 rounded-full border border-purple-500/20 mb-3">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-purple-400">
                    Live Course Card Preview
                  </span>
                </div>
                <div className="flex justify-center">
                  <div className="max-w-[18rem] w-full bg-[#070045] min-h-[17rem] rounded-2xl border border-[#3A3A5A] p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        {React.cloneElement(previewIcon, { size: 24 })}
                        <span
                          className={`font-bold text-xs px-2 py-0.5 rounded-full ${
                            newCourseData.level === "BEGINNER"
                              ? "bg-blue-900/50 text-blue-300"
                              : newCourseData.level === "INTERMEDIATE"
                              ? "bg-purple-900/50 text-purple-300"
                              : newCourseData.level === "ADVANCED"
                              ? "bg-green-900/50 text-green-300"
                              : "bg-gray-700/50 text-gray-300"
                          }`}
                        >
                          {newCourseData.level}
                        </span>
                      </div>
                      <div className="mb-3">
                        <h1 className="text-xl font-bold text-neutral-300">
                          {newCourseData.title || "Course Title"}
                        </h1>
                        <p className="text-gray-400 text-sm line-clamp-3">
                          {newCourseData.description || "Content will be here..."}
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="flex text-white my-1 justify-between text-xs">
                        <span className="flex items-center gap-0.5">
                          <FaUser size={10} className="text-gray-400" /> 0 viewers
                        </span>
                        <span className="flex items-center gap-0.5">
                          0 completions
                        </span>
                        <span className="flex items-center gap-0.5">
                          0 likes
                        </span>
                      </div>
                      <div className="flex justify-center mt-3">
                        <button
                          type="button"
                          className="rounded-full bg-gradient-to-r from-[#00ffee] to-purple-500 px-6 py-2 text-white font-bold text-xs opacity-50 cursor-not-allowed shadow-lg"
                          disabled
                        >
                          Enroll Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-3 mt-6 pt-4 border-t border-[#3A3A5A]">
                <button
                  type="button"
                  onClick={handleCloseAddCourseModal}
                  className="px-5 py-2.5 rounded-full cursor-pointer bg-gradient-to-r from-gray-700 to-gray-800 text-white font-medium hover:from-gray-800 hover:to-gray-900 transition-all duration-300 border border-gray-600 shadow-md text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-full cursor-pointer bg-gradient-to-r from-[#00ffee] to-purple-500 text-white font-semibold hover:from-purple-500 hover:to-[#00ffee] transition-all duration-300 shadow-lg text-sm"
                >
                  Create Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;
