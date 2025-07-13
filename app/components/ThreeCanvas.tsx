'use client'
import React, { useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { gsap } from 'gsap';
import * as THREE from 'three';

export function SprayCan() {
  return (
    <group>
      {/* Can Body */}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 2, 32]} />
        <meshStandardMaterial color="#cccccc" />
      </mesh>
      {/* Can Top */}
      <mesh position={[0, 2.1, 0]}>
        <sphereGeometry args={[0.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#999999" />
      </mesh>
      {/* Nozzle */}
      <mesh position={[0, 2.3, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.2, 32]} />
        <meshStandardMaterial color="#222222" />
      </mesh>

       {/* Cap (Czapka) */}
      <mesh position={[0, 2.6, 0]}>
        {/* Możesz użyć sphereGeometry lub capsuleGeometry dla bardziej zaokrąglonego kształtu */}
        <sphereGeometry args={[0.35, 32, 16]} />
        <meshStandardMaterial color="#444444" />
      </mesh>
    </group>
  );
}

export function AnimatedSprayCan() {
  const canRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (canRef.current) {
      gsap.to(canRef.current.rotation, {
        y: Math.PI * 2,
        duration: 2,
        repeat: -1,
        ease: 'linear',
      });
    }
  }, []);

  return (
    <group ref={canRef}>
      {/* Can Body */}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 2, 32]} />
        <meshStandardMaterial color="#cccccc" />
      </mesh>
      {/* Can Top */}
      <mesh position={[0, 2.1, 0]}>
        <sphereGeometry args={[0.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#999999" />
      </mesh>
      {/* Nozzle */}
      <mesh position={[0, 2.3, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.2, 32]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
    </group>
  );
}

const ThreeCanvas = () => {
  return (
    <div className="w-full h-96"> {/* or h-screen for full height */}
      <Canvas camera={{ position: [0, 3, 6], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 7]} intensity={1} />
        <SprayCan />
        <OrbitControls />
      </Canvas>
    </div>
  );
}

export default ThreeCanvas