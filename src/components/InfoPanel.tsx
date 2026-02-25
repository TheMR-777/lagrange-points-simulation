import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, Activity, Globe, Zap } from 'lucide-react';
import { lagrangeData } from '../data/lagrange-data';

interface InfoPanelProps {
  selectedId: string | null;
  onClose: () => void;
}

export function InfoPanel({ selectedId, onClose }: InfoPanelProps) {
  const data = selectedId ? lagrangeData[selectedId] : null;

  return (
    <AnimatePresence>
      {data && (
        <motion.div
          initial={{ opacity: 0, x: 50, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 50, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute right-6 top-6 bottom-6 w-96 rounded-2xl bg-acrylic film-grain p-6 shadow-2xl flex flex-col z-10 pointer-events-auto"
        >
          <div className="flex items-center justify-between mb-6 relative z-10">
            <h2 className="text-3xl font-light text-white tracking-tight flex items-center gap-3">
              <span className="text-cyan-400 font-bold">{data.id}</span>
              Point
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-8 relative z-10">
            <div className="space-y-2">
              <p className="text-white/60 text-sm uppercase tracking-widest font-semibold flex items-center gap-2">
                <Info size={16} className="text-cyan-400" />
                Location
              </p>
              <p className="text-xl text-white font-medium leading-tight">
                {data.shortDesc}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-white/60 text-sm uppercase tracking-widest font-semibold flex items-center gap-2">
                <Activity size={16} className="text-cyan-400" />
                Stability
              </p>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  data.stability === 'Stable' 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}>
                  {data.stability}
                </span>
                <span className="text-white/70 text-sm">
                  {data.stability === 'Stable' ? 'Can hold objects indefinitely' : 'Requires station-keeping thrust'}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-white/60 text-sm uppercase tracking-widest font-semibold flex items-center gap-2">
                <Globe size={16} className="text-cyan-400" />
                Physics
              </p>
              <p className="text-white/80 leading-relaxed text-sm">
                {data.description}
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-white/60 text-sm uppercase tracking-widest font-semibold flex items-center gap-2">
                <Zap size={16} className="text-cyan-400" />
                Applications
              </p>
              <ul className="space-y-2">
                {data.applications.map((app, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-white/80 bg-white/5 p-3 rounded-lg border border-white/5">
                    <span className="text-cyan-400 mt-0.5">•</span>
                    <span>{app}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
