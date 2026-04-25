import { Link } from 'react-router-dom';

export default function About() {
  // Luxury placeholders
  const aboutHeroImg = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2000";
  const craftImg = "https://images.unsplash.com/photo-1558603668-6570496b66f8?q=80&w=1000";

  return (
    <div className="bg-[#fdfbf9] animate-fade-in text-[#333333] font-sans">
      
      {/* 1. Hero Section: Refined & Focused */}
      <section className="py-24 md:py-44 border-b border-borderSoft/30">
        <div className="w-[90%] max-w-[900px] mx-auto text-center">
          <span className="text-accent tracking-[0.4em] text-[10px] font-bold uppercase mb-6 block">
            Our Heritage
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-medium leading-tight mb-8">
            Crafting Memories, <br />
            <span className="italic text-accent font-light">One Stitch at a Time.</span>
          </h1>
          <p className="text-gray-500 text-lg md:text-xl font-light max-w-[650px] mx-auto leading-relaxed italic">
            "Founded in the heart of Surat, Saheli Boutique began with a single vision: to ensure every woman feels like royalty on her special day."
          </p>
        </div>
      </section>

      {/* 2. The Vision: Balanced split with soft shadows */}
      <section className="py-24 bg-white">
        <div className="w-[90%] max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="aspect-[4/5] rounded-soft overflow-hidden shadow-xl border border-borderSoft/50">
              <img src={aboutHeroImg} alt="Boutique Story" className="w-full h-full object-cover" />
            </div>
            {/* Subtle luxury accent */}
            <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-accent/30 rounded-tl-soft"></div>
          </div>

          <div className="space-y-8">
            <h2 className="text-3xl font-serif font-medium text-textMain leading-tight">
              A New Standard in <br />Boutique Fashion.
            </h2>
            <p className="text-gray-600 text-base leading-loose font-normal">
              High-end fashion shouldn't be an unreachable dream. By offering premium rentals and bespoke tailoring, we bring the luxury of a designer wardrobe to you with a personal, boutique touch.
            </p>
            <div className="flex gap-12 pt-4">
              <div>
                <h4 className="text-accent text-2xl font-serif mb-1">500+</h4>
                <p className="text-[10px] uppercase tracking-widest text-textLight font-bold">Designer Pieces</p>
              </div>
              <div>
                <h4 className="text-accent text-2xl font-serif mb-1">2000+</h4>
                <p className="text-[10px] uppercase tracking-widest text-textLight font-bold">Styling Stories</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Craftsmanship: High-Detail Narrative */}
      <section className="py-24 bg-[#fdfbf9] border-y border-borderSoft/30">
        <div className="w-[90%] max-w-[1100px] mx-auto flex flex-col md:flex-row-reverse gap-16 items-center">
          <div className="w-full md:w-1/2">
            <div className="aspect-[3/2] rounded-soft overflow-hidden shadow-lg border border-white">
              <img src={craftImg} alt="Master Tailoring" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <span className="text-accent font-bold text-[10px] uppercase tracking-[0.3em] mb-4 block">Master Artistry</span>
            <h2 className="text-3xl font-serif font-medium mb-6">Precision in Every Fold.</h2>
            <p className="text-gray-600 text-base leading-relaxed mb-6">
              Every garment in our collection is treated with the utmost respect. Our in-house master tailors provide complimentary adjustments to ensure a silhouette that is uniquely yours.
            </p>
            <Link to="/contact" className="text-accent font-bold text-xs uppercase tracking-widest border-b border-accent/30 pb-1 hover:border-accent transition-all">
              Book a Trial →
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Core Values: Clean, Shadowed Grid */}
      <section className="py-24 bg-white">
        <div className="w-[90%] max-w-[1100px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Quality First", desc: "We source only authentic fabrics and designer-grade materials for our collection." },
              { title: "Transparency", desc: "Honest pricing with no hidden fees. We value the trust you place in us." },
              { title: "Community", desc: "A space where Surat’s women come together to find their perfect celebration look." }
            ].map((value, i) => (
              <div key={i} className="bg-white p-10 rounded-soft shadow-sm border border-borderSoft/50 hover:shadow-md transition-all duration-300">
                <h3 className="font-serif text-xl mb-4 text-textMain">{value.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Final CTA: Luxury Card Design */}
      <section className="py-24 bg-[#fdfbf9]">
        <div className="w-[90%] max-w-[800px] mx-auto">
          <div className="bg-white p-16 rounded-soft shadow-2xl border border-borderSoft/20 text-center relative overflow-hidden">
            <h2 className="text-3xl font-serif mb-6 text-textMain">Experience the Saheli Touch.</h2>
            <p className="text-gray-500 mb-10 text-base max-w-[400px] mx-auto">
              Ready to find your perfect look? Visit us in Surat or browse our digital collection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/shop" className="bg-accent text-white px-10 py-3.5 rounded-soft font-bold uppercase text-[10px] tracking-widest hover:bg-textMain transition-all shadow-lg shadow-accent/20">
                Shop Collection
              </Link>
              <Link to="/contact" className="bg-white text-textMain border border-borderSoft px-10 py-3.5 rounded-soft font-bold uppercase text-[10px] tracking-widest hover:shadow-md transition-all">
                Visit Studio
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}