import React, { useState } from 'react';
import upArrow from '../assets/upArrow.png';
import downArrow from '../assets/downArrow.png';
import { Link } from 'react-router-dom';
import { useGetLessonsForSubModuleQuery, useCreateLessonMutation } from '../redux/api/LessonSlice';
import { useGetLessonVideosByMiniModuleQuery } from '../redux/api/lessonVideoApi';
import { useCreateLessonVideoMutation } from '../redux/api/lessonVideoApi';
import { toast } from 'react-toastify'; 

const SubModuleItem = ({ title, moduleId, id: miniModuleId }) => {

  const [open, setOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    explanation: '',
    more: '',
    example: '',
    note: '',
    assignment: '',
  });
  const [uploadType, setUploadType] = useState('lesson'); // 'lesson' or 'video'
  const [videoTitle, setVideoTitle] = useState('');
  const [videoFile, setVideoFile] = useState(null);

  const [createLessonVideo] = useCreateLessonVideoMutation();

  const {
    data: lessons = [],
    refetch: refetchLessons,
  } = useGetLessonsForSubModuleQuery(miniModuleId);

  const {
    data: lessonVideos = [],
    refetch: refetchVideos,
  } = useGetLessonVideosByMiniModuleQuery(miniModuleId);

  const [createLesson, { isLoading }] = useCreateLessonMutation();

  const combinedItems = [
    ...(lessons?.map((lesson) => ({ ...lesson, type: 'lesson' })) || []),
    ...(lessonVideos?.map((video) => ({ ...video, type: 'video' })) || []),
  ].sort((a, b) => a.number - b.number);

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
  if (uploadType === 'lesson') {
    const payload = {
      ...formData,
      miniModuleId: parseInt(miniModuleId),
    };

    try {
      await createLesson(payload).unwrap();
      toast.success('Lesson created successfully');
      setShowAddForm(false);
      setFormData({
        title: '',
        explanation: '',
        more: '',
        example: '',
        note: '',
        assignment: '',
      });
       await refetchLessons();
       await refetchVideos();
    } catch (error) {
      console.error('Failed to create lesson:', error);
      toast.error(
        error?.data?.message || 'Failed to create lesson. Please try again.'
      );
    }
  } else if (uploadType === 'video') {
    if (!videoTitle || !videoFile) {
      toast.error('Please provide a video title and file');
      return;
    }

    const videoData = new FormData();
    videoData.append('title', videoTitle);
    videoData.append('miniModuleId', miniModuleId);
    videoData.append('file', videoFile);

   try {
    await createLessonVideo(videoData).unwrap();
    toast.success('Lesson video uploaded successfully');
    setShowAddForm(false);
    setVideoTitle('');
    setVideoFile(null);
    await refetchVideos();
    await refetchLessons();
  } catch (error) {
    console.error('Failed to upload lesson video:', error);
    if (error.data) {
    console.error('Validation errors:', error.data);
    toast.error(Object.values(error.data).flat().join(', '));
  } else {
    toast.error(
      error?.data?.message || 'Failed to upload video. Please try again.'
    );
  }
}

  }
};


  return (
    <div className="bg-[#1E20B7] rounded-lg w-full max-w-4xl mx-auto p-4 sm:p-5">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full text-left">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            className="appearance-none w-4 h-4 mr-3 border-2 border-white rounded-sm checked:bg-[#6B5EDD] checked:border-[#6B5EDD]"
          />
          <span className="font-bold text-sm sm:text-base">{title}</span>
        </div>
        <img src={open ? upArrow : downArrow} alt="Toggle arrow" className="w-3 h-3" />
      </button>

      {open && (
        <div className="mt-3 bg-[#1E20B7] p-3 sm:p-4 rounded-lg">
          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-12 lg:grid-cols-15 gap-2 mb-4">
            {combinedItems.map((item, i) => {
              const path =
                item.type === 'lesson'
                  ? `/admin/lesson/${item.id}`
                  : `/admin/${moduleId}/${item.id}`;

              return (
                <Link
                  key={`${item.type}-${item.id}`}
                  to={path}
                  className="bg-white font-bold text-[#6B5EDD] text-center rounded text-xs sm:text-sm py-1"
                >
                  {i + 1}
                </Link>
              );
            })}
          </div>
          {combinedItems.length > 0 && (
            <div className="flex justify-end w-full">
              <Link to={
                combinedItems[0].type === 'lesson'
                  ? `/admin/lesson/${combinedItems[0]?.id}`
                  : `/admin/${moduleId}/${combinedItems[0]?.id}`
              }>
              </Link>
            </div>
          )}
        </div>
      )}

      <div className="mt-4">
        <button
          onClick={() => setShowAddForm(true)}
          className="flex text-sm md:text-base items-center gap-2 bg-[#1D1543] hover:bg-[#2C1E6A] text-white px-6 py-3 rounded-full h-8"
        >
          Add lesson
        </button>
      </div>

{showAddForm && (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
    <div className="bg-[#4a38f1] text-black p-8 rounded-xl shadow-xl w-[90%] max-w-md">
      <h3 className="text-2xl font-semibold mb-4">Add Content</h3>

      {/* Radio Toggle */}
      <div className="mb-4 flex gap-6">
        <label>
          <input
            type="radio"
            name="uploadType"
            value="lesson"
            checked={uploadType === 'lesson'}
            onChange={() => setUploadType('lesson')}
            className="mr-2"
          />
          Lesson
        </label>
        <label>
          <input
            type="radio"
            name="uploadType"
            value="video"
            checked={uploadType === 'video'}
            onChange={() => setUploadType('video')}
            className="mr-2"
          />
          Video
        </label>
      </div>

      {/* LESSON FIELDS */}
      {uploadType === 'lesson' && (
        <>
          {['title', 'explanation', 'more', 'example', 'note', 'assignment'].map((field) => (
            <div className="mb-3" key={field}>
              <label className="block font-medium mb-1 capitalize">{field}:</label>
              <input
                type="text"
                name={field}
                value={formData[field]}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                disabled={isLoading}
              />
            </div>
          ))}
        </>
      )}

      {/* VIDEO FIELDS */}
      {uploadType === 'video' && (
        <>
          <div className="mb-3">
            <label className="block font-medium mb-1">Video Title:</label>
            <input
              type="text"
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-3">
            <label className="block font-medium mb-1">Upload File:</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files[0])}
              className="w-full p-2 border rounded"
            />
          </div>
        </>
      )}

      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={() => setShowAddForm(false)}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default SubModuleItem;
