import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { useGetChallengeCompletersQuery } from '../redux/api/AdminSlice'
import Loader from '../Components/ui/Loader';

const ChallengeCompleters = () => {
  const id = useParams();
  const {completers, isLoading, error} = useGetChallengeCompletersQuery(id.id);

  console.log(completers);
  if(isLoading) {
    return <Loader />
  }

  if(error) {
    console.log(error)
    return <div>
      Error while fetching completers
    </div>
  }
  return (
    <div>
      <Link to="/admin/challenges">
          <button className="px-8 py-3 rounded-lg bg-blue-500">Back</button>
        </Link>
      <h1 className='mt-5 text-xl text-white'>Students who completed this challenge:</h1>
      <div className="m-8 w-full grid">
        {completers?.map(completer => (
          <div className="w-full h-full p-3">
          <h2 className="text-lg text-gray-100">
             {completer?.user?.id}
          </h2>
          <h2 className="text-lg text-gray-100">
             {completer?.user?.username}
          </h2>
          <p className="text-md text-gray-200">Submition time: {completer?.completionTime}</p>      
        </div>
        ))}
      </div>
    </div>
  )
}

export default ChallengeCompleters
