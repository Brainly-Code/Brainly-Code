import BrainlyCodeIcon from "../BrainlyCodeIcon";

const Footer = () => {
  return (
    <footer className="mt-8">
      <div className="bg-[#6B5EDD] bg-opacity-40 rounded-lg px-6 py-8 w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-gray-100">
        
        <div>
          <BrainlyCodeIcon />
          <p className="text-xs text-gray-400 mt-3">
            Making coding fun and accessible for the next generation of developers.
          </p>
        </div>

        <div>
          <h1 className="text-xl font-bold mb-3">Learn</h1>
          <p><a className="text-xs text-gray-400 hover:text-gray-200" href="/">Courses</a></p>
          <p><a className="text-xs text-gray-400 hover:text-gray-200" href="/">Playgrounds</a></p>
          <p><a className="text-xs text-gray-400 hover:text-gray-200" href="/">Challenges</a></p>
          <p><a className="text-xs text-gray-400 hover:text-gray-200" href="/">Projects</a></p>
        </div>

        <div>
          <h1 className="text-xl font-bold mb-3">Resources</h1>
          <p><a className="text-xs text-gray-400 hover:text-gray-200" href="/">Blog</a></p>
          <p><a className="text-xs text-gray-400 hover:text-gray-200" href="/">Documentation</a></p>
          <p><a className="text-xs text-gray-400 hover:text-gray-200" href="/">FAQ</a></p>
          <p><a className="text-xs text-gray-400 hover:text-gray-200" href="/">Support</a></p>
        </div>

        <div>
          <h1 className="text-xl font-bold mb-3">Company</h1>
          <p><a className="text-xs text-gray-400 hover:text-gray-200" href="/">About us</a></p>
          <p><a className="text-xs text-gray-400 hover:text-gray-200" href="/">Careers</a></p>
          <p><a className="text-xs text-gray-400 hover:text-gray-200" href="/">Privacy Policy</a></p>
          <p><a className="text-xs text-gray-400 hover:text-gray-200" href="/">Terms of service</a></p>
        </div>
      </div>

      <div className="mt-8 border-t border-gray-600 pt-4">
        <p className="text-center text-xs text-gray-500">
          © 2025 BrainlyCode. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
