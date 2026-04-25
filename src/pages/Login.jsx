import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
        // After registering, route them to set up their beautiful profile
        navigate('/profile-setup'); 
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        // After logging in, take them back to the shop
        navigate('/shop'); 
      }
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfbf9] flex items-center justify-center py-16 px-4 animate-fade-in">
      <div className="max-w-md w-full bg-white border border-borderSoft rounded-soft p-10 shadow-sm">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif text-textMain mb-2">
            {isRegistering ? 'Create an Account' : 'Welcome Back'}
          </h1>
          <p className="text-textLight font-light text-sm">
            {isRegistering ? 'Join Saheli Boutique to manage rentals and bookings.' : 'Sign in to access your appointments and orders.'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-4 rounded-soft mb-6 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-textMain mb-2">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-borderSoft px-4 py-3 rounded-soft focus:outline-none focus:border-accent transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-textMain mb-2">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-borderSoft px-4 py-3 rounded-soft focus:outline-none focus:border-accent transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-accent text-white py-4 rounded-soft hover:bg-textMain transition-colors duration-300 font-medium tracking-wide mt-4"
          >
            {isRegistering ? 'Register' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-borderSoft pt-6">
          <p className="text-sm text-textLight">
            {isRegistering ? 'Already have an account?' : "Don't have an account?"}
            <button 
              type="button"
              onClick={() => setIsRegistering(!isRegistering)}
              className="ml-2 text-accent font-medium hover:text-textMain transition-colors"
            >
              {isRegistering ? 'Sign In' : 'Create One'}
            </button>
          </p>
        </div>
        
      </div>
    </div>
  );
}