'use client';

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { Mesh } from 'three';
import type { Shape3D } from './shapes';
import styles from './Activity.module.css';

function ShapeGeometry({ shapeId }: { shapeId: string }) {
  switch (shapeId) {
    case 'cube':
      return <boxGeometry args={[1.6, 1.6, 1.6]} />;
    case 'cuboid':
      return <boxGeometry args={[2, 1.2, 1]} />;
    case 'sphere':
      return <sphereGeometry args={[1, 32, 32]} />;
    case 'cylinder':
      return <cylinderGeometry args={[0.8, 0.8, 1.6, 32]} />;
    case 'cone':
      return <coneGeometry args={[0.9, 1.8, 32]} />;
    case 'triangular-prism':
      return <cylinderGeometry args={[0.9, 0.9, 1.6, 3]} />;
    case 'square-pyramid':
      return <coneGeometry args={[1, 1.6, 4]} />;
    default:
      return <boxGeometry args={[1.6, 1.6, 1.6]} />;
  }
}

function ShapeMesh({ shape, autoRotate }: { shape: Shape3D; autoRotate: boolean }) {
  const meshRef = useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (!autoRotate || !meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x += delta * (0.12 + Math.sin(t * 0.7) * 0.08);
    meshRef.current.rotation.y += delta * (0.2 + Math.sin(t * 0.5) * 0.15);
    meshRef.current.rotation.z += delta * (0.05 + Math.sin(t * 0.3) * 0.05);
  });

  return (
    <mesh ref={meshRef} rotation={[0.3, 0.3, 0]}>
      <ShapeGeometry shapeId={shape.id} />
      <meshStandardMaterial color={shape.color} roughness={0.35} metalness={0.05} />
    </mesh>
  );
}

interface ShapeViewerProps {
  shape: Shape3D;
}

export default function ShapeViewer({ shape }: ShapeViewerProps) {
  const [userControlled, setUserControlled] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    setUserControlled(false);
    controlsRef.current?.reset();
  }, [shape.id]);

  return (
    <div className={styles.viewer}>
      <Canvas camera={{ position: [0, 1.5, 3.5], fov: 50 }}>
        <ambientLight intensity={0.35} />
        <hemisphereLight args={['#b1e1ff', '#b97a20', 0.25]} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <directionalLight position={[-4, 2, -2]} intensity={0.3} />
        <pointLight position={[-3, -3, 4]} intensity={0.4} />
        <ShapeMesh
          key={shape.id}
          shape={shape}
          autoRotate={!userControlled}
        />
        <OrbitControls
          ref={controlsRef}
          enableZoom={false}
          enablePan={false}
          onStart={() => setUserControlled(true)}
        />
      </Canvas>
    </div>
  );
}
