import { useState } from "react";

const faqs = [
  {
    question: "How do I list my property on RentEase?",
    answer:
      "To list your property, simply create an account, click on 'List Your Property', and follow the guided steps to upload photos, details, and pricing.",
  },
  {
    question: "Is there a fee for tenants or landlords?",
    answer:
      "RentEase is free for tenants. Landlords may pay a small service fee per booking or opt for subscription-based listing plans.",
  },
  {
    question: "How does booking confirmation work?",
    answer:
      "Once a tenant submits a booking request, the landlord is notified and must approve it. Upon approval, the tenant is notified and payment is processed.",
  },
  {
    question: "Is RentEase secure for payments?",
    answer:
      "Yes. RentEase integrates secure payment gateways to ensure safe and encrypted transactions for all users.",
  },
];

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <section className="bg-gray-50 py-12 px-6 md:px-20">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`border rounded-2xl shadow-sm transition duration-200 cursor-pointer ${
                activeIndex === index
                  ? "bg-white border-sky-500"
                  : "bg-white border-gray-200"
              }`}
              onClick={() => toggleFAQ(index)}
            >
              <div className="p-4 md:p-5 hover:bg-sky-100 rounded-2xl transition-colors duration-300">
                <h3 className="text-lg font-medium text-gray-800 flex justify-between items-center">
                  {faq.question}
                  <span className="text-sky-500 text-xl">
                    {activeIndex === index ? "−" : "+"}
                  </span>
                </h3>
                {activeIndex === index && (
                  <p className="mt-3 text-gray-600 transition-all duration-200">
                    {faq.answer}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
