import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Sparkles, Environment } from '@react-three/drei';

export default function ThreeBackground() {
  return (
    <Canvas className="absolute top-0 left-0 w-full h-full -z-10 animate-fadeInBg">
      <ambientLight intensity={0.7} />
      <directionalLight position={[0, 0, 5]} intensity={0.7} />
      {/* Enhanced Starfield */}
      <Stars radius={70} depth={80} count={9000} factor={6} fade speed={2} />
      {/* Add Sparkles for more dynamic effect */}
      <Sparkles count={120} scale={[30, 10, 30]} size={2.5} speed={0.7} color="#ff9800" />
      {/* Subtle Environment for soft reflections */}
      <Environment preset="sunset" background={false} />
      {/* Controls for interaction (pan/rotate disabled for background) */}
      <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
    </Canvas>
  );
}
