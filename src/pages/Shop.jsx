import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Link } from 'react-router-dom';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Filter States
  const [category, setCategory] = useState('all');
  const [maxPrice, setMaxPrice] = useState(10000);
  const [specialTag, setSpecialTag] = useState('all');

  useEffect(() => {
    const fetchProducts = async () => {
      const snap = await getDocs(collection(db, "products_saheli"));
      setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };
    fetchProducts();
  }, []);

  // Updated Professional Filtering Logic (Rating removed)
  const filteredProducts = products.filter(p => {
    const matchesCategory = category === 'all' || p.category === category;
    const matchesPrice = (p.priceValue || 0) <= maxPrice;
    const matchesSpecial = specialTag === 'all' || p.tag === specialTag;
    
    return matchesCategory && matchesPrice && matchesSpecial;
  });

  return (
    <div className="bg-[#fdfbf9] min-h-screen font-sans">
      
      {/* 1. Header Section */}
      <header className="py-20 border-b border-borderSoft/30 bg-white/50 text-center animate-fade-in">
        <span className="text-accent tracking-[0.4em] text-[10px] font-bold uppercase mb-4 block">The Collection</span>
        <h1 className="text-4xl md:text-6xl font-serif text-textMain italic leading-tight">Nail Artistry & Services</h1>
      </header>

      <div className="w-[90%] max-w-[1400px] mx-auto py-12 flex flex-col lg:flex-row gap-12">
        
        {/* 2. Responsive Sidebar Filter (Rating Section Removed) */}
        <aside className={`lg:w-72 space-y-10 lg:block ${isSidebarOpen ? 'block' : 'hidden'} animate-fade-in`}>
          
          {/* Category Filter */}
          <div className="bg-white p-8 rounded-soft shadow-sm border border-borderSoft/30">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-textMain mb-6 border-b border-borderSoft/30 pb-2">Category</h3>
            <div className="flex flex-col gap-4 text-left">
              {['all', 'art', 'extensions', 'academy'].map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setCategory(cat)}
                  className={`text-sm transition-colors capitalize ${category === cat ? 'text-accent font-semibold' : 'text-gray-400 hover:text-textMain'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="bg-white p-8 rounded-soft shadow-sm border border-borderSoft/30">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-textMain mb-6 border-b border-borderSoft/30 pb-2">Max Price</h3>
            <input 
              type="range" 
              min="500" 
              max="10000" 
              step="500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full accent-accent mb-4 cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 font-medium font-sans">
              <span>₹500</span>
              <span className="text-accent font-bold">₹{maxPrice.toLocaleString()}</span>
            </div>
          </div>

          {/* Special Collections Filter */}
          <div className="bg-white p-8 rounded-soft shadow-sm border border-borderSoft/30">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-textMain mb-6 border-b border-borderSoft/30 pb-2">Collections</h3>
            <div className="flex flex-col gap-4 text-left">
              {['all', 'Best Seller', 'Selling of the Month', 'New Arrival'].map(tag => (
                <button 
                  key={tag} 
                  onClick={() => setSpecialTag(tag)}
                  className={`text-sm transition-colors ${specialTag === tag ? 'text-accent font-semibold' : 'text-gray-400 hover:text-textMain'}`}
                >
                  {tag === 'all' ? 'Everything' : tag}
                </button>
              ))}
            </div>
          </div>

        </aside>

        {/* 3. Main Product Grid */}
        <main className="flex-1 animate-fade-in">
          
          {/* Mobile Filter Toggle */}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden w-full mb-8 bg-white border border-borderSoft p-4 rounded-soft text-[10px] font-bold uppercase tracking-widest text-textMain shadow-sm flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>
            {isSidebarOpen ? 'Hide Filters' : 'Show Filters'}
          </button>

          {loading ? (
            <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div></div>
          ) : (
            <>
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProducts.map(p => (
                    <Link to={`/product/${p.id}`} key={p.id} className="group flex flex-col bg-white border border-borderSoft/50 rounded-soft overflow-hidden hover:shadow-2xl transition-all duration-500 shadow-sm">
                      <div className="aspect-[3/4] overflow-hidden relative">
                        <span className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-soft shadow-sm text-accent">
                          {p.tag}
                        </span>
                        <img 
                          src={p.thumbnail || p.images?.[0]} 
                          alt={p.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                        />
                      </div>
                      <div className="p-8 flex flex-col flex-grow text-center">
                        <h3 className="font-serif text-xl text-textMain mb-3 group-hover:text-accent transition-colors">{p.name}</h3>
                        <p className="text-gray-400 font-bold text-xs mt-auto tracking-[0.2em]">{p.priceDisplay}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-40 text-center bg-white border border-dashed border-borderSoft rounded-soft">
                  <p className="text-gray-400 font-serif italic text-lg">No services match your current selection.</p>
                  <button 
                    onClick={() => {setCategory('all'); setMaxPrice(10000); setSpecialTag('all');}}
                    className="mt-6 text-accent underline text-xs font-bold uppercase tracking-widest"
                  >
                    Reset all filters
                  </button>
                </div>
              )}
            </>
          )}
        </main>

      </div>
    </div>
  );
}