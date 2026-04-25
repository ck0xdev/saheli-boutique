import { Link } from 'react-router-dom';

export default function About() {
  const aboutHeroImg = "https://images.unsplash.com/photo-1522337360788-8b13df772ec2?q=80&w=2000";
  const craftImg = "https://images.unsplash.com/photo-1599426417071-6c4ce686d0d4?q=80&w=1000";

  return (
    <div className="bg-[#fdfbf9] animate-fade-in text-[#333333] font-sans">
      <section className="py-24 md:py-32 border-b border-borderSoft/30">
        <div className="w-[90%] max-w-[900px] mx-auto text-center">
          <span className="text-accent tracking-[0.4em] text-[10px] font-bold uppercase mb-6 block">Our Heritage</span>
          <h1 className="text-4xl md:text-6xl font-serif font-medium leading-tight mb-8">Crafting Memories, <br /><span className="italic text-accent font-light text-3xl md:text-5xl">One Stroke at a Time.</span></h1>
          <p className="text-gray-500 text-lg md:text-xl font-light max-w-[650px] mx-auto leading-relaxed italic">"Founded in the heart of Surat, Saheli Nail Boutique began with a single vision: to elevate nail artistry to a professional academic standard."</p>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="w-[90%] max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="aspect-[4/5] rounded-soft overflow-hidden shadow-2xl border border-borderSoft/50"><img src={aboutHeroImg} alt="Boutique Story" className="w-full h-full object-cover" /></div>
          <div className="space-y-8">
            <h2 className="text-3xl font-serif font-medium text-textMain leading-tight">A New Standard in <br />Professional Artistry.</h2>
            <p className="text-gray-600 text-base leading-loose">We believe luxury should be an experience, not just a service. From our curated extension collection to our masterclass certifications, we provide Surat with a personal, boutique touch.</p>
            <div className="flex gap-12 pt-4">
              <div><h4 className="text-accent text-2xl font-serif mb-1">20+</h4><p className="text-[10px] uppercase tracking-widest text-textLight font-bold">Art Specialists</p></div>
              <div><h4 className="text-accent text-2xl font-serif mb-1">3000+</h4><p className="text-[10px] uppercase tracking-widest text-textLight font-bold">Styling Stories</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="w-[90%] max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[{ title: "Precision", desc: "Every extension is sculpted with anatomical precision for lasting durability." },
            { title: "Transparency", desc: "Honest certification paths and service pricing with zero hidden costs." },
            { title: "Academy", desc: "Empowering the next generation of nail artists with world-class training." }].map((v, i) => (
            <div key={i} className="bg-white p-10 rounded-soft shadow-md border border-borderSoft/40 hover:-translate-y-1 transition-all"><h3 className="font-serif text-xl mb-4 text-textMain">{v.title}</h3><p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p></div>
          ))}
        </div>
      </section>
    </div>
  );
}