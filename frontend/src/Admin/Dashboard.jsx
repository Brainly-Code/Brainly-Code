import { toast } from "react-toastify";
import { useGetChallengesQuery } from "../redux/api/challengeSlice";
import SideBar from "./components/SideBar";
import Loader from "../Components/ui/Loader";
import GrapshSection from "./components/Chart";
import { FaArrowRight } from "react-icons/fa";
import Footer from "../Components/ui/Footer";
import Header from "./components/AdminFloatingNavBar";
import DashboardStats from "./components/DashboardStat.jsx"
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
    <div className="w-full bg-[#0D0056] text-white">
      {/* Fixed Header */}
      <div className="sticky backdrop-blur-xl top-0 z-50 w-full">
        <Header />
      </div>
  
      {/* Fixed Sidebar */}
      <div className="fixed top-24 left-0 h-screen w-27 sm:w-60 bg-[#0D0056] z-40">
        <SideBar />
      </div>
  
      {/* Main Content */}
      <div className="sm:ml-56 ml-5   min-h-screen overflow-x-hidden overflow-y-auto px-8 ">
        <DashboardStats/>
        {/* Chart */}
        <div className="flex justify-center mb-12">
          <GrapshSection />
        </div>
  
        {/* Rates Section */}
        <div className="text-center text-white mb-8">
          <h2 className="text-xl font-semibold mb-4">Rates</h2>
          <Rates />
        </div>
  
  
        <Footer />
      </div>
    </div>
  );
  
};

export default Dashboard
