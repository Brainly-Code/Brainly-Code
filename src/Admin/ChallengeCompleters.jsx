import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { useGetChallengeCompletersQuery } from '../redux/api/AdminSlice'
import Loader from '../Components/ui/Loader';
import dayjs from 'dayjs'
import profile from '../assets/user.png';

const ChallengeCompleters = () => {
  const { id } = useParams();
  const { data: completers = [], isLoading, error } = useGetChallengeCompletersQuery(id);

  if (isLoading) {
    return <Loader />;
  }
  if (error) {
    return (
      <div className="text-center text-red-500">
        Error while fetching completers
      </div>
    );
  }
  return (
    <div>
      <Link to="/admin/challenges">
        <button className="px-8 py-3 rounded-lg bg-blue-500 hover:bg-blue-700 transition">Back</button>
      </Link>
      <h1 className='mt-5 text-xl text-center font-semibold text-white'>
        {completers.length} Student{completers.length !== 1 ? "s" : ""} completed this challenge:
      </h1>
      <div className="m-8 bg-[#1e1285] h-full w-[80%] p-[1rem] rounded-lg grid gap-4">
        {completers.length > 0 ? (
          completers.map(completer => (
            <div key={completer.user?.id} className="flex items-center bg-[#2929a3] p-5 border-gray-500 border rounded-lg shadow">
              <img
                src={completer?.photo || profile}
                alt="avatar"
                className="w-12 h-12 rounded-full mr-4 border"
              />
              <div>
                <h2 className="text-lg font-bold text-gray-100">
                  {completer.user?.username}
                </h2>
                <p className="text-md text-gray-200">
                  Submission: {dayjs(completer.completionTime).format("MMM D, YYYY h:mm A")}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className='h-full'>
            <p className='text-center font-medium text-gray-400'>Sorry! No one has completed this challenge yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
export default ChallengeCompleters
