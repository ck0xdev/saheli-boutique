import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { doc, getDoc, collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import DOMPurify from "dompurify";
import { db, auth } from "../config/firebase";
import { getCloudinaryUrl } from "../utils/cloudinary";
import toast from "react-hot-toast";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState("");
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "products_saheli", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProduct({ id: docSnap.id, ...data });
        setActiveImage(data.images?.[0] || data.thumbnail);
        const q = query(
          collection(db, "reviews_saheli"),
          where("productId", "==", id),
          where("status", "==", "approved"),
        );
        const rSnap = await getDocs(q);
        setReviews(rSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const handleInquiry = () => {
    if (!auth.currentUser) {
      toast.error('Please sign in to send an inquiry.');
      navigate('/login');
      return;
    }
    const userName = auth.currentUser.displayName || auth.currentUser.email.split('@')[0];
    const productIdText = product.productId ? product.productId : product.id;
    const message = `Hi I am ${userName}, I am interested to buy ${product.name} (${productIdText})`;
    
    window.open(`https://wa.me/919265466420?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) return toast.error("Please sign in to leave a review.");
    
    if (!newReview.comment.trim()) {
      return toast.error("Review cannot be empty.");
    }

    setSubmitting(true);
    try {
      const userDoc = await getDoc(doc(db, "users_saheli", auth.currentUser.uid));
      const customerName = userDoc.exists() ? userDoc.data().name : auth.currentUser.displayName || "Client";
      
      await addDoc(collection(db, "reviews_saheli"), {
        productId: id,
        customerName,
        rating: Number(newReview.rating),
        comment: newReview.comment.trim(),
        status: "pending",
        createdAt: serverTimestamp(),
      });
      
      toast.success("Review submitted! It will appear Soon.");
      setNewReview({ rating: 5, comment: "" });
    } catch {
      toast.error("Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-bgBase"><div className="w-[90%] max-w-[1200px] mx-auto pt-20"><div className="aspect-[3/4] skeleton rounded-soft w-1/2" /></div></div>;
  if (!product) return <div className="min-h-screen bg-bgBase flex flex-col items-center justify-center"><h2 className="text-3xl font-serif mb-2 text-textMain">Product Not Found</h2><Link to="/shop" className="btn-ghost">Return to Collection</Link></div>;

  return (
    <div className="bg-bgBase min-h-screen pb-24 animate-fade-in">
      <div className="w-[90%] max-w-[1200px] mx-auto pt-20">
        <nav className="mb-10 text-[10px] font-sans font-bold uppercase tracking-widest text-textMuted flex items-center gap-2">
          <Link to="/shop" className="hover:text-accent transition-colors">Products</Link><span>/</span><span className="text-textMain">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-4">
            <div className="aspect-[3/4] rounded-soft overflow-hidden shadow-card border border-borderSoft bg-white">
              <img src={getCloudinaryUrl(activeImage, 800)} alt={product.name} className="w-full h-full object-cover" />
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImage(img)} className={`w-20 h-28 rounded-soft overflow-hidden border-2 flex-shrink-0 transition-all ${activeImage === img ? "border-accent shadow-md" : "border-transparent opacity-60 hover:opacity-100"}`}>
                    <img src={getCloudinaryUrl(img, 160)} className="w-full h-full object-cover" alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:sticky lg:top-32 space-y-8">
            <div>
              <span className="label text-accent">{product.category} · {product.tag}</span>
              <h1 className="text-3xl md:text-5xl font-serif text-textMain tracking-tight leading-tight mt-2">{product.name}</h1>
            </div>
            <div className="py-6 border-y border-borderSoft"><span className="text-2xl font-sans font-bold tracking-widest text-textMain">{product.priceDisplay}</span></div>
            <p className="text-textBody leading-relaxed text-base font-light">{product.shortDesc}</p>
            {product.details && <div className="text-textBody text-sm leading-loose font-light prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.details) }} />}
            <div className="pt-2 space-y-3">
              <button onClick={handleInquiry} className="w-full btn-primary py-3.5">
                Inquire on WhatsApp
              </button>
              <Link to="/contact" className="w-full btn-secondary py-3.5 flex justify-center text-[15px]">
                Send an Inquiry
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-24 pt-20 border-t border-borderSoft grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-5">
            <div className="card p-10">
              <h3 className="text-2xl font-serif text-textMain mb-2">Share Your Experience</h3>
              <p className="text-textMuted text-xs font-light mb-8">Your review goes live after moderation.</p>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="label">Rating</label>
                  <select value={newReview.rating} onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })} className="input-field">
                    {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} Star{n > 1 ? "s" : ""} {"★".repeat(n)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Your Review</label>
                  <textarea required placeholder="How was your product? Share your honest experience..." value={newReview.comment} onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })} className="input-field min-h-[120px] resize-none" />
                </div>
                <button type="submit" disabled={submitting} className="btn-primary w-full py-4">{submitting ? "Submitting..." : "Post Review"}</button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-7">
            <h3 className="text-3xl font-serif text-textMain mb-10 italic">Client Stories</h3>
            {reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((r, i) => (
                  <div key={i} className="card p-8 border-l-4 border-l-accent">
                    <div className="flex text-accent text-sm mb-4">{[...Array(5)].map((_, j) => <span key={j} className={j < r.rating ? "text-accent" : "opacity-30"}>★</span>)}</div>
                    <p className="text-textBody italic mb-4 leading-relaxed font-light">"{r.comment}"</p>
                    <p className="text-textMain font-sans font-bold uppercase text-[10px] tracking-widest">— {r.customerName}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-dashed border-borderSoft rounded-soft p-12 text-center"><p className="text-textMuted font-serif italic">Be the first to share your experience.</p></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}