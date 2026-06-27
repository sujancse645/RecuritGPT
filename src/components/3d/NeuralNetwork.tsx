"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function Particles() {
  const ref = useRef<THREE.Points>(null);
  
  // Generate random points in a sphere
  const [positions, sizes] = useMemo(() => {
    const count = 2000;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos((Math.random() * 2) - 1);
      // Create a hollow brain/sphere shape
      const r = 10 + Math.random() * 5;
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      sizes[i] = Math.random() * 1.5;
    }
    return [positions, sizes];
  }, []);

  const { pointer } = useThree();

  useFrame((state, delta) => {
    if (!ref.current) return;
    // Slow continuous rotation
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;

    // Subtle parallax effect on mouse move
    const targetX = (pointer.x * Math.PI) / 10;
    const targetY = (pointer.y * Math.PI) / 10;
    
    ref.current.rotation.y += 0.05 * (targetX - ref.current.rotation.y);
    ref.current.rotation.x += 0.05 * (targetY - ref.current.rotation.x);
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#00f0ff"
        size={0.1}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function ConnectionLines() {
  const groupRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.x += delta / 20;
    groupRef.current.rotation.y += delta / 25;
    
    const targetX = (pointer.x * Math.PI) / 8;
    const targetY = (pointer.y * Math.PI) / 8;
    
    groupRef.current.rotation.y += 0.05 * (targetX - groupRef.current.rotation.y);
    groupRef.current.rotation.x += 0.05 * (targetY - groupRef.current.rotation.x);
  });

  // Create a mesh-like connection
  return (
    <group ref={groupRef}>
      <mesh>
        <icosahedronGeometry args={[12, 1]} />
        <meshBasicMaterial color="#0070f3" wireframe transparent opacity={0.15} />
      </mesh>
      <mesh scale={1.2}>
        <icosahedronGeometry args={[12, 2]} />
        <meshBasicMaterial color="#b026ff" wireframe transparent opacity={0.08} />
      </mesh>
    </group>
  );
}

export function NeuralNetworkBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-[#030712]">
      {/* Background aurora/glow */}
      <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] rounded-full bg-electric-blue/10 blur-[120px]" />
      <div className="absolute bottom-[20%] right-[20%] w-[30%] h-[30%] rounded-full bg-neon-purple/10 blur-[120px]" />
      <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%] rounded-full bg-cyan/5 blur-[150px]" />

      <Canvas camera={{ position: [0, 0, 30], fov: 60 }}>
        <fog attach="fog" args={["#030712", 20, 40]} />
        <ambientLight intensity={0.5} />
        <Particles />
        <ConnectionLines />
      </Canvas>
    </div>
  );
}
