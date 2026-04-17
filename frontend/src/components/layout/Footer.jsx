// components/layout/Footer.jsx
/**
 * @file Footer.jsx
 * @description Application footer with branding and legal links
 */

const Footer = () => {
  return (
    <footer className="bg-base border-t border-gray-100 dark:border-gray-800 mt-12 transition-colors">
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        {/* Footer Content */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <span className="text-2xl font-bold text-text-main">BookStore</span>
            </div>
            <p className="text-text-muted mt-2 text-sm max-w-sm">
              Explore a world of knowledge with our curated collection of amazing books.
            </p>
          </div>
        </div>
        
        {/* Footer Bottom */}
        <div className="mt-10 border-t border-gray-100 dark:border-gray-800 pt-8 text-center flex flex-col md:flex-row justify-between items-center text-xs text-text-muted space-y-4 md:space-y-0">
          <p>
            &copy; {new Date().getFullYear()} BookStore Inc. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="hover:underline hover:text-text-main transition-colors">Privacy Policy</a>
            <a href="#" className="hover:underline hover:text-text-main transition-colors">Terms of Service</a>
            <a href="#" className="hover:underline hover:text-text-main transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
