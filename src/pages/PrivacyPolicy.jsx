export default function PrivacyPolicy() {
  return (
    <div className="bg-bgBase min-h-screen py-24 animate-fade-in font-sans">
      <div className="max-w-[800px] mx-auto card p-10 md:p-16">
        <span className="label text-accent mb-4">Legal</span>
        <h1 className="text-4xl font-serif text-textMain mb-8">Privacy Policy</h1>
        
        <div className="space-y-8 text-textBody font-light leading-relaxed text-sm">
          <p>Last updated: April 2026</p>
          
          <section>
            <h2 className="text-xl font-serif text-textMain mb-3">1. Information We Collect</h2>
            <p>At Saheli Nails, we collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products, or otherwise contact us. The personal information we collect may include names, phone numbers, email addresses, and contact preferences.</p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-textMain mb-3">2. How We Use Your Information</h2>
            <p>We use personal information collected via our website for a variety of business purposes, including:</p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>To facilitate account creation and logon process.</li>
              <li>To fulfill and manage your orders and inquiries.</li>
              <li>To send you marketing and promotional communications (if subscribed).</li>
              <li>To respond to user inquiries/offer support to users.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-serif text-textMain mb-3">3. Sharing Your Information</h2>
            <p>We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. We do not sell your personal information to third parties.</p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-textMain mb-3">4. Contact Us</h2>
            <p>If you have questions or comments about this notice, you may contact us through our Contact Page or visit us directly at our Surat studio.</p>
          </section>
        </div>
      </div>
    </div>
  );
}