import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, limit, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function Home() {
  const [bestSellers, setBestSellers] = useState([]); // New state for products
  const [reviews, setReviews] = useState([]);
  const [email, setEmail] = useState('');
  const [subMessage, setSubMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const heroImg = "https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=2000";

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Top 4 Best Selling Nails
        const pQuery = query(collection(db, "products_saheli"), limit(4));
        const pSnap = await getDocs(pQuery);
        setBestSellers(pSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        // 2. Fetch Approved Reviews
        const rQuery = query(collection(db, "reviews_saheli"), where("status", "==", "approved"), limit(3));
        const rSnap = await getDocs(rQuery);
        setReviews(rSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error fetching home data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSub = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "subscribes_saheli"), { email, subscribedAt: serverTimestamp(), active: true, source: 'home' });
      setSubMessage("Welcome to the circle.");
      setEmail('');
    } catch { setSubMessage("Error."); }
    setTimeout(() => setSubMessage(''), 5000);
  };

  return (
    <div className="bg-[#fdfbf9] animate-fade-in text-[#333333] font-sans">
      
      {/* 1. Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={heroImg} alt="Hero" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#fdfbf9] via-transparent to-transparent"></div>
        </div>
        <div className="w-[90%] max-w-[1200px] mx-auto relative z-10 py-32 text-center md:text-left">
          <div className="max-w-[750px]">
            <span className="text-accent tracking-[0.3em] text-xs font-bold uppercase mb-6 block">Artistry • Academy • Surat</span>
            <h1 className="text-5xl md:text-8xl font-serif font-medium leading-[1.1] mb-8 text-textMain">Art at Your <br/><span className="italic text-accent font-light">Fingertips.</span></h1>
            <p className="text-gray-600 text-lg md:text-xl mb-12 leading-relaxed">Surat's favorite destination for luxury nail extensions, bespoke artistry, and professional certification. Experience precision styling.</p>
            <div className="flex flex-col sm:flex-row gap-6">
              <Link to="/shop" className="bg-accent text-white px-12 py-4 rounded-soft shadow-xl shadow-accent/20 font-bold tracking-wide text-xs uppercase text-center">View Services</Link>
              <Link to="/contact" className="bg-white border border-borderSoft text-textMain px-12 py-4 rounded-soft shadow-lg font-bold tracking-wide text-xs uppercase text-center">Book Trial</Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Best Selling Nails (Replacement Section) */}
      <section className="py-32 bg-white border-y border-borderSoft/30">
        <div className="w-[90%] max-w-[1200px] mx-auto">
          <div className="text-center mb-20">
            <span className="text-accent tracking-[0.3em] text-[10px] font-bold uppercase mb-4 block">Most Loved</span>
            <h2 className="text-3xl md:text-5xl font-serif text-textMain italic">Best Selling Nails</h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-10"><div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin"></div></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {bestSellers.map((p) => (
                <Link to={`/product/${p.id}`} key={p.id} className="group bg-white flex flex-col hover:-translate-y-2 transition-all duration-500">
                  <div className="aspect-[3/4] overflow-hidden rounded-soft shadow-md group-hover:shadow-2xl transition-all relative">
                    <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-[9px] font-bold px-3 py-1 rounded-soft tracking-widest uppercase z-10">{p.tag}</span>
                    <img 
                      src={p.thumbnail || p.images?.[0]} 
                      alt={p.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                  </div>
                  <div className="pt-6 text-center">
                    <h3 className="font-serif text-lg text-textMain mb-2 group-hover:text-accent transition-colors">{p.name}</h3>
                    <p className="text-gray-400 text-xs font-bold tracking-widest uppercase">{p.priceDisplay}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
          
          <div className="text-center mt-20">
            <Link to="/shop" className="text-textMain font-bold uppercase text-[10px] tracking-[0.4em] border-b border-accent/30 pb-2 hover:border-accent transition-all">View Entire Collection</Link>
          </div>
        </div>
      </section>

      {/* 3. Narrative Section */}
      <section className="py-40 bg-[#fdfbf9]">
        <div className="w-[90%] max-w-[900px] mx-auto text-center">
          <h2 className="text-accent font-serif italic text-3xl mb-12">The Saheli Legacy</h2>
          <p className="text-3xl md:text-5xl text-textMain font-serif leading-[1.4] mb-12">“We don't just paint nails; we <span className="italic text-accent">sculpt</span> confidence. Every stroke is a step toward your personal perfection.”</p>
          
        </div>
      </section>

      {/* 4. Reviews Grid */}
      <section className="py-32 bg-white border-t border-borderSoft/30">
        <div className="w-[90%] max-w-[1200px] mx-auto">
          <h2 className="text-3xl font-serif text-center mb-20 italic">Voices of Saheli</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {reviews.map(r => (
              <div key={r.id} className="bg-white p-12 rounded-soft shadow-xl border-b-4 border-accent transition-all duration-500">
                <div className="flex text-accent mb-8 text-[10px]">{[...Array(5)].map((_, i) => <span key={i}>★</span>)}</div>
                <p className="text-gray-600 font-light italic mb-10 leading-loose">"{r.comment}"</p>
                <p className="text-textMain font-bold uppercase text-[10px] tracking-[0.2em]">{r.customerName}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Subscribe Section */}
      <section className="py-24 bg-[#fdfbf9] border-t border-borderSoft/20">
        <div className="w-[90%] max-w-[600px] mx-auto text-center">
          <h2 className="text-2xl font-serif mb-6">Join the Saheli Circle</h2>
          <p className="text-gray-500 mb-10 text-sm font-light">Be the first to hear about new collections and academy workshops.</p>
          <form onSubmit={handleSub} className="flex flex-col sm:flex-row gap-4">
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email address" required className="flex-grow bg-white border border-borderSoft p-4 rounded-soft text-sm outline-none focus:border-accent transition-all" />
            <button type="submit" className="bg-textMain text-white px-10 py-4 rounded-soft text-[10px] font-bold uppercase tracking-widest shadow-xl hover:bg-accent transition-all">Join</button>
          </form>
          {subMessage && <p className="mt-4 text-accent text-xs font-bold animate-fade-in">{subMessage}</p>}
        </div>
      </section>

    </div>
  );
}