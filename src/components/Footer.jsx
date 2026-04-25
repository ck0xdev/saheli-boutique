import { useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import logo from '../assets/logo.jpg';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Logic for the new collection: subscribes_saheli
      await addDoc(collection(db, "subscribes_saheli"), {
        email: email,
        subscribedAt: serverTimestamp(),
        active: true
      });
      setMessage("Thank you for subscribing!");
      setEmail('');
    } catch (err) {
      console.error("Subscription error:", err);
      setMessage("Please try again later.");
    } finally {
      setSubmitting(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <footer className="bg-[#fdfbf9] border-t border-borderSoft pt-20 pb-10 mt-auto font-sans">
      <div className="w-[90%] max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 items-start">
        
        {/* Section 1: Logo / Name */}
        <div className="flex flex-col gap-6">
          <Link to="/" className="inline-block hover:opacity-90 transition-opacity">
            <img src={logo} alt="Saheli Boutique" className="h-14 w-auto object-contain rounded-sm" />
          </Link>
          <p className="text-textLight text-sm font-light leading-relaxed">
            Elevating your special occasions with premium ethnic wear rentals and professional artistry in Surat.
          </p>
        </div>

        {/* Section 2: Page Links */}
        <div>
          <h3 className="text-textMain text-sm font-semibold uppercase tracking-widest mb-8">Navigation</h3>
          <ul className="flex flex-col gap-4 text-textLight text-sm font-light">
            <li><Link to="/" className="hover:text-accent transition-colors">Home</Link></li>
            <li><Link to="/shop" className="hover:text-accent transition-colors">Collection</Link></li>
            <li><Link to="/about" className="hover:text-accent transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-accent transition-colors">Contact</Link></li>
          </ul>
        </div>

        {/* Section 3: Privacy Policy & Policies */}
        <div>
          <h3 className="text-textMain text-sm font-semibold uppercase tracking-widest mb-8">Policies</h3>
          <ul className="flex flex-col gap-4 text-textLight text-sm font-light">
            <li><Link to="/shop" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
            <li><Link to="/shop" className="hover:text-accent transition-colors">Terms of Service</Link></li>
            <li><Link to="/shop" className="hover:text-accent transition-colors">Return Policy</Link></li>
            <li><Link to="/shop" className="hover:text-accent transition-colors">Rental Agreement</Link></li>
          </ul>
        </div>

        {/* Section 4: Email Subscribe */}
        <div>
          <h3 className="text-textMain text-sm font-semibold uppercase tracking-widest mb-8">Newsletter</h3>
          <p className="text-textLight text-sm font-light mb-6">Stay updated on our latest arrivals.</p>
          <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
            <input 
              type="email" 
              required
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white border border-borderSoft px-4 py-3 rounded-soft text-sm focus:outline-none focus:border-accent transition-colors w-full"
            />
            <button 
              type="submit" 
              disabled={submitting}
              className="bg-accent text-white py-3 rounded-soft text-sm font-medium hover:bg-textMain transition-all duration-300 disabled:opacity-50"
            >
              {submitting ? 'Subscribing...' : 'Subscribe'}
            </button>
            {message && <p className="text-xs text-accent mt-1 animate-fade-in font-medium">{message}</p>}
          </form>
        </div>

      </div>

      {/* Message Section / Copyright */}
      <div className="w-[90%] max-w-[1200px] mx-auto border-t border-borderSoft mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-textLight text-xs font-light tracking-wide uppercase">
        <p>Fashion You Love, Trends that Sets</p>
        <p>© 2026 Saheli Boutique. All rights reserved.</p>
      </div>
    </footer>
  );
}