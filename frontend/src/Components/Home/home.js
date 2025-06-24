import FAQSection from "../Faqs/faq";
const Home = () => {
  return (
    <div className="bg-gray-50 text-gray-800 mt-40">

      <section className="min-h-[50vh] flex items-center justify-center text-center px-6 bg-white">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
            Find or List Your Perfect Rental Property
          </h1>
          <p className="text-gray-500 mb-8">
            RentEase connects landlords with tenants in a secure, interactive platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-xl transition">
              Browse Properties
            </button>
            <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl transition">
              List Your Property
            </button>
          </div>
        </div>
      </section>
      <section className="py-16 px-6 bg-gray-50">
        <h2 className="text-3xl font-semibold text-center mb-12 text-gray-800">Why Choose RentEase?</h2>
        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          {[
            { title: 'Real-Time Chat', desc: 'Communicate instantly with tenants or landlords directly on the platform.' },
            { title: 'Secure Payments', desc: 'Integrated payment system ensures fast and safe transactions.' },
            { title: 'Interactive Listings', desc: 'Map-integrated listings with real-time availability updates.' },
          ].map((feature, idx) => (
            <div key={idx} className="bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition">
              <div className="text-amber-500 mb-3 text-3xl">★</div>
              <h3 className="text-xl font-semibold text-gray-800">{feature.title}</h3>
              <p className="text-gray-500 mt-2">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="py-16 px-6 bg-white">
        <h2 className="text-3xl font-semibold text-center mb-12 text-gray-800">What Our Users Say</h2>
        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          {[
            { name: 'Amit Verma', msg: 'RentEase made finding my new apartment super easy and stress-free!' },
            { name: 'Priya Sharma', msg: 'Listing my flat took just minutes. I found tenants quickly with no hassle.' },
            { name: 'Rohan Desai', msg: 'I loved the real-time chat feature. It made communication smooth and secure.' },
          ].map((testimonial, idx) => (
            <div key={idx} className="bg-gray-50 p-6 border border-gray-200 rounded-xl">
              <p className="text-gray-600 italic mb-4">“{testimonial.msg}”</p>
              <h4 className="font-semibold text-emerald-600">— {testimonial.name}</h4>
            </div>
          ))}
        </div>
      </section>
      <FAQSection />
    </div>
  );
};

export default Home;
