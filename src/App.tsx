import { useState } from "react";
import { Simulation } from "./components/Simulation";
import { InfoPanel } from "./components/InfoPanel";
import { Orbit, Mountain, Rotate3D } from "lucide-react";
import { motion } from "framer-motion";

export function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  // Mass ratio: 0.001 (Earth-like) to 0.4 (Binary star-like)
  const [mu, setMu] = useState<number>(0.05);
  const [showPotential, setShowPotential] = useState<boolean>(true);

  return (
    <div className="relative w-full h-screen bg-[#010204] overflow-hidden font-sans selection:bg-cyan-500/30 text-white">
      <Simulation selectedId={selectedId} onSelect={setSelectedId} mu={mu} showPotential={showPotential} />
      
      {/* Header UI */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute top-0 left-0 right-0 p-8 pointer-events-none z-10 flex items-start justify-between"
      >
        <div className="flex flex-col drop-shadow-lg">
          <div className="flex items-center gap-3">
            <Orbit className="text-cyan-400" size={32} strokeWidth={1.5} />
            <h1 className="text-3xl font-extralight tracking-tighter text-white uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              Orbital <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-cyan-500">Mechanics</span>
            </h1>
          </div>
          <p className="text-cyan-400/60 tracking-[0.2em] uppercase text-xs font-medium mt-1 ml-11">
            Lagrange Points Explorer
          </p>
        </div>
      </motion.div>

      {/* Controls Overlay */}
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="absolute left-8 bottom-8 flex flex-col gap-6 w-80 pointer-events-auto z-10"
      >
        <div className="bg-acrylic film-grain p-6 rounded-2xl shadow-2xl">
          <div className="flex items-center gap-2 mb-4 text-white/80 relative z-10">
            <Mountain size={18} className="text-cyan-400" />
            <h3 className="uppercase tracking-widest text-xs font-bold">Simulation Parameters</h3>
          </div>

          <div className="space-y-6 relative z-10">
            <div className="space-y-3">
              <div className="flex justify-between text-xs text-white/60">
                <span className="uppercase tracking-wider">Mass Ratio (μ)</span>
                <span className="font-mono text-cyan-400 font-bold">{mu.toFixed(3)}</span>
              </div>
              
              <input 
                type="range" 
                min="0.001" 
                max="0.4" 
                step="0.001" 
                value={mu}
                onChange={(e) => setMu(parseFloat(e.target.value))}
                className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-white/40 uppercase tracking-widest">
                <span>Earth/Sun</span>
                <span>Binary System</span>
              </div>
            </div>

            <div className="h-[1px] bg-white/10 w-full"></div>

            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-xs uppercase tracking-widest text-white/60 group-hover:text-white transition-colors">
                Gravity Potential Field
              </span>
              <div className={`relative w-10 h-5 transition-colors rounded-full border ${showPotential ? 'bg-cyan-500/20 border-cyan-500/50' : 'bg-white/5 border-white/20'}`}>
                <div className={`absolute top-[1px] left-[1px] w-4 h-4 rounded-full transition-transform ${showPotential ? 'translate-x-5 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]' : 'bg-white/40'}`}></div>
              </div>
              <input type="checkbox" className="hidden" checked={showPotential} onChange={(e) => setShowPotential(e.target.checked)} />
            </label>
          </div>
        </div>
      </motion.div>

      {/* Instructions Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: selectedId ? 0 : 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 pointer-events-none flex flex-col items-center gap-3"
      >
        <p className="text-white/70 text-xs tracking-[0.2em] uppercase bg-black/40 px-6 py-2.5 rounded-full backdrop-blur-md border border-white/10 shadow-[0_0_20px_rgba(34,211,238,0.15)] flex items-center gap-2">
          <Rotate3D size={14} className="text-cyan-400" />
          Select an <span className="text-cyan-400 font-bold">L-Point</span> to explore
        </p>
        <p className="text-white/30 text-[10px] tracking-widest uppercase">
          Drag to orbit • Scroll to zoom
        </p>
      </motion.div>

      {/* Info Panel */}
      <div className="pointer-events-none absolute inset-0 z-20">
        <InfoPanel selectedId={selectedId} onClose={() => setSelectedId(null)} />
      </div>
    </div>
  );
}
