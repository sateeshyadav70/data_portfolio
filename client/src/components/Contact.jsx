import React, { lazy, Suspense, useState } from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";
import SectionReveal from "./ui/SectionReveal";
import { contactData } from "../data/portfolioData";
import SectionShaderLayer from "./three/SectionShaderLayer";

const HoloBadge = lazy(() => import("./three/HoloBadge"));

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitMessage, setSubmitMessage] = useState("");

  const handleChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const subject = `Portfolio Contact from ${formData.name}`;
    const body = `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`;
    window.location.href = `mailto:${contactData.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSubmitMessage("Opening your email client...");
    setFormData({ name: "", email: "", message: "" });
  };

  const contactItems = [
    { icon: <FaEnvelope className="text-cyan-300" />, title: "Email", value: contactData.email, href: `mailto:${contactData.email}` },
    { icon: <FaPhone className="text-cyan-300" />, title: "Phone", value: contactData.phone, href: `tel:${contactData.phone.replace(/\s+/g, "")}` },
    { icon: <FaMapMarkerAlt className="text-cyan-300" />, title: "Location", value: contactData.location, href: null },
  ];

  return (
    <SectionReveal id="contact" className="section-shell section-divider">
      <SectionShaderLayer variant="contact" />
      <div className="section-container relative z-10">
        <div className="mb-12 grid items-center gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="text-center lg:text-left">
            <p className="section-kicker">Let's Collaborate</p>
            <h2 className="section-title">Contact</h2>
            <p className="section-subtitle lg:mx-0">{contactData.availability}</p>
          </div>
          <div className="glass-panel mx-auto h-[210px] w-full max-w-[360px] overflow-hidden">
            <Suspense fallback={<div className="flex h-full items-center justify-center text-sm text-slate-300">Loading 3D...</div>}>
              <HoloBadge label="CONTACT NODE" variant="contact" />
            </Suspense>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            {contactItems.map((item) => (
              <motion.div key={item.title} whileHover={{ y: -3 }} className="glass-panel p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-lg">{item.icon}</div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-200">{item.title}</h3>
                    {item.href ? (
                      <a href={item.href} className="text-sm text-slate-300 transition-colors hover:text-cyan-200">
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-sm text-slate-300">{item.value}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            <div className="glass-panel p-5">
              <h3 className="card-title mb-4">Social Links</h3>
              <div className="flex gap-4 text-xl text-slate-300">
                <a href={contactData.socials.github} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-200">
                  <FaGithub />
                </a>
                <a href={contactData.socials.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-200">
                  <FaLinkedin />
                </a>
                <a href={contactData.socials.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-200">
                  <FaInstagram />
                </a>
              </div>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="glass-panel p-6">
            <h3 className="card-title mb-5">Send a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block text-sm text-slate-300">
                Name
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="input-glass mt-2" placeholder="Your Name" />
              </label>

              <label className="block text-sm text-slate-300">
                Email
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="input-glass mt-2" placeholder="your.email@example.com" />
              </label>

              <label className="block text-sm text-slate-300">
                Message
                <textarea name="message" value={formData.message} onChange={handleChange} required rows="5" className="input-glass mt-2" placeholder="Tell me what you want to build" />
              </label>

              <button type="submit" className="btn-primary w-full">
                Send Message
              </button>

              {submitMessage && <p className="text-center text-xs text-cyan-200">{submitMessage}</p>}
            </form>
          </motion.div>
        </div>
      </div>
    </SectionReveal>
  );
};

export default Contact;
