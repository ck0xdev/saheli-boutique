import { useState, useCallback, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import { auth, db } from '../config/firebase';
import { updateProfile, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [currentPhoto, setCurrentPhoto] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentPhoto(user.photoURL);
        const docSnap = await getDoc(doc(db, "users_saheli", user.uid));
        if (docSnap.exists()) { setName(docSnap.data().name || ''); setMobile(docSnap.data().mobile || ''); }
      } else { navigate('/login'); }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      let finalPhotoURL = currentPhoto;
      if (imageSrc) {
        const formData = new FormData();
        formData.append('file', imageSrc);
        formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
        const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: formData });
        const data = await res.json();
        finalPhotoURL = data.secure_url;
      }
      await updateProfile(auth.currentUser, { displayName: name, photoURL: finalPhotoURL });
      await setDoc(doc(db, "users_saheli", auth.currentUser.uid), { name, mobile, email: auth.currentUser.email, photoURL: finalPhotoURL, updatedAt: new Date() }, { merge: true });
      setCurrentPhoto(finalPhotoURL);
      setImageSrc(null);
      alert("Profile Saved.");
    } catch { alert("Failed."); } finally { setIsSaving(false); }
  };

  if (loading) return <div className="min-h-screen bg-[#fdfbf9] flex flex-col items-center justify-center space-y-4"><div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div><p className="font-serif italic text-textLight uppercase tracking-widest text-[10px]">Preparing Profile...</p></div>;

  return (
    <div className="min-h-screen bg-[#fdfbf9] py-24 px-4 animate-fade-in">
      <div className="max-w-[900px] mx-auto bg-white border border-borderSoft/40 rounded-soft shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
        <div className="md:col-span-5 bg-[#fcfcfc] p-12 border-r border-borderSoft/40 flex flex-col items-center justify-center">
          <div className="w-44 h-44 rounded-full border-4 border-white shadow-2xl overflow-hidden mb-8 bg-accent/5 flex items-center justify-center">{currentPhoto ? <img src={currentPhoto} alt="Profile" className="w-full h-full object-cover" /> : <span className="text-accent text-5xl font-serif">{name.charAt(0) || 'S'}</span>}</div>
          <label className="bg-white border border-borderSoft px-10 py-3 rounded-soft text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:bg-accent hover:text-white transition-all shadow-md">Change Photo<input type="file" className="hidden" accept="image/*" onChange={(e)=>{const reader = new FileReader(); reader.onload=()=>setImageSrc(reader.result); reader.readAsDataURL(e.target.files[0])}} /></label>
        </div>
        <div className="md:col-span-7 p-16">
          <form onSubmit={handleSave} className="space-y-10">
            <div className="space-y-8">
              <div><label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Full Name</label><input type="text" required value={name} onChange={(e)=>setName(e.target.value)} className="w-full border-b border-borderSoft/60 py-2 outline-none focus:border-accent bg-transparent text-textMain text-lg" /></div>
              <div><label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Mobile Number</label><input type="tel" required value={mobile} onChange={(e)=>setMobile(e.target.value)} className="w-full border-b border-borderSoft/60 py-2 outline-none focus:border-accent bg-transparent text-textMain text-lg" /></div>
            </div>
            {imageSrc && <div className="h-[220px] relative rounded-soft overflow-hidden bg-black shadow-inner"><Cropper image={imageSrc} crop={crop} zoom={zoom} aspect={1} cropShape="round" onCropChange={setCrop} onZoomChange={setZoom} /></div>}
            <button type="submit" disabled={isSaving} className="w-full bg-textMain text-white py-4 rounded-soft font-bold uppercase text-[11px] tracking-[0.2em] shadow-xl hover:bg-accent transition-all duration-500">{isSaving ? 'Saving...' : 'Update Identity'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}