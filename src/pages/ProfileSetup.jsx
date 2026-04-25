import { useState, useCallback, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import { auth, db } from '../config/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function ProfileSetup() {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setImageSrc(reader.result));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    
    // Here you would process the croppedAreaPixels to create a new image blob,
    // upload it to Firebase Storage, get the URL, and save to Firestore.
    // For now, we save the text data:
    try {
      await setDoc(doc(db, "users_saheli", auth.currentUser.uid), {
        name,
        mobile,
        email: auth.currentUser.email,
        role: "customer"
      }, { merge: true });
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfbf9] py-16 animate-fade-in">
      <div className="max-w-[600px] mx-auto bg-white border border-borderSoft rounded-soft p-10 shadow-sm">
        <h1 className="text-3xl font-serif text-textMain mb-2">Complete Your Profile</h1>
        <p className="text-textLight font-light mb-8">Personalize your Saheli Boutique experience.</p>
        
        <form onSubmit={handleSave} className="space-y-6">
          {/* Email (Read Only) */}
          <div>
            <label className="block text-sm font-medium text-textMain mb-2">Email Address</label>
            <input 
              type="email" 
              value={auth.currentUser?.email || ''} 
              disabled 
              className="w-full border border-borderSoft bg-gray-50 px-4 py-3 rounded-soft text-textLight focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-textMain mb-2">Full Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-borderSoft px-4 py-3 rounded-soft focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-textMain mb-2">Mobile Number</label>
            <input 
              type="tel" 
              required
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full border border-borderSoft px-4 py-3 rounded-soft focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          {/* Image Upload & Cropper */}
          <div>
            <label className="block text-sm font-medium text-textMain mb-2">Profile Photo</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange}
              className="w-full border border-borderSoft px-4 py-3 rounded-soft text-sm"
            />
            
            {imageSrc && (
              <div className="relative h-[300px] w-full mt-4 rounded-soft overflow-hidden border border-borderSoft">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>
            )}
            {imageSrc && (
              <div className="mt-4 flex items-center gap-4">
                <span className="text-sm text-textLight">Zoom</span>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  onChange={(e) => setZoom(e.target.value)}
                  className="w-full accent-accent"
                />
              </div>
            )}
          </div>

          <button type="submit" className="w-full bg-accent text-white py-4 rounded-soft hover:bg-textMain transition-colors duration-300 font-medium tracking-wide mt-8">
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
}