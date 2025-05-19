import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

type Vector3 = {
  x: number;
  y: number;
  z: number;
} | null;

type BlochSphereProps = {
  vector: Vector3;
};

const BlochSphere: React.FC<BlochSphereProps> = ({ vector }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<THREE.ArrowHelper | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(2, 2, 2);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);

    // Sphere geometry
    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x0077ff,
      wireframe: true,
      opacity: 0.25,
      transparent: true,
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);

    // Axes helper
    const axesHelper = new THREE.AxesHelper(1.5);
    scene.add(axesHelper);

    // Arrow helper for Bloch vector - initially zero vector
    const dir = new THREE.Vector3(1, 0, 0); // default
    const origin = new THREE.Vector3(0, 0, 0);
    const length = 1;
    const hex = 0xff0000;
    arrowRef.current = new THREE.ArrowHelper(dir, origin, length, hex);
    scene.add(arrowRef.current);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup on unmount
    return () => {
      renderer.dispose();
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  // React to vector changes here
  useEffect(() => {
    if (!vector || !arrowRef.current) return;

    const { x, y, z } = vector;

    // Normalize vector for direction and length for magnitude
    const vec = new THREE.Vector3(x, y, z);
    const length = vec.length();

    if (length === 0) {
      arrowRef.current.setLength(0);
      return;
    }

    const dir = vec.clone().normalize();

    arrowRef.current.setDirection(dir);
    arrowRef.current.setLength(length);
  }, [vector]);

  return <div ref={mountRef} style={{ width: "100%", height: 400 }} />;
};

export default BlochSphere;
