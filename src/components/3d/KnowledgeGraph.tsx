"use client";
import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { AppState } from "@/app/page";

function GraphNodes({ appState }: { appState: AppState }) {
  const ref = useRef<THREE.Points>(null);
  
  // Create an optimized number of nodes (e.g. 500 instead of 2000) for 60fps
  const [positions, sizes] = useMemo(() => {
    const count = 500;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos((Math.random() * 2) - 1);
      const r = 5 + Math.random() * 8; // tighter cluster
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      sizes[i] = Math.random() * 2;
    }
    return [positions, sizes];
  }, []);

  const { pointer, camera } = useThree();

  useFrame((state, delta) => {
    if (!ref.current) return;
    
    // Speed increases as state progresses
    let speed = 1;
    if (appState === "BUILDING_INTELLIGENCE") speed = 2;
    if (appState === "GENERATING_RESULTS") speed = 3;

    ref.current.rotation.x -= (delta / 10) * speed;
    ref.current.rotation.y -= (delta / 15) * speed;

    // Interactive zoom effect
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, speed === 3 ? 15 : 20, 0.05);

    // Dynamic mouse tracking
    const targetX = (pointer.x * Math.PI) / 4;
    const targetY = (pointer.y * Math.PI) / 4;
    ref.current.rotation.y += 0.1 * (targetX - ref.current.rotation.y);
    ref.current.rotation.x += 0.1 * (targetY - ref.current.rotation.x);
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#b026ff"
        size={0.15}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function GraphLines({ appState }: { appState: AppState }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    let speed = appState === "BUILDING_INTELLIGENCE" || appState === "GENERATING_RESULTS" ? 2 : 1;
    groupRef.current.rotation.x += (delta / 10) * speed;
    groupRef.current.rotation.y += (delta / 15) * speed;
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <icosahedronGeometry args={[8, 2]} />
        <meshBasicMaterial color="#00f0ff" wireframe transparent opacity={0.1} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh scale={1.5}>
        <icosahedronGeometry args={[8, 1]} />
        <meshBasicMaterial color="#0070f3" wireframe transparent opacity={0.15} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

export function KnowledgeGraph({ appState }: { appState: AppState }) {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] rounded-full bg-electric-blue/20 blur-[150px]" />
      <Canvas camera={{ position: [0, 0, 20], fov: 60 }}>
        <fog attach="fog" args={["#030712", 10, 30]} />
        <ambientLight intensity={1} />
        <GraphNodes appState={appState} />
        <GraphLines appState={appState} />
      </Canvas>
    </div>
  );
}
