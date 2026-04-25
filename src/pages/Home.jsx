import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { collection, query, where, limit, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useState } from 'react';
import toast from 'react-hot-toast';

async function fetchHomeData() {
  const [pSnap, rSnap] = await Promise.all([
    getDocs(query(collection(db, 'products_saheli'), limit(4))),
    getDocs(query(collection(db, 'reviews_saheli'), where('status', '==', 'approved'), limit(3))),
  ]);
  return {
    bestSellers: pSnap.docs.map(d => ({ id: d.id, ...d.data() })),
    reviews:     rSnap.docs.map(d => ({ id: d.id, ...d.data() })),
  };
}

function ProductSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="aspect-[3/4] bg-borderSoft animate-pulse rounded-soft" />
      <div className="h-4 bg-borderSoft animate-pulse rounded-soft w-3/4 mx-auto mt-4" />
      <div className="h-3 bg-borderSoft animate-pulse rounded-soft w-1/2 mx-auto mt-2" />
    </div>
  );
}

export default function Home() {
  const [email, setEmail] = useState('');
  const { data, isLoading } = useQuery({ queryKey: ['homeData'], queryFn: fetchHomeData });
  
  const bestSellers = data?.bestSellers || [];
  const reviews = data?.reviews || [];

  const handleSub = async (e) => {
    e.preventDefault();
    if (!email.trim()) return toast.error('Please enter a valid email.');

    try {
      await addDoc(collection(db, 'subscribes_saheli'), {
        email: email.trim(),
        subscribedAt: serverTimestamp(),
        active: true,
        source: 'home',
      });
      toast.success('Welcome to the Saheli Circle!');
      setEmail('');
    } catch {
      toast.error('Subscription failed. Please try again.');
    }
  };

  return (
    <div className="bg-bgBase animate-fade-in font-sans">

      {/* ── 1. Hero ────────────────────────────────────────── */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=2000" 
            alt="Hero" 
            className="w-full h-full object-cover opacity-[0.15]" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bgBase via-bgBase/50 to-transparent"></div>
        </div>

        <div className="page-container relative z-10 py-32 text-center md:text-left">
          <div className="max-w-[750px]">
            <span className="label text-accent mb-6">Artistry • Academy • Surat</span>
            <h1 className="text-5xl md:text-8xl font-serif font-medium leading-[1.1] mb-8 text-textMain">
              Art at Your <br/>
              <span className="italic text-accent font-light">Fingertips.</span>
            </h1>
            <p className="text-textBody text-lg md:text-xl mb-12 leading-relaxed font-light">
              Surat's premier destination for luxury nail products, bespoke artistry, and professional certification. Experience precision styling.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/shop" className="btn-primary px-10">
                View Products
              </Link>
              <Link to="/contact" className="btn-secondary px-10">
                Book Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Best Sellers ───────────────────────────────── */}
      <section className="py-32 bg-white border-y border-borderSoft">
        <div className="page-container">
          <div className="text-center mb-20">
            <span className="label text-accent mb-4">Most Loved</span>
            <h2 className="text-3xl md:text-5xl font-serif text-textMain italic">Best Selling Nails</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {isLoading
              ? [...Array(4)].map((_, i) => <ProductSkeleton key={i} />)
              : bestSellers.map((p) => (
                <Link to={`/product/${p.id}`} key={p.id} className="card group flex flex-col hover:-translate-y-2 transition-all duration-500 shadow-sm hover:shadow-card-hover">
                  <div className="aspect-[3/4] overflow-hidden rounded-t-soft relative">
                    {p.tag && (
                      <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-[9px] font-sans font-bold px-3 py-1 rounded-soft tracking-widest uppercase z-10 text-accent">
                        {p.tag}
                      </span>
                    )}
                    <img
                      src={p.thumbnail || p.images?.[0]}
                      alt={p.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="pt-6 pb-8 px-6 text-center bg-white rounded-b-soft">
                    <h3 className="font-serif text-[18px] font-medium text-textMain mb-2 group-hover:text-accent transition-colors line-clamp-1">{p.name}</h3>
                    <p className="text-textMuted text-[11px] font-sans font-bold tracking-[0.2em] uppercase">{p.priceDisplay}</p>
                  </div>
                </Link>
              ))
            }
          </div>

          <div className="text-center mt-20">
            <Link to="/shop" className="text-textMain font-bold uppercase text-[10px] tracking-[0.4em] border-b border-accent/30 pb-2 hover:border-accent hover:text-accent transition-all">
              View Entire Collection
            </Link>
          </div>
        </div>
      </section>

      {/* ── 3. Brand Quote ────────────────────────────────── */}
      <section className="py-40 bg-bgBase">
        <div className="w-[90%] max-w-[900px] mx-auto text-center">
          <h2 className="text-accent font-serif italic text-3xl mb-12">The Saheli Legacy</h2>
          <p className="text-3xl md:text-5xl text-textMain font-serif leading-[1.4] mb-12 font-medium">
            “We don't just paint nails; we <span className="italic text-accent font-light">sculpt</span> confidence. Every stroke is a step toward your personal perfection.”
          </p>
          <div className="h-24 w-[1px] bg-accent/20 mx-auto"></div>
        </div>
      </section>

      {/* ── 4. Voices of Saheli (Reviews) ─────────────────── */}
      <section className="py-32 bg-white border-t border-borderSoft">
        <div className="page-container">
          <h2 className="text-3xl md:text-5xl font-serif text-center mb-20 italic text-textMain">Voices of Saheli</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="bg-bgBase p-12 rounded-soft animate-pulse h-64" />
              ))
            ) : reviews.length > 0 ? (
              reviews.map(r => (
                <div key={r.id} className="bg-bgBase p-12 rounded-soft shadow-card hover:-translate-y-2 transition-all duration-500 border-t-4 border-accent">
                  <div className="flex text-accent mb-8 text-[12px] gap-1">
                    {[...Array(5)].map((_, i) => <span key={i}>{i < (r.rating || 5) ? '★' : '☆'}</span>)}
                  </div>
                  <p className="text-textBody font-light italic mb-10 leading-loose text-base">
                    "{r.comment}"
                  </p>
                  <p className="text-textMain font-sans font-bold uppercase text-[10px] tracking-[0.2em]">
                    — {r.customerName}
                  </p>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-20">
                <p className="text-textMuted font-serif italic">Be the first to share your Saheli story.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── 5. Subscribe ──────────────────────────────────── */}
      <section className="py-28 bg-bgBase border-t border-borderSoft">
        <div className="w-[90%] max-w-[600px] mx-auto text-center">
          <h2 className="text-3xl font-serif mb-6 text-textMain">Join the Saheli Circle</h2>
          <p className="text-textMuted mb-10 text-sm font-light">
            Be the first to hear about new products, seasonal art, and academy workshops.
          </p>
          <form onSubmit={handleSub} className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value.replace(/\s/g, ''))}
              placeholder="Email address"
              required
              className="input-field flex-grow"
            />
            <button type="submit" className="btn-primary">
              Subscribe
            </button>
          </form>
        </div>
      </section>

    </div>
  );
}