import BrainlyCodeIcon from "../BrainlyCodeIcon";

const Footer = () => {
  return (
    <footer>
          <div className='bg-[#112043] mt-[2rem] text-gray-100 grid grid-cols-4 rounded-lg bg-opacity-40 p-6 h-[10%] w-[80%] m-auto '>
            <div className='mr-10'>
              <BrainlyCodeIcon />
              <p className='text-xs text-gray-500 mt-3'>Making coding fun and accessible for the next generation of developers</p>
            </div>
            <div className=''>
              <h1 className='text-xl font-bold '>Learn</h1>
              <p><a className='text-xs  text-gray-500 ' href="/">Courses</a></p>
              <p><a className='text-xs  text-gray-500 ' href="/">Playgrounds</a></p>
              <p><a className='text-xs  text-gray-500 ' href="/">Challenges</a></p>
              <p><a className='text-xs  text-gray-500 ' href="/">Projects</a></p>
            </div>
            <div className=''>
              <h1 className="text-xl font-bold">Resources</h1>
              <p><a className='text-xs  text-gray-500 ' href="/">Blog</a></p>
              <p><a className='text-xs  text-gray-500 ' href="/">Documentations</a></p>
              <p><a className='text-xs text-gray-500 ' href="/">FAQ</a></p>
              <p><a className='text-xs  text-gray-500 ' href="/">Support</a></p>
            </div>
            <div className=''>
              <h1 className="text-xl font-bold">Company</h1>
              <p><a className="text-xs  text-gray-500 " href="/">About us</a></p>
              <p><a className="text-xs  text-gray-500 " href="/">Careers</a></p>
              <p><a className="text-xs  text-gray-500 " href="/">Privacy Policy</a></p>
              <p><a className="text-xs  text-gray-500 " href="/">Terms of service</a></p>
            </div>
          </div>
          <div className="mt-[2rem] border-b-2">
          <p className='text-center  text-gray-500 '>
            <span className='m-auto'>
              ©2025 BrainlyCode. All rights reserved.
            </span>
          </p>
          </div>

        </footer>
  )
}

export default Footer;