"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, ShieldCheck, Compass, MessageSquare,
  Orbit, Globe, HeartHandshake, CheckCircle2,
  Phone, Mail, MapPin, Send, CheckCircle, X, Eye
} from 'lucide-react';
import CosmicBackground from '@/components/CosmicBackground';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

export default function AboutPage() {
  const { t, tText } = useLanguage();
  // Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('General Query');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  // Certificate Modal State
  const [activeCert, setActiveCert] = useState<string | null>(null);

  const experiences = [
    tText("Traditional Vedic Astrology Consultation", "பாரம்பரிய வேத ஜோதிட ஆலோசனை"),
    tText("Horoscope Analysis & Birth Time Correction (Chart Verification)", "துல்லிய ஜாதக கணிப்பு & கால திருத்தம்"),
    tText("Auspicious Timing (Muhurtham) for major life milestones", "வாழ்வின் முக்கிய நிகழ்வுகளுக்கான சுப முகூர்த்தம்"),
    tText("Instant Clock Astrology for Urgent Questions (Kadikara Prasannam)", "கடிகாரப் பிரசன்னம் (உடனடி கேள்விக்கான தீர்வு)"),
    tText("Convenient Phone & Online Video Consultations Worldwide", "உலகெங்கிலும் உள்ள தமிழர்களுக்கு தொலைபேசி & ஆன்லைன் ஆலோசனை")
  ];

  const specializations = [
    { title: tText("Horoscope Reading", "ஜாதக கணிப்பு & பலன்கள்"), category: tText("Complete study of Rising Sign (Lagna), planet positions, and life timeline (Dasha periods)", "லக்னம், நவகிரக நிலைகள் மற்றும் தசா புக்தி பலன்கள் விரிவான ஆய்வு") },
    { title: tText("Marriage Matching", "திருமணப் பொருத்தம்"), category: tText("Comprehensive 10-point compatibility check with Mars & planetary dosha analysis", "10 விதமான பொருத்தங்கள், செவ்வாய் & ராகு கேது தோஷ ஆய்வு") },
    { title: tText("Kadikara Prasannam", "கடிகாரப் பிரசன்னம்"), category: tText("Instant clock-based astrology (Prasannam) to answer urgent questions and make clear decisions", "அவசர கேள்விகள் மற்றும் முடிவுகளுக்கு உடனடி தீர்வு") },
    { title: tText("Career & Business Guidance", "தொழில் & வியாபார வழிகாட்டல்"), category: tText("Best lucky periods for career growth, job transitions, and business investments", "தொழில் வளர்ச்சி, வேலை மாற்றம் மற்றும் முதலீடுகளுக்கான உகந்த காலங்கள்") },
    { title: tText("Financial Guidance", "பொருளாதாரம் & நிதி வழிகாட்டல்"), category: tText("Income prospects, overcoming money delays, and practical remedies for wealth", "தன ஸ்தான பலம், கடன் தடைகள் மற்றும் நிதி பெருக்கத்திற்கான பரிகாரங்கள்") },
    { title: tText("Muhurtham Consultations", "சுப முகூர்த்த ஆலோசனை"), category: tText("Lucky dates and auspicious hours for buying a vehicle, house warming, child delivery, and property registration", "வாகனம் வாங்குதல், புதுமனை புகுவிழா, குழந்தை பிறப்பு, சொத்து பதிவு சுப நேரங்கள்") }
  ];

  const achievements = [
    { value: tText("Founder", "நிறுவனர்"), title: tText("Kkarthikeya Astrological Centre", "கார்த்திகேயா ஜோதிட மையம்"), desc: tText("Established a hub for authentic Vedic guidance", "பாரம்பரிய வேத ஜோதிடத்திற்கான மையம்") },
    { value: "5000+", title: tText("Happy Clients Guided", "வழிகாட்டப்பட்ட வாடிக்கையாளர்கள்"), desc: tText("Gained trust and provided clear guidance to clients worldwide", "உலகெங்கிலும் உள்ள வாடிக்கையாளர்களுக்கு தெளிவான வழிகாட்டல்") },
    { value: "500+", title: tText("Marriage Matches Done", "திருமணப் பொருத்தங்கள்"), desc: tText("Evaluated compatibility to secure blessed unions", "இனிய இல்லற வாழ்விற்கான சிறந்த பொருத்தங்கள்") },
    { value: tText("Specialist", "நிபுணர்"), title: tText("Muhurtham & Auspicious Timing", "சுப முகூர்த்த நிபுணர்"), desc: tText("Expert in calculating auspicious dates and times for important life events", "வாழ்வின் முக்கிய சுப நிகழ்வுகளுக்கு உகந்த நேரக் கணிப்பு") }
  ];

  const certificates = [
    {
      title: "Vedic Astrology Master",
      issuer: "Akhila Bharatiya Saraswata Parishad",
      src: "/assets/Cert/c1.webp",
      desc: "Accredited credentials in Vedic Horoscope Calculations and planetary transit analysis."
    }
  ];

  const gallery = [
    {
      title: "Master's Initiation & Certification",
      issuer: "Traditional Lineage",
      src: "/assets/Cert/g0.webp",
      desc: "Sacred initiation and certification received directly from the revered Master."
    },
    {
      title: "Vedic Heritage Certification",
      issuer: "Traditional Lineage",
      src: "/assets/Cert/g1.webp",
      desc: "Authentic authorizations validating ancient Vedic studies from the Guru parampara."
    },
    {
      title: "Advanced Prasannam Mastery",
      issuer: "Traditional Lineage",
      src: "/assets/Cert/g2.webp",
      desc: "Validation of expertise in advanced traditional techniques passed down through generations."
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          subject,
          message,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSent(true);
        // Clear form
        setName('');
        setEmail('');
        setPhone('');
        setMessage('');
      } else {
        alert(data.error || 'Failed to submit inquiry. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting inquiry:', err);
      alert('Network error. Failed to send inquiry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const mapEmbedUrl = "https://maps.google.com/maps?q=Singaperumal+Koil,+Tamil+Nadu+603204&t=&z=13&ie=UTF8&iwloc=&output=embed";

  return (
    <main className="relative min-h-screen w-full text-slate-100 overflow-x-hidden pb-16 selection:bg-amber-500/30">
      <CosmicBackground />

      {/* 🌌 Page Header / Hero Area */}
      <section className="pt-10 pb-12 px-6 max-w-6xl mx-auto relative z-10">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full border border-amber-500/20 bg-amber-950/20 text-amber-300 text-[9px] uppercase tracking-widest font-black">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Certified Vedic Astrologer & Guide
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white font-serif leading-[1.15]">
            About Astrologer Kkarthikeya
          </h1>
          <p className="text-xs md:text-sm text-indigo-300 font-bold uppercase tracking-widest">
            Chennai / Tamilnadu • Trusted Worldwide
          </p>
          <div className="w-12 h-1 bg-gradient-to-r from-amber-500 to-indigo-500 mx-auto rounded-full mt-4" />
        </div>
      </section>

      {/* 🕉️ Main Bio & Philosophy Section */}
      <section className="py-12 px-6 max-w-6xl mx-auto relative z-10">
        <div className="grid md:grid-cols-12 gap-12 items-center">

          {/* Portrait Container */}
          <div className="md:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-[320px] aspect-[3/4] rounded-3xl border border-white/10 bg-slate-900/30 backdrop-blur-xl p-4 shadow-antigravity group">
              <div className="relative w-full h-[88%] rounded-2xl overflow-hidden border border-white/5 bg-slate-950/60 p-1 shadow-glow">
                <Image
                  src="/assets/astrologer.png"
                  alt="Astrologer Kkarthikeya Vedic Astrology Specialist"
                  width={320}
                  height={427}
                  priority
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>

              <div className="mt-3 flex items-center justify-between px-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Horoscope Specialist</span>
                <span className="text-[9px] py-0.5 px-2 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-300 font-extrabold">Chennai, TN</span>
              </div>
            </div>
          </div>

          {/* Biography Copy */}
          <div className="md:col-span-7 space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white font-serif">Welcome User</h2>

            <p className="text-slate-300 leading-relaxed text-sm md:text-base">
              Welcome to <strong>Kkarthikeya Astrological Centre</strong>. I provide personalized Vedic astrology guidance to help people make confident decisions in life through horoscope analysis and Muhurtham consultation.
            </p>

            {/* Philosophy quote callout */}
            <div className="p-6 rounded-2xl border-l-4 border-amber-500 bg-amber-950/10 border-y border-r border-white/5 backdrop-blur-md shadow-inner">
              <div className="text-[10px] uppercase font-bold tracking-widest text-amber-400 mb-2 flex items-center gap-1.5">
                <HeartHandshake className="w-3.5 h-3.5" /> Consultation Philosophy
              </div>
              <p className="text-xs md:text-sm text-slate-200 italic leading-relaxed">
                "I believe astrology helps people gain clarity, confidence, and the right direction in life. My goal is to provide honest and practical guidance based on traditional Vedic astrology principles."
              </p>
            </div>

            {/* Bilingual indicators */}
            <div className="space-y-2">
              <span className="text-[9px] uppercase tracking-widest text-slate-500 font-black">Languages Spoken</span>
              <div className="flex gap-2">
                {["Tamil (தமிழ்)", "English"].map((lang) => (
                  <span
                    key={lang}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-950/20 text-indigo-300 text-xs font-bold"
                  >
                    <Globe className="w-3.5 h-3.5" /> {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 🏆 Experience & Achievements Bento */}
      <section className="py-16 bg-slate-950/20 border-y border-white/5 relative z-10">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-12 gap-10">

          {/* Left Column: Achievements Grid */}
          <div className="md:col-span-6 space-y-6">
            <div>
              <div className="text-xs font-bold tracking-widest uppercase text-amber-400 mb-2">Milestones</div>
              <h3 className="text-xl md:text-2xl font-bold text-white font-serif">Key Professional Achievements</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {achievements.map((ach, idx) => (
                <div key={idx} className="p-4 rounded-2xl border border-white/5 bg-slate-900/30 backdrop-blur-md shadow-inner">
                  <div className="text-amber-400 text-lg font-black font-serif">{ach.value}</div>
                  <div className="text-[10px] text-white font-extrabold uppercase tracking-widest mt-1 leading-snug">{ach.title}</div>
                  <div className="text-[10px] text-slate-400 mt-1 leading-snug">{ach.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Experience Points */}
          <div className="md:col-span-6 space-y-6">
            <div>
              <div className="text-xs font-bold tracking-widest uppercase text-indigo-400 mb-2">Background</div>
              <h3 className="text-xl md:text-2xl font-bold text-white font-serif">Vedic Experience & Format</h3>
            </div>

            <div className="space-y-4">
              {experiences.map((exp, idx) => (
                <div key={idx} className="flex items-start gap-3.5 p-3 rounded-2xl border border-white/5 bg-white/2 hover:border-indigo-500/20 transition-all duration-300">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-300 shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-200 mt-1">Verified Experience</h4>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{exp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 🔮 Expertise Catalog Grid */}
      <section className="py-20 px-6 max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-14">
          <div className="text-xs font-bold tracking-widest uppercase text-amber-400 mb-2">Areas of Expertise</div>
          <h2 className="text-3xl md:text-4xl font-bold text-white font-serif">Astrology Specialization</h2>
          <p className="text-slate-400 text-xs md:text-sm mt-3 max-w-xl mx-auto">
            Authentic calculations based on trusted Vedic astrology principles to bring you clarity in career, finances, marriage, and family life.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {specializations.map((spec, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl border border-white/5 bg-slate-900/10 backdrop-blur-md shadow-inner flex flex-col justify-between hover:border-amber-500/20 hover:bg-slate-900/30 transition-all duration-300"
            >
              <div>
                <div className="w-8 h-8 rounded-xl bg-amber-500/5 border border-amber-500/10 flex items-center justify-center text-amber-400 mb-4">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white font-serif uppercase tracking-widest">{spec.title}</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{spec.category}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 📜 Certificates & Credentials Section */}
      <section className="py-20 bg-transparent border-y border-white/5 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="text-xs font-bold tracking-widest uppercase text-amber-400 mb-2">Credentials</div>
            <h2 className="text-3xl md:text-4xl font-bold text-white font-serif">Board Certifications</h2>
            <p className="text-slate-400 text-xs md:text-sm mt-3 max-w-xl mx-auto">
              Authentic certifications validating traditional Vedic astrology studies, horoscope calculations, and clock-based Prasannam mastery.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            {certificates.map((cert, idx) => (
              <div
                key={idx}
                className="group w-full max-w-sm rounded-3xl border border-white/10 bg-slate-900/20 backdrop-blur-md p-5 shadow-inner hover:border-amber-500/30 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Certificate Image Frame */}
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/5 bg-slate-900/50 p-2 mb-4 flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] transition-shadow">
                    <Image
                      src={cert.src}
                      alt={cert.title}
                      width={384}
                      height={288}
                      className="w-full h-full object-contain group-hover:scale-105 transition-all duration-500"
                    />
                    <button
                      onClick={() => setActiveCert(cert.src)}
                      className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300"
                    >
                      <Eye className="w-4 h-4 text-amber-400" /> View Document
                    </button>
                  </div>
                  <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-100 font-serif leading-snug">{cert.title}</h3>
                  <p className="text-[10px] text-amber-400 uppercase tracking-wider font-bold mt-1.5">{cert.issuer}</p>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{cert.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🖼️ Gallery Section */}
      <section className="py-20 bg-transparent border-t border-white/5 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="text-xs font-bold tracking-widest uppercase text-amber-400 mb-2">Heritage</div>
            <h2 className="text-3xl md:text-4xl font-bold text-white font-serif">Guru Parampara Gallery</h2>
            <p className="text-slate-400 text-xs md:text-sm mt-3 max-w-xl mx-auto">
              Glimpses of sacred initiation and blessings received from the revered lineage.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {gallery.map((item, idx) => (
              <div
                key={idx}
                className="group rounded-3xl border border-white/10 bg-slate-900/20 backdrop-blur-md p-5 shadow-inner hover:border-amber-500/30 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Gallery Image Frame */}
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/5 bg-slate-900/50 p-2 mb-4 flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] transition-shadow">
                    <Image
                      src={item.src}
                      alt={item.title}
                      width={384}
                      height={288}
                      className="w-full h-full object-contain group-hover:scale-105 transition-all duration-500"
                    />
                    <button
                      onClick={() => setActiveCert(item.src)}
                      className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300"
                    >
                      <Eye className="w-4 h-4 text-amber-400" /> View Image
                    </button>
                  </div>
                  <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-100 font-serif leading-snug">{item.title}</h3>
                  <p className="text-[10px] text-amber-400 uppercase tracking-wider font-bold mt-1.5">{item.issuer}</p>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 📬 Contact Section (Merged Page) */}
      <section id="contact" className="py-20 px-6 max-w-6xl mx-auto relative z-10 scroll-mt-24">

        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full border border-amber-500/20 bg-amber-950/20 text-amber-300 text-[9px] uppercase tracking-widest font-black">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Visit Our Office
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white font-serif leading-[1.15] mt-3">
            Contact Our Centre
          </h2>
          <p className="text-xs md:text-sm text-indigo-300 font-bold uppercase tracking-widest mt-2">
            Connect with Astrologer Kkarthikeya online or visit Chennai Office
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Side: Contact Info & Map */}
          <div className="lg:col-span-5 space-y-6">

            {/* Direct Coordinate Channels Card */}
            <div className="rounded-[2rem] border border-white/10 bg-slate-900/35 backdrop-blur-2xl p-6 shadow-antigravity space-y-6">
              <h3 className="text-sm font-black tracking-widest text-white font-serif uppercase border-b border-white/5 pb-3">
                Direct Uplinks
              </h3>

              <div className="space-y-4.5 text-xs text-slate-300 font-medium">
                {/* WhatsApp Button */}
                <a
                  href="https://wa.me/917845369302?text=Hello%20Kkarthikeya%20Astrological%20Centre%2C%20I%20have%20a%20consultation%20query."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-3 rounded-2xl border border-emerald-500/20 bg-emerald-950/15 hover:bg-emerald-950/30 text-emerald-300 transition-all duration-300 active:scale-95 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[8px] uppercase tracking-widest text-emerald-500 font-black block">Fastest Response</span>
                    <span className="font-bold text-sm">Consult on WhatsApp</span>
                  </div>
                </a>

                {/* Phone Line */}
                <a
                  href="tel:+917845369302"
                  className="flex items-center gap-4 p-3 rounded-2xl border border-white/5 bg-white/2 hover:border-amber-500/20 transition-all duration-300 active:scale-95 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[8px] uppercase tracking-widest text-slate-500 font-bold block">Mobile Line</span>
                    <span className="font-bold text-sm text-slate-100">+91 78453 69302</span>
                  </div>
                </a>

                {/* Email Box */}
                <a
                  href="mailto:kkarthikeyaastro@gmail.com"
                  className="flex items-center gap-4 p-3 rounded-2xl border border-white/5 bg-white/2 hover:border-indigo-500/20 transition-all duration-300 active:scale-95 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[8px] uppercase tracking-widest text-slate-500 font-bold block">Stellar Mail</span>
                    <span className="font-bold text-sm text-slate-100">kkarthikeyaastro@gmail.com</span>
                  </div>
                </a>

                {/* Location pin */}
                <div className="flex items-center gap-4 p-3 rounded-2xl border border-white/5 bg-white/2">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[8px] uppercase tracking-widest text-slate-500 font-bold block">Office Address</span>
                    <span className="font-bold text-xs text-slate-100 leading-normal">
                      5/121A, GST Rd, near Sri Nidhi mahal, Viniyambakkam, Singaperumal Koil, Tamil Nadu 603204
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Google Map Panel */}
            <div className="rounded-[2rem] border border-white/10 bg-slate-900/35 backdrop-blur-2xl p-4.5 shadow-antigravity space-y-3 overflow-hidden">
              <div className="flex items-center justify-between px-1">
                <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-amber-500" /> Google Map Location
                </span>
                <span className="text-[8px] py-0.5 px-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-300 font-extrabold uppercase">Singaperumal Koil</span>
              </div>

              <div className="relative w-full aspect-square rounded-2xl overflow-hidden border border-white/10 bg-slate-950">
                <iframe
                  src={mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) brightness(0.9) contrast(1.2)" }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Kkarthikeya Astrological Centre Chennai Office Location"
                />
              </div>
            </div>

          </div>

          {/* Right Side: Cosmic Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="rounded-[2rem] border border-white/10 bg-slate-900/35 backdrop-blur-2xl p-6 md:p-8 shadow-antigravity">

              <AnimatePresence mode="wait">
                {!isSent ? (
                  <motion.div
                    key="contact-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <div className="border-b border-white/5 pb-4">
                      <h3 className="text-lg font-bold font-serif text-white uppercase tracking-widest">
                        {tText("Consultation Inquiry Form", "தகவல் கோரிக்கை படிவம்")}
                      </h3>
                      <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">
                        {tText("Send your message to our centre. We will get back to you within 24 hours.", "உங்கள் கேள்விகளை அனுப்புங்கள். 24 மணி நேரத்திற்குள் பதிலளிக்கப்படும்.")}
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest font-black text-slate-400">
                          {tText("Full Name", "முழு பெயர்")}
                        </label>
                        <input
                          type="text"
                          placeholder="Eg: Ramesh Kumar"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-xs text-white placeholder-slate-600 outline-none focus:border-indigo-500/50 transition-all shadow-inner"
                          required
                        />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase tracking-widest font-black text-slate-400">
                            {tText("Email Address", "மின்னஞ்சல் முகவரி")}
                          </label>
                          <input
                            type="email"
                            placeholder="Eg: ramesh@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-xs text-white placeholder-slate-600 outline-none focus:border-indigo-500/50 transition-all shadow-inner"
                            required
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase tracking-widest font-black text-slate-400">
                            {tText("Phone Number", "தொலைபேசி எண்")}
                          </label>
                          <input
                            type="tel"
                            placeholder="Eg: +91 98765 43210"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-xs text-white placeholder-slate-600 outline-none focus:border-indigo-500/50 transition-all shadow-inner"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest font-black text-amber-300">
                          {tText("Subject of Consultation", "ஆலோசனையின் தலைப்பு")}
                        </label>
                        <select
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          className="w-full bg-slate-950/80 border border-white/10 rounded-2xl py-3 px-4 text-xs text-white outline-none focus:border-amber-500/50 transition-all font-serif"
                        >
                          <option value="General Query">General Horoscope / Remedial Query</option>
                          <option value="Marriage Match">Marriage Compatibility (Porutham Check)</option>
                          <option value="Muhurtham Request">Muhurtham & Auspicious Timing Timing</option>
                          <option value="Custom Event">Custom / Business Corporate Consultations</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest font-black text-slate-400">
                          {tText("Detailed Query (Include DOB/TOB/POB if possible)", "கேள்வி விவரங்கள் (பிறந்த தேதி, நேரம், ஊர் குறிப்பிடவும்)")}
                        </label>
                        <textarea
                          rows={4}
                          placeholder="Please details your question, date of birth, time of birth and location of birth for specific guidance..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-xs text-white placeholder-slate-600 outline-none focus:border-indigo-500/50 transition-all shadow-inner resize-none"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white text-xs font-bold uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2 border border-indigo-400/20 shadow-glow"
                      >
                        {isSubmitting ? (
                          <>
                            <Orbit className="w-4 h-4 animate-spin" />
                            {tText("Sending Message...", "அனுப்பப்படுகிறது...")}
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            {tText("Send Message", "செய்தி அனுப்புக")}
                          </>
                        )}
                      </button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success-screen"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-12 text-center space-y-5"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-glow animate-pulse">
                      <CheckCircle className="w-8 h-8" />
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xl font-bold font-serif text-white uppercase tracking-widest">
                        Transmission Successful!
                      </h3>
                      <span className="text-[9px] uppercase tracking-widest text-emerald-400 font-extrabold bg-emerald-500/10 border border-emerald-500/20 py-0.5 px-3 rounded-full">
                        Message Sent Successfully
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
                      Namaste. Your message has been successfully received. Astrologer Kkarthikeya will review your details and get back to you within 24 hours.
                    </p>

                    <button
                      onClick={() => setIsSent(false)}
                      className="py-2.5 px-6 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-[9px] uppercase tracking-widest font-black text-slate-300 hover:text-white transition-all active:scale-95"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>
        </div>

      </section>

      {/* 🔬 Interactive Image Lightbox Modal */}
      <AnimatePresence>
        {activeCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4"
            onClick={() => setActiveCert(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-3xl w-full aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 bg-slate-900 p-2 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={activeCert}
                alt="Certificate Document Detail"
                fill
                sizes="(max-width: 768px) 100vw, 80vw"
                className="w-full h-full object-contain rounded-2xl"
              />
              <button
                onClick={() => setActiveCert(null)}
                className="absolute top-4 right-4 p-2 rounded-full border border-white/10 bg-slate-950/80 text-slate-300 hover:text-white active:scale-90 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
