import { useState, useEffect } from "react";
import { db } from "../config/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  orderBy,
} from "firebase/firestore";
import { getCloudinaryUrl } from "../utils/cloudinary";
import toast from "react-hot-toast";

const TABS = [
  { key: "manage", label: "Manage Products" },
  { key: "add", label: "Add/Edit Product" },
  { key: "reviews", label: "Moderation" },
  { key: "inquiries", label: "Client Inquiries" },
];

const INIT_FORM = {
  productId: "",
  name: "",
  category: "art",
  tag: "New Arrival",
  priceValue: "",
  priceDisplay: "",
  shortDesc: "",
  details: "",
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("manage");
  const [isUploading, setIsUploading] = useState(false);
  const [products, setProducts] = useState([]);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Form & Edit States
  const [formData, setFormData] = useState(INIT_FORM);
  const [images, setImages] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [imageInputKey, setImageInputKey] = useState(Date.now()); 

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingData(true);
      try {
        if (activeTab === "manage") {
          const snap = await getDocs(collection(db, "products_saheli"));
          setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        } else if (activeTab === "reviews") {
          const q = query(collection(db, "reviews_saheli"), where("status", "==", "pending"));
          const snap = await getDocs(q);
          setPendingReviews(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        } else if (activeTab === "inquiries") {
          const q = query(collection(db, "inquiries_saheli"), orderBy("createdAt", "desc"));
          const snap = await getDocs(q);
          setInquiries(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        }
      } catch (err) {
        console.error("Fetch Data Error:", err);
        toast.error("Failed to load data.");
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchData();
  }, [activeTab]);

  const handleInputChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleImageChange = (e) => {
    if (e.target.files) setImages(Array.from(e.target.files));
  };

  const clearEditState = () => {
    setEditingId(null);
    setFormData(INIT_FORM);
    setImages([]);
    setImageInputKey(Date.now());
  };

  const handleEditProduct = (product) => {
    setEditingId(product.id);
    setFormData({
      productId: product.productId || "",
      name: product.name || "",
      category: product.category || "art",
      tag: product.tag || "Regular Product",
      priceValue: product.priceValue || "",
      priceDisplay: product.priceDisplay || "",
      shortDesc: product.shortDesc || "",
      details: product.details || "",
    });
    setImages([]);
    setImageInputKey(Date.now());
    setActiveTab("add"); 
  };

  const cancelEdit = () => {
    clearEditState();
    setActiveTab("manage");
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      const uploadedImageUrls = [];
      if (images.length > 0) {
        for (const file of images) {
          const fd = new FormData();
          fd.append("file", file);
          fd.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

          const res = await fetch(
            `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
            { method: "POST", body: fd },
          );

          if (!res.ok) throw new Error("Cloudinary upload failed");
          const data = await res.json();
          uploadedImageUrls.push(data.secure_url);
        }
      }

      const productData = {
        ...formData,
        priceValue: Number(formData.priceValue),
        isActive: true,
      };

      if (uploadedImageUrls.length > 0) {
        productData.images = uploadedImageUrls;
        productData.thumbnail = uploadedImageUrls[0] || "";
      }

      if (editingId) {
        await updateDoc(doc(db, "products_saheli", editingId), productData);
        toast.success("Product updated successfully!");
      } else {
        productData.createdAt = serverTimestamp();
        await addDoc(collection(db, "products_saheli"), productData);
        toast.success("Product published to catalog!");
      }

      clearEditState();
      setActiveTab("manage");
    } catch (err) {
      console.error("Submission Error:", err);
      toast.error(err.message || "Failed to process request.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Delete this product? This cannot be undone.")) return;
    try {
      await deleteDoc(doc(db, "products_saheli", id));
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Product deleted.");
    } catch {
      toast.error("Failed to delete product.");
    }
  };

  const handleReviewAction = async (id, action) => {
    try {
      if (action === "approve") {
        await updateDoc(doc(db, "reviews_saheli", id), { status: "approved" });
        toast.success("Review approved.");
      } else {
        await deleteDoc(doc(db, "reviews_saheli", id));
        toast.success("Review rejected.");
      }
      setPendingReviews((prev) => prev.filter((r) => r.id !== id));
    } catch {
      toast.error("Failed to update review.");
    }
  };

  // --- INQUIRY STATUS LOGIC ---
  const handleInquiryStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "completed" ? "new" : "completed";
      await updateDoc(doc(db, "inquiries_saheli", id), { status: newStatus });
      setInquiries((prev) =>
        prev.map((inq) => (inq.id === id ? { ...inq, status: newStatus } : inq))
      );
      toast.success(`Inquiry marked as ${newStatus === "completed" ? "Resolved" : "Pending"}.`);
    } catch (err) {
      toast.error("Failed to update status.");
    }
  };

  return (
    <div className="min-h-screen bg-bgBase font-sans flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-white border-r border-borderSoft flex flex-col pt-8 md:min-h-screen shadow-sm z-10 flex-shrink-0">
        <div className="px-8 mb-10">
          <span className="label text-accent mb-2">Command Center</span>
          <h2 className="text-2xl font-serif text-textMain">Admin Panel</h2>
        </div>
        <nav className="flex flex-col px-4">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => {
                if (key !== "add") clearEditState();
                setActiveTab(key);
              }}
              className={`relative text-left px-6 py-4 rounded-soft text-[10px] font-sans font-bold uppercase tracking-widest transition-all flex justify-between items-center ${activeTab === key ? "bg-bgBase text-accent border border-borderSoft" : "text-textMuted hover:bg-bgBase/50"}`}
            >
              {label}{" "}
              {key === "reviews" &&
                pendingReviews.length > 0 &&
                activeTab !== "reviews" && (
                  <span className="bg-status-error text-white rounded-full px-2 py-0.5 text-[8px] font-bold">
                    {pendingReviews.length}
                  </span>
                )}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-6 md:p-12 animate-fade-in">
        <div className="max-w-[1000px] mx-auto">
          
          {/* TAB: MANAGE PRODUCTS */}
          {activeTab === "manage" && (
            <div className="card p-10 md:p-14">
              <h3 className="text-3xl font-serif text-textMain mb-2">Manage Products</h3>
              <p className="text-textMuted text-sm font-light mb-10">Review, edit, and remove active products from your storefront.</p>
              {isLoadingData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-24 skeleton rounded-soft" />
                  ))}
                </div>
              ) : products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {products.map((p) => (
                    <div key={p.id} className="border border-borderSoft rounded-soft p-4 flex items-center gap-4 bg-white hover:shadow-card transition-shadow">
                      <div className="w-20 h-20 rounded-soft overflow-hidden flex-shrink-0 shadow-sm">
                        <img src={getCloudinaryUrl(p.thumbnail || p.images?.[0], 80)} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif text-base text-textMain truncate">{p.name}</h4>
                        <p className="text-[9px] font-sans font-bold text-accent uppercase tracking-widest">{p.category} · {p.priceDisplay}</p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button onClick={() => handleEditProduct(p)} className="w-9 h-9 flex items-center justify-center rounded-full bg-accent/10 text-accent hover:bg-accent hover:text-white transition-all" title="Edit Product">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                        <button onClick={() => handleDeleteProduct(p.id)} className="w-9 h-9 flex items-center justify-center rounded-full bg-status-error/10 text-status-error hover:bg-status-error hover:text-white transition-all" title="Delete Product">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 border-2 border-dashed border-borderSoft rounded-soft">
                  <p className="text-textMuted italic mb-4">Your catalog is empty.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB: ADD / EDIT PRODUCT */}
          {activeTab === "add" && (
            <div className="card p-10 md:p-14">
              <h3 className="text-3xl font-serif text-textMain mb-2">
                {editingId ? "Edit Product" : "Publish New Product"}
              </h3>
              <p className="text-textMuted text-sm font-light mb-10">
                {editingId ? "Update the details and imagery for this product." : "Upload images and details to your digital storefront."}
              </p>
              
              <form onSubmit={handleProductSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label">Product ID</label>
                    <input type="text" name="productId" value={formData.productId} onChange={handleInputChange} className="input-field" required />
                  </div>
                  <div>
                    <label className="label">Product Title</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="input-field" required />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label">Category</label>
                    <select name="category" value={formData.category} onChange={handleInputChange} className="input-field">
                      <option value="art">Nail Art</option>
                      <option value="extensions">Nail Extensions</option>
                      <option value="academy">Academy Course</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Special Tag</label>
                    <select name="tag" value={formData.tag} onChange={handleInputChange} className="input-field">
                      <option value="Regular Product">Regular Product</option>
                      <option value="Best Seller">Best Seller</option>
                      <option value="Selling of the Month">Best Seller of the Month</option>
                      <option value="New Arrival">New Arrival</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label">Filter Price (Number)</label>
                    <input type="number" name="priceValue" value={formData.priceValue} onChange={handleInputChange} className="input-field" required />
                  </div>
                  <div>
                    <label className="label">Display Price</label>
                    <input type="text" name="priceDisplay" value={formData.priceDisplay} onChange={handleInputChange} className="input-field" required />
                  </div>
                </div>
                
                <div>
                  <label className="label">Short Description</label>
                  <input type="text" name="shortDesc" value={formData.shortDesc} onChange={handleInputChange} className="input-field mb-6" required />
                  
                  <label className="label">Full Details (HTML supported)</label>
                  <textarea name="details" value={formData.details} onChange={handleInputChange} rows="4" className="input-field resize-none" />
                </div>
                
                <div>
                  <label className="label">Gallery Images</label>
                  <div className="relative border-2 border-dashed border-borderSoft rounded-soft p-10 text-center hover:bg-bgBase transition-colors">
                    <input key={imageInputKey} type="file" multiple accept="image/*" onChange={handleImageChange} required={!editingId} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                    <p className="font-serif text-lg text-textMain">{editingId ? "Click or drag to replace images" : "Click or drag images here"}</p>
                    <p className="text-xs text-textMuted">{editingId ? "(Leave empty to keep existing images)" : "JPG or PNG recommended"}</p>
                    {images.length > 0 && <p className="mt-4 text-accent font-sans font-bold text-[10px] uppercase tracking-widest">{images.length} new file(s) selected</p>}
                  </div>
                </div>
                
                <div className="pt-4 flex flex-col gap-3">
                  <button type="submit" disabled={isUploading} className="w-full btn-primary py-4">
                    {isUploading ? "Processing..." : editingId ? "Save Changes" : "Publish Product"}
                  </button>
                  {editingId && (
                    <button type="button" onClick={cancelEdit} disabled={isUploading} className="w-full btn-secondary py-4">Cancel Edit</button>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* TAB: REVIEWS */}
          {activeTab === "reviews" && (
            <div className="card p-10 md:p-14">
              <h3 className="text-3xl font-serif text-textMain mb-2">Pending Reviews</h3>
              <p className="text-textMuted text-sm font-light mb-10">Approve or reject client reviews.</p>
              {isLoadingData ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => <div key={i} className="h-24 skeleton rounded-soft" />)}
                </div>
              ) : pendingReviews.length > 0 ? (
                <div className="space-y-5">
                  {pendingReviews.map((r) => (
                    <div key={r.id} className="border border-borderSoft rounded-soft p-6 flex flex-col md:flex-row justify-between items-start gap-4 bg-white">
                      <div>
                        <div className="flex text-accent text-sm mb-2">
                          {[...Array(5)].map((_, i) => <span key={i}>{i < r.rating ? "★" : "☆"}</span>)}
                        </div>
                        <p className="text-textBody italic mb-3 text-sm">"{r.comment}"</p>
                        <p className="text-[9px] font-sans font-bold text-textMuted uppercase tracking-widest">By: {r.customerName}</p>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => handleReviewAction(r.id, "approve")} className="bg-status-success/10 text-status-success px-5 py-2 rounded-soft text-[10px] font-bold uppercase tracking-widest hover:bg-status-success hover:text-white transition-colors">Approve</button>
                        <button onClick={() => handleReviewAction(r.id, "reject")} className="bg-status-error/10 text-status-error px-5 py-2 rounded-soft text-[10px] font-bold uppercase tracking-widest hover:bg-status-error hover:text-white transition-colors">Reject</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 border-2 border-dashed border-borderSoft rounded-soft">
                  <p className="text-textMuted italic">No pending reviews.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB: INQUIRIES */}
          {activeTab === "inquiries" && (
            <div className="card p-10 md:p-14">
              <h3 className="text-3xl font-serif text-textMain mb-2">Client Inquiries</h3>
              <p className="text-textMuted text-sm font-light mb-10">Manage and track your customer messages.</p>
              {isLoadingData ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => <div key={i} className="h-28 skeleton rounded-soft" />)}
                </div>
              ) : inquiries.length > 0 ? (
                <div className="space-y-5">
                  {inquiries.map((inq) => (
                    <div key={inq.id} className={`border rounded-soft p-6 transition-all duration-300 ${inq.status === 'completed' ? 'bg-bgBase border-borderSoft/50 opacity-75' : 'bg-white border-borderSoft shadow-sm'}`}>
                      <div className="flex justify-between items-start border-b border-borderSoft pb-4 mb-4">
                        <div>
                          <div className="flex items-center gap-3">
                            <p className="font-serif text-lg text-textMain">{inq.name}</p>
                            <span className={`px-2 py-0.5 rounded-soft text-[9px] font-bold uppercase tracking-widest ${inq.status === 'completed' ? 'bg-status-success/10 text-status-success' : 'bg-status-warning/10 text-[#D9A05B]'}`}>
                              {inq.status === 'completed' ? 'Resolved' : 'Pending'}
                            </span>
                          </div>
                          <p className="text-[10px] font-sans font-bold text-accent uppercase tracking-widest mt-1">{inq.phone}</p>
                          {inq.service && <p className="text-[9px] text-textMuted mt-1 font-sans uppercase tracking-widest">{inq.service}</p>}
                        </div>
                        <span className="text-[10px] text-textMuted font-sans">
                          {inq.createdAt?.toDate().toLocaleDateString("en-IN") || "Recent"}
                        </span>
                      </div>
                      <p className="text-textBody text-sm leading-relaxed mb-6 font-light">{inq.message}</p>
                      
                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        <a
                          href={`https://wa.me/${inq.phone.replace(/\D/g, "")}?text=Hi ${inq.name}, reaching out from Saheli Nails regarding your inquiry...`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center text-[10px] font-sans font-bold uppercase tracking-widest border border-accent text-accent px-6 py-2.5 rounded-soft hover:bg-accent hover:text-white transition-all text-center w-full sm:w-auto justify-center"
                        >
                          Reply via WhatsApp
                        </a>
                        <button 
                          onClick={() => handleInquiryStatus(inq.id, inq.status)} 
                          className={`inline-flex items-center text-[10px] font-sans font-bold uppercase tracking-widest px-6 py-2.5 rounded-soft transition-all text-center w-full sm:w-auto justify-center ${inq.status === 'completed' ? 'bg-borderSoft/50 text-textMuted hover:bg-borderSoft hover:text-textMain' : 'bg-status-success/10 text-status-success hover:bg-status-success hover:text-white'}`}
                        >
                          {inq.status === 'completed' ? 'Mark as Pending' : 'Mark as Resolved'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 border-2 border-dashed border-borderSoft rounded-soft">
                  <p className="text-textMuted italic">No inquiries yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}