import { useState, useEffect } from 'react';
import { db } from '../config/firebase'; 
import { collection, addDoc, serverTimestamp, query, where, getDocs, doc, updateDoc, deleteDoc, orderBy } from 'firebase/firestore';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('catalog');
  const [isUploading, setIsUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  // Data States for Dashboard
  const [pendingReviews, setPendingReviews] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Product Form State
  const [formData, setFormData] = useState({
    productId: '',
    name: '',
    category: 'art', // art, extensions, academy
    tag: 'New Arrival', // Fits the special collections filter
    priceValue: '',
    priceDisplay: '',
    shortDesc: '',
    details: ''
  });
  const [images, setImages] = useState([]);

  // Fetch Dashboard Data (Reviews & Inquiries)
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoadingData(true);
      try {
        if (activeTab === 'reviews') {
          const q = query(collection(db, "reviews_saheli"), where("status", "==", "pending"));
          const snap = await getDocs(q);
          setPendingReviews(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        } else if (activeTab === 'inquiries') {
          const q = query(collection(db, "inquiries_saheli"), orderBy("createdAt", "desc"));
          const snap = await getDocs(q);
          setInquiries(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        }
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchDashboardData();
  }, [activeTab]);

  // Handle Product Inputs
  const handleInputChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleImageChange = (e) => { if (e.target.files) setImages(Array.from(e.target.files)); };

  // Submit New Product
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    setSuccessMsg('');

    try {
      const uploadedImageUrls = [];
      // Upload to Cloudinary
      for (const file of images) {
        const cloudData = new FormData();
        cloudData.append('file', file);
        cloudData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

        const response = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: cloudData });
        if (!response.ok) throw new Error('Cloudinary upload failed');
        const data = await response.json();
        uploadedImageUrls.push(data.secure_url); 
      }

      // Save to Firestore
      await addDoc(collection(db, "products_saheli"), {
        ...formData,
        priceValue: Number(formData.priceValue), 
        images: uploadedImageUrls,
        thumbnail: uploadedImageUrls[0] || '', 
        isActive: true,
        createdAt: serverTimestamp()
      });

      setSuccessMsg('Service successfully published to the catalog!');
      setFormData({ productId: '', name: '', category: 'art', tag: 'New Arrival', priceValue: '', priceDisplay: '', shortDesc: '', details: '' });
      setImages([]);
      document.getElementById('imageUpload').value = ''; 
    } catch (error) {
      alert("Failed to upload service. Check your Cloudinary .env settings.");
    } finally {
      setIsUploading(false);
      setTimeout(() => setSuccessMsg(''), 5000);
    }
  };

  // Review Moderation Actions
  const handleReviewAction = async (id, action) => {
    try {
      if (action === 'approve') {
        await updateDoc(doc(db, "reviews_saheli", id), { status: 'approved' });
      } else {
        await deleteDoc(doc(db, "reviews_saheli", id));
      }
      setPendingReviews(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      alert("Failed to update review status.");
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfbf9] font-sans flex flex-col md:flex-row">
      
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-borderSoft/40 flex flex-col pt-8 md:min-h-screen shadow-sm z-10">
        <div className="px-8 mb-10">
          <span className="text-accent tracking-[0.3em] text-[10px] font-bold uppercase mb-2 block">Command Center</span>
          <h2 className="text-2xl font-serif text-textMain">Admin Panel</h2>
        </div>
        <nav className="flex flex-col gap-2 px-4">
          <button onClick={() => setActiveTab('catalog')} className={`text-left px-6 py-4 rounded-soft text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'catalog' ? 'bg-[#fdfbf9] text-accent shadow-inner border border-borderSoft/30' : 'text-gray-400 hover:bg-gray-50'}`}>Add Service</button>
          <button onClick={() => setActiveTab('reviews')} className={`text-left px-6 py-4 rounded-soft text-xs font-bold uppercase tracking-widest transition-all flex justify-between ${activeTab === 'reviews' ? 'bg-[#fdfbf9] text-accent shadow-inner border border-borderSoft/30' : 'text-gray-400 hover:bg-gray-50'}`}>
            Moderation {pendingReviews.length > 0 && activeTab !== 'reviews' && <span className="bg-red-500 text-white rounded-full px-2 py-0.5 text-[8px]">{pendingReviews.length}</span>}
          </button>
          <button onClick={() => setActiveTab('inquiries')} className={`text-left px-6 py-4 rounded-soft text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'inquiries' ? 'bg-[#fdfbf9] text-accent shadow-inner border border-borderSoft/30' : 'text-gray-400 hover:bg-gray-50'}`}>Client Inquiries</button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-12 animate-fade-in">
        <div className="max-w-[1000px] mx-auto">

          {/* TAB 1: ADD SERVICE */}
          {activeTab === 'catalog' && (
            <div className="bg-white border border-borderSoft/40 rounded-soft p-10 md:p-14 shadow-xl relative overflow-hidden">
              <h3 className="text-3xl font-serif text-textMain mb-2 relative z-10">Publish New Service</h3>
              <p className="text-gray-400 text-sm font-light mb-10 relative z-10">Upload high-quality images and details to your digital storefront.</p>
              
              {successMsg && <div className="bg-[#fdfbf9] text-accent p-6 rounded-soft mb-8 border border-accent/20 font-medium text-sm text-center">{successMsg}</div>}

              <form onSubmit={handleProductSubmit} className="space-y-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div><label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Service ID</label><input type="text" name="productId" value={formData.productId} onChange={handleInputChange} placeholder="e.g., NAIL-001" required className="w-full border-b border-borderSoft/60 py-3 focus:outline-none focus:border-accent bg-transparent text-textMain" /></div>
                  <div><label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Service Title</label><input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g., Chrome Extension Master" required className="w-full border-b border-borderSoft/60 py-3 focus:outline-none focus:border-accent bg-transparent text-textMain" /></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Category</label>
                    <select name="category" value={formData.category} onChange={handleInputChange} className="w-full border-b border-borderSoft/60 py-3 focus:outline-none focus:border-accent bg-transparent text-textMain">
                      <option value="art">Nail Art</option>
                      <option value="extensions">Nail Extensions</option>
                      <option value="academy">Academy Course</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Special Tag (Filter)</label>
                    <select name="tag" value={formData.tag} onChange={handleInputChange} className="w-full border-b border-borderSoft/60 py-3 focus:outline-none focus:border-accent bg-transparent text-textMain">
                      <option value="Regular">Regular Service</option>
                      <option value="Best Seller">Best Seller</option>
                      <option value="Selling of the Month">Selling of the Month</option>
                      <option value="New Arrival">New Arrival</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div><label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Filter Price (Number)</label><input type="number" name="priceValue" value={formData.priceValue} onChange={handleInputChange} placeholder="1500" required className="w-full border-b border-borderSoft/60 py-3 focus:outline-none focus:border-accent bg-transparent text-textMain" /></div>
                  <div><label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Display Price</label><input type="text" name="priceDisplay" value={formData.priceDisplay} onChange={handleInputChange} placeholder="Starts at ₹1,500" required className="w-full border-b border-borderSoft/60 py-3 focus:outline-none focus:border-accent bg-transparent text-textMain" /></div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Short Description</label>
                  <input type="text" name="shortDesc" value={formData.shortDesc} onChange={handleInputChange} placeholder="Brief summary for the shop grid..." required className="w-full border-b border-borderSoft/60 py-3 focus:outline-none focus:border-accent bg-transparent text-textMain mb-6" />
                  
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Full Details (Supports HTML)</label>
                  <textarea name="details" value={formData.details} onChange={handleInputChange} rows="4" placeholder="<p>Full service description here...</p>" className="w-full border border-borderSoft/60 rounded-soft p-4 focus:outline-none focus:border-accent bg-transparent text-textMain text-sm"></textarea>
                </div>

                <div className="pt-4">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Gallery Images</label>
                  <div className="relative border-2 border-dashed border-borderSoft/60 rounded-soft p-10 text-center hover:bg-[#fcfcfc] transition-colors group">
                    <input type="file" id="imageUpload" multiple accept="image/*" onChange={handleImageChange} required className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                    <div className="relative z-10 pointer-events-none">
                      <p className="font-serif text-lg text-textMain mb-2 group-hover:text-accent transition-colors">Click or drag images here</p>
                      <p className="text-xs text-gray-400">High-resolution JPG or PNG recommended</p>
                      {images.length > 0 && <p className="mt-4 text-accent font-bold text-[10px] uppercase tracking-widest bg-accent/10 py-2 rounded-soft">{images.length} file(s) selected</p>}
                    </div>
                  </div>
                </div>

                <button type="submit" disabled={isUploading} className="w-full bg-textMain text-white py-5 rounded-soft hover:bg-accent transition-all duration-500 font-bold uppercase text-[11px] tracking-[0.2em] shadow-xl disabled:opacity-50 mt-8">
                  {isUploading ? 'Uploading to Cloudinary...' : 'Publish to Collection'}
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: REVIEW MODERATION */}
          {activeTab === 'reviews' && (
            <div className="bg-white border border-borderSoft/40 rounded-soft p-10 md:p-14 shadow-xl">
              <h3 className="text-3xl font-serif text-textMain mb-2">Pending Reviews</h3>
              <p className="text-gray-400 text-sm font-light mb-10">Approve authentic client experiences to display on the storefront.</p>
              
              {isLoadingData ? <div className="text-center py-10"><span className="animate-pulse text-gray-400 text-sm tracking-widest uppercase">Loading...</span></div> : (
                pendingReviews.length > 0 ? (
                  <div className="space-y-6">
                    {pendingReviews.map(r => (
                      <div key={r.id} className="border border-borderSoft/50 rounded-soft p-6 flex flex-col md:flex-row justify-between items-start gap-6 bg-[#fcfcfc]">
                        <div>
                          <div className="flex text-accent text-sm mb-2">{[...Array(5)].map((_, i) => <span key={i}>{i < r.rating ? '★' : '☆'}</span>)}</div>
                          <p className="text-gray-600 italic mb-4">"{r.comment}"</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">By: {r.customerName} | Product ID: {r.productId}</p>
                        </div>
                        <div className="flex gap-4 w-full md:w-auto">
                          <button onClick={() => handleReviewAction(r.id, 'approve')} className="flex-1 md:flex-none bg-green-50 text-green-700 px-6 py-2 rounded-soft text-[10px] font-bold uppercase tracking-widest border border-green-200 hover:bg-green-100 transition-colors">Approve</button>
                          <button onClick={() => handleReviewAction(r.id, 'reject')} className="flex-1 md:flex-none bg-red-50 text-red-700 px-6 py-2 rounded-soft text-[10px] font-bold uppercase tracking-widest border border-red-200 hover:bg-red-100 transition-colors">Reject</button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 border-2 border-dashed border-borderSoft/50 rounded-soft"><p className="text-gray-400 italic">No pending reviews at the moment.</p></div>
                )
              )}
            </div>
          )}

          {/* TAB 3: CLIENT INQUIRIES */}
          {activeTab === 'inquiries' && (
            <div className="bg-white border border-borderSoft/40 rounded-soft p-10 md:p-14 shadow-xl">
              <h3 className="text-3xl font-serif text-textMain mb-2">Client Inquiries</h3>
              <p className="text-gray-400 text-sm font-light mb-10">Recent messages from the contact page.</p>

              {isLoadingData ? <div className="text-center py-10"><span className="animate-pulse text-gray-400 text-sm tracking-widest uppercase">Loading...</span></div> : (
                inquiries.length > 0 ? (
                  <div className="space-y-6">
                    {inquiries.map(inq => (
                      <div key={inq.id} className="border border-borderSoft/50 rounded-soft p-6 bg-[#fcfcfc]">
                        <div className="flex justify-between items-start border-b border-borderSoft/50 pb-4 mb-4">
                          <div>
                            <p className="font-serif text-lg text-textMain">{inq.name}</p>
                            <p className="text-[10px] font-bold text-accent uppercase tracking-widest">{inq.phone}</p>
                          </div>
                          <span className="text-[10px] text-gray-400">{inq.createdAt?.toDate().toLocaleDateString() || 'Recent'}</span>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">{inq.message}</p>
                        <a href={`https://wa.me/${inq.phone.replace(/\D/g, '')}?text=Hi ${inq.name}, reaching out from Saheli Nails regarding your inquiry...`} target="_blank" rel="noreferrer" className="inline-block mt-6 text-[10px] font-bold uppercase tracking-widest border border-accent text-accent px-6 py-2 rounded-soft hover:bg-accent hover:text-white transition-colors">
                          Reply via WhatsApp
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 border-2 border-dashed border-borderSoft/50 rounded-soft"><p className="text-gray-400 italic">No new inquiries.</p></div>
                )
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}