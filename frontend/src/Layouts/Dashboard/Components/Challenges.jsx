import React, { useState } from 'react';
import Loader from '../../../Components/ui/Loader';
import { Link } from 'react-router-dom';
import { FaStopwatch } from 'react-icons/fa';
import { CiUndo, CiRedo } from 'react-icons/ci';
import { HiOutlineAdjustmentsHorizontal } from 'react-icons/hi2';
import { toast } from 'react-toastify'; // For notifications
import { X } from 'lucide-react'; // For modal close icon

// import { useGetChallengesQuery } from '../../../redux/api/challengeSlice' // Commented out for mock data

// Mock data for challenges
const initialMockChallenges = [
  {
    _id: "challenge-1",
    title: "Implement a Dynamic Array",
    description: "Create a dynamic array (ArrayList in Java, `std::vector` in C++) from scratch, supporting operations like add, remove, get, and resize.",
    difficulty: "Medium",
    context: "Data Structures",
    estimatedTime: "2 hours",
    likes: 150,
    completions: 80,
  },
  {
    _id: "challenge-2",
    title: "Build a Simple Todo List with React",
    description: "Develop a basic Todo List application using React.js. Features should include adding, deleting, and marking tasks as complete.",
    difficulty: "Easy",
    context: "Frontend",
    estimatedTime: "1 hour",
    likes: 230,
    completions: 190,
  },
  {
    _id: "challenge-3",
    title: "RESTful API with Node.js and Express",
    description: "Design and implement a RESTful API for a blog application using Node.js and Express. Include routes for posts (CRUD) and basic user authentication.",
    difficulty: "Hard",
    context: "Backend",
    estimatedTime: "4 hours",
    likes: 90,
    completions: 45,
  },
  {
    _id: "challenge-4",
    title: "FizzBuzz in Python",
    description: "Write a program that prints numbers from 1 to 100. For multiples of three, print 'Fizz' instead of the number, and for the multiples of five, print 'Buzz'. For numbers which are multiples of both three and five, print 'FizzBuzz'.",
    difficulty: "Easy",
    context: "Logic",
    estimatedTime: "30 minutes",
    likes: 300,
    completions: 250,
  },
  {
    _id: "challenge-5",
    title: "Implement a Binary Search Tree",
    description: "Build a Binary Search Tree (BST) from scratch, including insert, search, and delete operations. Ensure it maintains the BST properties.",
    difficulty: "Hard",
    context: "Data Structures",
    estimatedTime: "3 hours",
    likes: 110,
    completions: 60,
  },
];

const Challenges = () => {
  // Main state for the list of challenges
  const [challenges, setChallenges] = useState(initialMockChallenges);
  // History of challenge states for undo/redo
  const [challengeHistory, setChallengeHistory] = useState([initialMockChallenges]);
  // Current position in the history array
  const [historyIndex, setHistoryIndex] = useState(0);

  // State for Add Challenge modal visibility
  const [showAddChallengeModal, setShowAddChallengeModal] = useState(false);
  // State for Filter dropdown visibility
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  // State for the selected difficulty filter
  const [selectedDifficultyFilter, setSelectedDifficultyFilter] = useState("ALL");

  // State to hold data for a new challenge being created via the modal form
  const [newChallengeData, setNewChallengeData] = useState({
    title: "",
    description: "",
    difficulty: "Easy", // Default
    context: "General",  // Default
    estimatedTime: "1 hour", // Default
  });

  // Dummy loading and error states for mock data (replace with RTK Query states when integrating)
  const isLoading = false;
  const isError = false;

  // --- Undo/Redo Logic ---
  const addStateToHistory = (newChallengeState) => {
    const newHistory = challengeHistory.slice(0, historyIndex + 1); // Cut off future history if new action
    setChallengeHistory([...newHistory, newChallengeState]);
    setHistoryIndex(newHistory.length); // Point to the new last state
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
    if (historyIndex < challengeHistory.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setChallenges(challengeHistory[newIndex]);
      toast.info("Redo successful!");
    } else {
      toast.warn("Nothing to redo.");
    }
  };
  // --- End Undo/Redo Logic ---

  // --- Filter Logic ---
  const toggleFilterDropdown = () => {
    setShowFilterDropdown((prev) => !prev);
  };

  const applyFilter = (difficulty) => {
    setSelectedDifficultyFilter(difficulty);
    setShowFilterDropdown(false); // Close dropdown after selection
  };

  const filteredChallenges = challenges.filter((challenge) => {
    if (selectedDifficultyFilter === "ALL") {
      return true;
    }
    return challenge.difficulty === selectedDifficultyFilter;
  });
  // --- End Filter Logic ---

  // --- Add Challenge Modal Logic ---
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
    });
  };

  const handleNewChallengeInputChange = (e) => {
    const { name, value } = e.target;
    setNewChallengeData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateNewChallenge = (e) => {
    e.preventDefault();

    if (!newChallengeData.title || !newChallengeData.description) {
      toast.error("Please fill in title and description.");
      return;
    }

    const newChallengeId = `mock-${Date.now()}`; 
    const challengeToAdd = {
      _id: newChallengeId,
      title: newChallengeData.title,
      description: newChallengeData.description,
      difficulty: newChallengeData.difficulty,
      context: newChallengeData.context,
      estimatedTime: newChallengeData.estimatedTime,
      likes: 0,
      completions: 0,
    };

    const updatedChallenges = [...challenges, challengeToAdd];
    setChallenges(updatedChallenges); 
    addStateToHistory(updatedChallenges);

    toast.success(`Challenge "${newChallengeData.title}" created successfully!`);
    handleCloseAddChallengeModal();
  };



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
        Error loading Challenges.
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="z-40 sticky top-28 backdrop-blur-xl  flex place-items-start justify-between p-3 rounded-b-lg shadow-lg mb-8">
        <span className="md:text-2xl text-lg font-normal text-gray-100">
          Challenges
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
            disabled={historyIndex === challengeHistory.length - 1}
            className={`w-8 h-8 flex items-center justify-center cursor-pointer rounded-full border border-gray-300 text-white transition-colors ${
              historyIndex === challengeHistory.length - 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-700"
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
            title="Filter Challenges"
          >
            <HiOutlineAdjustmentsHorizontal />
          </button>

         
          {showFilterDropdown && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-[#07032B] border border-[#3A3A5A] rounded-lg shadow-lg overflow-hidden z-50">
              <button
                onClick={() => applyFilter("ALL")}
                className="block w-full text-left px-4 py-2 text-gray-200 hover:bg-[#3A3A5A] transition-colors text-sm"
              >
                All Difficulties
              </button>
              <button
                onClick={() => applyFilter("Easy")}
                className="block w-full text-left px-4 py-2 text-gray-200 hover:bg-[#3A3A5A] transition-colors text-sm"
              >
                Easy
              </button>
              <button
                onClick={() => applyFilter("Medium")}
                className="block w-full text-left px-4 py-2 text-gray-200 hover:bg-[#3A3A5A] transition-colors text-sm"
              >
                Medium
              </button>
              <button
                onClick={() => applyFilter("Hard")}
                className="block w-full text-left px-4 py-2 text-gray-200 hover:bg-[#3A3A5A] transition-colors text-sm"
              >
                Hard
              </button>
            </div>
          )}

          <button
            onClick={handleAddChallengeClick}
            className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-[#00ffee] to-purple-500 text-white rounded-full font-semibold shadow-md hover:from-purple-500 hover:to-[#00ffee] transition-all duration-300"
            title="Add New Challenge"
          >
            <span>Add</span>
            <span>+</span>
          </button>
        </div>
      </div>

      <div className="flex-1">
        <h1 className='text-gray-300 font-bold mb-8 text-xl text-center '>All Challenges {`(${filteredChallenges.length || "0"})`}</h1>
        <div className="grid lg:grid-cols-3 justify-center text-start md:grid-cols-2 gap-6">
          {filteredChallenges.map((challenge) => (
            <div key={challenge._id || challenge.id} className="flex justify-center">
              <div className="sm:min-w-[20rem] max-w-[20rem] w-full bg-[#070045] min-h-[19rem] rounded-2xl border border-[#3A3A5A] p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span
                      className={`text-md font-bold px-2 py-1 rounded-md ${
                        challenge.difficulty === 'Easy'
                          ? 'bg-[rgba(63,101,58,0.69)] text-[#01FE01]'
                          : challenge.difficulty === 'Medium'
                          ? 'bg-[rgba(255,208,51,0.57)] text-[#FFA500]'
                          : challenge.difficulty === 'Hard'
                          ? 'bg-[#F59898] text-[rgba(255,0,0,0.89)]'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      {challenge.difficulty}
                    </span>
                    <span className='text-white'>{challenge.context}</span>
                  </div>

                  <div className="mb-4">
                    <h1 className="text-xl sm:text-2xl font-bold text-neutral-300 dark:text-neutral-200 mb-2">
                      {challenge.title}
                    </h1>
                    <p className="text-gray-400 text-sm sm:text-base line-clamp-3"> {/* Added line-clamp-3 */}
                      {challenge.description}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center text-white my-4 justify-start">
                    <FaStopwatch/> <p className='ml-3'>Est. Time: {challenge.estimatedTime || "30 Minutes"}</p>
                  </div>
                  <div className="flex items-center justify-between mt-6"> {/* Removed h-1/6 */}
                    <div className="flex gap-4"> {/* Used gap for spacing */}
                      <span className="text-white text-sm">{challenge.likes} likes</span>
                      <span className="text-white text-sm">{challenge.completions} completions</span>
                    </div>
                    <Link to={`/user/challenge/${challenge._id}`}> {/* Assuming a route for single challenge view */}
                      <button className="rounded-full bg-gradient-to-r from-[#00ffee] to-purple-500 px-6 py-2 text-white font-bold text-sm shadow-lg hover:from-purple-500 hover:to-[#00ffee] transition-all duration-300">
                        View
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAddChallengeModal && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-start z-50 px-4 py-10 overflow-y-auto">
          <div className="bg-[#070045] mx-auto w-full max-w-xl p-6 rounded-2xl shadow-2xl border border-[#3A3A5A] relative max-h-[90vh] overflow-y-auto scrollbar-hide">
            <button
              type="button"
              onClick={handleCloseAddChallengeModal}
              className="absolute top-4 right-4 p-2 cursor-pointer text-gray-400 hover:bg-[#3A3A5A] rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-white mb-6 text-center">Create New Challenge</h2>

            <form onSubmit={handleCreateNewChallenge} className="space-y-4">
              <div>
                <label htmlFor="challenge-title" className="block mb-1 font-medium text-gray-300 text-sm">
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
                  className="w-full rounded-md px-3 py-2 border border-[#3A3A5A] text-gray-100 bg-[#07032B] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Max {70 - newChallengeData.title.length} characters remaining.</p>
              </div>

              <div>
                <label htmlFor="challenge-description" className="block mb-1 font-medium text-gray-300 text-sm">
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
                  className="w-full rounded-md px-3 py-2 border border-[#3A3A5A] text-gray-100 bg-[#07032B] resize-y focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm"
                />
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-500">
                    {newChallengeData.description.length}/300 characters
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="challenge-difficulty" className="block mb-1 font-medium text-gray-300 text-sm">
                    Difficulty *
                  </label>
                  <select
                    id="challenge-difficulty"
                    name="difficulty"
                    value={newChallengeData.difficulty}
                    onChange={handleNewChallengeInputChange}
                    required
                    className="w-full rounded-md px-3 py-2 border border-[#3A3A5A] text-gray-100 bg-[#07032B] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="challenge-context" className="block mb-1 font-medium text-gray-300 text-sm">
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
                    className="w-full rounded-md px-3 py-2 border border-[#3A3A5A] text-gray-100 bg-[#07032B] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="challenge-time" className="block mb-1 font-medium text-gray-300 text-sm">
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
                  className="w-full rounded-md px-3 py-2 border border-[#3A3A5A] text-gray-100 bg-[#07032B] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm"
                />
              </div>

              {/* Live Challenge Card Preview */}
              <div className="mt-6 pt-4 border-t border-[#3A3A5A] text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-500/10 rounded-full border border-purple-500/20 mb-3">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-purple-400">
                    Live Challenge Card Preview
                  </span>
                </div>
                <div className="flex justify-center">
                  <div className="max-w-[18rem] w-full bg-[#070045] min-h-[17rem] rounded-2xl border border-[#3A3A5A] p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span
                          className={`font-bold text-xs px-2 py-0.5 rounded-md ${
                            newChallengeData.difficulty === 'Easy'
                              ? 'bg-[rgba(63,101,58,0.69)] text-[#01FE01]'
                              : newChallengeData.difficulty === 'Medium'
                              ? 'bg-[rgba(255,208,51,0.57)] text-[#FFA500]'
                              : newChallengeData.difficulty === 'Hard'
                              ? 'bg-[#F59898] text-[rgba(255,0,0,0.89)]'
                              : 'bg-gray-200 text-gray-800'
                          }`}
                        >
                          {newChallengeData.difficulty}
                        </span>
                        <span className='text-white text-xs'>{newChallengeData.context || 'Context'}</span>
                      </div>
                      <div className="mb-3">
                        <h1 className="text-xl font-bold text-neutral-300">
                          {newChallengeData.title || "Challenge Title"}
                        </h1>
                        <p className="text-gray-400 text-sm line-clamp-3">
                          {newChallengeData.description || "Challenge description will be here..."}
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center text-white my-2 text-xs justify-start">
                        <FaStopwatch size={12}/> <p className='ml-2'>Est. Time: {newChallengeData.estimatedTime || "N/A"}</p>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex gap-2">
                          <span className="text-white text-xs">0 likes</span>
                          <span className="text-white text-xs">0 completions</span>
                        </div>
                        <button
                          type="button"
                          className="rounded-full bg-gradient-to-r from-[#00ffee] to-purple-500 px-4 py-1.5 text-white font-bold text-xs opacity-50 cursor-not-allowed shadow-lg"
                          disabled
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-3 mt-6 pt-4 border-t border-[#3A3A5A]">
                <button
                  type="button"
                  onClick={handleCloseAddChallengeModal}
                  className="px-5 py-2.5 rounded-full cursor-pointer bg-gradient-to-r from-gray-700 to-gray-800 text-white font-medium hover:from-gray-800 hover:to-gray-900 transition-all duration-300 border border-gray-600 shadow-md text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-full cursor-pointer bg-gradient-to-r from-[#00ffee] to-purple-500 text-white font-semibold hover:from-purple-500 hover:to-[#00ffee] transition-all duration-300 shadow-lg text-sm"
                >
                  Create Challenge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Challenges;