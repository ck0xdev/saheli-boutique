import { useState, useCallback, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import { auth, db } from '../config/firebase';
import { updateProfile, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { getCroppedImg } from '../utils/cropImage';
import toast from 'react-hot-toast';

export default function Profile() {
  const navigate = useNavigate();
  const [name, setName]       = useState('');
  const [mobile, setMobile]   = useState('');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop]         = useState({ x: 0, y: 0 });
  const [zoom, setZoom]         = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [currentPhoto, setCurrentPhoto] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentPhoto(user.photoURL);
        const snap = await getDoc(doc(db, 'users_saheli', user.uid));
        if (snap.exists()) {
          setName(snap.data().name || '');
          setMobile(snap.data().mobile || '');
        }
      } else { navigate('/login'); }
      setLoading(false);
    });
    return unsub;
  }, [navigate]);

  const onCropComplete = useCallback((_, pixels) => { setCroppedAreaPixels(pixels); }, []);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!name.trim() || !mobile.trim()) {
      return toast.error("Please provide valid details.");
    }

    setIsSaving(true);
    try {
      let finalPhotoURL = currentPhoto;
      if (imageSrc && croppedAreaPixels) {
        const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
        const formData = new FormData();
        formData.append('file', croppedBlob, 'profile.jpg');
        formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
        const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: formData });
        if (!res.ok) throw new Error('Image upload failed');
        const data = await res.json();
        finalPhotoURL = data.secure_url;
      }
      
      const cleanName = name.trim();
      await updateProfile(auth.currentUser, { displayName: cleanName, photoURL: finalPhotoURL });
      await setDoc(doc(db, 'users_saheli', auth.currentUser.uid), { name: cleanName, mobile, email: auth.currentUser.email, photoURL: finalPhotoURL, updatedAt: new Date() }, { merge: true });
      setCurrentPhoto(finalPhotoURL);
      setImageSrc(null);
      toast.success('Profile updated successfully!');
    } catch (err) { toast.error('Failed to save profile. Please try again.'); } finally { setIsSaving(false); }
  };

  if (loading) return <div className="min-h-screen bg-bgBase flex flex-col items-center justify-center"><div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-bgBase py-24 px-4 animate-fade-in">
      <div className="max-w-[900px] mx-auto card overflow-hidden grid grid-cols-1 md:grid-cols-12">
        <div className="md:col-span-5 bg-white p-12 border-r border-borderSoft flex flex-col items-center justify-center gap-6">
          <div className="w-44 h-44 rounded-full border-4 border-bgBase shadow-card overflow-hidden bg-bgBase flex items-center justify-center">
            {currentPhoto ? <img src={currentPhoto} alt="Profile" className="w-full h-full object-cover" /> : <span className="text-accent text-5xl font-serif">{name.charAt(0) || 'S'}</span>}
          </div>
          <label className="btn-secondary px-8 py-3 text-[10px] cursor-pointer">
            Change Photo<input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
          </label>
          <p className="text-[10px] text-textMuted font-sans text-center leading-relaxed">Upload a square image for best results.<br />JPG or PNG, max 5MB.</p>
        </div>

        <div className="md:col-span-7 p-12 md:p-16">
          <h1 className="text-3xl font-serif text-textMain mb-2">My Profile</h1>
          <p className="text-textMuted text-sm font-light mb-10">Update your personal information.</p>
          <form onSubmit={handleSave} className="space-y-6">
            {imageSrc && (
              <div className="h-[240px] relative rounded-soft overflow-hidden bg-black border border-borderSoft mb-6">
                <Cropper image={imageSrc} crop={crop} zoom={zoom} aspect={1} cropShape="round" showGrid={false} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={onCropComplete} />
                <div className="absolute bottom-3 left-0 right-0 flex justify-center"><input type="range" min={1} max={3} step={0.1} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="w-40 accent-accent" /></div>
              </div>
            )}
            <div>
              <label className="label">Full Name</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="input-field" placeholder="Your name" />
            </div>
            <div>
              <label className="label">Mobile Number</label>
              <input type="text" inputMode="tel" required value={mobile} onChange={(e) => setMobile(e.target.value.replace(/[^0-9+\-\s()]/g, ''))} className="input-field" placeholder="+91 98765 43210" />
            </div>
            <button type="submit" disabled={isSaving} className="w-full btn-primary py-4 mt-4">{isSaving ? 'Saving...' : 'Update Profile'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}