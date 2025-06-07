import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';

export default function ThreeBackground() {
  return (
    <Canvas className="absolute top-0 left-0 w-full h-full -z-10">
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 0, 5]} />
      <Stars radius={50} depth={50} count={5000} factor={4} />
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}
