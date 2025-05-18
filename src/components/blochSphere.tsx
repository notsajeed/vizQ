// components/BlochSphere.tsx
import React from "react";
import BlochSphere3D from "./blochSphere3d.tsx";

interface BlochVector {
  x: number;
  y: number;
  z: number;
}

interface BlochSphereProps {
  vector: BlochVector;
}

const BlochSphere: React.FC<BlochSphereProps> = ({ vector }) => {
  return (
    <div style={{ width: "100%", height: "500px" }}>
      <BlochSphere3D vector={vector} />
    </div>
  );
};

export default BlochSphere;
