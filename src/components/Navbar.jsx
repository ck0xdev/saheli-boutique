import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { auth, db } from "../config/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import toast from "react-hot-toast";

export default function Navbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Close drawer on route change
  useEffect(() => {
    setIsDrawerOpen(false);
  }, [location]);

  // Auth & Role listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const snap = await getDoc(doc(db, "users_saheli", currentUser.uid));
          if (snap.exists()) {
            setRole(snap.data()?.role);
          }
        } catch (error) {
          console.error("Failed to fetch role", error);
        }
      } else {
        setRole(null);
      }
    });
    return unsub;
  }, []);

  // Sticky shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Signed out. See you soon!");
    } catch {
      toast.error("Sign out failed. Please try again.");
    }
  };

  const navLinks = [
    { to: "/shop", label: "Products" },
    { to: "/about", label: "Our Story" },
    { to: "/contact", label: "Contact" },
  ];

  // Prevent scrolling when mobile drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isDrawerOpen]);

  return (
    <>
      <nav
        className={`sticky top-0 z-50 w-full border-b border-borderSoft bg-bgBase/90 backdrop-blur-md transition-all duration-300 ${scrolled ? "shadow-sm py-3" : "py-4"}`}
      >
        <div className="w-[90%] max-w-[1200px] mx-auto flex justify-between items-center">
          
          {/* Logo */}
          <Link
            to="/"
            className="hover:opacity-70 transition-opacity flex items-center z-50"
          >
            <span className="text-xl md:text-2xl font-serif font-semibold text-textMain tracking-tight">
              Saheli{" "}
              <span className="italic text-accent font-light">Nails</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <div className="flex gap-6 lg:gap-8 text-[11px] font-sans font-bold uppercase tracking-widest text-textMuted">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`hover:text-accent transition-colors duration-300 ${location.pathname === to ? "text-accent" : ""}`}
                >
                  {label}
                </Link>
              ))}
            </div>

            <div className="h-5 w-[1px] bg-borderSoft mx-2" />

            {user ? (
              <div className="relative group">
                <button className="w-9 h-9 rounded-full bg-accent/5 border border-accent/20 overflow-hidden hover:scale-105 transition-transform flex items-center justify-center shadow-sm">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-accent font-serif text-sm font-bold uppercase">
                      {user.email[0]}
                    </span>
                  )}
                </button>
                
                {/* Desktop Dropdown */}
                <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="bg-white border border-borderSoft rounded-soft shadow-card w-48 overflow-hidden">
                    <div className="px-5 py-4 border-b border-borderSoft/50 bg-bgBase/50">
                      <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-textMuted truncate">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      to="/profile"
                      className="block px-5 py-3.5 text-[12px] font-sans font-medium text-textMain hover:bg-bgBase border-b border-borderSoft/50 transition-colors"
                    >
                      My Profile
                    </Link>
                    {role === "admin" && (
                      <Link
                        to="/admin"
                        className="block px-5 py-3.5 text-[12px] font-sans font-bold text-accent hover:bg-accent/5 border-b border-borderSoft/50 transition-colors"
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-5 py-3.5 text-[12px] font-sans font-medium text-status-error hover:bg-status-error/5 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-ghost py-2.5 px-4 lg:px-5">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary py-2.5 px-5 lg:px-6">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center">
            <button
              className="text-textMain p-2 -mr-2"
              onClick={() => setIsDrawerOpen(true)}
              aria-label="Open menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      <div
        className={`fixed inset-0 z-[100] transition-opacity duration-500 md:hidden ${isDrawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <div
          className="absolute inset-0 bg-textMain/20 backdrop-blur-sm"
          onClick={() => setIsDrawerOpen(false)}
        />
        
        {/* Mobile Drawer Panel */}
        <div
          className={`absolute right-0 top-0 h-[100dvh] w-[85vw] max-w-[320px] bg-bgBase shadow-modal transition-transform duration-500 flex flex-col ${isDrawerOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex items-center justify-between p-6 border-b border-borderSoft">
            <span className="text-xl font-serif font-semibold text-textMain tracking-tight">
              Saheli{" "}
              <span className="italic text-accent font-light">Nails</span>
            </span>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="text-textMuted hover:text-textMain p-2 -mr-2 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Drawer Links */}
          <div className="flex flex-col p-6 gap-3 flex-grow overflow-y-auto">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`text-[18px] font-serif px-5 py-3.5 rounded-soft transition-colors ${location.pathname === to ? "bg-white text-accent shadow-sm border border-borderSoft" : "text-textMain hover:bg-white hover:border-borderSoft"}`}
              >
                {label}
              </Link>
            ))}
            
            {role === "admin" && (
              <Link
                to="/admin"
                className="text-[14px] font-sans font-bold text-accent px-5 py-4 rounded-soft mt-4 bg-white border border-accent/20 shadow-sm text-center uppercase tracking-widest"
              >
                Admin Dashboard
              </Link>
            )}
          </div>

          {/* Drawer Footer (Auth) */}
          <div className="p-6 border-t border-borderSoft bg-white pb-safe">
            {user ? (
              <div className="space-y-2">
                <p className="text-[10px] font-sans font-medium text-textMuted mb-4 px-2 truncate">
                  Logged in as {user.email}
                </p>
                <Link
                  to="/profile"
                  className="block text-[13px] font-sans font-bold uppercase tracking-widest text-textMain px-2 py-2 hover:text-accent transition-colors"
                >
                  My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-[13px] font-sans font-bold uppercase tracking-widest text-status-error px-2 py-2 hover:opacity-80 transition-opacity"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <Link to="/login" className="btn-secondary w-full py-4 text-center">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary w-full py-4 text-center block">
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}