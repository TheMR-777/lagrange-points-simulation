import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload } from "@react-three/drei";
import { Scene } from "./Scene";
import { Suspense } from "react";

interface SimulationProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
  mu: number;
  showPotential: boolean;
}

export function Simulation({ selectedId, onSelect, mu, showPotential }: SimulationProps) {
  return (
    <div className="absolute inset-0 bg-[#010204]">
      <Canvas
        camera={{ position: [0, 20, 25], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#010204']} />
        
        <Suspense fallback={null}>
          <Scene selectedId={selectedId} onSelect={onSelect} mu={mu} showPotential={showPotential} />
          
          <OrbitControls 
            enablePan={false}
            enableZoom={true}
            minDistance={10}
            maxDistance={80}
            maxPolarAngle={Math.PI / 2 - 0.1}
            autoRotate={false}
          />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
