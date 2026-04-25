export default function Footer() {
  return (
    <footer className="pt-20 pb-8 bg-[#fdfbf9] border-t border-borderSoft mt-auto">
      <div className="w-[90%] max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 items-start">
        
        {/* Brand Info */}
        <div className="md:col-span-5 lg:col-span-4">
          <div className="text-2xl text-textMain font-serif tracking-wide mb-6">
            SAHELI <span className="text-accent italic font-light">Boutique</span>
          </div>
          <p className="text-textLight mb-6 leading-relaxed font-light">
            Elevating your special occasions with premium ethnic wear rentals, bespoke tailoring, and professional nail artistry.
          </p>
          <div className="text-textMain font-medium">
            <p className="mb-1">A-98 Sumeru City Mall, Sudama Chowk</p>
            <p className="mb-4">Mota Varachha, Surat</p>
            <a href="tel:+919265466420" className="text-accent hover:text-textMain transition-colors duration-300 inline-block border-b border-accent/30 pb-0.5">
              +91 92654 66420
            </a>
          </div>
        </div>
        
        {/* Empty Spacer Column for Desktop */}
        <div className="hidden lg:block lg:col-span-2"></div>

        {/* Map */}
        <div className="md:col-span-7 lg:col-span-6">
          <div className="h-[250px] w-full border border-borderSoft rounded-soft overflow-hidden shadow-sm bg-white p-1">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3718.966961730079!2d72.88099681534882!3d21.23315268588825!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04f5e088bf24d%3A0x6b801a24d8560091!2sSumeru%20City%20Mall!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin" 
              className="w-full h-full rounded-sm" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Saheli Boutique Location">
            </iframe>
          </div>
        </div>
      </div>
      
      <div className="w-[90%] max-w-[1200px] mx-auto border-t border-borderSoft/60 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-textLight text-sm font-light">
        <p>© 2026 Saheli Boutique. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-accent transition-colors">Instagram</a>
          <a href="#" className="hover:text-accent transition-colors">WhatsApp</a>
        </div>
      </div>
    </footer>
  );
}