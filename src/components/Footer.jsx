import { useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

export default function Footer() {
  const [email, setEmail]         = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) return toast.error('Please enter a valid email.');

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'subscribes_saheli'), { 
        email: email.trim(), 
        subscribedAt: serverTimestamp(), 
        active: true, 
        source: 'footer' 
      });
      toast.success('Welcome to the Saheli Circle!');
      setEmail('');
    } catch { 
      toast.error('Subscription failed. Please try again.'); 
    } finally { 
      setSubmitting(false); 
    }
  };

  const navLinks = [
    { to: '/',        label: 'Home'     },
    { to: '/shop',    label: 'Products' },
    { to: '/about',   label: 'Our Story'},
    { to: '/contact', label: 'Contact'  },
  ];

  const legalLinks = [
    { to: '/privacy', label: 'Privacy Policy' },
    { to: '/terms',   label: 'Terms of Use'   },
  ];

  return (
    <footer className="bg-bgBase border-t border-borderSoft pt-20 pb-10 mt-auto font-sans">
      <div className="w-[90%] max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 items-start">
        <div className="flex flex-col gap-5">
          <Link to="/"><span className="text-2xl font-serif font-semibold text-textMain tracking-tight">Saheli <span className="italic text-accent font-light">Nails</span></span></Link>
          <p className="text-textMuted text-sm font-light leading-relaxed">Surat's premier destination for luxury nail products and professional academy training.</p>
        </div>
        <div>
          <h3 className="label mb-6">Navigation</h3>
          <ul className="flex flex-col gap-3">
            {navLinks.map(({ to, label }) => (<li key={to}><Link to={to} className="text-textMuted text-sm font-light hover:text-accent transition-colors">{label}</Link></li>))}
          </ul>
        </div>
        <div>
          <h3 className="label mb-6">Legal</h3>
          <ul className="flex flex-col gap-3">
            {legalLinks.map(({ to, label }) => (<li key={to}><Link to={to} className="text-textMuted text-sm font-light hover:text-accent transition-colors">{label}</Link></li>))}
          </ul>
        </div>
        <div>
          <h3 className="label mb-6">Newsletter</h3>
          <p className="text-textMuted text-xs font-light mb-5 leading-relaxed">Be the first to hear about new collections and academy workshops.</p>
          <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
            <input 
              type="email" 
              required 
              placeholder="Email address" 
              value={email} 
              onChange={(e) => setEmail(e.target.value.replace(/\s/g, ''))} 
              className="input-field text-sm py-3" 
            />
            <button type="submit" disabled={submitting} className="btn-primary w-full py-3 text-[11px]">{submitting ? 'Joining...' : 'Subscribe'}</button>
          </form>
        </div>
      </div>
      <div className="w-[90%] max-w-[1200px] mx-auto border-t border-borderSoft mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-textMuted tracking-[0.3em] uppercase">
        <span>© 2026 Saheli Nails · Surat, India</span><span className="text-accent font-medium">Art at Your Fingertips</span>
      </div>
    </footer>
  );
}