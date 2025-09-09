import React from 'react'

const BrainlyCodeIcon = (className) => {
  return (
    <div className={` mb-0 flex gap-2 items-center  font-fredoka ${className}`}>
      <div className='bg-gradient-to-b  text-gray-200 font-fredoka  py-1 px-1 rounded-3xl from-blue-400 inline to-purple-600 pr-2 pl-2'>
        {"</>"}
      </div >
      <div className="items-center">
      <h1 className='lg:inline hidden text-gray-50 text-2xl font-fredoka mt-2'><span className='text-[#00ffff]'>Brainly</span>Code</h1>
      </div>
    </div>
  )
}

export default BrainlyCodeIcon
