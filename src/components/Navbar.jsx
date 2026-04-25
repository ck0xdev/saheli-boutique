import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { auth } from '../config/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

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
        <div className="w-[90%] max-w-[1200px] mx-auto py-5 flex justify-between items-center">
          <Link to="/" className="text-2xl text-textMain no-underline font-serif tracking-wide">
            SAHELI <span className="text-accent italic font-light">Boutique</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-10">
            <Link to="/shop" className="text-textLight hover:text-accent transition-colors duration-300 font-medium tracking-wide text-sm uppercase">Collection</Link>
            <Link to="/contact" className="text-textLight hover:text-accent transition-colors duration-300 font-medium tracking-wide text-sm uppercase">Contact</Link>
            
            {/* Auth State Rendering */}
            {user ? (
              <div className="flex items-center gap-4 group relative cursor-pointer">
                {/* Profile Badge */}
                <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center overflow-hidden">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-accent font-serif text-lg">{user.email?.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                {/* Dropdown menu */}
                <div className="absolute top-full right-0 mt-2 w-48 bg-bgMain border border-borderSoft rounded-soft shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col overflow-hidden">
                  <Link to="/profile-setup" className="px-4 py-3 text-textMain hover:bg-gray-50 text-sm border-b border-borderSoft">Edit Profile</Link>
                  <button onClick={handleLogout} className="px-4 py-3 text-left text-red-600 hover:bg-red-50 text-sm">Sign Out</button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="text-accent border border-accent px-5 py-2 rounded-soft hover:bg-accent hover:text-white transition-colors duration-300 font-medium text-sm">
                Sign In
              </Link>
            )}
          </div>
          
          <button className="md:hidden text-textMain p-2 -mr-2" onClick={() => setIsDrawerOpen(true)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer (Omitted for brevity, keep your existing one but add the Auth links inside) */}
    </>
  );
}