import { useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addDoc(collection(db, "subscribes_saheli"), { email, subscribedAt: serverTimestamp(), active: true });
      setMessage("Thank you for joining!");
      setEmail('');
    } catch (err) { setMessage("Error. Please try again."); } finally { setSubmitting(false); setTimeout(() => setMessage(''), 3000); }
  };

  return (
    <footer className="bg-[#fdfbf9] border-t border-borderSoft pt-20 pb-10 mt-auto font-sans">
      <div className="w-[90%] max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 items-start">
        
        <div className="flex flex-col gap-6">
          {/* Footer Text Logo */}
          <span className="text-2xl font-serif font-semibold text-textMain tracking-tight">
            Saheli <span className="italic text-accent font-light">Nails</span>
          </span>
          <p className="text-gray-500 text-sm font-light leading-relaxed">
            Surat's premier destination for luxury nail artistry and professional academy training.
          </p>
        </div>

        <div>
          <h3 className="text-textMain text-xs font-bold uppercase tracking-widest mb-8">Navigation</h3>
          <ul className="flex flex-col gap-4 text-gray-500 text-sm font-light">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/shop">Services</Link></li>
            <li><Link to="/about">Our Story</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-textMain text-xs font-bold uppercase tracking-widest mb-8">Legal</h3>
          <ul className="flex flex-col gap-4 text-gray-500 text-sm font-light">
            <li><Link to="/shop">Privacy Policy</Link></li>
            <li><Link to="/shop">Terms of Use</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-textMain text-xs font-bold uppercase tracking-widest mb-8">Newsletter</h3>
          <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
            <input type="email" required placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-white border border-borderSoft px-4 py-3 rounded-soft text-sm focus:border-accent outline-none w-full" />
            <button type="submit" disabled={submitting} className="bg-accent text-white py-3 rounded-soft text-xs font-bold uppercase tracking-widest hover:bg-textMain transition-all">
              {submitting ? 'Joining...' : 'Subscribe'}
            </button>
            {message && <p className="text-[10px] text-accent mt-1 animate-fade-in font-medium">{message}</p>}
          </form>
        </div>

      </div>

      <div className="w-[90%] max-w-[1200px] mx-auto border-t border-borderSoft/40 mt-16 pt-8 text-center text-[10px] text-gray-400 tracking-[0.3em] uppercase">
        © 2026 Saheli Nails • Art at Your Fingertips
      </div>
    </footer>
  );
}