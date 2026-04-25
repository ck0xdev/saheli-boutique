import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { auth } from '../config/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
// Importing the logo from your assets folder
import logo from '../assets/logo.jpg'; 

export default function Navbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    setIsDrawerOpen(false);
  }, [location]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-borderSoft/50 bg-bgMain/80 backdrop-blur-md transition-all duration-300">
        <div className="w-[90%] max-w-[1200px] mx-auto py-4 flex justify-between items-center">
          
          {/* Left Side: Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <img 
              src={logo} 
              alt="Saheli Boutique Logo" 
              className="h-12 w-auto object-contain rounded-sm" 
            />
          </Link>
          
          {/* Right Side: Navigation Links & Auth */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-8">
              <Link to="/" className="text-textLight hover:text-accent transition-colors duration-300 font-medium tracking-wide text-sm uppercase">Home</Link>
              <Link to="/shop" className="text-textLight hover:text-accent transition-colors duration-300 font-medium tracking-wide text-sm uppercase">Shop</Link>
              <Link to="/about" className="text-textLight hover:text-accent transition-colors duration-300 font-medium tracking-wide text-sm uppercase">About</Link>
              <Link to="/contact" className="text-textLight hover:text-accent transition-colors duration-300 font-medium tracking-wide text-sm uppercase">Contact</Link>
            </div>

            {/* Separator Line */}
            <div className="h-6 w-[1px] bg-borderSoft mx-2"></div>
            
            {/* Auth State Rendering */}
            {user ? (
              <div className="flex items-center gap-4 group relative cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-accent font-serif text-lg">{user.email?.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                {/* Dropdown menu */}
                <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-borderSoft rounded-soft shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col overflow-hidden">
                  <Link to="/profile-setup" className="px-4 py-3 text-textMain hover:bg-gray-50 text-sm border-b border-borderSoft">Edit Profile</Link>
                  <button onClick={handleLogout} className="px-4 py-3 text-left text-red-600 hover:bg-red-50 text-sm">Sign Out</button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="bg-accent text-white px-6 py-2.5 rounded-soft hover:bg-textMain transition-all duration-300 font-medium text-sm tracking-wide shadow-sm">
                Sign In
              </Link>
            )}
          </div>
          
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-textMain p-2 -mr-2 focus:outline-none"
            onClick={() => setIsDrawerOpen(true)}
            aria-label="Open Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Elegant Mobile Drawer */}
      <div className={`fixed inset-y-0 right-0 w-[300px] bg-bgMain border-l border-borderSoft shadow-2xl z-[2000] p-8 flex flex-col transform transition-transform duration-500 ease-in-out ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <button 
          className="self-end text-textLight hover:text-textMain p-2 -mr-2 focus:outline-none transition-colors"
          onClick={() => setIsDrawerOpen(false)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="flex flex-col gap-6 mt-12">
          <Link to="/" className="text-xl font-serif text-textMain hover:text-accent transition-colors">Home</Link>
          <Link to="/shop" className="text-xl font-serif text-textMain hover:text-accent transition-colors">Shop</Link>
          <Link to="/about" className="text-xl font-serif text-textMain hover:text-accent transition-colors">About</Link>
          <Link to="/contact" className="text-xl font-serif text-textMain hover:text-accent transition-colors">Contact</Link>
          
          <div className="h-[1px] bg-borderSoft my-4"></div>
          
          {user ? (
            <>
              <Link to="/profile-setup" className="text-lg text-textMain font-medium">Edit Profile</Link>
              <button onClick={handleLogout} className="text-left text-lg text-red-600 font-medium">Sign Out</button>
            </>
          ) : (
            <Link to="/login" className="bg-accent text-white text-center py-3 rounded-soft font-medium">Sign In</Link>
          )}
        </div>
      </div>

      {/* Gentle Overlay */}
      <div 
        className={`fixed inset-0 bg-textMain/20 backdrop-blur-sm z-[1999] transition-opacity duration-500 ${isDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsDrawerOpen(false)}
      />
    </>
  );
} 