import React from 'react';
import { motion } from 'motion/react';
import { 
  Sun, Shield, Video, Calculator as CalcIcon, 
  ArrowUpRight, Wrench, Sparkles, ShieldCheck, 
  Tv, Zap, HandCoins, ChevronRight
} from 'lucide-react';
import CompanyLogo from './CompanyLogo';

interface LandingPageProps {
  onGetStarted: () => void;
  onLoginClick: () => void;
  onSignUpClick: () => void;
  isDarkMode: boolean;
}

// Global ScrollReveal utility for pop up motion effect as users scroll through
export function ScrollReveal({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 35, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function SeaflowsLandingPage({
  onGetStarted,
  onLoginClick,
  onSignUpClick,
  isDarkMode
}: LandingPageProps) {

  const scrollToFeatures = () => {
    const el = document.getElementById('features-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      onGetStarted();
    }
  };

  return (
    <div className="flex flex-col gap-16 text-left selection:bg-[#FDB813] selection:text-[#0A2342]" id="landing-page">
      
      {/* BACKGROUND FLOATING GLOW BLOBS */}
      <div className="absolute top-[8%] left-[5%] w-72 h-72 rounded-full bg-gradient-to-tr from-[#FDB813]/4 to-transparent blur-3xl pointer-events-none animate-premium-float" />
      <div className="absolute top-[40%] right-[5%] w-96 h-96 rounded-full bg-gradient-to-br from-[#0A2342]/6 to-transparent blur-3xl pointer-events-none animate-premium-float-sec" />

      {/* 1. DEDICATED LANDING NAVIGATION BAR */}
      <ScrollReveal>
        <div className="w-full bg-[#040916]/50 border border-gray-850/80 rounded-2xl px-6 py-4 flex justify-between items-center backdrop-blur-md backdrop-filter shadow-sm">
          <div className="flex items-center gap-2">
            <CompanyLogo />
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={scrollToFeatures}
              className="hidden sm:inline-flex text-[11px] font-bold uppercase tracking-wider text-gray-400 hover:text-[#FDB813] px-3 py-1.5 transition-colors cursor-pointer"
            >
              Features
            </button>
            
            <button
              onClick={scrollToFeatures}
              className="bg-transparent text-gray-200 border border-gray-800 hover:border-gray-600 hover:bg-gray-900/10 px-4 py-2 rounded-xl text-xs font-bold tracking-widest uppercase transition-colors cursor-pointer"
            >
              Get Started
            </button>
            
            <button
              onClick={onLoginClick}
              className="bg-[#0A2342] hover:bg-[#123661] text-white border border-[#0A2342] px-4.5 py-2 rounded-xl text-xs font-bold tracking-widest uppercase transition-all cursor-pointer"
            >
              Login
            </button>

            <button
              onClick={onSignUpClick}
              className="bg-[#FDB813] hover:bg-amber-400 text-[#0A2342] px-4.5 py-2 rounded-xl text-xs font-heading font-extrabold tracking-widest uppercase transition-all cursor-pointer shadow-md shadow-amber-500/10"
            >
              Sign Up
            </button>
          </div>
        </div>
      </ScrollReveal>

      {/* 2. HERO PRESENTATION GRAPHICS */}
      <ScrollReveal>
        <div className="relative bg-gradient-to-br from-[#0c182f] to-[#040e1b] rounded-2.5xl p-6 sm:p-12 border border-gray-800 flex flex-col lg:flex-row justify-between items-center gap-10 overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[#FDB813]/2 opacity-50 pointer-events-none" />
          
          <div className="max-w-2xl flex flex-col gap-5 z-10 relative">
            <span className="text-[#FDB813] text-xs font-mono font-extrabold tracking-widest bg-amber-950/40 border border-amber-900/30 px-3.5 py-1 w-fit rounded-full uppercase">
              Excellent Connections, Better Value
            </span>
            
            <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-white leading-tight tracking-tight">
              High-Grade Solar Networks & AI CCTV Surveillance Systems
            </h1>
            
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-lg font-sans">
              Seaflows Technologies delivers certified solar backup microgrids, pure sine wave power inverters, and high-sec PTZ thermal recorders designed for commercial and private complexes throughout Nigeria.
            </p>

            <div className="flex flex-wrap gap-3.5 mt-2">
              <button
                onClick={onSignUpClick}
                className="bg-[#FDB813] text-[#0A2342] hover:bg-amber-400 font-heading font-extrabold px-6 py-3 rounded-xl text-xs tracking-wider uppercase transition-all duration-300 flex items-center gap-1.5 shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 cursor-pointer"
              >
                Configure Solar System <ArrowUpRight size={14} />
              </button>
              <button
                onClick={scrollToFeatures}
                className="bg-transparent text-white border border-gray-700 hover:border-gray-500 hover:bg-gray-900/30 font-bold px-6 py-3 rounded-xl text-xs tracking-wider uppercase transition-colors cursor-pointer"
              >
                Explore Solutions Overview
              </button>
            </div>
          </div>

          {/* Floating metrics grid on the right of the hero */}
          <div className="grid grid-cols-2 gap-4 w-full lg:w-fit shrink-0 font-sans z-10 relative">
            <div className="p-4 bg-[#030913]/90 border border-gray-850 rounded-xl max-w-[160px] card-premium-interactive">
              <span className="text-[#FDB813] text-2xl font-heading font-extrabold block">280+</span>
              <span className="text-gray-500 text-[10px] uppercase font-bold tracking-wider leading-none">Microgrids Deployed</span>
            </div>
            <div className="p-4 bg-[#030913]/90 border border-gray-850 rounded-xl max-w-[160px] card-premium-interactive">
              <span className="text-[#FDB813] text-2xl font-heading font-extrabold block">1,200+</span>
              <span className="text-gray-500 text-[10px] uppercase font-bold tracking-wider leading-none">CCTV Mounts Active</span>
            </div>
            <div className="p-4 bg-[#030913]/90 border border-gray-850 rounded-xl max-w-[160px] card-premium-interactive">
              <span className="text-[#FDB813] text-2xl font-heading font-extrabold block">100%</span>
              <span className="text-gray-500 text-[10px] uppercase font-bold tracking-wider leading-none">PSW Pure Stability</span>
            </div>
            <div className="p-4 bg-[#030913]/90 border border-gray-850 rounded-xl max-w-[160px] card-premium-interactive">
              <span className="text-[#FDB813] text-2xl font-heading font-extrabold block">Naira</span>
              <span className="text-gray-500 text-[10px] uppercase font-bold tracking-wider leading-none">Zero Fuel Surcharges</span>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* 3. FEATURES SECTION */}
      <div id="features-section" className="flex flex-col gap-8 scroll-mt-20">
        <ScrollReveal>
          <div className="text-center md:text-left">
            <span className="text-xs uppercase font-mono font-extrabold tracking-widest text-[#FDB813] block mb-1">
              Engineered Core Strengths
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
              Uncompromised Quality Designed For Clean Energy Independence
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm mt-2 max-w-2xl">
              We bypass local grid instabilities and brownouts by supplying premium, highly durable components that run silent, secure, and automatic.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <ScrollReveal>
            <div className="card-premium-interactive bg-[#030913] border border-gray-850 rounded-2xl p-6 flex flex-col gap-4 h-full">
              <div className="p-3 bg-blue-950/40 text-[#FDB813] w-fit rounded-xl border border-blue-900/30">
                <Sun size={24} />
              </div>
              <h3 className="text-base font-heading font-extrabold text-white">Advanced Hybrid Solar</h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                Monocrystalline half-cell panels backed by premium grade Lithium iron phosphate (LiFePO4) storage options for true 6,000+ cycle life endurance.
              </p>
              <ul className="text-xs text-gray-500 space-y-1.5 mt-2">
                <li className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-emerald-400" /> High conversion efficiency panels</li>
                <li className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-emerald-400" /> Hybrid sine wave stabilizers</li>
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="card-premium-interactive bg-[#030913] border border-gray-850 rounded-2xl p-6 flex flex-col gap-4 h-full">
              <div className="p-3 bg-blue-950/40 text-[#FDB813] w-fit rounded-xl border border-blue-900/30">
                <Video size={24} />
              </div>
              <h3 className="text-base font-heading font-extrabold text-white">Intel CCTV Surveillance</h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                Full 4K Ultra-HD bullet cameras styled with starlight IR registers and IP67 weather shielding to operate flawlessly during harsh regional storms.
              </p>
              <ul className="text-xs text-gray-500 space-y-1.5 mt-2">
                <li className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-emerald-400" /> AI motion & human tracking</li>
                <li className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-emerald-400" /> Real-time cloud recording</li>
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="card-premium-interactive bg-[#030913] border border-gray-850 rounded-2xl p-6 flex flex-col gap-4 h-full">
              <div className="p-3 bg-blue-950/40 text-[#FDB813] w-fit rounded-xl border border-blue-900/30">
                <HandCoins size={24} />
              </div>
              <h3 className="text-base font-heading font-extrabold text-white">Flexible Installment Options</h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                Equip your property now with a minimal down-payment, then spread remaining costs over convenient 3, 6, or 12 month terms with 0% hidden surcharges.
              </p>
              <ul className="text-xs text-gray-500 space-y-1.5 mt-2">
                <li className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-emerald-400" /> Rapid financing approval</li>
                <li className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-emerald-400" /> Fully transparent billing logs</li>
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* 4. REAL-TIME GROUNDING ACCENT CARD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <ScrollReveal>
            <div className="card-premium-interactive bg-[#030913] border border-gray-850 rounded-2xl p-6 flex flex-col justify-between gap-6 h-full">
              <div>
                <span className="text-[#FDB813] font-mono text-[10px] font-bold tracking-widest block mb-1">CCTV & SOLAR STABILITY ADVANTAGE</span>
                <h3 className="text-base font-heading font-extrabold text-white mb-2">Why Premium African Complexes Prefer Seaflows Connections</h3>
                <p className="text-gray-400 text-xs leading-relaxed font-sans text-justify">
                  Modern grid instability across West African cities exacts heavy tolls on electronic business nodes and private residences. High-power diesel fuel generators emit noxious smoke while standard low-budget voltage setups cause frequent brownouts. Seaflows Technologies delivers uncompromised Pure Sine Wave technology and starlight-enabled IP67 hardware arrays to transition properties into secure, clean, and self-sufficient zones.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-gray-905 pt-4">
                <div className="p-3 bg-[#0a1120] rounded-xl border border-gray-900 text-center hover:scale-105 transition-transform duration-200 cursor-pointer">
                  <span className="text-white font-mono font-bold block">15 Mins Response</span>
                  <span className="text-gray-500 text-[9px] uppercase tracking-wider block mt-0.5">SUPPORT TICKETING</span>
                </div>
                <div className="p-3 bg-[#0a1120] rounded-xl border border-gray-900 text-center hover:scale-105 transition-transform duration-200 cursor-pointer">
                  <span className="text-white font-mono font-bold block">IP67 Waterproof</span>
                  <span className="text-gray-500 text-[9px] uppercase tracking-wider block mt-0.5">CAMERA HARDWARE</span>
                </div>
                <div className="p-3 bg-[#0a1120] rounded-xl border border-gray-900 text-center hover:scale-105 transition-transform duration-200 cursor-pointer">
                  <span className="text-white font-mono font-bold block">6,000+ Cycles</span>
                  <span className="text-gray-500 text-[9px] uppercase tracking-wider block mt-0.5">LITHIUM LIFE LIFE</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        <div className="lg:col-span-4">
          <ScrollReveal>
            <div className="bg-gradient-to-br from-blue-950/20 to-indigo-950/25 border border-blue-900/40 p-6 rounded-2xl flex flex-col justify-between h-full">
              <div>
                <div className="flex gap-1.5 items-center text-[#FDB813] font-bold text-xs uppercase mb-2">
                  <Sparkles size={14} className="animate-pulse" /> Secure AI Agent Assist
                </div>
                <h4 className="text-sm font-heading font-extrabold text-white mb-2">Discuss Microgrid Solutions With AI</h4>
                <p className="text-gray-400 text-xs leading-normal">Have questions? Log in or create an account to start configuring your custom solar sizes or domestic protection architectures with our server-integrated AI assistant.</p>
              </div>

              <button
                onClick={onLoginClick}
                className="w-full bg-[#1e345e]/50 hover:bg-[#2c4a85] border border-blue-800 text-blue-300 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 mt-6 cursor-pointer"
              >
                Access Sizing Assistant <ChevronRight size={14} />
              </button>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* 5. HIGH-CONVERTING BOTTOM CALL TO ACTION */}
      <ScrollReveal>
        <div className="bg-[#030913] border border-gray-850 p-8 sm:p-12 rounded-2.5xl text-center flex flex-col items-center gap-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-radial-gradient(ellipse at center, rgba(253, 184, 19, 0.05) 0%, transparent 70%) pointer-events-none" />
          <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-white max-w-xl">
            Ready to Transition Your Estate to Sustainable Clean Energy?
          </h3>
          <p className="text-gray-400 text-xs sm:text-sm max-w-md">
            Sign up today to custom-calculate your billing, track dispatch timelines, browse product catalog supplies, and communicate with dedicated field engineers.
          </p>
          <button
            onClick={onSignUpClick}
            className="bg-[#FDB813] hover:bg-amber-400 text-[#0A2342] font-heading font-extrabold px-8 py-3 rounded-xl text-xs tracking-wider uppercase transition-all duration-300 shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 cursor-pointer mt-2"
          >
            Create A Free Account Securing ₦0 Consultation
          </button>
        </div>
      </ScrollReveal>

    </div>
  );
}
