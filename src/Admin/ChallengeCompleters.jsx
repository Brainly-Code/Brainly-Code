import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCorrectCompleterMutation, useGetChallengeCompletersQuery } from '../redux/api/AdminSlice'
import Loader from '../Components/ui/Loader';
import dayjs from 'dayjs'
import profile from '../assets/user.png';
import { ThemeContext } from '../Contexts/ThemeContext';
import { FaArrowDown, FaArrowRight, FaCheck, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useSendMessageMutation } from '../redux/api/messageSlice';

const ChallengeCompleters = () => {
  const { theme } = useContext(ThemeContext);
  const [ userSolution, setUserSolution ] = useState(null);
  const [ showSolution, setShowSolution ] = useState(false);
  const { id } = useParams();
  const { data: completers = [], isLoading, error } = useGetChallengeCompletersQuery(id);
  const [correct] = useCorrectCompleterMutation();
  const comp = completers.find(completer => completer.user.id ===1);
  console.log(comp)
  const findCompleter = (userId) => {
    const completer = completers.find(completer => completer?.user?.id === userId);
    return completer;
  }

  const handleCorrectCompleter = async(id) => {
    try {

      findCompleter(id);
      // const res = await correct(id, {completer}).unwrap();
      // toast.success("Ticked successfully")
    } catch (error) {
      toast.error("Failed to tick")
      console.log(error);
    }    
  }

  const handleAnswerIsWrong = async (id) => {
    try{
      const user = findCompleter(id);
      console.log(user);
      // await rejectAnswer(user).unwrap();
    }catch(error) {
      toast.error("Failed to reject answer");
    }
  }

  const handleShowOrHideSol = () => {
    if(showSolution === false){
      setShowSolution(true);
    }else {
      setShowSolution(false);
    };
  }

  if (isLoading) {
    return <Loader />;
  }
  if (error) {
    return (
      <div className={`text-center ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
        Error while fetching completers
      </div>
    );
  }

  
  return (
    <div className={`${theme === 'dark' ? '' : 'bg-gray-50'} min-h-screen transition-all duration-500`}>
      <Link to={`/admin/editChallenge/${id}`}>
        <button className={`${theme === "dark"
              ? "bg-gradient-to-r from-[#00ffff] to-purple-400 text-gray-300"
              : "bg-gradient-to-r from-blue-400 to-purple-400 text-white" } px-8 py-3 rounded-lg bg-blue-500`}>
          Back
        </button>
      </Link>
      <h1 className={`mt-5 text-xl text-center font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'
        }`}>
        {completers.length} Student{completers.length !== 1 ? "s" : ""} completed this challenge:
      </h1>
      <div className={`m-8 h-full w-[80%] p-[1rem] rounded-lg grid gap-4 transition-all duration-500 ${theme === 'dark' ? 'bg-[#1e1285]' : 'bg-white shadow-md border border-gray-200'
        }`}>
        {completers.length > 0 ? (
          completers.map((completer, i) => (
            <div key={i} className={`flex items-center p-5 border rounded-lg shadow transition-all duration-300 ${theme === 'dark'
                ? 'bg-[#2929a3] border-gray-500 hover:bg-[#3333b3]'
                : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
              }`}>
              <img
                src={completer?.user?.photo || profile}
                alt="avatar"
                className="w-12 h-12 rounded-full mr-4 border border-gray-300"
              />
              <div>
                <h2 className={`text-lg font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
                  }`}>
                  {completer.user?.username}
                </h2>
                <p className={`text-md ${theme === 'dark' ? 'text-gray-200' : 'text-gray-600'
                  }`}>
                  Submission: {dayjs(completer.completionTime).format("MMM D, YYYY h:mm A")}
                </p>
                {completer.url ? (
                  <Link to={completer.url}>
                    <p className={`text-md ${theme === 'dark'} ? 'text-gray-200' : 'text-green-600'`}>{completer.url}</p>
                  </Link>
                ) : <></>}

                {  
                completer.solution ? (
                  <div>
                    <p className='text-blue-500 px-3 py-5'>{showSolution ? (
                      <button onClick={handleShowOrHideSol} className='flex gap-10'>
                         Hide solution 
                         <FaArrowRight className='mt-1'/>
                      </button>
                    ) : <p className='flex gap-10'>
                      Check the solution out
                      <FaArrowDown className='mt-1' />
                    </p> 
                    }</p>

                    {showSolution ? (
                      <p>{completer.solution}</p>
                    ) : <></>}
                  </div>
                ) : <></>}
              </div>
              {
              completer.correct === "WRIGHT" ? (
                <div className=''>
                </div>
              ) : (
                <div className='mx-auto gap-0 flex grid lg:grid-cols-2 grid-rows-2 sm:block lg:gap-10'>
                  <button onClick={() => handleCorrectCompleter(completer.id)}>
                    <FaCheck color="green" size={25} className='hover:size-[50]  hover:cursor-pointer'/>
                  </button>
                  <button onClick={() => handleAnswerIsWrong(completer.id)}>
                    <FaTimes color='red' size={25} className='hover:size-[50] hover:cursor-pointer'/>
                  </button>
                </div>
              )
              }
            </div>
          ))
        ) : (
          <div className='h-full'>
            <p className={`text-center font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
              Sorry! No one has completed this challenge yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
export default ChallengeCompleters
