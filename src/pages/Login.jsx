import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db } from '../config/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

export default function Login() {
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // --- Email & Password Auth ---
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
        await setDoc(doc(db, 'users_saheli', cred.user.uid), { 
          email: cleanEmail, 
          role: 'user', 
          name: '', 
          mobile: '', 
          photoURL: null, 
          createdAt: serverTimestamp() 
        });
        
        toast.success('Welcome to Saheli Nails! Set up your profile.');
        navigate('/profile');
      } else {
        await signInWithEmailAndPassword(auth, cleanEmail, password);
        toast.success('Welcome back!');
        navigate('/shop');
      }
    } catch (err) { 
      toast.error(err.message.replace('Firebase: ', '')); 
    } finally { 
      setLoading(false); 
    }
  };

  // --- Google Auth ---
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    setLoading(true);
    
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if user already exists in our database
      const userRef = doc(db, 'users_saheli', user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        // First time logging in with Google: Create their profile record
        await setDoc(userRef, {
          email: user.email,
          role: 'user',
          name: user.displayName || '',
          mobile: '',
          photoURL: user.photoURL || null,
          createdAt: serverTimestamp()
        });
        toast.success('Welcome to Saheli Nails! You can complete your profile here.');
        navigate('/profile');
      } else {
        // Returning user
        toast.success('Welcome back!');
        navigate('/shop');
      }
    } catch (err) {
      toast.error(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
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

          {/* Google Sign In Button (Only show on Login/Register modes) */}
          {mode !== 'forgot' && (
            <div className="mt-6">
              <div className="relative flex items-center justify-center mb-6">
                <div className="absolute border-t border-borderSoft w-full"></div>
                <span className="bg-white px-4 text-xs text-textMuted font-sans uppercase tracking-widest relative z-10">Or continue with</span>
              </div>
              
              <button 
                type="button" 
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full bg-white border border-borderSoft text-textMain py-3.5 rounded-soft font-sans font-medium flex items-center justify-center gap-3 hover:bg-bgBase transition-colors shadow-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
            </div>
          )}

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