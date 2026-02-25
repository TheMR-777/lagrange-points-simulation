import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, Line, Float, Sparkles, Stars, Grid } from "@react-three/drei";
import * as THREE from "three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { solveLagrangePoints } from "../utils/math";
import { PotentialField } from "./PotentialField";

const R = 15; // Distance between Primary and Secondary

function GlowSphere({ position, radius, color, intensity = 1 }: { position: [number, number, number], radius: number, color: string, intensity?: number }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[radius, 64, 64]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={intensity}
        toneMapped={false}
      />
    </mesh>
  );
}

function LagrangePoint({ id, position, onSelect, selectedId }: { id: string, position: [number, number, number], onSelect: (id: string) => void, selectedId: string | null }) {
  const isSelected = selectedId === id;
  const ref = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  
  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.emissiveIntensity = isSelected ? 4 + Math.sin(clock.elapsedTime * 4) * 2 : 2.0;
    }
    if (ref.current && isSelected) {
       ref.current.rotation.y += 0.01;
    }
  });

  return (
    <group position={position} onClick={(e) => { e.stopPropagation(); onSelect(id); }}>
      <Float speed={2} rotationIntensity={0} floatIntensity={0.5}>
        <mesh>
          <octahedronGeometry args={[0.4, 0]} />
          <meshStandardMaterial
            ref={materialRef}
            color={isSelected ? "#00ffff" : "#8888ff"}
            emissive={isSelected ? "#00ffff" : "#4444ff"}
            emissiveIntensity={2.0}
            wireframe
            transparent
            opacity={0.8}
            toneMapped={false}
          />
        </mesh>
        
        {isSelected && (
          <Sparkles count={30} scale={3} size={4} speed={0.4} opacity={1} color="#00ffff" />
        )}

        <Html
          position={[0, 1.2, 0]}
          center
          style={{
            transition: 'all 0.3s',
            opacity: isSelected ? 1 : 0.5,
            transform: isSelected ? 'scale(1.2)' : 'scale(1)',
          }}
          className="pointer-events-none"
        >
          <div className="font-mono text-sm font-bold text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] select-none">
            {id}
          </div>
        </Html>
      </Float>
    </group>
  );
}

function OrbitPaths({ pointsData }: { pointsData: any }) {
  const circlePoints = useMemo(() => {
    const pts = [];
    // Orbit of the secondary mass
    const rOrbit = Math.abs(pointsData.M2[0]);
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(angle) * rOrbit, 0, Math.sin(angle) * rOrbit));
    }
    return pts;
  }, [pointsData]);

  const primaryOrbit = useMemo(() => {
    const pts = [];
    const rOrbit = Math.abs(pointsData.M1[0]);
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(angle) * rOrbit, 0, Math.sin(angle) * rOrbit));
    }
    return pts;
  }, [pointsData]);

  return (
    <group>
      {/* Primary Orbit */}
      <Line points={primaryOrbit} color="#ffaa00" opacity={0.1} transparent lineWidth={1} dashed={true} dashScale={10} dashSize={1} dashOffset={0} />
      {/* Secondary Orbit */}
      <Line points={circlePoints} color="#00ffff" opacity={0.1} transparent lineWidth={1} dashed={true} dashScale={20} dashSize={1} dashOffset={0} />
      
      {/* L4/L5 Triangles */}
      <Line points={[new THREE.Vector3(...pointsData.M1), new THREE.Vector3(...pointsData.L4), new THREE.Vector3(...pointsData.M2)]} color="#44ff44" opacity={0.15} transparent lineWidth={1} />
      <Line points={[new THREE.Vector3(...pointsData.M1), new THREE.Vector3(...pointsData.L5), new THREE.Vector3(...pointsData.M2)]} color="#44ff44" opacity={0.15} transparent lineWidth={1} />
      
      {/* L1-L3 Line */}
      <Line points={[new THREE.Vector3(...pointsData.L3), new THREE.Vector3(...pointsData.L2)]} color="#ffffff" opacity={0.15} transparent lineWidth={1} />
    </group>
  );
}

export function Scene({ selectedId, onSelect, mu, showPotential }: { selectedId: string | null, onSelect: (id: string) => void, mu: number, showPotential: boolean }) {
  const systemRef = useRef<THREE.Group>(null);
  
  const pointsData = useMemo(() => solveLagrangePoints(mu, R), [mu]);

  useFrame((_, delta) => {
    if (systemRef.current) {
      systemRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <>
      <ambientLight intensity={0.1} />
      
      <group ref={systemRef}>
        {showPotential && <PotentialField mu={mu} R={R} />}

        {/* Primary Body */}
        <GlowSphere position={pointsData.M1 as [number, number, number]} radius={2.5 - mu * 2} color="#ffcc00" intensity={5} />
        <pointLight position={pointsData.M1 as [number, number, number]} intensity={100} color="#ffcc00" distance={100} decay={2} />
        
        {/* Secondary Body */}
        <GlowSphere position={pointsData.M2 as [number, number, number]} radius={0.5 + mu * 2} color="#00d8ff" intensity={4} />
        <pointLight position={pointsData.M2 as [number, number, number]} intensity={20} color="#00d8ff" distance={50} decay={2} />
        
        <OrbitPaths pointsData={pointsData} />

        {/* Lagrange Points */}
        {(['L1', 'L2', 'L3', 'L4', 'L5'] as const).map((id) => (
          <LagrangePoint
            key={id}
            id={id}
            position={pointsData[id] as [number, number, number]}
            selectedId={selectedId}
            onSelect={onSelect}
          />
        ))}
      </group>

      <Stars radius={100} depth={50} count={3000} factor={4} saturation={1} fade speed={0.5} />
      
      {!showPotential && (
        <Grid 
          infiniteGrid 
          fadeDistance={60} 
          sectionColor="#22d3ee" 
          sectionThickness={1}
          cellColor="#082f49" 
          position={[0, -5, 0]} 
          cellSize={2} 
          sectionSize={10} 
        />
      )}
      
      <EffectComposer>
        <Bloom luminanceThreshold={1.2} mipmapBlur intensity={1.2} />
      </EffectComposer>
    </>
  );
}
