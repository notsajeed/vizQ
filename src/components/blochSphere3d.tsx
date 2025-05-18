// components/BlochSphere3D.tsx
import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line, Html } from "@react-three/drei";
import * as THREE from "three";

interface BlochVector {
  x: number;
  y: number;
  z: number;
}

interface Props {
  vector: BlochVector;
}

const Arrow: React.FC<Props> = ({ vector }) => {
  const ref = useRef<any>(null);

  useFrame(() => {
    if (ref.current) {
      ref.current.geometry.setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(vector.x, vector.y, vector.z),
      ]);
    }
  });

  return (
    <Line
      ref={ref}
      points={[
        [0, 0, 0],
        [vector.x, vector.y, vector.z],
      ]}
      color="red"
      lineWidth={3}
    />
  );
};

const BlochSphere3D: React.FC<{ vector: BlochVector }> = ({ vector }) => {
  return (
    <Canvas camera={{ position: [2.5, 2.5, 2.5], fov: 50 }}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls />
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#87ceeb" wireframe />
      </mesh>
      <Arrow vector={vector} />
      <axesHelper args={[1.5]} />
      <Html position={[1.1, 0, 0]}>
        <div style={{ color: "black" }}>X</div>
      </Html>
      <Html position={[0, 1.1, 0]}>
        <div style={{ color: "black" }}>Y</div>
      </Html>
      <Html position={[0, 0, 1.1]}>
        <div style={{ color: "black" }}>Z</div>
      </Html>
    </Canvas>
  );
};

export default BlochSphere3D;
