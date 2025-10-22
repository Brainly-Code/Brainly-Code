import React, { useContext } from 'react'
import { ThemeContext } from '../Contexts/ThemeContext'

const BrainlyCodeIcon = (className) => {
  const {theme} = useContext(ThemeContext);
  return (
    <div className={`mb-0 flex gap-2 items-center  font-fredoka ${className}`}>
      <div className='bg-gradient-to-b  text-gray-200 font-fredoka  py-1 px-1 rounded-3xl from-blue-400 inline to-purple-600 pr-2 pl-2'>
        {"</>"}
      </div >
      <div className="items-center">
      <h1 className={`${theme === "light" ? "text-[#00ffee]" : "text-gray-50"} lg:inline hidden text-2xl font-fredoka mt-2`}><span className={`${theme === "light" ? "text-gray-500" : 'text-[#00ffff]'}`}>Brainly</span>Code</h1>
      </div>
    </div>
  )
}

export default BrainlyCodeIcon
