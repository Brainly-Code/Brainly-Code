import { toast } from "react-toastify";
import { useGetChallengesQuery } from "../redux/api/challengeSlice";
import SideBar from "./components/SideBar";
import Loader from "../Components/ui/Loader";
import GrapshSection from "./components/Chart";
import { FaArrowRight } from "react-icons/fa";
import Footer from "../Components/ui/Footer";
import Header from "./components/AdminFloatingNavBar";
import Course from "./components/Course";
import Challenge from "./components/Challenge";
import Rates from "./components/Rates"

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
    <div className="w-full overflow-x-hidden bg-[#0D0056] flex flex-col">
      <Header />

      <div className="flex w-full overflow-x-hidden overflow-y-auto flex-1">
      <div className="static">
      <SideBar />
      </div>

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-8">
          {/* ... chart and rates */}

          {/* Chart */}
          <div className="flex relative justify-center mb-12">
              <GrapshSection />
            
          </div>

          {/* Rates Section */}
          <div className="text-center text-white mb-8">
            <h2 className="text-xl font-semibold mb-4">Rates</h2>
            <div className="">
            <Rates/>
            </div>
          </div>

        
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard
