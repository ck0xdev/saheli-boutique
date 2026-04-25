import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

// Eager-load critical pages
import Home from './pages/Home';
import Login from './pages/Login';

// Lazy-load everything else (code splitting → faster initial load)
const Shop          = lazy(() => import('./pages/Shop'));
const About         = lazy(() => import('./pages/About'));
const Contact       = lazy(() => import('./pages/Contact'));
const Profile       = lazy(() => import('./pages/Profile'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,  // 5 minutes — avoids refetching same data
      gcTime:    1000 * 60 * 10, // 10 minutes garbage collection
      retry: 1,
    },
  },
});

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="w-7 h-7 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-neutral-400 animate-pulse">Loading...</p>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="flex flex-col min-h-screen bg-neutral-50 text-neutral-800 font-sans">
          <Navbar />
          <main className="flex-grow">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/"            element={<Home />} />
                <Route path="/shop"        element={<Shop />} />
                <Route path="/shop/:id"    element={<ProductDetail />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/about"       element={<About />} />
                <Route path="/contact"     element={<Contact />} />
                <Route path="/login"       element={<Login />} />
                <Route path="/register"    element={<Login />} />

                {/* Protected Routes */}
                <Route path="/profile" element={
                  <ProtectedRoute><Profile /></ProtectedRoute>
                } />
                <Route path="/dashboard" element={
                  <ProtectedRoute><Profile /></ProtectedRoute>
                } />

                {/* Admin-only Route */}
                <Route path="/admin" element={
                  <AdminRoute><AdminDashboard /></AdminRoute>
                } />
                <Route path="/admin/*" element={
                  <AdminRoute><AdminDashboard /></AdminRoute>
                } />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>

        {/* Global Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#FDFAF7',
              color: '#1A1A18',
              border: '1px solid #EAE4DE',
              borderRadius: '8px',
              fontFamily: 'Jost, sans-serif',
              fontSize: '13px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            },
            success: {
              iconTheme: { primary: '#B76E79', secondary: '#FDFAF7' },
            },
            error: {
              iconTheme: { primary: '#C0504D', secondary: '#FDFAF7' },
            },
          }}
        />
      </Router>
    </QueryClientProvider>
  );
}