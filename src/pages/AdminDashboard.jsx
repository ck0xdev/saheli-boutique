import { useState } from 'react';
import { db } from '../config/firebase'; // Removed storage import
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function AdminDashboard() {
  const [isUploading, setIsUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    productId: '',
    name: '',
    category: 'chaniya',
    tag: 'Rent',
    priceValue: '',
    priceDisplay: '',
    buyoutPrice: '',
    shortDesc: '',
    details: ''
  });
  
  // Image State
  const [images, setImages] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    setSuccessMsg('');

    try {
      const uploadedImageUrls = [];

      // 1. Upload Images to Cloudinary (Bypasses Firebase Storage CORS)
      for (const file of images) {
        const cloudData = new FormData();
        cloudData.append('file', file);
        cloudData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
          { method: 'POST', body: cloudData }
        );

        if (!response.ok) throw new Error('Cloudinary upload failed');

        const data = await response.json();
        uploadedImageUrls.push(data.secure_url); // Professional optimized URL
      }

      // 2. Save Data to Firestore Collection products_saheli
      const productData = {
        ...formData,
        priceValue: Number(formData.priceValue), 
        images: uploadedImageUrls,
        thumbnail: uploadedImageUrls[0] || '', 
        isActive: true,
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, "products_saheli"), productData);

      setSuccessMsg('Product successfully added with optimized Cloudinary images!');
      
      // Reset Form
      setFormData({
        productId: '', name: '', category: 'chaniya', tag: 'Rent', priceValue: '', priceDisplay: '', buyoutPrice: '', shortDesc: '', details: ''
      });
      setImages([]);
      document.getElementById('imageUpload').value = ''; 
      
    } catch (error) {
      console.error("Error adding product: ", error);
      alert("Failed to upload product. Check your Cloudinary .env settings.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfbf9] py-16 px-4 animate-fade-in">
      <div className="max-w-[800px] mx-auto bg-white border border-borderSoft rounded-soft p-10 shadow-sm">
        
        <div className="mb-10 border-b border-borderSoft pb-6 text-center">
          <h1 className="text-3xl font-serif text-textMain mb-2">Store Administration</h1>
          <p className="text-textLight font-light">Upload real gallery images and manage the Saheli catalog.</p>
        </div>

        {successMsg && (
          <div className="bg-green-50 text-green-700 p-4 rounded-soft mb-8 border border-green-200 animate-fade-in">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-textMain mb-2 uppercase tracking-wider">Manual Product ID</label>
              <input type="text" name="productId" value={formData.productId} onChange={handleInputChange} placeholder="e.g., CC-007" required className="w-full border border-borderSoft px-4 py-3 rounded-soft focus:outline-none focus:border-accent bg-[#fcfcfc]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-textMain mb-2 uppercase tracking-wider">Product Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g., Royal Blue Lehenga" required className="w-full border border-borderSoft px-4 py-3 rounded-soft focus:outline-none focus:border-accent bg-[#fcfcfc]" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-textMain mb-2 uppercase tracking-wider">Category</label>
              <select name="category" value={formData.category} onChange={handleInputChange} className="w-full border border-borderSoft px-4 py-3 rounded-soft focus:outline-none focus:border-accent bg-white">
                <option value="chaniya">Dress / Chaniya Choli</option>
                <option value="nails">Nail Art / Service</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-textMain mb-2 uppercase tracking-wider">Action Tag</label>
              <select name="tag" value={formData.tag} onChange={handleInputChange} className="w-full border border-borderSoft px-4 py-3 rounded-soft focus:outline-none focus:border-accent bg-white">
                <option value="Rent">Rent</option>
                <option value="Buy">Buy</option>
                <option value="Service">Service</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-borderSoft pt-8">
            <div>
              <label className="block text-sm font-medium text-textMain mb-2 uppercase tracking-wider">Filter Price</label>
              <input type="number" name="priceValue" value={formData.priceValue} onChange={handleInputChange} placeholder="2500" required className="w-full border border-borderSoft px-4 py-3 rounded-soft focus:outline-none focus:border-accent bg-[#fcfcfc]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-textMain mb-2 uppercase tracking-wider">Display Price</label>
              <input type="text" name="priceDisplay" value={formData.priceDisplay} onChange={handleInputChange} placeholder="₹2,500 / day" required className="w-full border border-borderSoft px-4 py-3 rounded-soft focus:outline-none focus:border-accent bg-[#fcfcfc]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-textMain mb-2 uppercase tracking-wider">Buyout Price</label>
              <input type="text" name="buyoutPrice" value={formData.buyoutPrice} onChange={handleInputChange} placeholder="₹12,000" className="w-full border border-borderSoft px-4 py-3 rounded-soft focus:outline-none focus:border-accent bg-[#fcfcfc]" />
            </div>
          </div>

          <div className="border-t border-borderSoft pt-8">
            <label className="block text-sm font-medium text-textMain mb-2 uppercase tracking-wider">Short Description</label>
            <input type="text" name="shortDesc" value={formData.shortDesc} onChange={handleInputChange} placeholder="Brief summary for the shop grid." required className="w-full border border-borderSoft px-4 py-3 rounded-soft focus:outline-none focus:border-accent mb-6 bg-[#fcfcfc]" />
            
            <label className="block text-sm font-medium text-textMain mb-2 uppercase tracking-wider">Full Details (HTML)</label>
            <textarea name="details" value={formData.details} onChange={handleInputChange} rows="4" placeholder="<ul><li>Available Sizes: S, M, L</li></ul>" className="w-full border border-borderSoft px-4 py-3 rounded-soft focus:outline-none focus:border-accent bg-[#fcfcfc]"></textarea>
          </div>

          <div className="border-t border-borderSoft pt-8">
            <label className="block text-sm font-medium text-textMain mb-2 uppercase tracking-wider">Gallery Images (Select Multiple)</label>
            <div className="relative border-2 border-dashed border-borderSoft rounded-soft p-8 text-center bg-[#fdfbf9] hover:bg-white transition-colors">
              <input 
                type="file" 
                id="imageUpload" 
                multiple 
                accept="image/*" 
                onChange={handleImageChange} 
                required 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="text-textLight">
                <p className="font-medium text-textMain mb-1">Click to upload or drag and drop</p>
                <p className="text-xs">Supports: JPG, PNG, WEBP</p>
                {images.length > 0 && (
                  <p className="mt-4 text-accent font-semibold">{images.length} file(s) ready to upload</p>
                )}
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isUploading}
            className={`w-full py-4 rounded-soft font-medium tracking-widest uppercase transition-all duration-300 mt-8 shadow-sm ${isUploading ? 'bg-borderSoft text-textLight cursor-not-allowed' : 'bg-accent text-white hover:bg-textMain shadow-md'}`}
          >
            {isUploading ? 'Uploading to Cloudinary...' : 'Confirm and Publish'}
          </button>
        </form>

      </div>
    </div>
  );
}