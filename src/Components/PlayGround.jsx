import React from 'react'
import { Link } from 'react-router-dom';
import { Logout } from '../redux/Features/authSlice';
import { FloatingNav } from './ui/FloatingNav';
import BrainlyCodeIcon from './BrainlyCodeIcon';
import TextGenerateEffect from './ui/TextGenerate';
import CodeEditor from './CodeEditor';
import Header from './ui/Header';
import { useGetChallengesQuery } from '../redux/api/challengeSlice';
import PlaygroundCodeEditor from './PlaygroundCodeEditor';

const PlayGround = () => {

  const {data: challenges} = useGetChallengesQuery(); 

  // const projects = [
  //   { title: "A function that prints the words of a string backwards" , descrption: "" },
  //   { title: "palindrome checker" , descrption: "" },
  //   { title: "Build a cat website" , descrption: "" },
  // ]

  return (
    <div className='bg-[#070045] m-0'>
      <Header />
      <section>
        <div className='w-full max-w-xl mt-8 text-center mx-auto px-4'>
          <h1 className="text-3xl md:text-4xl font-bold flex justify-center text-gray-300">
            <span className='mr-3 text-[#8F57EF]'>Code</span>
            <TextGenerateEffect className={"font-bold text-[#00DEDE]"} words={"Playground"} />
          </h1>
          <p className="text-gray-400 mt-4">
            Experiment with code, test your ideas and learn by doing in our interactive playground.
          </p>
        </div>
      </section>

      <section className="editor my-8 px-4 md:px-10">
        <PlaygroundCodeEditor />
      </section>

      <section className='text-gray-100 mt-16 mx-4 md:mx-10 lg:mx-32'>
        <h1 className='text-center text-xl md:text-2xl font-bold'>
          Here are some projects you might want to try out in the playground
        </h1>
        
          {challenges?.map((project, index) => (
            <div key={index} className='bg-[#161077] mx-auto w-[70%] py-8 rounded-xl mt-8'>
            <div  className="text-center py-2">
              <h2 className='text-lg md:text-xl font-semibold'>{project.title}</h2>
            </div>
            </div>
          ))}
      </section>
    </div>
  )
}

export default PlayGround