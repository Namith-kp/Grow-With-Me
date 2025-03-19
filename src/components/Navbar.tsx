import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BiChevronDown } from 'react-icons/bi';
import { toggleTheme } from './theme';

// interface NavbarProps {
//   theme: 'light' | 'dark';
//   toggleTheme: () => void;
// }

export const Navbar = ({ theme }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  

  const isHomePage = location.pathname === '/';
  const isAuthPage = location.pathname.startsWith('/auth/');
  const showSignOut = !isHomePage && !isAuthPage;

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

  

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link 
            to="/" 
            className="text-2xl font-extrabold text-primary dark:text-dark-foreground tracking-tight hover:opacity-80 transition-opacity"
          >
            Grow With Me
          </Link>
          <div className="flex gap-4 items-center">
            {showSignOut ? (
              <>
                <Button 
                  onClick={handleSignOut}
                  className="text-white shadow-lg bg-gradient-to-r from-primary to-blue-400 hover:from-primary/90 hover:to-blue-500 transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl active:scale-95 active:shadow-md"
                >
                  Log Out
                </Button>
                <button
                  onClick={toggleTheme}
                  className="px-4 py-2 rounded-md bg-primary dark:bg-dark-primary text-foreground dark:text-dark-foreground hover:bg-secondary dark:hover:bg-dark-secondary transition-all"
                >
                  {theme === 'light' ? '🌙' : '☀️'}
                </button>
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
