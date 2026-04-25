import { useState, useEffect } from 'react';
import { db, auth } from '../config/firebase'; // Added auth import
import { onAuthStateChanged } from 'firebase/auth'; // Auth listener
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Contact() {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '', service: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // --- Check if User is Logged In ---
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Auto-fill their name and email so they don't have to type it again
        setForm(prev => ({
          ...prev,
          name: currentUser.displayName || '',
          email: currentUser.email || ''
        }));
      }
      setLoadingAuth(false);
    });
    return unsub;
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      setForm(prev => ({ ...prev, [name]: value.replace(/[^0-9+\-\s()]/g, '') }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) {
      return toast.error('Please provide a valid name and message.');
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'inquiries_saheli'), { 
        ...form, 
        name: form.name.trim(),
        message: form.message.trim(),
        createdAt: serverTimestamp(), 
        status: 'new' 
      });
      setSubmitted(true);
      toast.success('Your message has been received! We\'ll reach out soon.');
    } catch (err) { 
      toast.error('Something went wrong. Please try again.'); 
    } finally { 
      setSubmitting(false); 
    }
  };

  if (loadingAuth) {
    return <div className="min-h-screen bg-bgBase flex items-center justify-center"><div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="bg-bgBase min-h-screen animate-fade-in font-sans">
      <header className="py-24 border-b border-borderSoft/50 text-center bg-white">
        <span className="label text-accent mb-4">Get in Touch</span>
        <h1 className="text-4xl md:text-6xl font-serif text-textMain italic leading-tight">Let's Connect.</h1>
        <p className="mt-6 text-textBody font-light max-w-md mx-auto text-sm leading-relaxed">
          Have questions about our nail products or academy courses? We are here to help you shine.
        </p>
      </header>

      <div className="page-container py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <aside className="lg:col-span-4 space-y-10">
            <div>
              <h2 className="text-2xl font-serif text-textMain mb-8">Our Studio</h2>
              <div className="space-y-8">
                {[{ label: 'Address', value: 'Surat, Gujarat, India' }, { label: 'WhatsApp', value: '+91 92654 66420' }, { label: 'Instagram', value: '@saheli_nail_and_academy' }].map((item, i) => (
                  <div key={i}>
                    <p className="label mb-1">{item.label}</p>
                    <p className="text-textBody text-sm">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="card p-8 bg-bgSurface border-borderSoft shadow-sm">
              <h3 className="font-serif text-textMain text-xl mb-2">Prefer WhatsApp?</h3>
              <p className="text-textMuted mb-6 font-light text-sm">Get an immediate response.</p>
              <a href="https://wa.me/919265466420" target="_blank" rel="noreferrer" className="inline-flex items-center text-accent font-bold uppercase text-[10px] tracking-widest border-b border-accent pb-1 hover:text-textMain hover:border-textMain transition-all">Start Chat Now</a>
            </div>
          </aside>

          <div className="lg:col-span-8">
            {/* If NOT logged in, show login prompt */}
            {!user ? (
              <div className="card p-16 text-center animate-scale-in border-dashed border-2">
                <div className="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                </div>
                <h3 className="text-3xl font-serif text-textMain mb-4">Sign in required</h3>
                <p className="text-textMuted font-light mb-8 text-sm max-w-sm mx-auto">
                  To prevent spam and ensure the highest quality of service, we ask all clients to sign in before sending a direct message.
                </p>
                <Link to="/login" className="btn-primary px-10">Sign In to Continue</Link>
              </div>
            ) : submitted ? (
              <div className="card p-16 text-center animate-scale-in">
                <h3 className="text-3xl font-serif text-textMain mb-4">Message Received</h3>
                <p className="text-textMuted font-light mb-8 text-sm max-w-sm mx-auto">Thank you for reaching out. A Saheli specialist will contact you via WhatsApp shortly.</p>
                <button onClick={() => { setSubmitted(false); setForm({ name: user.displayName || '', phone: '', email: user.email || '', message: '', service: '' }); }} className="btn-secondary">Send Another Message</button>
              </div>
            ) : (
              <div className="card p-10 md:p-14">
                <h2 className="text-3xl font-serif text-textMain mb-2">Send an Inquiry</h2>
                <p className="text-textMuted text-sm font-light mb-10">We read every message personally.</p>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label className="label">Your Name</label><input name="name" required value={form.name} onChange={handleChange} className="input-field" placeholder="Jane Doe" /></div>
                    <div><label className="label">WhatsApp Number *</label><input type="text" inputMode="tel" name="phone" required value={form.phone} onChange={handleChange} className="input-field" placeholder="+91 98765 43210" /></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label className="label">Email Address</label><input type="email" name="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value.replace(/\s/g, '')})} className="input-field" placeholder="you@example.com" /></div>
                    <div>
                      <label className="label">Interested In</label>
                      <select name="service" value={form.service} onChange={handleChange} className="input-field">
                        <option value="">Select an option...</option>
                        <option value="nail-products">Nail Products</option>
                        <option value="academy">Academy Course</option>
                        <option value="other">Other Query</option>
                      </select>
                    </div>
                  </div>
                  <div><label className="label">How can we help?</label><textarea name="message" required value={form.message} onChange={handleChange} rows={5} className="input-field resize-none" placeholder="I am interested in..." /></div>
                  <button type="submit" disabled={submitting} className="w-full btn-primary py-4">{submitting ? 'Sending...' : 'Submit Inquiry'}</button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}