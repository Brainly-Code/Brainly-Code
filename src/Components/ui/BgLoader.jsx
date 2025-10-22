import React, { useContext } from 'react'
import { ThemeContext } from '../../Contexts/ThemeContext'

const BgLoader = () => {
  const {theme} = useContext(ThemeContext);
  return (
    <div className={`${theme === "light" ? "bg-white" : "bg-[#0D0056]"} h-screen pt-[15rem]`}>
      <div className='p-[5rem] mx-auto border-t-2 rounded-full animate-spin border-blue-500 w-[1rem] h-[1rem]'>
      </div>
    </div>
  )
}

export default BgLoader
