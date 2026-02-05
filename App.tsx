import React, { useEffect, useState, useRef } from 'react';
import { 
  Menu, X, Sun, Moon, Music, Pause, ArrowUp, 
  Github, Youtube, Facebook, Send, ExternalLink, Settings, Check, Play, Quote, Terminal
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Swiper from 'swiper';
import { Autoplay, EffectCoverflow } from 'swiper/modules';

import Preloader from './components/Preloader';
import CustomCursor from './components/CustomCursor';
import { UserData } from './types';

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger);

type ThemeColor = 'green' | 'blue' | 'purple' | 'orange' | 'cyan';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeColor, setActiveColor] = useState<ThemeColor>('green');
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // --- Dynamic Content Configuration ---
  
  // ✨ GALLERY MANAGER ✨
  // Simply Add, Remove, or Replace URLs in this array to update the gallery.
  const galleryImages = [
    "https://raw.githubusercontent.com/jubairbro/Faw/refs/heads/main/photos/IMG_20250822_001904_975.jpg",
    "https://raw.githubusercontent.com/jubairbro/Faw/refs/heads/main/photos/1735204262659.jpg",
    "https://raw.githubusercontent.com/jubairbro/Faw/refs/heads/main/photos/satoru-gojo-jujutsu-5120x2880-10828.png",
    "https://raw.githubusercontent.com/jubairbro/Faw/refs/heads/main/photos/IMG_20251001_161822_246.jpg"
  ];

  const quotes = [
    { text: "Knowledge is the life of the mind.", author: "Hazrat Ali (RA)" },
    { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
    { text: "Code is like humor. When you have to explain it, it’s bad.", author: "Cory House" }
  ];

  const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#links", label: "Links" },
    { href: "#gallery", label: "Gallery" },
    { href: "#contact", label: "Contact" },
  ];

  const themes: { id: ThemeColor; color: string }[] = [
    { id: 'green', color: '#27ae60' },
    { id: 'blue', color: '#3b82f6' },
    { id: 'purple', color: '#8b5cf6' },
    { id: 'orange', color: '#f97316' },
    { id: 'cyan', color: '#06b6d4' },
  ];

  // --- Initialization Logic ---
  useEffect(() => {
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('themeMode');
    
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      setIsDarkMode(systemPrefersDark);
    }
    
    const savedColor = localStorage.getItem('colorTheme') as ThemeColor;
    if (savedColor) {
      setActiveColor(savedColor);
    }
  }, []);

  // --- Theme Application ---
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('themeMode', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('themeMode', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const root = document.documentElement;
    let colorValue = '39 174 96'; // Green default

    if (activeColor === 'blue') colorValue = '59 130 246';
    if (activeColor === 'purple') colorValue = '139 92 246';
    if (activeColor === 'orange') colorValue = '249 115 22';
    if (activeColor === 'cyan') colorValue = '6 182 212';

    root.style.setProperty('--color-primary', colorValue);
    localStorage.setItem('colorTheme', activeColor);
  }, [activeColor]);

  // --- Menu Scroll Lock ---
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'; // Completely lock scroll
    } else {
      document.body.style.overflow = ''; // Restore scroll
    }
  }, [isMenuOpen]);

  // --- Audio Logic ---
  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Audio play failed", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  // --- Animations & Swiper ---
  useEffect(() => {
    if (loading) return;

    // Initialize Swiper
    new Swiper('.mySwiper', {
      modules: [EffectCoverflow, Autoplay],
      effect: 'coverflow',
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: 'auto',
      loop: true,
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
      coverflowEffect: {
        rotate: 30,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true,
      },
    });

    // GSAP Animations for Main Content
    const ctx = gsap.context(() => {
      // Speech Bubble Pop
      gsap.fromTo('.speech-bubble', 
        { scale: 0, opacity: 0, transformOrigin: "bottom left" },
        { scale: 1, opacity: 1, duration: 0.5, delay: 1, ease: "back.out(1.7)" }
      );

      // Reveal General Sections
      gsap.utils.toArray('.reveal').forEach((elem: any) => {
        gsap.from(elem, {
          y: 50,
          opacity: 0,
          duration: 1.0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: elem,
            start: 'top 85%',
          },
        });
      });

      // Special Animation for Links (Side In)
      gsap.utils.toArray('.link-card').forEach((card: any, i) => {
        gsap.from(card, {
          x: i % 2 === 0 ? -80 : 80, // Alternating sides, reduced distance for performance
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 90%',
          }
        });
      });

    }, mainRef);

    return () => ctx.revert();
  }, [loading]);

  // --- Menu Animation ---
  useEffect(() => {
    if (isMenuOpen && menuRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo('.menu-item', 
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "power2.out" }
        );
        gsap.fromTo('.menu-widget',
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, delay: 0.2, ease: "power2.out" }
        );
      }, menuRef);
      return () => ctx.revert();
    }
  }, [isMenuOpen]);

  const getCurrentYear = () => new Date().getFullYear();

  return (
    <>
      <audio ref={audioRef} loop src="https://github.com/jubairbro/Faw/raw/refs/heads/main/audio.mp3" />
      
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      
      {!loading && (
        <div ref={mainRef} className={`min-h-screen transition-colors duration-500 bg-gray-50 dark:bg-dark text-slate-800 dark:text-slate-200 cursor-none md:cursor-auto`}>
          <CustomCursor />

          {/* Clean Navbar - Reduced padding on mobile (py-2 px-4) for a slimmer look */}
          <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 py-2 md:py-5 md:px-12 backdrop-blur-xl bg-white/70 dark:bg-dark/70 border-b border-gray-200/50 dark:border-white/5 transition-all duration-300">
            <a href="#home" className="text-xl md:text-2xl font-bold font-serif tracking-tight z-50 interactive group relative">
              Jubair<span className="text-primary group-hover:text-primary transition-colors duration-300">.</span>
            </a>
            
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="z-50 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors interactive active:scale-95 duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </nav>

          {/* Full Screen Menu Overlay */}
          <div ref={menuRef} className={`fixed inset-0 z-40 bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-3xl transition-all duration-500 flex flex-col items-center justify-center ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
            
            <div className="flex flex-col items-center gap-5 mb-10 overflow-y-auto max-h-[50vh] w-full px-4">
              {navLinks.map((link) => (
                <a 
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="menu-item text-4xl md:text-5xl font-serif font-bold text-gray-800 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-all duration-300 interactive hover:tracking-wide p-2"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Redesigned Control Center - Slimmer on Mobile */}
            <div className="menu-widget w-full max-w-sm px-6">
              <div className="bg-gray-100/50 dark:bg-white/5 border border-white/20 backdrop-blur-md p-3 md:p-5 rounded-2xl md:rounded-3xl shadow-2xl">
                <div className="flex flex-col gap-3 md:gap-5">
                  
                  {/* Quran Player */}
                  <div className="flex items-center justify-between bg-white dark:bg-black/40 p-3 md:p-4 rounded-xl md:rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm">
                     <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-colors ${isPlaying ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                           <Music size={18} className={isPlaying ? 'animate-spin-slow' : ''} />
                        </div>
                        <div>
                           <p className="text-sm font-bold font-sans">Quran Recitation</p>
                           <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400">Peace of Mind</p>
                        </div>
                     </div>
                     
                     <div className="flex items-center gap-3">
                        {/* Visualizer */}
                        <div className="flex items-end gap-[2px] h-3 md:h-4">
                          {[1, 2, 3, 4].map((bar) => (
                            <div 
                              key={bar} 
                              className={`w-1 bg-primary rounded-t-sm transition-all duration-300 ${isPlaying ? 'animate-music-bar' : 'h-1'}`}
                              style={{ animationDelay: `${bar * 0.1}s` }}
                            ></div>
                          ))}
                        </div>
                        
                        <button 
                          onClick={toggleMusic}
                          className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-primary hover:text-white transition-all interactive active:scale-90"
                        >
                           {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-1" />}
                        </button>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 md:gap-4">
                    {/* Theme Switcher */}
                    <div className="bg-white dark:bg-black/40 p-3 md:p-4 rounded-xl md:rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm flex flex-col items-center justify-center gap-2 md:gap-3">
                       <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wider text-gray-400">Mode</span>
                       <button 
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className="relative w-full h-8 md:h-10 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden interactive group"
                       >
                          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${isDarkMode ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
                             <Sun className="text-orange-500 mr-2" size={16} /> <span className="font-bold text-xs font-sans">Light</span>
                          </div>
                          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${isDarkMode ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                             <Moon className="text-blue-400 mr-2" size={16} /> <span className="font-bold text-xs font-sans">Dark</span>
                          </div>
                       </button>
                    </div>

                    {/* Color Switcher */}
                    <div className="bg-white dark:bg-black/40 p-3 md:p-4 rounded-xl md:rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm flex flex-col items-center justify-center gap-2 md:gap-3 col-span-1">
                       <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wider text-gray-400">Color</span>
                       <div className="flex flex-wrap justify-center gap-2">
                        {themes.map((theme) => (
                          <button
                            key={theme.id}
                            onClick={() => setActiveColor(theme.id)}
                            className={`w-5 h-5 md:w-6 md:h-6 rounded-full transition-all interactive flex items-center justify-center ${activeColor === theme.id ? 'scale-110 shadow-lg ring-2 ring-offset-2 ring-offset-gray-100 dark:ring-offset-gray-800' : 'opacity-60 hover:opacity-100'}`}
                            style={{ 
                              backgroundColor: theme.color,
                            }}
                          >
                            {activeColor === theme.id && <Check size={10} className="text-white" strokeWidth={4} />}
                          </button>
                        ))}
                       </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

          <main className="container mx-auto px-6 pt-24">
            
            {/* Hero Section */}
            <section id="home" className="min-h-[90dvh] flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 relative pb-10">
              {/* Background Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-primary/10 rounded-full blur-[80px] md:blur-[120px] -z-10 animate-pulse"></div>

              {/* Profile Image & Bubble */}
              <div className="relative group z-10 perspective-1000 mt-4 md:mt-0">
                 {/* Animated Blob Background */}
                <div className="absolute top-0 -left-4 w-60 h-60 md:w-80 md:h-80 bg-gradient-to-tr from-primary to-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob dark:mix-blend-normal dark:opacity-40"></div>
                <div className="absolute top-0 -right-4 w-60 h-60 md:w-80 md:h-80 bg-gradient-to-tr from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000 dark:mix-blend-normal dark:opacity-40"></div>
                
                <div className="relative w-56 h-56 md:w-80 md:h-80 rounded-full border-4 border-white/30 dark:border-white/10 backdrop-blur-sm overflow-hidden shadow-2xl transition-transform duration-500 group-hover:rotate-y-6 group-hover:rotate-x-6 transform-style-3d">
                  <img 
                    src="https://raw.githubusercontent.com/jubairbro/Faw/refs/heads/main/photos/IMG_20250822_001904_975.jpg" 
                    alt="Jubair Ahmad" 
                    className="w-full h-full object-cover" 
                  />
                </div>

                {/* Speech Bubble (SVG Tail for smoother look) */}
                <div className="speech-bubble absolute -top-8 -right-4 md:-top-10 md:-right-10 bg-white dark:bg-card-dark shadow-xl border border-gray-100 dark:border-gray-700 px-5 py-3 rounded-2xl rounded-bl-none z-20 animate-float">
                  <p className="font-serif text-primary font-bold text-xl md:text-2xl leading-none">السلام عليكم</p>
                  {/* Tail handled by CSS Class to look organic */}
                  <svg className="absolute bottom-[-14px] left-0 w-6 h-6 text-white dark:text-card-dark fill-current transform scale-x-[-1]" viewBox="0 0 100 100">
                      <path d="M0,0 L100,0 L0,100 Z" />
                  </svg>
                </div>
              </div>

              {/* Text Content */}
              <div className="text-center md:text-left z-10 max-w-xl px-2">
                <div className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] md:text-xs font-bold mb-4 tracking-wider uppercase animate-pop-in font-sans">
                  Tech Enthusiast
                </div>
                {/* Changed: Removed 'block' class from spans so name stays on one line */}
                <h1 className="text-4xl md:text-7xl font-serif font-bold mb-4 leading-tight">
                  <span className="inline-block text-slate-900 dark:text-white hover:text-primary transition-colors duration-300 mr-2 md:mr-4">Jubair</span>
                  <span className="inline-block text-slate-500 dark:text-slate-400">Ahmad</span>
                </h1>
                <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed font-sans">
                  Exploring the digital frontier, building communities, and sharing knowledge one line of code at a time.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                   <a href="#contact" className="bg-primary text-white px-8 py-3 rounded-full font-sans font-medium tracking-wide shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 transition-all interactive active:scale-95">
                     Say Hello
                   </a>
                   <a href="#about" className="border border-gray-300 dark:border-gray-600 px-8 py-3 rounded-full font-sans font-medium tracking-wide hover:bg-gray-100 dark:hover:bg-white/5 transition-all interactive active:scale-95">
                     About Me
                   </a>
                </div>
              </div>
            </section>

            {/* Quotes Section (Visible on PC mostly) */}
            <section className="hidden md:block py-12 reveal">
              <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                {quotes.map((q, i) => (
                  <div key={i} className="bg-white/50 dark:bg-white/5 p-6 rounded-xl border border-gray-200 dark:border-white/5 hover:border-primary/30 transition-all hover:-translate-y-1">
                    <Quote className="text-primary opacity-50 mb-3" size={24} />
                    <p className="font-serif italic text-lg mb-4">"{q.text}"</p>
                    <p className="text-sm font-bold text-gray-500 dark:text-gray-400 font-sans">- {q.author}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* About / Terminal Section */}
            <section id="about" className="py-24 reveal">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-16 flex items-center justify-center gap-4">
                  <span className="w-8 md:w-12 h-[2px] bg-primary/50"></span>
                  Who Am I?
                  <span className="w-8 md:w-12 h-[2px] bg-primary/50"></span>
                </h2>

                {/* New Beautiful Terminal */}
                <div className="bg-[#1e1e1e] rounded-xl overflow-hidden shadow-2xl border border-gray-800 transform hover:scale-[1.01] transition-transform duration-500 group mx-2 md:mx-0">
                  {/* Terminal Header */}
                  <div className="bg-[#2d2d2d] px-4 py-3 flex items-center justify-between border-b border-gray-700">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#ff5f56] hover:bg-[#ff5f56]/80 transition-colors"></div>
                      <div className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:bg-[#ffbd2e]/80 transition-colors"></div>
                      <div className="w-3 h-3 rounded-full bg-[#27c93f] hover:bg-[#27c93f]/80 transition-colors"></div>
                    </div>
                    <div className="text-gray-400 text-xs font-mono flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                      <Terminal size={10} />
                      <span>jubair_config.json</span>
                    </div>
                    <div className="w-10"></div> {/* Spacer for center alignment */}
                  </div>
                  
                  {/* Terminal Content */}
                  <div className="p-4 md:p-8 overflow-x-auto custom-scrollbar bg-[#1e1e1e]/95 backdrop-blur">
                    <pre className="font-mono text-xs md:text-base leading-relaxed">
                      <span className="text-purple-400">const</span> <span className="text-yellow-400">jubair</span> <span className="text-white">=</span> <span className="text-gray-300">{`{`}</span>
                      {'\n'}  <span className="text-sky-400">name</span>: <span className="text-green-400">"Jubair Ahmad"</span>,
                      {'\n'}  <span className="text-sky-400">rank</span>: <span className="text-orange-400">"Leader of Noobs"</span>,
                      {'\n'}  <span className="text-sky-400">status</span>: <span className="text-red-400">"404: Potential Not Found"</span>,
                      {'\n'}  <span className="text-sky-400">note</span>: <span className="text-yellow-300">"I am nothing. Just a background process."</span>,
                      {'\n'}  <span className="text-sky-400">interests</span>: <span className="text-gray-300">[</span>
                      {'\n'}    <span className="text-green-400">"Coding"</span>, <span className="text-green-400">"Gaming"</span>, <span className="text-green-400">"Photography"</span>
                      {'\n'}  <span className="text-gray-300">]</span>
                      {'\n'}<span className="text-gray-300">{`}`}</span>;
                    </pre>
                  </div>
                </div>
              </div>
            </section>

            {/* Links Section */}
            <section id="links" className="py-24 overflow-hidden">
              <div className="text-center mb-16 reveal">
                 <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Connect With Me</h2>
                 <p className="text-gray-500 font-sans">Find me on these platforms</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto px-4">
                {[
                  { icon: <Send />, title: "Telegram Channel", desc: "Tech updates & mods", url: "https://t.me/+1p9RnexGMP0yOGVl" },
                  { icon: <Send />, title: "Personal Channel", desc: "My random thoughts", url: "https://t.me/JubairSensei" },
                  { icon: <Github />, title: "GitHub", desc: "Open source contributions", url: "https://github.com/jubairbro" },
                  { icon: <Youtube />, title: "YouTube", desc: "Tutorials & Reviews", url: "https://youtube.com/@jubairsensei" },
                  { icon: <Facebook />, title: "Facebook", desc: "Social updates", url: "https://fb.com/jubair.py" },
                ].map((link, idx) => (
                  <a 
                    key={idx} 
                    href={link.url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="link-card group bg-white dark:bg-card-dark border border-gray-200 dark:border-white/5 p-5 rounded-2xl flex items-center gap-5 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 interactive"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300 shadow-inner shrink-0">
                      {link.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg group-hover:text-primary transition-colors truncate font-sans">{link.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate font-sans">{link.desc}</p>
                    </div>
                    <ExternalLink className="text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" size={18} />
                  </a>
                ))}
              </div>
            </section>

            {/* Gallery Section */}
            <section id="gallery" className="pt-12 pb-4 reveal border-t border-gray-100 dark:border-white/5">
               <h2 className="text-3xl md:text-4xl font-serif font-bold mb-8 text-center">Visual Journey</h2>
               <div className="swiper mySwiper w-full py-8">
                <div className="swiper-wrapper">
                  {galleryImages.map((img, idx) => (
                    <div key={idx} className="swiper-slide rounded-2xl overflow-hidden shadow-2xl border-[4px] border-white dark:border-gray-800 interactive transform hover:scale-105 transition-transform duration-500 group">
                      <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                         <p className="text-white font-serif tracking-widest uppercase border border-white/50 px-4 py-1 rounded-full backdrop-blur-sm">View</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="pt-4 pb-20 text-center reveal px-4">
               <div className="bg-gradient-to-br from-primary/5 to-transparent dark:from-white/5 dark:to-transparent rounded-3xl p-8 md:p-12 max-w-4xl mx-auto border border-primary/10 backdrop-blur-sm">
                 <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Get In Touch</h2>
                 <p className="text-gray-500 mb-10 text-lg font-sans">Have a project in mind or just want to chat?</p>
                 
                 <div className="flex flex-wrap justify-center gap-8">
                    <a href="https://t.me/JubairZ" className="flex items-center gap-3 bg-white dark:bg-card-dark px-8 py-4 rounded-xl shadow-lg hover:shadow-2xl hover:text-primary hover:-translate-y-1 transition-all interactive group w-full md:w-auto justify-center font-sans font-medium tracking-wide">
                      <Send className="text-blue-500 group-hover:rotate-12 transition-transform" />
                      <span className="font-semibold text-lg">@JubairZ</span>
                    </a>
                 </div>
               </div>
            </section>

          </main>

          {/* Footer */}
          <footer className="text-center py-8 text-gray-500 text-sm border-t border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-dark mt-0 font-sans">
            <p className="font-mono flex items-center justify-center gap-2">
              <span>&copy; {getCurrentYear()} Jubair Ahmad.</span>
            </p>
            <p className="text-xs mt-2 opacity-50 flex items-center justify-center gap-1">
              Made with <span className="text-red-500 animate-pulse">❤️</span>
            </p>
          </footer>

          {/* Back to Top */}
          <a 
            href="#home" 
            className="fixed bottom-6 right-6 w-12 h-12 bg-white/80 dark:bg-card-dark/80 backdrop-blur border border-gray-200 dark:border-white/10 rounded-full flex items-center justify-center text-primary shadow-lg hover:-translate-y-1 hover:shadow-primary/20 transition-all z-30 interactive"
          >
            <ArrowUp size={20} />
          </a>
        </div>
      )}
    </>
  );
};

export default App;