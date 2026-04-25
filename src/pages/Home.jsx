import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="animate-fade-in">
      {/* Editorial Hero Section */}
      <section className="bg-[#fdfbf9] py-20 md:py-32 border-b border-borderSoft">
        <div className="w-[90%] max-w-[1200px] mx-auto flex flex-col items-center text-center">
          <span className="text-accent tracking-[0.2em] text-xs font-semibold uppercase mb-6">Rent • Buy • Tailor</span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-textMain leading-[1.15] mb-8 max-w-[900px]">
            Your perfect outfit, <br className="hidden md:block" />
            <span className="italic font-light text-textLight">without the compromise.</span>
          </h1>
          <p className="text-lg md:text-xl text-textLight mb-12 max-w-[600px] leading-relaxed font-light">
            Discover our curated collection of designer ethnic wear and bridal pieces. Available for rent or purchase, with custom tailoring in Surat.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
            <Link to="/shop" className="w-full sm:w-auto bg-accent text-bgMain px-10 py-4 rounded-soft border border-accent hover:bg-textMain hover:border-textMain transition-all duration-300 font-medium tracking-wide">
              Explore Collection
            </Link>
            <Link to="/contact" className="w-full sm:w-auto bg-transparent text-textMain px-10 py-4 rounded-soft border border-textMain hover:bg-bgMain transition-all duration-300 font-medium tracking-wide">
              Visit Boutique
            </Link>
          </div>
        </div>
      </section>

      {/* The Saheli Experience (Proof Section) */}
      <section className="py-24 border-b border-borderSoft bg-white">
        <div className="w-[90%] max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Image Grid */}
          <div className="relative">
            <div className="aspect-[4/5] w-[85%] rounded-soft overflow-hidden border border-borderSoft shadow-sm">
              <img src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1000&auto=format&fit=crop" alt="Designer Lehenga" className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-10 right-0 aspect-square w-[45%] rounded-soft overflow-hidden border-[6px] border-white shadow-lg">
              <img src="https://images.unsplash.com/photo-1516975080661-46b0a8eb7127?q=80&w=500&auto=format&fit=crop" alt="Boutique Details" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Text Content */}
          <div className="pl-0 lg:pl-8">
            <h2 className="text-3xl md:text-4xl font-serif text-textMain mb-6 leading-tight">
              Real outfits. <br/>Impeccable fitting.
            </h2>
            <p className="text-textLight mb-10 leading-relaxed text-lg font-light">
              We stock over 500 authentic Chaniya Cholis and bridal pieces. Stop by our Mota Varachha location to feel the fabrics, try them on, and let our in-house tailors ensure a flawless fit.
            </p>
            
            <ul className="space-y-5">
              {[
                'Over 2,000 customers styled for their special days',
                'In-house tailoring for a perfect, custom fit',
                'Transparent rental pricing with no hidden fees'
              ].map((item, i) => (
                <li key={i} className="flex items-start">
                  <svg className="w-6 h-6 text-accent mr-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-textMain font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}