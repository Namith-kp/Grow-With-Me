import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BiChevronDown } from 'react-icons/bi';
import { toggleTheme } from './theme';
import { BsList,  BsSearch } from "react-icons/bs";

// interface NavbarProps {
//   theme: 'light' | 'dark';
//   toggleTheme: () => void;
// }

export const Navbar = ({ theme, setIsSideMenuOpen, searchQuery, setSearchQuery, profileElement }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  

  const isHomePage = location.pathname === '/';
  const isAuthPage = location.pathname.startsWith('/auth/');
  const showSignOut = !isHomePage && !isAuthPage;
  const showSearch = !isHomePage && !isAuthPage;

  

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    navigate('/');
  };

  if (isHomePage) {
    return null;
  }

  if (isAuthPage) {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-1">
        <div className="flex justify-between h-16 items-center">
          {/* Left section - Logo and menu button */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0 min-w-0">
          <button
              onClick={() => setIsSideMenuOpen(prev => !prev)}
              className="text-gray-600 dark:text-gray-300 sm:hidden"
            >
              <BsList className="h-6 w-6" />
            </button>
            <Link 
              to="/" 
              className="text-2xl sm:text-2xl md:text-2xl lg:text-3xl font-extrabold text-primary dark:text-dark-foreground tracking-tight hover:opacity-80 transition-opacity truncate"
              >
              <span className="xs:inline">Grow With Me</span>
              
            </Link>
          </div>
          
          {/* Center section - Search bar (hidden on mobile) */}
          <div className="hidden sm:flex justify-center flex-grow px-4">
          {showSearch && (
              <div className="relative w-full max-w-md">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-2 pl-10 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
                <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-200" />
              </div>
            )}
          </div>
          
          {/* Right section - Buttons */}
          <div className="flex gap-2 sm:gap-4 items-center justify-end flex-shrink-0">
          {showSignOut ? (
              <>
                <Button 
                  onClick={handleSignOut}
                  className="hidden sm:block text-white shadow-lg rounded-full bg-black hover:bg-gray-700 dark:bg-blue-600 dark:hover:bg-blue-500 transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl active:scale-95 active:shadow-md"
                >
                  Log Out
                </Button>
                {profileElement}
                
              </>
            ) : isHomePage && (
              <div className="relative" ref={dropdownRef}>
                <Button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="text-white shadow-lg bg-gradient-to-r from-primary to-blue-400 hover:from-primary/90 hover:to-blue-500 transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl active:scale-95 active:shadow-md flex items-center gap-2"
                >
                  Sign Up / Login
                  <BiChevronDown className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </Button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-dark-background border rounded-md shadow-lg py-2 z-50">
                    <div className="px-4 py-2 text-sm font-semibold text-gray-500">Join as:</div>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-dark-foreground hover:bg-gray-100 dark:hover:bg-dark-secondary"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        navigate('/auth/developer');
                      }}
                    >
                      Developer
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-dark-foreground hover:bg-gray-100 dark:hover:bg-dark-secondary"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        navigate('/auth/recruiter');
                      }}
                    >
                      Founder
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-dark-foreground hover:bg-gray-100 dark:hover:bg-dark-secondary"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        navigate('/auth/investor');
                      }}
                    >
                      Investor
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
