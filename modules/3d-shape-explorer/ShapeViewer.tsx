'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
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

function ShapeMesh({ shape }: { shape: Shape3D }) {
  return (
    <mesh rotation={[0.3, 0.3, 0]}>
      <ShapeGeometry shapeId={shape.id} />
      <meshStandardMaterial color={shape.color} flatShading={false} />
    </mesh>
  );
}

interface ShapeViewerProps {
  shape: Shape3D;
}

export default function ShapeViewer({ shape }: ShapeViewerProps) {
  return (
    <div className={styles.viewer}>
      <Canvas camera={{ position: [0, 1.5, 3.5], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <directionalLight position={[-3, -2, -3]} intensity={0.3} />
        <ShapeMesh shape={shape} />
        <OrbitControls
          autoRotate
          autoRotateSpeed={2}
          enableZoom={false}
          enablePan={false}
        />
      </Canvas>
    </div>
  );
}
