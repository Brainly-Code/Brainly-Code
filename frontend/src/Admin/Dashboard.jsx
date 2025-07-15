import { toast } from "react-toastify";
import { useGetChallengesQuery } from "../redux/api/challengeSlice";
import SideBar from "./components/SideBar";
import Loader from "../Components/ui/Loader";
import UserChart from "./components/Chart";
import { FaArrowRight } from "react-icons/fa";
import Footer from "../Components/ui/Footer";
import Header from "./components/AdminFloatingNavBar";

// correct imports stay the same...
const Dashboard = () => {
  const { data: challenges, error, isLoading } = useGetChallengesQuery();

  if (error) {
    toast.error(error);
  }

  const filteredChallenges = challenges
    ?.slice()
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 1);

  if (isLoading) return <Loader />;

  return (
    <div className="w-full bg-[#2b1edf] flex flex-col">
      <Header />

      <div className="flex w-full flex-1">
        <SideBar />

        <main className="flex-1 p-8">
          {/* ... chart and rates */}

          {/* Chart */}
          <div className="flex justify-center mb-12">
            <div className="w-[600px] h-[350px] bg-[#0d0e70] p-4 rounded-lg">
              <UserChart />
            </div>
          </div>

          {/* Rates Section */}
          <div className="text-center text-white mb-8">
            <h2 className="text-xl font-semibold mb-4">Rates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2].map((_, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="rounded-md bg-gradient-to-r from-green-800 to-purple-950 w-64 h-44 flex justify-center items-center">
                    <div className="rounded-full bg-blue-900 w-16 h-16 flex items-center justify-center">
                      <p className="font-bold text-lg">{"</>"}</p>
                    </div>
                  </div>
                  <div className="bg-[#120b46] rounded-xl -mt-10 p-6 w-72">
                    <span className="text-sm font-bold text-[#00CED1] bg-[#00CED1] bg-opacity-70 px-3 py-1 rounded-full">
                      Beginner
                    </span>
                    <h3 className="text-lg font-bold mt-4">Web Development Basics</h3>
                    <p className="text-sm mt-2">Learn HTML, CSS, and JavaScript fundamentals through interactive lessons.</p>
                    <div className="flex justify-between mt-5 text-sm">
                      <div>
                        <p>8 modules</p>
                        <p>8 lessons</p>
                      </div>
                      <button className="text-[#00ffee] flex items-center gap-2">
                        View Course
                        <FaArrowRight size={18} />
                      </button>
                    </div>
                    <p className="text-sm mt-2">94%  Watched this course</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Most Liked Challenge */}
          <div className="text-center text-white mb-8">
            <h2 className="text-xl font-semibold mb-4">Most Liked Challenge</h2>

            {filteredChallenges?.map((challenge) => (
              <div
                key={challenge._id || challenge.id}
                className="mx-auto max-w-sm bg-[#120b46] rounded-2xl border border-[#3A3A5A] p-6"
              >
                <div className="flex justify-between mb-2">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
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
                  <span className="text-xs text-gray-300">{challenge.category || 'Strings'}</span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                  {challenge.title}
                </h3>
                <p className="text-sm text-gray-400 mb-4">{challenge.description}</p>

                <div className="flex justify-between text-xs text-gray-400 mb-4">
                  <p>Est. Time: {challenge.estimatedTime || '30 Minutes'}</p>
                  <p>{challenge.likes} Likes</p>
                  <p>{challenge.completions || '500'} Completions</p>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard
