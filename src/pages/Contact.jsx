import { useState } from 'react';
import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Save to Firebase Collection: inquiries_saheli
      await addDoc(collection(db, "inquiries_saheli"), {
        ...formData,
        status: 'unread',
        createdAt: serverTimestamp()
      });

      setSubmitted(true);
      setFormData({ name: '', phone: '', message: '' });
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfbf9] py-16 md:py-24 animate-fade-in">
      <div className="w-[90%] max-w-[1200px] mx-auto">
        
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif text-textMain mb-4">Contact Us</h1>
          <p className="text-textLight font-light max-w-[600px] mx-auto">
            Have questions about a rental or need a custom fitting? We are here to help you look your best.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          
          {/* Inquiry Form */}
          <div className="bg-white border border-borderSoft rounded-soft p-8 md:p-12 shadow-sm">
            <h2 className="text-2xl font-serif text-textMain mb-8">Send a message</h2>
            
            {submitted ? (
              <div className="bg-green-50 text-green-700 p-6 rounded-soft border border-green-100 animate-fade-in text-center">
                <p className="font-medium text-lg mb-2">Message Sent Successfully!</p>
                <p className="font-light">We will contact you via WhatsApp shortly.</p>
                <button onClick={() => setSubmitted(false)} className="mt-6 text-accent underline">Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-textMain mb-2">Your Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    required 
                    value={formData.name} 
                    onChange={handleChange}
                    className="w-full border border-borderSoft px-4 py-3 rounded-soft focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-textMain mb-2">Mobile Number</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    required 
                    value={formData.phone} 
                    onChange={handleChange}
                    className="w-full border border-borderSoft px-4 py-3 rounded-soft focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-textMain mb-2">How can we help?</label>
                  <textarea 
                    name="message" 
                    rows="4" 
                    required 
                    value={formData.message} 
                    onChange={handleChange}
                    className="w-full border border-borderSoft px-4 py-3 rounded-soft focus:outline-none focus:border-accent transition-colors"
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-accent text-white py-4 rounded-soft hover:bg-textMain transition-all duration-300 font-medium tracking-wide shadow-sm"
                >
                  {isSubmitting ? 'Sending...' : 'Submit Inquiry'}
                </button>
              </form>
            )}
          </div>

          {/* Boutique Details & Socials */}
          <div className="flex flex-col gap-10">
            <div>
              <h2 className="text-2xl font-serif text-textMain mb-6">Boutique Details</h2>
              <div className="space-y-6 text-textLight font-light">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-accent/5 flex items-center justify-center mr-4 flex-shrink-0 text-accent italic">A</div>
                  <p>A-98 Sumeru City Mall, Sudama Chowk,<br/>Mota Varachha, Surat</p>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-accent/5 flex items-center justify-center mr-4 flex-shrink-0 text-accent italic">P</div>
                  <p>+91 92654 66420</p>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-accent/5 flex items-center justify-center mr-4 flex-shrink-0 text-accent italic">I</div>
                  <p>@saheli_nail_and_academy</p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-accent/5 p-8 rounded-soft border border-accent/10">
              <h3 className="font-serif text-textMain text-xl mb-4 text-accent">Prefer WhatsApp?</h3>
              <p className="text-textLight mb-6 font-light">Get an immediate response by chatting with us directly.</p>
              <a 
                href="https://wa.me/919265466420" 
                target="_blank" 
                className="inline-flex items-center text-accent font-semibold border-b border-accent/30 pb-1 hover:border-accent transition-all"
              >
                Start Chat Now
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}