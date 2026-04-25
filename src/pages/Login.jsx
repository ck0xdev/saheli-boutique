import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db } from '../config/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

export default function Login() {
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    const cleanEmail = email.replace(/\s/g, ''); 
    setLoading(true);

    try {
      if (mode === 'forgot') {
        await sendPasswordResetEmail(auth, cleanEmail);
        toast.success('Password reset email sent. Check your inbox.');
        setMode('signin');
      } else if (mode === 'register') {
        if (password !== confirmPassword) return toast.error('Passwords do not match.');
        if (password.length < 6) return toast.error('Password must be at least 6 characters.');
        const cred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
        await setDoc(doc(db, 'users_saheli', cred.user.uid), { email: cleanEmail, role: 'user', name: '', mobile: '', photoURL: null, createdAt: serverTimestamp() });
        toast.success('Welcome to Saheli Nails! Set up your profile.');
        navigate('/profile');
      } else {
        await signInWithEmailAndPassword(auth, cleanEmail, password);
        toast.success('Welcome back!');
        navigate('/shop');
      }
    } catch (err) { toast.error(err.message.replace('Firebase: ', '')); } finally { setLoading(false); }
  };

  const titles = {
    signin:   { h1: 'Welcome Back',       sub: 'Sign in to access your appointments and orders.' },
    register: { h1: 'Create an Account',  sub: 'Join Saheli Boutique — manage bookings.' },
    forgot:   { h1: 'Reset Password',     sub: 'Enter your email and we\'ll send a reset link.' },
  };

  return (
    <div className="min-h-screen bg-bgBase flex items-center justify-center py-16 px-4 animate-fade-in">
      <div className="max-w-md w-full">
        <div className="card p-10">
          <div className="text-center mb-10">
            <Link to="/" className="inline-block mb-6">
              <span className="text-2xl font-serif font-semibold text-textMain tracking-tight">Saheli <span className="italic text-accent font-light">Nails</span></span>
            </Link>
            <h1 className="text-3xl font-serif text-textMain mb-2">{titles[mode].h1}</h1>
            <p className="text-textMuted font-sans font-light text-sm">{titles[mode].sub}</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-5">
            <div>
              <label className="label">Email Address</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value.replace(/\s/g, ''))} className="input-field" placeholder="you@example.com" />
            </div>
            {mode !== 'forgot' && <div><label className="label">Password</label><input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" placeholder="••••••••" minLength={6} /></div>}
            {mode === 'register' && <div><label className="label">Confirm Password</label><input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input-field" placeholder="••••••••" /></div>}
            <button type="submit" disabled={loading} className="w-full btn-primary py-4 mt-2">
              {loading ? 'Processing...' : mode === 'signin' ? 'Sign In' : mode === 'register' ? 'Create Account' : 'Send Reset Link'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-borderSoft space-y-3 text-center">
            {mode === 'signin' && (
              <>
                <p className="text-sm text-textMuted">Don't have an account? <button onClick={() => setMode('register')} className="text-accent font-semibold hover:text-accentDeep transition-colors">Create One</button></p>
                <p className="text-sm text-textMuted"><button onClick={() => setMode('forgot')} className="text-textMuted hover:text-accent transition-colors text-xs font-light">Forgot your password?</button></p>
              </>
            )}
            {mode === 'register' && <p className="text-sm text-textMuted">Already have an account? <button onClick={() => setMode('signin')} className="text-accent font-semibold hover:text-accentDeep transition-colors">Sign In</button></p>}
            {mode === 'forgot' && <button onClick={() => setMode('signin')} className="text-sm text-textMuted hover:text-accent transition-colors font-light">← Back to Sign In</button>}
          </div>
        </div>
      </div>
    </div>
  );
}