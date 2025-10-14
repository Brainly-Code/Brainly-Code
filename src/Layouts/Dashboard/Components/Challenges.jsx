import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaStopwatch } from 'react-icons/fa';
import { CiUndo, CiRedo } from 'react-icons/ci';
import { HiOutlineAdjustmentsHorizontal } from 'react-icons/hi2';
import { toast } from 'react-toastify';
import { X } from 'lucide-react';
import { SearchContext } from '../../../Contexts/SearchContext';
import { ThemeContext } from '../../../Contexts/ThemeContext.jsx'; // Import ThemeContext
import { useCreateChallengeMutation, useDeleteChallengeMutation, useGetChallengesQuery } from '../../../redux/api/challengeSlice';
import BgLoader from '../../../Components/ui/BgLoader';

const Challenges = () => {
  const { searchQuery } = useContext(SearchContext);
  const { theme } = useContext(ThemeContext); // Access theme from ThemeContext
  const { data: challengesData, isLoading, isError, refetch } = useGetChallengesQuery();
  const [createChallenge] = useCreateChallengeMutation();
  const [deleteChallenge, { isLoading: isDeleting }] = useDeleteChallengeMutation();

  const [challenges, setChallenges] = useState(challengesData || []);
  const [challengeHistory, setChallengeHistory] = useState([challengesData || []]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [showAddChallengeModal, setShowAddChallengeModal] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedDifficultyFilter, setSelectedDifficultyFilter] = useState("ALL");
  const [creatingChallenge, setCreatingChallenge] = useState(false);
  const [openDropdownChallengeId, setOpenDropdownChallengeId] = useState(null);
  const navigate = useNavigate();

  const [newChallengeData, setNewChallengeData] = useState({
    title: "",
    description: "",
    difficulty: "Easy",
    context: "General",
    estimatedTime: "1 hour",
    document: null,
  });

  // Sync challenges and history with API data
  useEffect(() => {
    if (challengesData) {
      setChallenges(challengesData);
      setChallengeHistory([challengesData]);
      setHistoryIndex(0);
    }
  }, [challengesData]);

  const addStateToHistory = (newChallengeState) => {
    const newHistory = challengeHistory?.slice(0, historyIndex + 1);
    setChallengeHistory([...newHistory, newChallengeState]);
    setHistoryIndex(newHistory.length);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setChallenges(challengeHistory[newIndex]);
      toast.info("Undo successful!");
    } else {
      toast.warn("Nothing to undo.");
    }
  };

  const handleRedo = () => {
    if (historyIndex < challengeHistory?.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setChallenges(challengeHistory[newIndex]);
      toast.info("Redo successful!");
    } else {
      toast.warn("Nothing to redo.");
    }
  };

  const toggleFilterDropdown = () => {
    setShowFilterDropdown((prev) => !prev);
  };

  const applyFilter = (difficulty) => {
    setSelectedDifficultyFilter(difficulty);
    setShowFilterDropdown(false);
    const filteredChallenges = difficulty === "ALL"
      ? challenges
      : challenges.filter((challenge) => challenge.difficulty === difficulty);
    setChallenges(filteredChallenges);
    addStateToHistory(filteredChallenges);
  };

  const getFilteredAndSearchedChallenges = () => {
    let currentFilteredChallenges = challenges;

    if (selectedDifficultyFilter !== "ALL") {
      currentFilteredChallenges = currentFilteredChallenges.filter(
        (challenge) => challenge.difficulty === selectedDifficultyFilter
      );
    }

    if (searchQuery) {
      const lowerCaseSearchQuery = searchQuery.toLowerCase();
      currentFilteredChallenges = currentFilteredChallenges.filter(
        (challenge) =>
          (challenge.title?.toLowerCase().includes(lowerCaseSearchQuery) || false) ||
          (challenge.description?.toLowerCase().includes(lowerCaseSearchQuery) || false) ||
          (challenge.context?.toLowerCase().includes(lowerCaseSearchQuery) || false) ||
          (challenge.difficulty?.toLowerCase().includes(lowerCaseSearchQuery) || false)
      );
    }
    return currentFilteredChallenges;
  };

  const handleDelete = async (id) => {
    try {
      await deleteChallenge(id).unwrap();
      await refetch();
      toast.success("Challenge deleted successfully!");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete challenge. Please try again.");
    }
  };

  const toggleDropdown = (challengeId) => {
    if (openDropdownChallengeId === challengeId) {
      setOpenDropdownChallengeId(null); // close if same one is clicked again
    } else {
      setOpenDropdownChallengeId(challengeId);
    }
  };

  const filteredChallenges = getFilteredAndSearchedChallenges();

  const handleAddChallengeClick = () => {
    setShowAddChallengeModal(true);
  };

  const handleCloseAddChallengeModal = () => {
    setShowAddChallengeModal(false);
    setNewChallengeData({
      title: "",
      description: "",
      difficulty: "Easy",
      context: "General",
      estimatedTime: "1 hour",
      document: null,
    });
  };

  const handleNewChallengeInputChange = (e) => {
    const { name, value } = e.target;
    setNewChallengeData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setNewChallengeData((prev) => ({
      ...prev,
      document: e.target.files[0], // store file object
    }));
  };

  const handleCreateNewChallenge = async (e) => {
    e.preventDefault();

    if (!newChallengeData.title || !newChallengeData.description) {
      toast.error("Please fill in title and description.");
      return;
    }

    // Create FormData to send text fields + file
    const formData = new FormData();
    formData.append('title', newChallengeData.title);
    formData.append('description', newChallengeData.description);
    formData.append('difficulty', newChallengeData.difficulty || '');
    formData.append('duration', newChallengeData.estimatedTime || '');
    formData.append('relation', newChallengeData.context || '');

    // If user selected a document, append it
    if (newChallengeData.document) {
      formData.append('file', newChallengeData.document);
    }
    setCreatingChallenge(true);
    try {
      const res = await fetch('https://backend-hx6c.onrender.com/challenges', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setCreatingChallenge(false);
      refetch();
      toast.success(`Challenge "${newChallengeData.title}" created successfully!`);
      handleCloseAddChallengeModal();
    } catch (error) {
      toast.error("Failed to create challenge. Please try again.");
      setCreatingChallenge(false);
    }
  };

  const openFile = (url) => {
    if (url) {
      handleViewInBrowser(url);
    } else {
      toast.error("File URL not available");
    }
  };

  const handleViewInBrowser = (url) => {
    const updatedUrl = url.replace(
      'https://res.cloudinary.com/dglbxzxsc/',
      'https://res.cloudinary.com/dnppwzg0k/'
    );

    const extension = updatedUrl.split('.').pop().toLowerCase();

    if (['docx', 'doc', 'pptx', 'ppt', 'xlsx'].includes(extension)) {
      // Open Office documents in Office Online Viewer
      const officeUrl = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(updatedUrl)}`;
      window.open(officeUrl, '_blank');
    } else if (extension === 'pdf') {
      // Open PDF directly in the browser
      window.open(updatedUrl, '_blank');
    } else {
      // Fallback: open other file types in Google Docs Viewer
      const googleViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(updatedUrl)}&embedded=true`;
      window.open(googleViewerUrl, '_blank');
    }
  };

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
        Error loading Challenges.
      </div>
    );
  }

  return (
    <div className={`p-4 sm:p-6 lg:p-8 ${theme === "dark" ? "bg-[#0D0056]/90" : "bg-gray-100"} transition-all duration-500`}>
      <div className={`z-40 sticky top-28 backdrop-blur-xl flex place-items-start justify-between p-3 rounded-b-lg shadow-lg mb-8 ${
        theme === "dark" ? "bg-[#07032B]/90 border-[#3A3A5A]" : "bg-white border-gray-200"
      }`}>
        <span className={`md:text-2xl text-lg font-normal ${
          theme === "dark" ? "text-gray-100" : "text-gray-800"
        }`}>
          Challenges
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
            disabled={historyIndex === challengeHistory?.length - 1}
            className={`w-8 h-8 flex items-center justify-center cursor-pointer rounded-full border transition-colors ${
              theme === "dark"
                ? `border-gray-300 text-white ${historyIndex === challengeHistory?.length - 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-700"}`
                : `border-gray-200 text-gray-800 ${historyIndex === challengeHistory?.length - 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"}`
            }`}
            title="Redo Last Action"
          >
            <CiRedo />
          </button>
          <div className="relative">
            <button
              onClick={toggleFilterDropdown}
              className={`w-8 h-8 flex items-center justify-center cursor-pointer rounded-full border transition-colors ${
                theme === "dark"
                  ? "border-gray-300 text-white hover:bg-gray-700"
                  : "border-gray-200 text-gray-800 hover:bg-gray-200"
              }`}
              aria-haspopup="true"
              aria-expanded={showFilterDropdown ? "true" : "false"}
              title="Filter Challenges"
            >
              <HiOutlineAdjustmentsHorizontal />
            </button>
            {showFilterDropdown && (
              <div className={`absolute top-full right-0 mt-2 w-48 rounded-lg shadow-lg overflow-hidden z-50 ${
                theme === "dark" ? "bg-[#07032B] border-[#3A3A5A]" : "bg-white border-gray-200"
              }`}>
                {["ALL", "Easy", "Medium", "Hard"].map((difficulty) => (
                  <button
                    key={difficulty}
                    onClick={() => applyFilter(difficulty)}
                    className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                      theme === "dark" ? "text-gray-200 hover:bg-[#3A3A5A]" : "text-gray-800 hover:bg-gray-100"
                    }`}
                  >
                    {difficulty === "ALL" ? "All Difficulties" : difficulty}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={handleAddChallengeClick}
            className={`flex items-center gap-1 px-4 py-2 rounded-full font-semibold shadow-md transition-all duration-300 ${
              theme === "dark"
                ? "bg-gradient-to-r from-[#00ffee] to-purple-500 text-white hover:from-purple-500 hover:to-[#00ffee]"
                : "bg-gradient-to-r from-blue-400 to-purple-400 text-white hover:from-purple-400 hover:to-blue-400"
            }`}
            title="Add New Challenge"
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
          All Challenges {`(${filteredChallenges?.length || "0"})`}
        </h1>
        <div className="grid lg:grid-cols-3 justify-center text-start md:grid-cols-2 gap-6">
          {filteredChallenges?.map((challenge) => (
            <div key={challenge.id} className="flex justify-center">
              <div className={`sm:min-w-[20rem] max-w-[20rem] w-full min-h-[19rem] rounded-2xl border p-6 flex flex-col justify-between ${
                theme === "dark" ? "bg-[#070045] border-[#3A3A5A]" : "bg-white border-gray-200 shadow-md"
              }`}>
                <div>
                  <div className="flex justify-between items-center mb-4 relative">
                    <span
                      className={`text-md font-bold px-2 py-1 rounded-md ${
                        challenge.difficulty === "Easy"
                          ? theme === "dark"
                            ? "bg-[rgba(63,101,58,0.69)] text-[#01FE01]"
                            : "bg-green-100 text-green-700"
                          : challenge.difficulty === "Medium"
                          ? theme === "dark"
                            ? "bg-[rgba(255,208,51,0.57)] text-[#FFA500]"
                            : "bg-yellow-100 text-yellow-700"
                          : challenge.difficulty === "Hard"
                          ? theme === "dark"
                            ? "bg-[#F59898] text-[rgba(255,0,0,0.89)]"
                            : "bg-red-100 text-red-700"
                          : theme === "dark"
                          ? "bg-gray-700 text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {challenge.difficulty}
                    </span>
                    <span className={theme === "dark" ? "ml-[3rem] text-white" : "ml-[3rem] text-gray-800"}>
                      {challenge?.relation}
                    </span>
                    <button
                      className={theme === "dark" ? "text-white hover:text-gray-400" : "text-gray-600 hover:text-gray-800"}
                      onClick={() => toggleDropdown(challenge.id)}
                    >
                      ⋮
                    </button>
                    <div className={`${
                      openDropdownChallengeId === challenge.id ? "block" : "hidden"
                    } absolute right-2 mt-2 w-28 rounded shadow-lg z-50 ${
                      theme === "dark" ? "bg-[#070045] border-[#3A3A5A]" : "bg-white border-gray-200"
                    }`}>
                      <button
                        className={`w-full text-left px-4 py-2 text-sm ${
                          theme === "dark" ? "text-red-400 hover:bg-[#3A3A5A]" : "text-red-600 hover:bg-red-100"
                        }`}
                        onClick={() => handleDelete(challenge.id)}
                        disabled={isDeleting}
                      >
                        {isDeleting ? "Deleting..." : "Remove"}
                      </button>
                    </div>
                  </div>
                  <div className="mb-4">
                    <h1 className={`text-xl sm:text-2xl font-bold ${
                      theme === "dark" ? "text-neutral-300" : "text-gray-800"
                    } mb-2`}>
                      {challenge.title}
                    </h1>
                    <p className={`text-sm sm:text-base line-clamp-3 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}>
                      {challenge.description}
                    </p>
                  </div>
                </div>
                <div>
                  <div className={`flex items-center my-4 justify-start ${
                    theme === "dark" ? "text-white" : "text-gray-800"
                  }`}>
                    <FaStopwatch />
                    <p className="ml-3">Est. Time: {challenge.estimatedTime || "30 Minutes"}</p>
                  </div>
                  <div className="flex items-center justify-between mt-6">
                    <div className={`flex gap-4 text-sm ${
                      theme === "dark" ? "text-white" : "text-gray-800"
                    }`}>
                      <span>{challenge.likes || 0} likes</span>
                      <span>{challenge.completions || 0} completions</span>
                    </div>
                    {challenge.documentUrl == null ? (
                      <Link to={`/admin/editChallenge/${challenge.id}`}>
                        <button className={`rounded-full px-6 py-2 text-white font-bold text-sm shadow-lg transition-all duration-300 ${
                          theme === "dark"
                            ? "bg-gradient-to-r from-[#00ffee] to-purple-500 hover:from-purple-500 hover:to-[#00ffee]"
                            : "bg-gradient-to-r from-blue-400 to-purple-400 hover:from-purple-400 hover:to-blue-400"
                        }`} onClick={() => navigate(`/editChallenge/${challenge._id}`)}>
                          View
                        </button>
                      </Link>
                    ) : (
                      <Link>
                        <button
                          onClick={() => openFile(challenge.documentUrl)}
                          className={`rounded-full px-6 py-2 text-white font-bold text-sm shadow-lg transition-all duration-300 ${
                            theme === "dark"
                              ? "bg-gradient-to-r from-[#00ffee] to-purple-500 hover:from-purple-500 hover:to-[#00ffee]"
                              : "bg-gradient-to-r from-blue-400 to-purple-400 hover:from-purple-400 hover:to-blue-400"
                          }`}
                        >
                          View
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filteredChallenges?.length === 0 && (
            <div className={`col-span-full text-center text-xl mt-10 ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}>
              No challenges found matching your filters and search query.
            </div>
          )}
        </div>
      </div>

      {showAddChallengeModal && (
        <div className={`fixed inset-0 flex justify-center items-start z-50 px-4 py-10 overflow-y-auto ${
          theme === "dark" ? "bg-black/70" : "bg-black/30"
        }`}>
          <div className={`mx-auto w-full max-w-xl p-6 rounded-2xl shadow-2xl border relative max-h-[90vh] overflow-y-auto scrollbar-hide ${
            theme === "dark" ? "bg-[#070045] border-[#3A3A5A]" : "bg-white border-gray-200"
          }`}>
            <button
              type="button"
              onClick={handleCloseAddChallengeModal}
              className={`absolute top-4 right-4 p-2 cursor-pointer rounded-full transition-colors ${
                theme === "dark" ? "text-gray-400 hover:bg-[#3A3A5A]" : "text-gray-600 hover:bg-gray-200"
              }`}
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className={`text-2xl font-bold mb-6 text-center ${
              theme === "dark" ? "text-white" : "text-gray-800"
            }`}>
              Create New Challenge
            </h2>
            <form onSubmit={handleCreateNewChallenge} className="space-y-4">
              <div>
                <label htmlFor="challenge-title" className={`block mb-1 font-medium text-sm ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}>
                  Challenge Title *
                </label>
                <input
                  id="challenge-title"
                  type="text"
                  name="title"
                  value={newChallengeData.title}
                  onChange={handleNewChallengeInputChange}
                  placeholder="e.g., Implement QuickSort"
                  maxLength={70}
                  required
                  className={`w-full rounded-md px-3 py-2 border text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                    theme === "dark"
                      ? "bg-[#07032B] border-[#3A3A5A] text-gray-100"
                      : "bg-white border-gray-300 text-gray-800"
                  }`}
                />
                <p className={`text-xs mt-1 ${
                  theme === "dark" ? "text-gray-500" : "text-gray-600"
                }`}>Max {70 - newChallengeData.title.length} characters remaining.</p>
              </div>
              <div>
                <label htmlFor="challenge-description" className={`block mb-1 font-medium text-sm ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}>
                  Challenge Description *
                </label>
                <textarea
                  id="challenge-description"
                  name="description"
                  value={newChallengeData.description}
                  onChange={handleNewChallengeInputChange}
                  placeholder="Describe what the user needs to build or solve..."
                  maxLength={300}
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
                    {newChallengeData.description.length}/300 characters
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="challenge-difficulty" className={`block mb-1 font-medium text-sm ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Difficulty *
                  </label>
                  <select
                    id="challenge-difficulty"
                    name="difficulty"
                    value={newChallengeData.difficulty}
                    onChange={handleNewChallengeInputChange}
                    required
                    className={`w-full rounded-md px-3 py-2 border text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                      theme === "dark"
                        ? "bg-[#07032B] border-[#3A3A5A] text-gray-100"
                        : "bg-white border-gray-300 text-gray-800"
                    }`}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="challenge-context" className={`block mb-1 font-medium text-sm ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Context (e.g., Frontend, Algorithms)
                  </label>
                  <input
                    id="challenge-context"
                    type="text"
                    name="context"
                    value={newChallengeData.context}
                    onChange={handleNewChallengeInputChange}
                    placeholder="e.g., Data Structures"
                    maxLength={30}
                    className={`w-full rounded-md px-3 py-2 border text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                      theme === "dark"
                        ? "bg-[#07032B] border-[#3A3A5A] text-gray-100"
                        : "bg-white border-gray-300 text-gray-800"
                    }`}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="challenge-time" className={`block mb-1 font-medium text-sm ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}>
                  Estimated Time (e.g., 1 hour, 30 minutes)
                </label>
                <input
                  id="challenge-time"
                  type="text"
                  name="estimatedTime"
                  value={newChallengeData.estimatedTime}
                  onChange={handleNewChallengeInputChange}
                  placeholder="e.g., 2 hours"
                  maxLength={30}
                  className={`w-full rounded-md px-3 py-2 border text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                    theme === "dark"
                      ? "bg-[#07032B] border-[#3A3A5A] text-gray-100"
                      : "bg-white border-gray-300 text-gray-800"
                  }`}
                />
              </div>
              <div>
                <label
                  htmlFor="challenge-document"
                  className={`block mb-1 font-medium text-sm ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Upload Supporting Document (optional)
                </label>
                <input
                  id="challenge-document"
                  type="file"
                  name="document"
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
                  onChange={handleFileChange}
                  className={`w-full text-sm ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                />
                {newChallengeData.document && (
                  <p className={`text-xs mt-1 ${
                    theme === "dark" ? "text-green-400" : "text-green-600"
                  }`}>
                    Selected: {newChallengeData.document.name}
                  </p>
                )}
              </div>
              <div className={`mt-6 pt-4 border-t text-center ${
                theme === "dark" ? "border-[#3A3A5A]" : "border-gray-200"
              }`}>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border mb-3 ${
                  theme === "dark"
                    ? "bg-purple-500/10 border-purple-500/20"
                    : "bg-purple-100 border-purple-200"
                }`}>
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                  <span className={`text-xs font-medium ${
                    theme === "dark" ? "text-purple-400" : "text-purple-600"
                  }`}>
                    Live Challenge Card Preview
                  </span>
                </div>
                <div className="flex justify-center">
                  <div className={`max-w-[18rem] w-full min-h-[17rem] rounded-2xl border p-4 flex flex-col justify-between ${
                    theme === "dark" ? "bg-[#070045] border-[#3A3A5A]" : "bg-white border-gray-200 shadow-md"
                  }`}>
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span
                          className={`font-bold text-xs px-2 py-0.5 rounded-md ${
                            newChallengeData.difficulty === "Easy"
                              ? theme === "dark"
                                ? "bg-[rgba(63,101,58,0.69)] text-[#01FE01]"
                                : "bg-green-100 text-green-700"
                              : newChallengeData.difficulty === "Medium"
                              ? theme === "dark"
                                ? "bg-[rgba(255,208,51,0.57)] text-[#FFA500]"
                                : "bg-yellow-100 text-yellow-700"
                              : newChallengeData.difficulty === "Hard"
                              ? theme === "dark"
                                ? "bg-[#F59898] text-[rgba(255,0,0,0.89)]"
                                : "bg-red-100 text-red-700"
                              : theme === "dark"
                              ? "bg-gray-700 text-white"
                              : "bg-gray-200 text-gray-800"
                          }`}
                        >
                          {newChallengeData.difficulty}
                        </span>
                        <span className={`text-xs ${
                          theme === "dark" ? "text-white" : "text-gray-800"
                        }`}>
                          {newChallengeData.context || "Context"}
                        </span>
                      </div>
                      <div className="mb-3">
                        <h1 className={`text-xl font-bold ${
                          theme === "dark" ? "text-neutral-300" : "text-gray-800"
                        }`}>
                          {newChallengeData.title || "Challenge Title"}
                        </h1>
                        <p className={`text-sm line-clamp-3 ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}>
                          {newChallengeData.description || "Challenge description will be here..."}
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className={`flex items-center my-2 text-xs justify-start ${
                        theme === "dark" ? "text-white" : "text-gray-800"
                      }`}>
                        <FaStopwatch size={12} />
                        <p className="ml-2">Est. Time: {newChallengeData.estimatedTime || "N/A"}</p>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className={`flex gap-2 text-xs ${
                          theme === "dark" ? "text-white" : "text-gray-800"
                        }`}>
                          <span>0 likes</span>
                          <span>0 completions</span>
                        </div>
                        <Link to={`/challenge/module/1`}>
                          <button
                            type="button"
                            className={`rounded-full px-4 py-1.5 text-white font-bold text-xs opacity-50 cursor-not-allowed shadow-lg ${
                              theme === "dark"
                                ? "bg-gradient-to-r from-[#00ffee] to-purple-500"
                                : "bg-gradient-to-r from-blue-400 to-purple-400"
                            }`}
                            disabled
                          >
                            View
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`flex justify-center gap-3 mt-6 pt-4 border-t ${
                theme === "dark" ? "border-[#3A3A5A]" : "border-gray-200"
              }`}>
                <button
                  type="button"
                  onClick={handleCloseAddChallengeModal}
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
                  disabled={creatingChallenge}
                >
                  {creatingChallenge ? "Creating..." : "Create challenge"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Challenges;