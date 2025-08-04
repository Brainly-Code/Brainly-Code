import BrainlyCodeIcon from "../BrainlyCodeIcon";

const Footer = () => {
  return (
<footer className="mt-6">
  <div className="bg-[#07032B] bg-opacity-90 rounded-lg px-4 py-6 w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-gray-100">
        
        {/* Logo and description */}
        <div>
          <BrainlyCodeIcon />
          <p className="text-xs text-gray-400 mt-4">
            Making coding fun and accessible for the next generation of developers.
          </p>
        </div>

        {/* Learn Section */}
        <div className="sm:text-center">
          <h1 className="text-xl font-bold mb-3">Learn</h1>
          <ul className="space-y-0.5">
            <li><a className="text-xs text-gray-400 hover:text-gray-200" href="/">Courses</a></li>
            <li><a className="text-xs text-gray-400 hover:text-gray-200" href="/">Playgrounds</a></li>
            <li><a className="text-xs text-gray-400 hover:text-gray-200" href="/">Challenges</a></li>
            <li><a className="text-xs text-gray-400 hover:text-gray-200" href="/">Projects</a></li>
          </ul>
        </div>

        {/* Resources Section */}
        <div className="sm:text-center">
          <h1 className="text-xl font-bold mb-3">Resources</h1>
          <ul className="space-y-0.5">
            <li><a className="text-xs text-gray-400 hover:text-gray-200" href="/">Blog</a></li>
            <li><a className="text-xs text-gray-400 hover:text-gray-200" href="/">Documentation</a></li>
            <li><a className="text-xs text-gray-400 hover:text-gray-200" href="/">FAQ</a></li>
            <li><a className="text-xs text-gray-400 hover:text-gray-200" href="/">Support</a></li>
          </ul>
        </div>

        {/* Company Section */}
        <div className="sm:text-center">
          <h1 className="text-xl font-bold mb-3">Company</h1>
          <ul className="space-y-0.5">
            <li><a className="text-xs text-gray-400 hover:text-gray-200" href="/">About us</a></li>
            <li><a className="text-xs text-gray-400 hover:text-gray-200" href="/">Careers</a></li>
            <li><a className="text-xs text-gray-400 hover:text-gray-200" href="/">Privacy Policy</a></li>
            <li><a className="text-xs text-gray-400 hover:text-gray-200" href="/">Terms of service</a></li>
          </ul>
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
