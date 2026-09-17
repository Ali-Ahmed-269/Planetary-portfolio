"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ParticleBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;

    // Dimensions
    let width = container.clientWidth;
    let height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
    camera.position.z = 5;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particle geometries
    const whiteGeometry = new THREE.BufferGeometry();
    const orangeGeometry = new THREE.BufferGeometry();

    const whiteCount = 2500;
    const orangeCount = 500;

    const whitePositions = new Float32Array(whiteCount * 3);
    const orangePositions = new Float32Array(orangeCount * 3);

    // X: [-15, 15], Y: [-15, 15], Z: [-5, 5]
    for (let i = 0; i < whiteCount; i++) {
      whitePositions[i * 3] = (Math.random() - 0.5) * 30;
      whitePositions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      whitePositions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }

    for (let i = 0; i < orangeCount; i++) {
      orangePositions[i * 3] = (Math.random() - 0.5) * 30;
      orangePositions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      orangePositions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }

    whiteGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(whitePositions, 3)
    );
    orangeGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(orangePositions, 3)
    );

    // Particle Materials
    const whiteMaterial = new THREE.PointsMaterial({
      color: 0xdddddd,
      size: 0.015,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
    });

    const orangeMaterial = new THREE.PointsMaterial({
      color: 0xf97316,
      size: 0.025,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
    });

    // Meshes
    const whiteParticles = new THREE.Points(whiteGeometry, whiteMaterial);
    const orangeParticles = new THREE.Points(orangeGeometry, orangeMaterial);

    scene.add(whiteParticles);
    scene.add(orangeParticles);

    // Mouse parallax tracking
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      targetX = ((event.clientX / window.innerWidth) * 2 - 1) * 1.5;
      targetY = -((event.clientY / window.innerHeight) * 2 - 1) * 1.5;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener("resize", handleResize);

    // Animation loop
    let animationFrameId: number;

    const animate = () => {
      // Rotation / Drift
      whiteParticles.rotation.y += 0.0003;
      whiteParticles.rotation.x += 0.0001;

      orangeParticles.rotation.y += 0.0003;
      orangeParticles.rotation.x += 0.0001;

      // Mouse Parallax smooth lerp
      camera.position.x += (targetX - camera.position.x) * 0.02;
      camera.position.y += (targetY - camera.position.y) * 0.02;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);

      whiteGeometry.dispose();
      orangeGeometry.dispose();
      whiteMaterial.dispose();
      orangeMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 pointer-events-none"
      style={{ width: "100%", height: "100%" }}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
