import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  query,
  where,
  limit,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";

// Comment out the online images and uncomment your local assets when they are ready
// import heroLocal from '../assets/hero.png';
// import chaniyaLocal from '../assets/chaniya.jpg';
// import nailsLocal from '../assets/nails.jpg';

export default function Home() {
  const [reviews, setReviews] = useState([]);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [subMessage, setSubMessage] = useState("");

  // Online placeholder images for a professional look
  const heroImg =
    "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=2000";
  const chaniyaImg =
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000";
  const nailsImg =
    "https://images.unsplash.com/photo-1604654894610-df490c81726a?q=80&w=1000";

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const rQuery = query(
          collection(db, "reviews_saheli"),
          where("status", "==", "approved"),
          limit(3),
        );
        const rSnap = await getDocs(rQuery);
        setReviews(rSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };
    fetchReviews();
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addDoc(collection(db, "subscribes_saheli"), {
        email,
        subscribedAt: serverTimestamp(),
        active: true,
        source: "home_page",
      });
      setSubMessage("Thank you! You're on the list.");
      setEmail("");
    } catch (err) {
      setSubMessage("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
      setTimeout(() => setSubMessage(""), 5000);
    }
  };

  return (
    <div className="bg-[#fdfbf9] animate-fade-in text-[#333333] font-sans">
      {/* 1. Hero Section (With Image Support) */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Image - Comment out the next line if you want no background */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImg}
            alt="Hero"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#fdfbf9] via-transparent to-transparent"></div>
        </div>

        <div className="w-[90%] max-w-[1200px] mx-auto relative z-10 py-32 text-center md:text-left">
          <div className="max-w-[700px]">
            <span className="text-accent tracking-[0.3em] text-xs font-bold uppercase mb-6 block">
              Est. 2023 • Premium Boutique
            </span>
            <h1 className="text-5xl md:text-8xl font-serif font-medium leading-[1.1] mb-8 text-textMain">
              Your Dream <br />
              <span className="italic text-accent font-light">
                Outfit Awaits.
              </span>
            </h1>
            <p className="text-gray-600 text-lg md:text-xl mb-12 leading-relaxed max-w-[550px]">
              Surat's favorite destination for designer ethnic wear rentals and
              professional nail artistry. Experience elegance without the
              designer price tag.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <Link
                to="/shop"
                className="bg-accent text-white px-12 py-4 rounded-soft hover:bg-textMain transition-all duration-300 shadow-xl shadow-accent/20 font-bold tracking-wide text-sm uppercase"
              >
                View Collection
              </Link>
              <Link
                to="/contact"
                className="bg-white/80 backdrop-blur-md border border-borderSoft text-textMain px-12 py-4 rounded-soft hover:shadow-lg transition-all duration-300 font-bold tracking-wide text-sm uppercase"
              >
                Visit Studio
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Categories (Elevated Cards with Shadows) */}
      <section className="py-48 bg-white border-y border-borderSoft/30">
        <div className="w-[90%] max-w-[1200px] mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-3xl md:text-5xl font-serif mb-4">
              Our Services
            </h2>
            <p className="text-gray-500 max-w-[500px] mx-auto">
              Curated with care for every woman's unique style journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
            {/* Chaniya Choli Card */}
            <Link
              to="/shop?cat=chaniya"
              className="group relative bg-[#fdfbf9] rounded-soft shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden"
            >
              <div className="h-80 overflow-hidden relative">
                {/* Image tag for later */}
                <img
                  src={chaniyaImg}
                  alt="Chaniya Choli"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90"
                />
                <div className="absolute inset-0 bg-accent/10 group-hover:bg-transparent transition-colors"></div>
              </div>
              <div className="p-12 text-center">
                <h3 className="text-3xl font-serif mb-4">Chaniya Choli</h3>
                <p className="text-gray-500 mb-8 text-sm leading-relaxed">
                  Elegant designer pieces for rent and custom tailoring.
                </p>
                <span className="text-accent font-bold uppercase text-xs tracking-widest border-b-2 border-accent pb-1">
                  Shop Now
                </span>
              </div>
            </Link>

            {/* Nail Academy Card */}
            <Link
              to="/shop?cat=nails"
              className="group relative bg-[#fdfbf9] rounded-soft shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden"
            >
              <div className="h-80 overflow-hidden relative">
                <img
                  src={nailsImg}
                  alt="Nail Art"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90"
                />
                <div className="absolute inset-0 bg-accent/10 group-hover:bg-transparent transition-colors"></div>
              </div>
              <div className="p-12 text-center">
                <h3 className="text-3xl font-serif mb-4">Nail Academy</h3>
                <p className="text-gray-500 mb-8 text-sm leading-relaxed">
                  Professional artistry and training from industry experts.
                </p>
                <span className="text-accent font-bold uppercase text-xs tracking-widest border-b-2 border-accent pb-1">
                  Book Service
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. About Section (Immersive Typography) */}
      <section className="py-60 bg-[#fdfbf9]">
        <div className="w-[90%] max-w-[900px] mx-auto text-center">
          <h2 className="text-accent font-serif italic text-3xl mb-12">
            The Saheli Legacy
          </h2>
          <p className="text-3xl md:text-5xl text-textMain font-serif leading-[1.4] mb-12 font-normal">
            “We believe that every stitch matters. Our goal is to make every
            woman feel like <span className="italic text-accent">royalty</span>,
            whether it's for a night or a lifetime.”
          </p>

          <p className="text-gray-500 text-lg uppercase tracking-[0.4em] font-medium">
            Mota Varachha • Surat
          </p>
        </div>
      </section>

      {/* 4. Our Process (Simplified) */}
      <section className="py-48 bg-white border-y border-borderSoft/30">
        <div className="w-[90%] max-w-[1200px] mx-auto text-center">
          <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-textLight mb-24">
            A Seamless Experience
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-24">
            <div className="px-6">
              <span className="text-6xl font-serif text-accent/10 block mb-4 italic">
                01
              </span>
              <h3 className="text-xl font-bold mb-6">Discovery</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Browse over 500 hand-picked designer pieces online or in our
                Surat studio.
              </p>
            </div>
            <div className="px-6">
              <span className="text-6xl font-serif text-accent/10 block mb-4 italic">
                02
              </span>
              <h3 className="text-xl font-bold mb-6">Personalized Fit</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Our master tailors provide complimentary, on-the-spot
                adjustments for a flawless fit.
              </p>
            </div>
            <div className="px-6">
              <span className="text-6xl font-serif text-accent/10 block mb-4 italic">
                03
              </span>
              <h3 className="text-xl font-bold mb-6">Radiate</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Enjoy your event. We take care of all professional cleaning and
                gown maintenance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Email Subscribe (Shadowed Feature Card) */}
      <section className="py-60 bg-[#fdfbf9]">
        <div className="w-[90%] max-w-[800px] mx-auto">
          <div className="bg-white p-16 md:p-24 rounded-soft shadow-2xl border border-borderSoft/30 text-center">
            <h2 className="text-3xl md:text-4xl font-serif mb-6 text-textMain">
              Join the Saheli Circle
            </h2>
            <p className="text-gray-500 mb-12 text-sm max-w-[450px] mx-auto leading-relaxed">
              Subscribe for early access to our new collections and exclusive
              boutique events.
            </p>

            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-4"
            >
              <input
                type="email"
                required
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-grow bg-[#fdfbf9] border border-borderSoft px-6 py-4 rounded-soft text-base focus:outline-none focus:border-accent transition-colors"
              />
              <button
                type="submit"
                disabled={submitting}
                className="bg-accent text-white px-12 py-4 rounded-soft font-bold uppercase text-xs tracking-widest hover:bg-textMain transition-all shadow-lg shadow-accent/20"
              >
                {submitting ? "Adding..." : "Subscribe"}
              </button>
            </form>
            {subMessage && (
              <p className="text-sm text-accent mt-8 font-medium italic animate-pulse">
                {subMessage}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 6. Customer Reviews (Premium Grid) */}
      <section className="py-48 bg-white border-t border-borderSoft/30">
        <div className="w-[90%] max-w-[1200px] mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-3xl md:text-5xl font-serif italic mb-4">
              Kind Words
            </h2>
            <div className="w-12 h-1 bg-accent mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            {reviews.length > 0 ? (
              reviews.map((r) => (
                <div
                  key={r.id}
                  className="bg-white p-12 rounded-soft shadow-xl border-b-4 border-accent hover:-translate-y-2 transition-all duration-500"
                >
                  <div className="flex text-accent mb-8 text-sm">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <p className="text-gray-600 font-light italic mb-10 leading-loose text-base">
                    "{r.comment}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-[1px] bg-borderSoft"></div>
                    <p className="text-textMain font-bold uppercase text-[10px] tracking-[0.2em]">
                      {r.customerName}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-20 bg-[#fdfbf9] rounded-soft border-2 border-dashed border-borderSoft">
                <p className="text-gray-400 italic">
                  Be the first to share your Saheli story.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
