import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Link } from 'react-router-dom';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products_saheli"));
        const items = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(items);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => filter === 'all' || p.category === filter);

  return (
    <div className="bg-[#fdfbf9] min-h-screen py-16 animate-fade-in">
      <div className="w-[90%] max-w-[1400px] mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif text-textMain mb-4">Our Collection</h1>
          <p className="text-textLight font-light">Explore designer dresses and professional nail artistry.</p>
          
          <div className="flex justify-center gap-4 mt-8">
            {['all', 'chaniya', 'nails'].map(cat => (
              <button 
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 rounded-soft text-sm font-medium tracking-wide transition-colors ${filter === cat ? 'bg-textMain text-white' : 'bg-transparent border border-borderSoft text-textMain hover:border-textMain'}`}
              >
                {cat === 'all' ? 'All Items' : cat === 'chaniya' ? 'Dresses' : 'Nail Art'}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProducts.map(product => (
              <Link to={`/product/${product.id}`} key={product.id} className="group flex flex-col bg-white border border-borderSoft rounded-soft overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="aspect-[3/4] overflow-hidden relative bg-gray-50">
                  <span className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm text-textMain text-xs font-medium px-3 py-1 rounded-soft shadow-sm">
                    {product.tag}
                  </span>
                  <img 
                    src={product.thumbnail || product.images?.[0] || 'http://placehold.it/400x500/eeeeee/111111&text=No+Image'} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="font-serif text-lg text-textMain mb-2">{product.name}</h3>
                  <p className="text-accent font-medium mt-auto">{product.priceDisplay}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}