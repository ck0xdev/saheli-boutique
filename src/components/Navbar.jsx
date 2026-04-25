import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { auth } from '../config/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function Navbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => { setIsDrawerOpen(false); }, [location]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try { await signOut(auth); } catch (error) { console.error("Logout failed:", error); }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-borderSoft/40 bg-[#fdfbf9]/90 backdrop-blur-md">
        <div className="w-[90%] max-w-[1200px] mx-auto py-4 flex justify-between items-center">
          
          {/* Text-Based Luxury Logo */}
          <Link to="/" className="hover:opacity-70 transition-opacity">
            <span className="text-xl md:text-2xl font-serif font-semibold text-textMain tracking-tight">
              Saheli <span className="italic text-accent font-light">Nails</span>
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <div className="flex gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
              <Link to="/" className="hover:text-accent transition-colors">Home</Link>
              <Link to="/shop" className="hover:text-accent transition-colors">Services</Link>
              <Link to="/about" className="hover:text-accent transition-colors">About</Link>
              <Link to="/contact" className="hover:text-accent transition-colors">Contact</Link>
            </div>
            <div className="h-6 w-[1px] bg-borderSoft/60 mx-2"></div>
            
            {user ? (
              <div className="relative group">
                <button className="w-10 h-10 rounded-full bg-accent/5 border border-accent/20 overflow-hidden shadow-sm hover:scale-105 transition-transform flex items-center justify-center">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-accent font-serif text-sm">{user.email[0].toUpperCase()}</span>
                  )}
                </button>
                <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="bg-white border border-borderSoft/50 rounded-soft shadow-xl w-48 overflow-hidden">
                    <Link to="/profile" className="block px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-textMain hover:bg-[#fdfbf9] border-b border-borderSoft/30">Profile Settings</Link>
                    <button onClick={handleLogout} className="w-full text-left px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-50">Sign Out</button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="bg-accent text-white px-6 py-2.5 rounded-soft text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg shadow-accent/10 hover:bg-textMain transition-all">Sign In</Link>
            )}
          </div>

          <button className="md:hidden text-textMain" onClick={() => setIsDrawerOpen(true)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`fixed inset-0 z-[100] transition-opacity duration-500 ${isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-textMain/20 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)} />
        <div className={`absolute right-0 top-0 h-full w-[280px] bg-[#fdfbf9] shadow-2xl transition-transform duration-500 p-8 ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col gap-8 mt-12">
            <span className="text-2xl font-serif font-semibold text-textMain tracking-tight mb-4">
              Saheli <span className="italic text-accent font-light">Nails</span>
            </span>
            <Link to="/" className="text-xl font-serif text-textMain">Home</Link>
            <Link to="/shop" className="text-xl font-serif text-textMain">Shop</Link>
            <Link to="/about" className="text-xl font-serif text-textMain">About</Link>
            <Link to="/contact" className="text-xl font-serif text-textMain">Contact</Link>
            <div className="h-[1px] bg-borderSoft/50 my-4"></div>
            {user ? (
              <>
                <Link to="/profile" className="text-sm font-bold uppercase tracking-widest text-textMain">My Profile</Link>
                <button onClick={handleLogout} className="text-left text-sm font-bold uppercase tracking-widest text-red-500">Sign Out</button>
              </>
            ) : (
              <Link to="/login" className="bg-accent text-white py-4 rounded-soft text-center text-xs font-bold uppercase tracking-widest">Sign In</Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}