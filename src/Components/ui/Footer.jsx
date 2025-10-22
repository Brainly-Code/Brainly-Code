import BrainlyCodeIcon from "../BrainlyCodeIcon";

const Footer = () => {
  return (
    <footer className="mt-8">
      <div className="bg-[#070045] bg-opacity-90 rounded-lg px-6 py-8 w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 grid-cols-2 gap-8 text-gray-100">
        
        {/* Logo and description */}
        <div >
          <BrainlyCodeIcon />
          <p className="text-xs text-gray-400 mt-6">
            Making coding fun and accessible for the next generation of developers.
          </p>
        </div>

        {/* Learn Section */}
        <div className="sm:text-center">
          <h1 className="text-xl font-bold mb-3">Learn</h1>
          <ul className="space-y-1">
            <li><a className="text-xs text-gray-400 hover:text-gray-200" href="/user">Courses</a></li>
            <li><a className="text-xs text-gray-400 hover:text-gray-200" href="/user">Playgrounds</a></li>
            <li><a className="text-xs text-gray-400 hover:text-gray-200" href="/user">Challenges</a></li>
            <li><a className="text-xs text-gray-400 hover:text-gray-200" href="/user">Projects</a></li>
          </ul>
        </div>

        {/* Resources Section */}
        <div className="sm:text-center">
          <h1 className="text-xl font-bold mb-3">Resources</h1>
          <ul className="space-y-1">
            <li><a className="text-xs text-gray-400 hover:text-gray-200" href="/user">Blog</a></li>
            <li><a className="text-xs text-gray-400 hover:text-gray-200" href="/user">Documentation</a></li>
            <li><a className="text-xs text-gray-400 hover:text-gray-200" href="/user">FAQ</a></li>
            <li><a className="text-xs text-gray-400 hover:text-gray-200" href="/user">Support</a></li>
          </ul>
        </div>

        {/* Company Section */}
        <div className="sm:text-center">
          <h1 className="text-xl font-bold mb-3">Company</h1>
          <ul className="space-y-1">
            <li><a className="text-xs text-gray-400 hover:text-gray-200" href="/user">About us</a></li>
            <li><a className="text-xs text-gray-400 hover:text-gray-200" href="/user">Careers</a></li>
            <li><a className="text-xs text-gray-400 hover:text-gray-200" href="/user">Privacy Policy</a></li>
            <li><a className="text-xs text-gray-400 hover:text-gray-200" href="/user">Terms of service</a></li>
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
