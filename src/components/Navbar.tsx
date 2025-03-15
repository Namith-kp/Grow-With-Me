import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BiChevronDown } from 'react-icons/bi';

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Check if user is on home page
  const isHomePage = location.pathname === '/';
  
  // Check if user is on auth or signup pages
  const isAuthPage = location.pathname.startsWith('/auth/');

  // Show sign out button everywhere except home and auth pages
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
    // Add any sign out logic here (clear tokens, etc.)
    navigate('/');
  };

  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link 
            to="/" 
            className="text-2xl font-extrabold text-primary tracking-tight hover:opacity-80 transition-opacity"
          >
            FounderBridge
          </Link>
          <div className="flex gap-4 items-center">
            {showSignOut ? (
              <Button 
                onClick={handleSignOut}
                className="text-white shadow-lg 
                bg-gradient-to-r from-primary to-blue-400 hover:from-primary/90 hover:to-blue-500
                transform transition-all duration-300 ease-in-out
                hover:scale-105 hover:shadow-xl
                active:scale-95 active:shadow-md"
              >
                Log Out
              </Button>
            ) : isHomePage && (
              <div className="relative" ref={dropdownRef}>
                <Button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="text-white shadow-lg 
                  bg-gradient-to-r from-primary to-blue-400 hover:from-primary/90 hover:to-blue-500
                  transform transition-all duration-300 ease-in-out
                  hover:scale-105 hover:shadow-xl
                  active:scale-95 active:shadow-md
                  flex items-center gap-2"
                >
                  Sign Up / Login
                  <BiChevronDown className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </Button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white border rounded-md shadow-lg py-2 z-50">
                    <div className="px-4 py-2 text-sm font-semibold text-gray-500">Join as:</div>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        navigate('/auth/developer');
                      }}
                    >
                      Developer
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        navigate('/auth/recruiter');
                      }}
                    >
                      Founder
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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
