import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { Navigate } from 'react-router-dom';

function Spinner() {
  return (
    <div className="min-h-screen bg-bgBase flex flex-col items-center justify-center gap-6">
      <div className="w-10 h-10 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
      <p className="font-sans font-bold text-[10px] uppercase tracking-[0.3em] text-textMuted animate-pulse">
        Verifying Access...
      </p>
    </div>
  );
}

export function ProtectedRoute({ children }) {
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setStatus(user ? 'ok' : 'denied');
    });
    return unsub;
  }, []);

  if (status === 'loading') return <Spinner />;
  if (status === 'denied') return <Navigate to="/login" replace />;
  return children;
}

export function AdminRoute({ children }) {
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return setStatus('denied');
      try {
        const snap = await getDoc(doc(db, 'users_saheli', user.uid));
        const role = snap.exists() ? snap.data()?.role : null;
        setStatus(role === 'admin' ? 'ok' : 'forbidden');
      } catch {
        setStatus('forbidden');
      }
    });
    return unsub;
  }, []);

  if (status === 'loading') return <Spinner />;
  if (status === 'denied') return <Navigate to="/login" replace />;
  if (status === 'forbidden') return <Navigate to="/" replace />;
  return children;
}