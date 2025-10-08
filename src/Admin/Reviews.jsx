import React, { useState } from 'react';
import { HiOutlineAdjustmentsHorizontal } from 'react-icons/hi2';
import { useGetCommentsQuery } from '../redux/api/commentsSlice';
import BgLoader from '../Components/ui/BgLoader';

const Reviews = () => {
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('recent'); // 'recent' or 'older'
  const commentsPerPage = 5;

  const { data: comments, isLoading, error } = useGetCommentsQuery();

  if(!comments) return <div className='text-center mt-[10rem] text-white p-4'>No comments available yet.</div>;
  // Sort comments based on filter
  const sortedComments = comments?.slice().sort((a, b) => {
    if (sortOrder === 'recent') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
  });

  // Pagination logic
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = sortedComments?.slice(indexOfFirstComment, indexOfLastComment);
  const totalPages = Math.ceil((sortedComments?.length || 0) / commentsPerPage);

  const toggleFilterDropdown = () => {
    setShowFilterDropdown(prev => !prev);
  };

  const handleSortChange = (order) => {
    setSortOrder(order);
    setCurrentPage(1); // Reset to first page when filter changes
    setShowFilterDropdown(false); // Close dropdown
  };

  if(isLoading) {
    return <BgLoader />
  }

  return (
    <div className='text-white'>
      {/* Filter Button */}
      <div className='flex justify-end mr-12 relative'>
        <button
          onClick={toggleFilterDropdown}
          className="w-8 h-8 flex items-center justify-center cursor-pointer rounded-full border border-gray-300 text-white hover:bg-gray-700 transition-colors"
          aria-haspopup="true"
          aria-expanded={showFilterDropdown ? "true" : "false"}
          title="Filter Comments"
        >
          <HiOutlineAdjustmentsHorizontal />
        </button>

        {/* Dropdown */}
        {showFilterDropdown && (
          <div className="absolute right-0 mt-2 w-36 bg-[#6B5EDD] rounded-md shadow-lg z-50">
            <button
              className="w-full text-left px-4 py-2 hover:bg-[#2c28b8]"
              onClick={() => handleSortChange('recent')}
            >
              Recent
            </button>
            <button
              className="w-full text-left px-4 py-2 hover:bg-[#2c28b8]"
              onClick={() => handleSortChange('older')}
            >
              Older
            </button>
          </div>
        )}
      </div>

      <h1 className='text-white text-xl font-bold mx-[3rem] mb-16 mt-12 mx-[40%]'>Reviews</h1>

      {isLoading ? (
        <p>Loading comments...</p>
      ) : error ? (
        <p>Failed to load comments</p>
      ) : (
        currentComments?.map(comment => (
          <div
            key={comment.id}
            className='w-[90%] rounded-lg bg-[#1074D2] bg-opacity-35 p-[1rem] my-[0.5rem] flex mx-[3rem]'
          >
            <p>{comment.message}</p>
            <p class="text-sm absolute mt-1 right-40">{comment.createdAt}</p>
          </div>
        ))
      )}

      {/* Pagination */}
      <div className='flex flex-row justify-end mr-12 mt-12 gap-2'>
        {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(page => (
          <button
            key={page}
            className={`w-8 h-8 rounded-md text-sm font-semibold flex items-center justify-center transition-colors 
              ${currentPage === page ? 'bg-[#2c28b8]' : 'bg-[#19179B]'} text-white hover:bg-[#2c28b8]`}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
