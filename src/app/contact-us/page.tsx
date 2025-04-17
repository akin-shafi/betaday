"use client";

import { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#fdf6e9]">
      {/* Arabian geometric pattern background */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0l25 25-25 25 25 25-25 25v-25L25 50l25-25V0zM0 50l25-25L0 0v100l25-25zm100 0L75 25l25-25v100l-25-25z' fill='%23c17f59' fill-opacity='0.4'/%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Decorative arch shapes */}
      <div
        className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[#ff6600]/5 via-[#c17f59]/5 to-transparent"
        style={{
          clipPath:
            "polygon(0 0, 100% 0, 100% 100%, 85% 90%, 70% 95%, 55% 85%, 40% 95%, 25% 85%, 10% 95%, 0 85%)",
        }}
      ></div>

      <div className="relative z-10">
        {/* <Header /> */}
        <main className="max-w-6xl mx-auto px-4 py-12 pt-32">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-block"
            >
              <h1 className="text-5xl font-bold mb-4 text-[#2d1810]">
                Contact Us
                {/* <span className="block text-lg font-normal text-[#c17f59] mt-2">
                  تواصل معنا
                </span> */}
              </h1>
              <p className="text-[#5c4437] max-w-2xl mx-auto text-lg">
                Have questions or need assistance? We&apos;re here to help.
                Reach out to our team through any of the channels below.
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-[#c17f59]/20 relative overflow-hidden">
                {/* Decorative corner patterns */}
                <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[#c17f59]/30 rounded-tl-xl"></div>
                <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-[#c17f59]/30 rounded-tr-xl"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-[#c17f59]/30 rounded-bl-xl"></div>
                <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[#c17f59]/30 rounded-br-xl"></div>

                <h2 className="text-2xl font-bold mb-8 text-[#2d1810] relative z-10">
                  Get in Touch
                </h2>
                <div className="space-y-8 relative z-10">
                  {/* <div className="flex items-center gap-6 p-4 bg-[#fdf6e9]/50 rounded-xl">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#ff6600] to-[#c17f59] rounded-lg blur-lg opacity-20"></div>
                      <div className="relative bg-gradient-to-br from-[#ff6600] to-[#c17f59] p-3 rounded-lg">
                        <Phone className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-[#2d1810]">Phone</h3>
                      <p className="text-[#5c4437]">+234 814 880 4448</p>
                    </div>
                  </div> */}

                  <div className="flex items-center gap-6 p-4 bg-[#fdf6e9]/50 rounded-xl">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#ff6600] to-[#c17f59] rounded-lg blur-lg opacity-20"></div>
                      <div className="relative bg-gradient-to-br from-[#ff6600] to-[#c17f59] p-3 rounded-lg">
                        <Mail className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-[#2d1810]">Email</h3>
                      <p className="text-[#5c4437]">help.betaday@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 p-4 bg-[#fdf6e9]/50 rounded-xl">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#ff6600] to-[#c17f59] rounded-lg blur-lg opacity-20"></div>
                      <div className="relative bg-gradient-to-br from-[#ff6600] to-[#c17f59] p-3 rounded-lg">
                        <MapPin className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    {/* <div>
                      <h3 className="font-medium text-[#2d1810]">Address</h3>
                      <p className="text-[#5c4437]">
                        123 BetaDay Street, City, Country
                      </p>
                    </div> */}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <form
                onSubmit={handleSubmit}
                className="space-y-6 bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-[#c17f59]/20 relative"
              >
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#ff6600]/5 to-[#c17f59]/5 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-[#c17f59]/5 to-transparent rounded-full blur-2xl"></div>

                <div className="relative">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-[#2d1810] mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#fdf6e9]/50 border border-[#c17f59]/20 rounded-xl focus:ring-2 focus:ring-[#ff6600]/20 focus:border-[#ff6600] transition-colors"
                    required
                  />
                </div>

                <div className="relative">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-[#2d1810] mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#fdf6e9]/50 border border-[#c17f59]/20 rounded-xl focus:ring-2 focus:ring-[#ff6600]/20 focus:border-[#ff6600] transition-colors"
                    required
                  />
                </div>

                <div className="relative">
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-[#2d1810] mb-2"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#fdf6e9]/50 border border-[#c17f59]/20 rounded-xl focus:ring-2 focus:ring-[#ff6600]/20 focus:border-[#ff6600] transition-colors"
                    required
                  />
                </div>

                <div className="relative">
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-[#2d1810] mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-[#fdf6e9]/50 border border-[#c17f59]/20 rounded-xl focus:ring-2 focus:ring-[#ff6600]/20 focus:border-[#ff6600] transition-colors resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#ff6600] to-[#c17f59] text-white py-3 px-6 rounded-xl hover:shadow-lg hover:shadow-[#ff6600]/10 transition-all duration-300 relative overflow-hidden group"
                >
                  <span className="relative z-10">Send Message</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#c17f59] to-[#ff6600] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </form>
            </motion.div>
          </div>
        </main>
        {/* <Footer /> */}
      </div>
    </div>
  );
}
