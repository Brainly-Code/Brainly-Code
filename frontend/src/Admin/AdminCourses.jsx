import React from "react";
import { useGetCoursesByCreatorQuery } from '../redux/api/coursesSlice';
import { useNavigate } from "react-router-dom";
import { useDeleteCourseMutation } from '../redux/api/coursesSlice';

const MyCourses = () => {
  const { data: courses, error, isLoading, refetch } = useGetCoursesByCreatorQuery();
  const [deleteCourse, { isLoading: isDeleting }] = useDeleteCourseMutation();

  const handleDelete = async (id) => {

  try {
    await deleteCourse(id).unwrap();
    await refetch(); 
 
  } catch (err) {
    console.error("Delete failed:", err);

  }
};

  const navigate = useNavigate()
  console.log(courses)
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading courses.</p>;

  return (
    <div className="min-h-screen bg-[#0D0056]  py-12 px-4 text-white">
      <h2 className="text-center text-3xl font-semibold mb-10">Your Courses</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-[#070045] border border-[#3A3A5A] rounded-2xl p-6 w-full max-w-sm shadow-lg"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="bg-yellow-400 text-black font-bold px-2 py-1 rounded-full">JS</div>
              <span className="text-sm text-[#00FFA3] font-medium">{course?.level}</span>
            </div>

            <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                <p className="text-sm mb-4">
                {course?.description && course?.description.length > 90
                    ? course?.description.slice(0, 90) + "..."
                    : course?.description || "No description provided."}
                </p>

            <div className="flex justify-between text-sm text-gray-300 mb-4">
              <span>🕓 {course.duration} Hours</span>
              <span>👨‍🎓 {course.studentsCount} Students</span>
              <span>⭐ {course.rating?.toFixed?.(1) ?? "N/A"}</span>
            </div>

            <div className="flex justify-between gap-4">
              <button className="bg-gradient-to-r from-[#00ffee] to-purple-500 hover:from-purple-500 hover:to-[#00ffee] transition-all duration-300 px-4 py-2 rounded-full text-sm font-semibold" onClick={() => navigate(`/admin/courseModules/${course.id}`)}>
                Edit
              </button>
              <button
                className="bg-gray-700 hover:bg-red-500 px-4 py-2 rounded-full text-sm font-semibold"
                onClick={() => handleDelete(course.id)}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Remove"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCourses;
