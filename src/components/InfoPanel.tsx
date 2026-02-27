import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, Activity, Globe, Zap } from 'lucide-react';
import { lagrangeData } from '../data/lagrange-data';
import { useEffect, useState } from 'react';

interface InfoPanelProps {
  selectedId: string | null;
  onClose: () => void;
}

export function InfoPanel({ selectedId, onClose }: InfoPanelProps) {
  const data = selectedId ? lagrangeData[selectedId] : null;
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    // No need to call checkMobile immediately since we initialized state
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {data && (
        <motion.div
          key={isMobile ? 'mobile-panel' : 'desktop-panel'}
          initial={isMobile ? { y: "100%", opacity: 0 } : { x: "100%", opacity: 0 }}
          animate={isMobile ? { y: 0, opacity: 1 } : { x: 0, opacity: 1 }}
          exit={isMobile ? { y: "100%", opacity: 0 } : { x: "100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`
            fixed z-50 panel-surface shadow-2xl flex flex-col pointer-events-auto border-white/10 backdrop-blur-3xl
            md:absolute md:right-0 md:top-0 md:bottom-0 md:w-[420px] md:h-full md:border-l md:rounded-l-3xl
            bottom-0 left-0 right-0 h-[60vh] rounded-t-3xl border-t
          `}
        >
          {/* Mobile Handle */}
          <div className="md:hidden w-full flex justify-center pt-3 pb-1">
            <div className="w-12 h-1.5 bg-white/20 rounded-full" />
          </div>

          <div className="flex items-start justify-between p-6 pb-2 md:p-8 md:pb-4 relative z-10">
            <div className="flex flex-col gap-1">
              <h2 className="text-3xl md:text-4xl font-light text-white tracking-tighter">
                Lagrange <span className="text-cyan-400 font-bold">{data.id}</span>
              </h2>
              <p className="text-white/40 uppercase tracking-[0.2em] text-[10px] md:text-xs font-medium">Orbital Dynamics Data</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors mt-1"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 md:px-8 pb-8 custom-scrollbar space-y-8 md:space-y-10 relative z-10">
            
            {/* Stability Badge (Hero Status) */}
            <div className={`p-4 rounded-xl border ${
              data.stability === 'Stable' 
                ? 'bg-emerald-500/10 border-emerald-500/20' 
                : 'bg-rose-500/10 border-rose-500/20'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <Activity size={16} className={data.stability === 'Stable' ? 'text-emerald-400' : 'text-rose-400'} />
                <span className={`text-xs font-bold uppercase tracking-widest ${
                  data.stability === 'Stable' ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {data.stability} Equilibrium
                </span>
              </div>
              <p className="text-white/80 text-sm leading-relaxed">
                {data.stability === 'Stable' 
                  ? 'Objects at this point will tend to stay there. Small perturbations result in orbits around the point.' 
                  : 'Objects here are balanced like a ball on a hill. Without station-keeping, they will eventually drift away.'}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white/50 mb-1">
                <Info size={16} />
                <span className="text-xs uppercase tracking-widest font-bold">Location Profile</span>
              </div>
              <p className="text-xl text-white font-light leading-snug">
                {data.shortDesc}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white/50 mb-1">
                <Globe size={16} />
                <span className="text-xs uppercase tracking-widest font-bold">Gravitational Physics</span>
              </div>
              <p className="text-white/80 leading-relaxed font-light">
                {data.description}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white/50 mb-1">
                <Zap size={16} />
                <span className="text-xs uppercase tracking-widest font-bold">Key Applications</span>
              </div>
              <div className="grid gap-3">
                {data.applications.map((app, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-white/90 bg-white/5 p-4 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0"></div>
                    <span>{app}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
