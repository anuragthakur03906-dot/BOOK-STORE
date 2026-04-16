import { FiGithub, FiBook, FiHeart } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-white border-t mt-12">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center space-x-2">
              <FiBook className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">BookStore</span>
            </div>
            <p className="text-gray-600 mt-2 text-sm">
              Your one-stop destination for amazing books
            </p>
          </div>
          
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <FiGithub className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <FiHeart className="h-6 w-6" />
            </a>
          </div>
        </div>
        
        <div className="mt-8 border-t pt-8 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} BookStore. All rights reserved.
          </p>
          <p className="text-gray-400 text-xs mt-2">
            Built with React, Node.js, MongoDB & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
