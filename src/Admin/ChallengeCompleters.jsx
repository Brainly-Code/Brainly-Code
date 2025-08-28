import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { useGetChallengeCompletersQuery } from '../redux/api/AdminSlice'
import Loader from '../Components/ui/Loader';
import dayjs from 'dayjs'

const ChallengeCompleters = () => {
  const id = useParams();
  const {data: completers, isLoading, error} = useGetChallengeCompletersQuery(id.id);

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
      <h1 className='mt-5 text-xl text-center font-semibold text-white'>Students who completed this challenge:</h1>
      <div className="m-8 bg-[#1e1285] h-full w-[80%] p-[1rem] rounded-lg grid">
        {completers?.map(completer => (
          <div className="w-full bg-[#1e1285] p-5 border-gray-500 border h-full p-3">
          <h2 className="text-lg inline text-gray-100">
             {completer?.user?.id}. {""}
          </h2>
          <h2 className="text-lg inline text-gray-100">
             {completer?.user?.username}
          </h2>
          <p className="text-md text-gray-200">Submition time: {dayjs(completer?.completionTime).format("MMM D, YYYY h:mm A")}</p>      
        </div>
        ))}
      </div>
    </div>
  )
}

export default ChallengeCompleters
