import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useGetChallengesQuery, useToggleChallengeLikeMutation } from "../redux/api/challengeSlice";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import TextGenerateEffect from "./ui/TextGenerate";
import Footer from "./ui/Footer";
import Header from "./ui/Header";
import BgLoader from "./ui/BgLoader";
import like from "../assets/like.png";
import liked from "../assets/liked.png";
import { FaCheck, FaRegCheckCircle } from "react-icons/fa";

const Challenges = () => {
  const { data: challenges, error, isLoading, refetch } = useGetChallengesQuery();
  const [toggleLike] = useToggleChallengeLikeMutation();
  const [challengesState, setChallengesState] = useState([]);

  const { user } = useSelector((state) => state.auth);


  // Local states for search
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchHints, setShowSearchHints] = useState(false);
  const searchRef = useRef();

  // Difficulty filter
  const [filterLevel, setFilterLevel] = useState("ALL");

  // Seting initial challenge state with like info
  useEffect(() => {
    if (challenges) {
      const withLikes = challenges.map((ch) => {
        const userHasLiked = ch.likesList?.some((like) => like.userId === user?.id) || false;
        return { ...ch, userHasLiked };
      });
      setChallengesState(withLikes);
    }
  }, [challenges, user?.id]);

  // Doing a click outside to hide search hints
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchHints(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (error) toast.error(error);

  const handleLikeClick = async (challengeId) => {
    try {
      const res = await toggleLike({ id: challengeId, userId: user?.id }).unwrap();
      toast.success(res.message);

      setChallengesState((prev) =>
        prev.map((ch) =>
          ch.id === challengeId
            ? {
                ...ch,
                userHasLiked: res.liked,
                likes: res.liked ? ch.likes + 1 : ch.likes - 1,
              }
            : ch
        )
      );

      refetch();
    } catch (error) {
      toast.error("Failed to like challenge");
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
    // Ensure the URL points to your Cloudinary account
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

  let filteredChallenges =
    filterLevel === "ALL"
      ? challengesState
      : challengesState?.filter((c) => c.difficulty === filterLevel);

  if (searchTerm.trim()) {
    filteredChallenges = filteredChallenges?.filter((c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (isLoading) return <BgLoader />;

  return (
    <div className="bg-[#0D0056] h-full">
      <Header />

      {/* Hero */}
      <section className="mt-[2rem] w-full md:w-[50%] px-4 text-center mx-auto">
        {/* Search bar */}
        <div ref={searchRef} className="mt-6 flex mb-[4rem] flex-col items-center">
          <input
            type="text"
            className="w-full md:w-2/3 px-4 py-2 bg-[#6B5EDD] bg-opacity-70 text-gray-50 rounded-lg border border-[#6B5EDD] focus:outline-none focus:ring-2 focus:ring-[#2a28d4]"
            placeholder="Search challenges by title..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSearchHints(true);
            }}
            onKeyDown={(e) => e.key === "Enter" && setShowSearchHints(false)}
          />
          {showSearchHints && searchTerm.trim() && (
            <div className="w-full md:w-2/3 bg-[#6B5EDD] bg-opacity-70 rounded-lg shadow mt-2 p-2">
              {filteredChallenges?.length > 0 ? (
                <ul>
                  {filteredChallenges.slice(0, 5).map((ch) => (
                    <li
                      key={ch.id}
                      className="cursor-pointer px-2 py-1 hover:bg-[#6B5EDD] rounded text-gray-200"
                      onClick={() => {
                        setSearchTerm(ch.title);
                        setShowSearchHints(false);
                      }}
                    >
                      {ch.title}
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-gray-300 text-sm">No challenges found.</span>
              )}
            </div>
          )}
        </div>
        <h1 className="text-2xl md:text-4xl font-bold flex justify-center text-gray-300">
          <span className="mr-2 text-white">Coding</span>
          <TextGenerateEffect className="font-bold text-[#03C803]" words={"Challenges"} />
        </h1>
        <p className="text-gray-400 text-sm md:text-base mt-2">
          Test your skills, solve problems and compete with others through our interactive coding challenges.
        </p>

      </section>

      {/* Filter buttons */}
      <section className="px-4 sm:px-8 lg:px-20 mt-6">
        <div className="mb-8 flex gap-2 justify-center">
          {["ALL", "Easy", "Medium", "Hard"].map((level) => (
            <button
              key={level}
              onClick={() => setFilterLevel(level)}
              className={`py-1 px-4 sm:py-2 sm:px-5 border rounded-md font-semibold${
                filterLevel === level
                  ? "bg-[#2a28d4] text-white"
                  : "bg-transparent text-gray-300 hover:bg-[#6B5EDD] hover:text-white"
              }`}
            >
              {level}
            </button>
          ))}
        </div>

        {/* Challenges grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-14 mb-12">
          {filteredChallenges?.map((challenge) => (
            <div key={challenge._id || challenge.id} className="h-full rounded-[22px] p-6 shadow-lg bg-[#0d0b3d]">
              <div className="flex justify-between items-center mb-4">
                <span
                  className={`text-sm font-bold px-2 py-1 rounded-md ${
                    challenge.difficulty === "Easy"
                      ? "bg-[rgba(63,101,58,0.69)] text-[#01FE01]"
                      : challenge.difficulty === "Medium"
                      ? "bg-[rgba(255,208,51,0.57)] text-[#FFA500]"
                      : challenge.difficulty === "Hard"
                      ? "bg-[#F59898] text-[rgba(255,0,0,0.89)]"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {challenge.difficulty}
                </span>
              </div>

              <h1 className="text-xl font-bold text-neutral-300">{challenge.title}</h1>
              <p className="text-gray-400 text-sm">{challenge.description}</p>

              <div className="flex justify-around mt-6">
                {challenge.documentUrl === null && 
                <Link to={`/user/challenge/${challenge.id}`}>
                  <button className="rounded-lg bg-[#06325B] hover:bg-[#06325b96] py-2 px-6 text-white font-bold text-sm">
                    Start
                  </button>
                </Link>
                }
                {challenge.documentUrl != null && 
                <Link onClick={() => openFile(challenge.documentUrl)}>
                  <button className="rounded-lg bg-[#06325B] hover:bg-[#06325b96] py-2 px-6 text-white font-bold text-sm">
                    Start
                  </button>
                </Link>
                }
                {challenge.userHasLiked ? (
                    <FaCheck
                      size={24}
                      className="cursor-pointer hover:scale-110 transition-transform text-green-400"
                      onClick={() => handleLikeClick(challenge.id)}
                    />
                  ) : (
                    <FaRegCheckCircle
                      size={24}
                      className="cursor-pointer hover:scale-110 transition-transform text-gray-400"
                      onClick={() => handleLikeClick(challenge.id)}
                    />
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Challenges;
