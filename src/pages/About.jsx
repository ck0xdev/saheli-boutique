import { Link } from 'react-router-dom';

export default function About() {
  const aboutHeroImg = "https://images.unsplash.com/photo-1522337360788-8b13df772ec2?q=80&w=2000";

  return (
    <div className="bg-bgBase animate-fade-in font-sans">
      
      {/* 1. Hero Section */}
      <section className="py-24 md:py-32 border-b border-borderSoft/50">
        <div className="w-[90%] max-w-[900px] mx-auto text-center">
          <span className="label text-accent mb-6 block">Our Heritage</span>
          <h1 className="text-4xl md:text-6xl font-serif font-medium leading-tight mb-8 text-textMain">
            Crafting Memories, <br />
            <span className="italic text-accent font-light text-3xl md:text-5xl">One Stroke at a Time.</span>
          </h1>
          <p className="text-textBody text-lg md:text-xl font-light max-w-[650px] mx-auto leading-relaxed italic">
            "Founded in the heart of Surat, Saheli Nail Boutique began with a single vision: to elevate nail artistry to a professional academic standard."
          </p>
        </div>
      </section>

      {/* 2. Story Section */}
      <section className="py-24 bg-white">
        <div className="w-[90%] max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="aspect-[4/5] rounded-soft overflow-hidden shadow-card border border-borderSoft/50">
            <img src={aboutHeroImg} alt="Boutique Story" className="w-full h-full object-cover" />
          </div>
          <div className="space-y-8">
            <h2 className="text-3xl font-serif font-medium text-textMain leading-tight">A New Standard in <br />Professional Artistry.</h2>
            <p className="text-textBody text-base leading-loose font-light">
              We believe luxury should be an experience, not just a transaction. From our curated nail product collections to our masterclass certifications, we provide Surat with a personal, boutique touch.
            </p>
            <div className="flex gap-12 pt-4">
              <div>
                <h4 className="text-accent text-2xl font-serif mb-1">20+</h4>
                <p className="text-[10px] uppercase tracking-widest text-textMuted font-bold">Art Specialists</p>
              </div>
              <div>
                <h4 className="text-accent text-2xl font-serif mb-1">3000+</h4>
                <p className="text-[10px] uppercase tracking-widest text-textMuted font-bold">Styling Stories</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Values Section */}
      <section className="py-24 bg-white">
        <div className="w-[90%] max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Precision", desc: "Every product is sculpted with anatomical precision for lasting durability." },
            { title: "Transparency", desc: "Honest certification paths and product pricing with zero hidden costs." },
            { title: "Academy", desc: "Empowering the next generation of nail artists with world-class training." }
          ].map((v, i) => (
            <div key={i} className="card p-10 text-center">
              <h3 className="font-serif text-xl mb-4 text-textMain">{v.title}</h3>
              <p className="text-textMuted text-sm leading-relaxed font-light">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. CTA */}
      <section className="py-24 bg-bgBase">
        <div className="w-[90%] max-w-[800px] mx-auto">
          <div className="card p-16 text-center relative overflow-hidden">
            <h2 className="text-3xl font-serif mb-6 text-textMain">Experience the Saheli Touch.</h2>
            <p className="text-textBody mb-10 text-base max-w-[400px] mx-auto font-light">
              Ready to find your perfect look? Visit us in Surat or browse our digital collection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/shop" className="btn-primary">Shop Collection</Link>
              <Link to="/contact" className="btn-secondary">Book a Session</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}