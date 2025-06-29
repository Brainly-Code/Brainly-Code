import React from 'react'

const BrainlyCodeIcon = (className) => {
  return (
    <div className={`"mb-2 inline  font-fredoka", ${className}`}>
      <div className='bg-gradient-to-b font-fredoka mr-3 pb-1 pt-1 px-1 rounded from-blue-400 inline to-purple-600'>
        {"</>"}
      </div >
      <h1 className='inline text-xl font-fredoka mt-2'><span className='text-[#00ffff]'>Brainly</span>Code</h1>
    </div>
  )
}

export default BrainlyCodeIcon
