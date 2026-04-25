import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../config/firebase';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const docRef = doc(db, 'products_saheli', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProduct({ id: docSnap.id, ...data });
        setActiveImage(data.images?.[0] || data.thumbnail);
        const q = query(collection(db, 'reviews_saheli'), where('productId', '==', id), where('status', '==', 'approved'));
        const rSnap = await getDocs(q);
        setReviews(rSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      }
      setLoading(false);
    };
    fetch();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) return alert("Please sign in.");
    setSubmitting(true);
    try {
      const userDoc = await getDoc(doc(db, 'users_saheli', auth.currentUser.uid));
      const customerName = userDoc.exists() ? userDoc.data().name : (auth.currentUser.displayName || "Client");
      await addDoc(collection(db, 'reviews_saheli'), { productId: id, customerName, rating: Number(newReview.rating), comment: newReview.comment, status: 'pending', createdAt: serverTimestamp() });
      alert("Review submitted for moderation.");
      setNewReview({ rating: 5, comment: '' });
    } catch { alert("Error."); } finally { setSubmitting(false); }
  };

  if (loading) return <div className="min-h-screen bg-[#fdfbf9] flex items-center justify-center"><div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div></div>;
  if (!product) return <div className="min-h-screen bg-[#fdfbf9] flex flex-col items-center justify-center"><h2 className="text-3xl font-serif mb-4">Service Not Found</h2><Link to="/shop" className="text-accent underline text-xs">Return to Collection</Link></div>;

  return (
    <div className="bg-[#fdfbf9] min-h-screen pb-24">
      <div className="w-[90%] max-w-[1200px] mx-auto pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-6">
            <div className="aspect-[3/4] rounded-soft overflow-hidden shadow-2xl border border-borderSoft/30"><img src={activeImage} alt={product.name} className="w-full h-full object-cover" /></div>
            {product.images?.length > 1 && <div className="flex gap-4 overflow-x-auto pb-4">{product.images.map((img, i) => <button key={i} onClick={() => setActiveImage(img)} className={`w-24 h-32 rounded-soft overflow-hidden border-2 ${activeImage === img ? 'border-accent' : 'border-transparent opacity-70'}`}><img src={img} className="w-full h-full object-cover" /></button>)}</div>}
          </div>
          <div className="lg:sticky lg:top-32 space-y-8">
            <span className="text-accent text-[10px] font-bold uppercase tracking-[0.3em]">{product.tag}</span>
            <h1 className="text-4xl md:text-6xl font-serif text-textMain leading-tight">{product.name}</h1>
            <div className="py-6 border-y border-borderSoft/30"><span className="text-3xl font-serif">{product.priceDisplay}</span></div>
            <p className="text-gray-600 leading-relaxed text-base">{product.shortDesc}</p>
            <div className="pt-8"><a href={`https://wa.me/919265466420?text=Hi, I am interested in ${product.name}`} target="_blank" className="w-full bg-accent text-white py-4 rounded-soft flex items-center justify-center font-bold uppercase text-xs tracking-widest shadow-xl shadow-accent/20 hover:bg-textMain transition-all">Book via WhatsApp</a></div>
          </div>
        </div>
        <div className="mt-32 pt-24 border-t border-borderSoft/30 grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-5"><div className="bg-white p-12 rounded-soft shadow-xl border border-borderSoft/30"><h3 className="text-2xl font-serif mb-6">Client Experience</h3><form onSubmit={handleSubmit} className="space-y-6"><select value={newReview.rating} onChange={(e)=>setNewReview({...newReview, rating: e.target.value})} className="w-full bg-[#fdfbf9] border border-borderSoft p-4 rounded-soft text-sm outline-none"><option value="5">5 Stars</option><option value="4">4 Stars</option></select><textarea required placeholder="How was your session?" value={newReview.comment} onChange={(e)=>setNewReview({...newReview, comment: e.target.value})} className="w-full bg-[#fdfbf9] border border-borderSoft p-4 rounded-soft text-sm outline-none min-h-[120px]" /><button className="w-full bg-textMain text-white py-4 rounded-soft text-[10px] font-bold uppercase tracking-widest shadow-xl">{submitting ? 'Submitting...' : 'Post Story'}</button></form></div></div>
          <div className="lg:col-span-7"><h3 className="text-2xl font-serif mb-12 italic">Voices of Saheli</h3>{reviews.length > 0 ? <div className="space-y-8">{reviews.map((r, i) => <div key={i} className="bg-white p-10 rounded-soft shadow-md border-l-4 border-accent"><p className="text-gray-500 italic mb-6 leading-relaxed">"{r.comment}"</p><p className="text-textMain font-bold uppercase text-[10px] tracking-widest">— {r.customerName}</p></div>)}</div> : <p className="text-gray-400 italic">No stories yet.</p>}</div>
        </div>
      </div>
    </div>
  );
}