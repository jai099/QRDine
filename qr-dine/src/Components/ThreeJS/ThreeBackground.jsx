import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Environment } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three';
import toast from 'react-hot-toast';

// Custom Particle System Component
function InteractiveParticles({ mouse }) {
  const particlesRef = useRef();
  const particleCount = 200;
  const positions = new Float32Array(particleCount * 3);
  const velocities = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);

  // Initialize particles
  useEffect(() => {
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      velocities[i * 3] = (Math.random() - 0.5) * 0.05;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.05;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.05;

      colors[i * 3] = 1.0; // Red
      colors[i * 3 + 1] = 0.6; // Green
      colors[i * 3 + 2] = 0.0; // Blue

      sizes[i] = Math.random() * 3 + 1;
    }

    const geometry = particlesRef.current.geometry;
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  }, []);

  useFrame(() => {
    const positions = particlesRef.current.geometry.attributes.position.array;
    const velocities = particlesRef.current.geometry.attributes.velocity.array;

    for (let i = 0; i < particleCount; i++) {
      // Update positions
      positions[i * 3] += velocities[i * 3];
      positions[i * 3 + 1] += velocities[i * 3 + 1];
      positions[i * 3 + 2] += velocities[i * 3 + 2];

      // Attract particles towards mouse
      const dx = mouse.current[0] * 5 - positions[i * 3];
      const dy = mouse.current[1] * 5 - positions[i * 3 + 1];
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance > 0.1) {
        velocities[i * 3] += dx * 0.0005;
        velocities[i * 3 + 1] += dy * 0.0005;
      }

      // Boundary check
      if (Math.abs(positions[i * 3]) > 10) velocities[i * 3] *= -0.5;
      if (Math.abs(positions[i * 3 + 1]) > 10) velocities[i * 3 + 1] *= -0.5;
      if (Math.abs(positions[i * 3 + 2]) > 10) velocities[i * 3 + 2] *= -0.5;
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry />
      <pointsMaterial
        size={3}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Glowing Orb Component
function GlowingOrb({ mouse }) {
  const meshRef = useRef();
  const lightRef = useRef();

  // Spring animation for smooth mouse following
  const { position } = useSpring({
    position: [mouse.current[0] * 5, mouse.current[1] * 5, 0],
    config: { mass: 1, tension: 120, friction: 14 },
  });

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    meshRef.current.scale.set(
      1 + Math.sin(time * 2) * 0.1,
      1 + Math.sin(time * 2) * 0.1,
      1 + Math.sin(time * 2) * 0.1
    );
    lightRef.current.intensity = 2 + Math.sin(time * 3) * 0.5;
  });

  return (
    <animated.mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial
        color="#ff9800"
        emissive="#ff9800"
        emissiveIntensity={1.5}
        toneMapped={false}
      />
      <pointLight ref={lightRef} color="#ff9800" intensity={2} distance={10} />
    </animated.mesh>
  );
}

// Twinkling Stars Component
function TwinklingStars() {
  const starsRef = useRef();

  useFrame(({ clock }) => {
    starsRef.current.rotation.y += 0.0005;
    starsRef.current.rotation.x += 0.0002;
  });

  return (
    <Stars
      ref={starsRef}
      radius={70}
      depth={80}
      count={9000}
      factor={6}
      fade
      speed={2}
    />
  );
}

export default function ThreeBackground() {
  const [mouse, setMouse] = useState([0, 0]);
  const mouseRef = useRef([0, 0]);

  // Mouse movement handler
  useEffect(() => {
    const handleMouseMove = (event) => {
      const { clientX, clientY } = event;
      const x = (clientX / window.innerWidth) * 2 - 1;
      const y = -(clientY / window.innerHeight) * 2 + 1;
      setMouse([x, y]);
      mouseRef.current = [x, y];
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Mouse click handler for burst effect
  const handleClick = () => {
    toast.success('✨ Particle Burst!', { position: 'top-center' });
  };

  return (
    <Canvas
      className="absolute top-0 left-0 w-full h-full -z-10"
      camera={{ position: [0, 0, 10], fov: 60 }}
      onClick={handleClick}
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.7} />

      {/* Twinkling Starfield */}
      <TwinklingStars />

      {/* Interactive Particles */}
      <InteractiveParticles mouse={mouseRef} />

      {/* Glowing Orb */}
      <GlowingOrb mouse={mouseRef} />

      {/* Subtle Fog for Depth */}
      <fog attach="fog" args={['#1a1a1a', 10, 50]} />

      {/* Dynamic Environment */}
      <Environment preset="sunset" background={false} />

      {/* Post-Processing Effects */}
      <EffectComposer>
        <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} intensity={1.5} />
        <Vignette eskil={false} offset={0.1} darkness={0.8} />
      </EffectComposer>

      {/* Controls for subtle camera movement */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={true}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </Canvas>
  );
}