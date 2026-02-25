import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform float uMu;
  uniform float uR;
  varying vec2 vUv;

  void main() {
    float scale = 6.0 * uR;
    vec2 pos = (vUv - 0.5) * scale;
    
    // Coordinates
    float x = pos.x;
    float y = pos.y;
    
    // Masses positions (un-normalized by dividing by R for math)
    float xNorm = x / uR;
    float yNorm = y / uR;
    
    float x1 = -uMu;
    float x2 = 1.0 - uMu;
    
    float r1 = distance(vec2(xNorm, yNorm), vec2(x1, 0.0));
    float r2 = distance(vec2(xNorm, yNorm), vec2(x2, 0.0));
    
    // Effective potential in co-rotating frame (Roche potential)
    float epsilon = 0.005;
    float U = -(1.0 - uMu) / (r1 + epsilon) - uMu / (r2 + epsilon) - 0.5 * (xNorm * xNorm + yNorm * yNorm);
    
    // Create an "unreal" aesthetic
    // 1. Color mapping based on potential U
    // U is generally negative. 
    // Saddle points (L1,L2,L3) are around -1.5
    // Maxima (L4,L5) are exactly at -1.5 (actually they are peaks so they are the least negative)
    // Near masses, U goes to -infinity.
    // Let's normalize U somewhat for color mapping.
    
    // We want to highlight the interesting topology between -2.5 and -1.4 (L4/L5 are around -1.5)
    float mappedU = smoothstep(-2.5, -1.4, U);
    
    // Base colors: elegant, minimalist, moody, dark space aesthetic
    vec3 colorVoid = vec3(0.005, 0.01, 0.02); // Almost black / Deep space
    vec3 colorWell = vec3(0.02, 0.08, 0.18);  // Deep moody blue for gravity wells
    vec3 colorSaddle = vec3(0.06, 0.25, 0.35);  // Subtle cyan for L1/L2/L3 saddle areas
    vec3 colorPeak = vec3(0.15, 0.4, 0.5);      // Brighter, distinct cyan/teal for L4/L5 peaks
    
    vec3 baseColor = mix(colorVoid, colorWell, smoothstep(0.0, 0.4, mappedU));
    baseColor = mix(baseColor, colorSaddle, smoothstep(0.4, 0.8, mappedU));
    baseColor = mix(baseColor, colorPeak, smoothstep(0.8, 1.0, mappedU));
    
    // 2. Contour lines
    // Clean, sharp, elegant topography lines
    float contourFreq = 18.0;
    float cVal = U * contourFreq - uTime * 0.2;
    float line = abs(fract(cVal) - 0.5) * 2.0; // Triangle wave: 0 to 1
    
    float lineThickness = 0.08;
    float contour = smoothstep(lineThickness, 0.0, line);
    
    // Elegant glow for contours
    vec3 contourColor = mix(vec3(0.1, 0.3, 0.5), vec3(0.3, 0.8, 1.0), mappedU);
    
    // Dim the contours in the deep gravity wells to avoid clutter
    contour *= smoothstep(0.0, 0.4, mappedU) + 0.05;
    
    vec3 finalColor = baseColor + contourColor * contour * 0.7;
    
    // 3. Fade out smoothly at edges
    float distFromCenter = length(vUv - 0.5);
    float alpha = 1.0 - smoothstep(0.25, 0.45, distFromCenter);
    
    // Fade out very deep wells to blend into the central masses seamlessly
    float wellFade = smoothstep(-3.5, -2.0, U);
    alpha *= wellFade;

    gl_FragColor = vec4(finalColor, alpha * 0.65); // 0.65 max opacity for ghostly elegance
  }
`;

export function PotentialField({ mu, R }: { mu: number; R: number }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMu: { value: mu },
      uR: { value: R },
    }),
    []
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      materialRef.current.uniforms.uMu.value = mu;
      materialRef.current.uniforms.uR.value = R;
    }
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]}>
      <planeGeometry args={[R * 6, R * 6, 128, 128]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </mesh>
  );
}
