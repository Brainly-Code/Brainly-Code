import React, { useState, useEffect, useContext } from "react";
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
import { useDeleteCourseMutation, useGetCoursesQuery } from "../../../redux/api/coursesSlice";
import { SearchContext } from '../../../Contexts/SearchContext';
import { ThemeContext } from '../../../Contexts/ThemeContext.jsx'; // Import ThemeContext
import BgLoader from "../../../Components/ui/Loader";

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
  // ... (unchanged mock data)
];

const Courses = () => {
  const { searchQuery } = useContext(SearchContext);
  const { theme } = useContext(ThemeContext); // Access theme from ThemeContext

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
      toast.error("Failed to delete course.");
    }
  };

  const [courses, setCourses] = useState(initialMockCourses);
  const [courseHistory, setCourseHistory] = useState([initialMockCourses]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedLevelFilter, setSelectedLevelFilter] = useState("ALL");
  const [newCourseData, setNewCourseData] = useState({
    title: "",
    level: "BEGINNER",
    description: "",
    category: "",
    duration: "",
  });
  const [previewIcon, setPreviewIcon] = useState(null);

  useEffect(() => {
    setPreviewIcon(getIconForCourse(newCourseData.title));
  }, [newCourseData.title]);

  useEffect(() => {
    if (coursesData && coursesData.length > 0) {
      setCourses(coursesData);
      setCourseHistory([coursesData]);
      setHistoryIndex(0);
    } else if (!isLoading && !isError) {
      setCourses([]);
      setCourseHistory([[]]);
      setHistoryIndex(0);
    }
  }, [coursesData, isLoading, isError]);

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

  const getFilteredAndSearchedCourses = () => {
    let currentFilteredCourses = courses;
    if (selectedLevelFilter !== "ALL") {
      currentFilteredCourses = currentFilteredCourses.filter(
        (course) => course.level === selectedLevelFilter
      );
    }
    if (searchQuery) {
      const lowerCaseSearchQuery = searchQuery.toLowerCase();
      currentFilteredCourses = currentFilteredCourses.filter(
        (course) =>
          course.title.toLowerCase().includes(lowerCaseSearchQuery) ||
          course.description.toLowerCase().includes(lowerCaseSearchQuery) ||
          (course.category && course.category.toLowerCase().includes(lowerCaseSearchQuery)) ||
          course.level.toLowerCase().includes(lowerCaseSearchQuery)
      );
    }
    return currentFilteredCourses;
  };

  const filteredCourses = getFilteredAndSearchedCourses();

  const toggleDropdown = (courseId) => {
    setOpenDropdownCourseId(openDropdownCourseId === courseId ? null : courseId);
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
      refetch();
    } catch (error) {
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
    return <BgLoader />;
  }

  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <BgLoader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className={`w-full h-full text-center font-bold text-3xl flex justify-center items-center ${
        theme === "dark" ? "text-white" : "text-gray-800"
      }`}>
        Error loading courses. Please try again.
      </div>
    );
  }

  return (
    <div className={`p-4 sm:p-6 lg:p-8 ${theme === "dark" ? "bg-[#0D0056]/90" : "bg-gray-100"} transition-all duration-500`}>
      <div className={`z-40 sticky top-28 backdrop-blur-xl flex items-center justify-between p-3 rounded-b-lg shadow-lg mb-8 ${
        theme === "dark" ? "bg-[#07032B]/90 border-[#3A3A5A]" : "bg-white border-gray-200"
      }`}>
        <span className={`md:text-2xl text-lg font-normal ${
          theme === "dark" ? "text-gray-100" : "text-gray-800"
        }`}>
          Courses
        </span>
        <div className="flex items-center gap-2 relative">
          <button
            onClick={handleUndo}
            disabled={historyIndex === 0}
            className={`w-8 h-8 flex items-center justify-center cursor-pointer rounded-full border transition-colors ${
              theme === "dark"
                ? `border-gray-300 text-white ${historyIndex === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-700"}`
                : `border-gray-200 text-gray-800 ${historyIndex === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"}`
            }`}
            title="Undo Last Action"
          >
            <CiUndo />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex === courseHistory.length - 1}
            className={`w-8 h-8 flex items-center justify-center cursor-pointer rounded-full border transition-colors ${
              theme === "dark"
                ? `border-gray-300 text-white ${historyIndex === courseHistory.length - 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-700"}`
                : `border-gray-200 text-gray-800 ${historyIndex === courseHistory.length - 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"}`
            }`}
            title="Redo Last Action"
          >
            <CiRedo />
          </button>
          <button
            onClick={toggleFilterDropdown}
            className={`w-8 h-8 flex items-center justify-center cursor-pointer rounded-full border transition-colors ${
              theme === "dark"
                ? "border-gray-300 text-white hover:bg-gray-700"
                : "border-gray-200 text-gray-800 hover:bg-gray-200"
            }`}
            aria-haspopup="true"
            aria-expanded={showFilterDropdown ? "true" : "false"}
            title="Filter Courses"
          >
            <HiOutlineAdjustmentsHorizontal />
          </button>
          {showFilterDropdown && (
            <div className={`absolute top-full right-0 mt-2 w-48 rounded-lg shadow-lg overflow-hidden z-50 ${
              theme === "dark" ? "bg-[#07032B] border-[#3A3A5A]" : "bg-white border-gray-200"
            }`}>
              <button
                onClick={() => applyFilter("ALL")}
                className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                  theme === "dark" ? "text-gray-200 hover:bg-[#3A3A5A]" : "text-gray-800 hover:bg-gray-100"
                }`}
              >
                All Levels
              </button>
              <button
                onClick={() => applyFilter("BEGINNER")}
                className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                  theme === "dark" ? "text-gray-200 hover:bg-[#3A3A5A]" : "text-gray-800 hover:bg-gray-100"
                }`}
              >
                Beginner
              </button>
              <button
                onClick={() => applyFilter("INTERMEDIATE")}
                className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                  theme === "dark" ? "text-gray-200 hover:bg-[#3A3A5A]" : "text-gray-800 hover:bg-gray-100"
                }`}
              >
                Intermediate
              </button>
              <button
                onClick={() => applyFilter("ADVANCED")}
                className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                  theme === "dark" ? "text-gray-200 hover:bg-[#3A3A5A]" : "text-gray-800 hover:bg-gray-100"
                }`}
              >
                Advanced
              </button>
            </div>
          )}
          <button
            onClick={handleAddCourseClick}
            className={`flex items-center gap-1 px-4 py-2 rounded-full font-semibold shadow-md transition-all duration-300 ${
              theme === "dark"
                ? "bg-gradient-to-r from-[#00ffee] to-purple-500 text-white hover:from-purple-500 hover:to-[#00ffee]"
                : "bg-gradient-to-r from-blue-400 to-purple-400 text-white hover:from-purple-400 hover:to-blue-400"
            }`}
            title="Add New Course"
          >
            <span>Add</span>
            <span>+</span>
          </button>
        </div>
      </div>

      <div className="flex-1">
        <h1 className={`font-bold mb-8 text-xl text-center ${
          theme === "dark" ? "text-gray-300" : "text-gray-800"
        }`}>
          All Courses {`(${filteredCourses.length || "0"})`}
        </h1>

        <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1 justify-center gap-2 md:gap-6">
          {filteredCourses.map((course) => (
            <div key={course._id || course.id} className="flex justify-center">
              <div className={`sm:min-w-[20rem] max-w-[20rem] w-full min-h-[19rem] rounded-2xl border p-6 flex flex-col justify-between ${
                theme === "dark" ? "bg-[#070045] border-[#3A3A5A]" : "bg-white border-gray-200 shadow-md"
              }`}>
                <div className="relative group">
                  <div className="flex justify-end">
                    <button
                      className={`hover:text-gray-400 ${
                        theme === "dark" ? "text-white" : "text-gray-800"
                      }`}
                      onClick={() => toggleDropdown(course.id)}
                    >
                      ⋮
                    </button>
                  </div>
                  <div className={`${
                    openDropdownCourseId === course.id ? "block" : "hidden"
                  } absolute right-0 mt-2 w-28 rounded shadow-lg z-50 ${
                    theme === "dark" ? "bg-[#070045] border-[#3A3A5A]" : "bg-white border-gray-200"
                  }`}>
                    <button
                      className={`w-full text-left px-4 py-2 text-sm ${
                        theme === "dark" ? "text-gray-300 hover:bg-[#3A3A5A]" : "text-gray-800 hover:bg-gray-100"
                      }`}
                      onClick={() => navigate(`/admin/courseModules/${course.id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className={`w-full text-left px-4 py-2 text-sm ${
                        theme === "dark" ? "text-red-400 hover:bg-[#3A3A5A]" : "text-red-600 hover:bg-gray-100"
                      }`}
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
                          ? theme === "dark"
                            ? "bg-blue-900/50 text-blue-300"
                            : "bg-blue-100 text-blue-700"
                          : course.level === "INTERMEDIATE"
                          ? theme === "dark"
                            ? "bg-purple-900/50 text-purple-300"
                            : "bg-purple-100 text-purple-700"
                          : course.level === "ADVANCED"
                          ? theme === "dark"
                            ? "bg-green-900/50 text-green-300"
                            : "bg-green-100 text-green-700"
                          : theme === "dark"
                          ? "bg-gray-700/50 text-gray-300"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {course.level}
                    </span>
                  </div>
                  <div className="mb-4">
                    <h1 className={`text-2xl font-bold mb-2 ${
                      theme === "dark" ? "text-neutral-300" : "text-gray-800"
                    }`}>
                      {course.title}
                    </h1>
                    <p className={`text-base line-clamp-3 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}>
                      {course.description}
                    </p>
                  </div>
                </div>
                <div>
                  <div className={`flex my-2 justify-between text-sm ${
                    theme === "dark" ? "text-white" : "text-gray-800"
                  }`}>
                    <span className="flex items-center gap-1">
                      <FaUser size={12} className={theme === "dark" ? "text-gray-400" : "text-gray-600"} /> {course.viewers}
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
                        className={`rounded-full px-8 py-3 font-bold text-sm shadow-lg transition-all duration-300 ${
                          theme === "dark"
                            ? "bg-gradient-to-r from-[#00ffee] to-purple-500 text-white hover:from-purple-500 hover:to-[#00ffee]"
                            : "bg-gradient-to-r from-blue-400 to-purple-400 text-white hover:from-purple-400 hover:to-blue-400"
                        }`}
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
            <div className={`col-span-full text-center text-xl mt-10 ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}>
              No courses found matching your filters and search query.
            </div>
          )}
        </div>
      </div>

      {showAddCourseModal && (
        <div className={`fixed inset-0 flex justify-center items-start z-50 px-4 py-10 overflow-y-auto ${
          theme === "dark" ? "bg-black/70" : "bg-black/30"
        }`}>
          <div className={`mx-auto w-full max-w-xl p-6 rounded-2xl shadow-2xl border max-h-[90vh] overflow-y-auto scrollbar-hide ${
            theme === "dark" ? "bg-[#070045] border-[#3A3A5A]" : "bg-white border-gray-200"
          }`}>
            <button
              type="button"
              onClick={handleCloseAddCourseModal}
              className={`absolute top-4 right-4 p-2 cursor-pointer rounded-full transition-colors ${
                theme === "dark" ? "text-gray-400 hover:bg-[#3A3A5A]" : "text-gray-600 hover:bg-gray-200"
              }`}
              aria-label="Close"
            >
              ✕
            </button>
            <h2 className={`text-2xl font-bold mb-6 text-center ${
              theme === "dark" ? "text-white" : "text-gray-800"
            }`}>
              Create New Course
            </h2>
            <form onSubmit={handleCreateNewCourse} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <div>
                  <label htmlFor="course-title" className={`block mb-1 font-medium text-sm ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}>
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
                    className={`w-full rounded-md px-3 py-2 border text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                      theme === "dark"
                        ? "bg-[#07032B] border-[#3A3A5A] text-gray-100"
                        : "bg-white border-gray-300 text-gray-800"
                    }`}
                  />
                  <p className={`text-xs mt-1 ${
                    theme === "dark" ? "text-gray-500" : "text-gray-600"
                  }`}>
                    Max {50 - newCourseData.title.length} characters remaining.
                  </p>
                </div>
                <div>
                  <label className={`block mb-1 font-medium text-sm ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Auto-generated Icon Preview
                  </label>
                  <div className={`w-full rounded-md px-3 py-2 border flex items-center gap-2 h-full text-sm ${
                    theme === "dark"
                      ? "bg-[#07032B] border-[#3A3A5A] text-gray-100"
                      : "bg-white border-gray-300 text-gray-800"
                  }`}>
                    {previewIcon}
                    <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
                      Icon based on title.
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="course-level" className={`block mb-1 font-medium text-sm ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}>
                  Course Level *
                </label>
                <select
                  id="course-level"
                  name="level"
                  value={newCourseData.level}
                  onChange={handleNewCourseInputChange}
                  required
                  className={`w-full rounded-md px-3 py-2 border text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                    theme === "dark"
                      ? "bg-[#07032B] border-[#3A3A5A] text-gray-100"
                      : "bg-white border-gray-300 text-gray-800"
                  }`}
                >
                  <option value="BEGINNER">BEGINNER</option>
                  <option value="INTERMEDIATE">INTERMEDIATE</option>
                  <option value="ADVANCED">ADVANCED</option>
                </select>
              </div>
              <div>
                <label htmlFor="course-category" className={`block mb-1 font-medium text-sm ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}>
                  Course Category
                </label>
                <select
                  id="course-category"
                  name="category"
                  value={newCourseData.category}
                  onChange={handleNewCourseInputChange}
                  className={`w-full rounded-md px-3 py-2 border text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                    theme === "dark"
                      ? "bg-[#07032B] border-[#3A3A5A] text-gray-100"
                      : "bg-white border-gray-300 text-gray-800"
                  }`}
                >
                  <option value="">Select category</option>
                  <option value="Normal">Normal</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              <div>
                <label htmlFor="course-description" className={`block mb-1 font-medium text-sm ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}>
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
                  className={`w-full rounded-md px-3 py-2 border text-sm resize-y focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                    theme === "dark"
                      ? "bg-[#07032B] border-[#3A3A5A] text-gray-100"
                      : "bg-white border-gray-300 text-gray-800"
                  }`}
                />
                <div className="flex justify-between items-center mt-1">
                  <span className={`text-xs ${
                    theme === "dark" ? "text-gray-500" : "text-gray-600"
                  }`}>
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
                  <div className={`max-w-[18rem] w-full min-h-[17rem] rounded-2xl border p-4 flex flex-col justify-between ${
                    theme === "dark" ? "bg-[#070045] border-[#3A3A5A]" : "bg-white border-gray-200 shadow-md"
                  }`}>
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        {React.cloneElement(previewIcon, { size: 24 })}
                        <span
                          className={`font-bold text-xs px-2 py-0.5 rounded-full ${
                            newCourseData.level === "BEGINNER"
                              ? theme === "dark"
                                ? "bg-blue-900/50 text-blue-300"
                                : "bg-blue-100 text-blue-700"
                              : newCourseData.level === "INTERMEDIATE"
                              ? theme === "dark"
                                ? "bg-purple-900/50 text-purple-300"
                                : "bg-purple-100 text-purple-700"
                              : newCourseData.level === "ADVANCED"
                              ? theme === "dark"
                                ? "bg-green-900/50 text-green-300"
                                : "bg-green-100 text-green-700"
                              : theme === "dark"
                              ? "bg-gray-700/50 text-gray-300"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {newCourseData.level}
                        </span>
                      </div>
                      <div className="mb-3">
                        <h1 className={`text-xl font-bold ${
                          theme === "dark" ? "text-neutral-300" : "text-gray-800"
                        }`}>
                          {newCourseData.title || "Course Title"}
                        </h1>
                        <p className={`text-sm line-clamp-3 ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}>
                          {newCourseData.description || "Content will be here..."}
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className={`flex my-1 justify-between text-xs ${
                        theme === "dark" ? "text-white" : "text-gray-800"
                      }`}>
                        <span className="flex items-center gap-0.5">
                          <FaUser size={10} className={theme === "dark" ? "text-gray-400" : "text-gray-600"} /> 0 viewers
                        </span>
                        <span className="flex items-center gap-0.5">
                          {coursesData.completions} completions
                        </span>
                        <span className="flex items-center gap-0.5">
                          {coursesData.likes} likes
                        </span>
                      </div>
                      <div className="flex justify-center mt-3">
                        <button
                          type="button"
                          className={`rounded-full px-6 py-2 font-bold text-xs opacity-50 cursor-not-allowed shadow-lg ${
                            theme === "dark"
                              ? "bg-gradient-to-r from-[#00ffee] to-purple-500 text-white"
                              : "bg-gradient-to-r from-blue-400 to-purple-400 text-white"
                          }`}
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
                  className={`px-5 py-2.5 rounded-full cursor-pointer font-medium transition-all duration-300 border shadow-md text-sm ${
                    theme === "dark"
                      ? "bg-gradient-to-r from-gray-700 to-gray-800 text-white hover:from-gray-800 hover:to-gray-900 border-gray-600"
                      : "bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 hover:from-gray-300 hover:to-gray-400 border-gray-300"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2.5 rounded-full cursor-pointer font-semibold transition-all duration-300 shadow-lg text-sm ${
                    theme === "dark"
                      ? "bg-gradient-to-r from-[#00ffee] to-purple-500 text-white hover:from-purple-500 hover:to-[#00ffee]"
                      : "bg-gradient-to-r from-blue-400 to-purple-400 text-white hover:from-purple-400 hover:to-blue-400"
                  }`}
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