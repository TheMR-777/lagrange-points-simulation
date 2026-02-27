import { useState } from "react";
import { Simulation } from "./components/Simulation";
import { InfoPanel } from "./components/InfoPanel";
import { Orbit, Mountain, Rotate3D } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  // Mass ratio: 0.001 (Earth-like) to 0.4 (Binary star-like)
  const [mu, setMu] = useState<number>(0.05);
  const [showPotential, setShowPotential] = useState<boolean>(true);
  // Default to hidden controls on mobile to show the simulation first
  const [showControls, setShowControls] = useState<boolean>(() => window.innerWidth >= 768);

  return (
    <div className="relative w-full h-screen bg-[#010204] overflow-hidden font-sans selection:bg-cyan-500/30 text-white">
      <Simulation selectedId={selectedId} onSelect={setSelectedId} mu={mu} showPotential={showPotential} />
      
      {/* Header UI */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute top-0 left-0 right-0 p-6 md:p-8 pointer-events-none z-10 flex items-start justify-between"
      >
        <div className="flex flex-col drop-shadow-lg">
          <div className="flex items-center gap-3">
            <Orbit className="text-cyan-400 w-6 h-6 md:w-8 md:h-8" strokeWidth={1.5} />
            <h1 className="text-xl md:text-3xl font-extralight tracking-tighter text-white uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              Orbital <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-cyan-500">Mechanics</span>
            </h1>
          </div>
          <p className="text-cyan-400/60 tracking-[0.2em] uppercase text-[10px] md:text-xs font-medium mt-1 ml-9 md:ml-11">
            Lagrange Points Explorer
          </p>
        </div>
      </motion.div>

      {/* Mobile Controls Toggle */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        onClick={() => setShowControls(!showControls)}
        className="absolute left-6 bottom-6 md:hidden z-20 w-12 h-12 rounded-full panel-surface flex items-center justify-center border border-white/10 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.1)] active:scale-95 transition-transform"
      >
        <Mountain size={20} />
      </motion.button>

      {/* Controls Overlay */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 30 }}
            className="absolute left-4 right-4 bottom-24 md:bottom-8 md:left-8 md:right-auto md:w-80 pointer-events-auto z-10"
          >
            <div className="panel-surface p-6 rounded-2xl border border-white/5 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between mb-6 text-white relative z-10">
                <div className="flex items-center gap-2">
                  <Mountain size={18} className="text-cyan-400" />
                  <h3 className="uppercase tracking-[0.15em] text-xs font-bold">Simulation Controls</h3>
                </div>
                {/* Close button for mobile only */}
                <button onClick={() => setShowControls(false)} className="md:hidden text-white/40 hover:text-white">
                  <div className="w-1 h-4 bg-white/20 rounded-full rotate-45 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  <div className="w-1 h-4 bg-white/20 rounded-full -rotate-45 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </button>
              </div>

              <div className="space-y-8 relative z-10">
                {/* Mass Ratio Slider */}
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] uppercase tracking-widest text-white/50">Mass Ratio (μ)</span>
                    <span className="font-mono text-cyan-400 font-bold text-lg leading-none">{mu.toFixed(3)}</span>
                  </div>
                  
                  <div className="relative h-6 flex items-center touch-none">
                    <div className="absolute w-full h-1 bg-white/10 rounded-full overflow-hidden">
                       <div className="h-full bg-cyan-500/30" style={{ width: `${(mu / 0.4) * 100}%` }}></div>
                    </div>
                    <input 
                      type="range" 
                      min="0.001" 
                      max="0.4" 
                      step="0.001" 
                      value={mu}
                      onChange={(e) => setMu(parseFloat(e.target.value))}
                      className="w-full h-6 opacity-0 absolute cursor-pointer z-20"
                    />
                    <div 
                      className="absolute h-4 w-4 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)] pointer-events-none transition-transform z-10"
                      style={{ left: `calc(${((mu - 0.001) / (0.4 - 0.001)) * 100}% - 8px)` }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-[9px] text-white/30 uppercase tracking-widest font-medium">
                    <span>Earth/Sun</span>
                    <span>Binary</span>
                  </div>
                </div>

                <div className="h-[1px] bg-white/10 w-full"></div>

                {/* Field Toggle */}
                <label className="flex items-center justify-between cursor-pointer group select-none">
                  <div className="flex flex-col">
                    <span className="text-xs uppercase tracking-widest text-white/80 group-hover:text-white transition-colors font-bold">
                      Potential Field
                    </span>
                    <span className="text-[10px] text-white/40 mt-0.5">Visualize gravity wells</span>
                  </div>
                  
                  <div className={`relative w-12 h-6 transition-colors rounded-full border ${showPotential ? 'bg-cyan-900/40 border-cyan-500/50' : 'bg-white/5 border-white/10'}`}>
                    <div className={`absolute top-[3px] left-[3px] w-4 h-4 rounded-full transition-transform duration-300 ${showPotential ? 'translate-x-6 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.6)]' : 'bg-white/20'}`}></div>
                  </div>
                  <input type="checkbox" className="hidden" checked={showPotential} onChange={(e) => setShowPotential(e.target.checked)} />
                </label>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
