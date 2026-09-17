"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function SaturnPlanet() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 550;
    const height = container.clientHeight || 550;

    // ── 1. Scene, Camera, Renderer Setup ──
    const scene = new THREE.Scene();

    // Camera positioned at z = 12 so ring outer radius (3.9) fits with ample padding without clipping
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(0, 0, 12);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    container.appendChild(renderer.domElement);

    // ── 2. Lighting ──
    // Direct sunlight from upper-left
    const dirLight = new THREE.DirectionalLight(0xfff5ea, 3.4);
    dirLight.position.set(-7, 6, 6);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 30;
    dirLight.shadow.camera.left = -6;
    dirLight.shadow.camera.right = 6;
    dirLight.shadow.camera.top = 6;
    dirLight.shadow.camera.bottom = -6;
    dirLight.shadow.bias = -0.0003;
    scene.add(dirLight);

    // Soft warm ambient cosmic light
    const ambientLight = new THREE.AmbientLight(0x2a2438, 0.65);
    scene.add(ambientLight);

    // Subtle fill light from lower right
    const fillLight = new THREE.DirectionalLight(0x403020, 0.4);
    fillLight.position.set(7, -5, -4);
    scene.add(fillLight);

    // ── 3. Main Master Group ──
    const saturnGroup = new THREE.Group();
    saturnGroup.rotation.x = 0.36; // Default tilt (~20 deg)
    saturnGroup.rotation.z = -0.20;
    scene.add(saturnGroup);

    // ── 4. Procedural Textures ──
    // Planet Body Texture
    const bodyCanvas = document.createElement("canvas");
    bodyCanvas.width = 1024;
    bodyCanvas.height = 512;
    const bCtx = bodyCanvas.getContext("2d")!;

    bCtx.fillStyle = "#d8c4a4";
    bCtx.fillRect(0, 0, 1024, 512);

    const bands = [
      { y: 0.0, h: 0.12, color: "#4c5866" }, // North polar cap
      { y: 0.12, h: 0.08, color: "#7a8a99" },
      { y: 0.20, h: 0.07, color: "#cfc0a5" },
      { y: 0.27, h: 0.08, color: "#eadecb" },
      { y: 0.35, h: 0.07, color: "#cfa26e" },
      { y: 0.42, h: 0.10, color: "#f7e8cf" }, // Equatorial zone
      { y: 0.52, h: 0.10, color: "#d69f62" }, // Amber belt
      { y: 0.62, h: 0.08, color: "#b59875" },
      { y: 0.70, h: 0.08, color: "#786550" },
      { y: 0.78, h: 0.10, color: "#4a3c30" },
      { y: 0.88, h: 0.12, color: "#2d241c" }, // South pole
    ];

    bands.forEach((b) => {
      const yPx = b.y * 512;
      const hPx = b.h * 512;
      bCtx.fillStyle = b.color;
      bCtx.fillRect(0, yPx, 1024, hPx);

      for (let i = 0; i < 3; i++) {
        bCtx.fillStyle = "rgba(0, 0, 0, 0.04)";
        bCtx.fillRect(0, yPx + (i / 3) * hPx, 1024, hPx / 6);
      }
    });

    const bodyTexture = new THREE.CanvasTexture(bodyCanvas);
    bodyTexture.wrapS = THREE.RepeatWrapping;
    bodyTexture.wrapT = THREE.ClampToEdgeWrapping;

    // Ring Texture (smooth radial falloff at outer edge)
    const ringCanvas = document.createElement("canvas");
    ringCanvas.width = 64;
    ringCanvas.height = 1024;
    const rCtx = ringCanvas.getContext("2d")!;

    const rGrad = rCtx.createLinearGradient(0, 0, 0, 1024);
    rGrad.addColorStop(0.0, "rgba(0, 0, 0, 0)");
    rGrad.addColorStop(0.05, "rgba(180, 160, 130, 0.15)");
    rGrad.addColorStop(0.20, "rgba(205, 185, 150, 0.4)");
    rGrad.addColorStop(0.25, "rgba(235, 215, 180, 0.85)");
    rGrad.addColorStop(0.42, "rgba(255, 248, 230, 0.95)");
    rGrad.addColorStop(0.55, "rgba(215, 195, 160, 0.8)");
    rGrad.addColorStop(0.58, "rgba(8, 8, 12, 0.04)");   // Cassini gap
    rGrad.addColorStop(0.63, "rgba(8, 8, 12, 0.04)");
    rGrad.addColorStop(0.65, "rgba(200, 180, 145, 0.75)");
    rGrad.addColorStop(0.84, "rgba(170, 150, 120, 0.55)");
    rGrad.addColorStop(0.90, "rgba(10, 10, 15, 0.08)");
    rGrad.addColorStop(0.95, "rgba(220, 200, 170, 0.3)");
    rGrad.addColorStop(1.0, "rgba(0, 0, 0, 0)"); // Smooth transparent edge

    rCtx.fillStyle = rGrad;
    rCtx.fillRect(0, 0, 64, 1024);

    const ringTexture = new THREE.CanvasTexture(ringCanvas);

    // ── 5. Saturn Planet Mesh ──
    const sphereGeo = new THREE.SphereGeometry(1.5, 64, 64);
    const sphereMat = new THREE.MeshStandardMaterial({
      map: bodyTexture,
      roughness: 0.65,
      metalness: 0.08,
    });
    const planetMesh = new THREE.Mesh(sphereGeo, sphereMat);
    planetMesh.castShadow = true;
    planetMesh.receiveShadow = true;
    saturnGroup.add(planetMesh);

    // Atmosphere Rim Glow Mesh
    const atmosGeo = new THREE.SphereGeometry(1.53, 32, 32);
    const atmosMat = new THREE.MeshBasicMaterial({
      color: 0xf97316,
      transparent: true,
      opacity: 0.12,
      side: THREE.BackSide,
    });
    const atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
    saturnGroup.add(atmosMesh);

    // ── 6. Saturn Ring Mesh (Sized to fit comfortably in view) ──
    const innerRadius = 2.0;
    const outerRadius = 3.9;
    const ringGeo = new THREE.RingGeometry(innerRadius, outerRadius, 128);
    ringGeo.rotateX(-Math.PI / 2);

    // Fix UV mapping for RingGeometry
    const pos = ringGeo.attributes.position;
    const uv = ringGeo.attributes.uv;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const radius = Math.sqrt(x * x + z * z);
      const normR = (radius - innerRadius) / (outerRadius - innerRadius);
      uv.setY(i, normR);
    }
    uv.needsUpdate = true;

    const ringMat = new THREE.MeshStandardMaterial({
      map: ringTexture,
      side: THREE.DoubleSide,
      transparent: true,
      roughness: 0.4,
      metalness: 0.1,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.castShadow = true;
    ringMesh.receiveShadow = true;
    saturnGroup.add(ringMesh);

    // ── 7. Orbiting Moons ──
    // Titan
    const titanGeo = new THREE.SphereGeometry(0.065, 16, 16);
    const titanMat = new THREE.MeshStandardMaterial({
      color: 0xfceabb,
      roughness: 0.5,
    });
    const titanMesh = new THREE.Mesh(titanGeo, titanMat);
    titanMesh.position.set(4.4, 0.7, -1.0);
    saturnGroup.add(titanMesh);

    // Enceladus
    const enceladusGeo = new THREE.SphereGeometry(0.035, 16, 16);
    const enceladusMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.3,
    });
    const enceladusMesh = new THREE.Mesh(enceladusGeo, enceladusMat);
    enceladusMesh.position.set(-3.0, -0.5, 1.4);
    saturnGroup.add(enceladusMesh);

    // ── 8. Mouse Movement Tracking ──
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const heroEl = document.getElementById("home");
      if (!heroEl) return;

      const rect = heroEl.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        const normX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
        const normY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

        targetRotY = normX * 0.4; // max ±23 deg Y tilt
        targetRotX = normY * 0.3; // max ±17 deg X tilt
      } else {
        targetRotX = 0;
        targetRotY = 0;
      }
    };

    const handleMouseLeave = () => {
      targetRotX = 0;
      targetRotY = 0;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.body.addEventListener("mouseleave", handleMouseLeave);

    // ── 9. Animation Loop ──
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Continuous 3D rotation of planet on its axis
      planetMesh.rotation.y += 0.0025;

      // Smooth interpolation for mouse 3D tilt
      currentRotX += (targetRotX - currentRotX) * 0.05;
      currentRotY += (targetRotY - currentRotY) * 0.05;

      saturnGroup.rotation.x = 0.36 + currentRotX;
      saturnGroup.rotation.y = currentRotY;

      renderer.render(scene, camera);
    };

    animate();

    // ── 10. Responsive Window Resize Handler ──
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    // ── 11. Cleanup ──
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);

      sphereGeo.dispose();
      sphereMat.dispose();
      atmosGeo.dispose();
      atmosMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      titanGeo.dispose();
      titanMat.dispose();
      enceladusGeo.dispose();
      enceladusMat.dispose();
      bodyTexture.dispose();
      ringTexture.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      className="absolute left-1/2 lg:left-[53%] xl:left-[55%] top-[48%] -translate-y-1/2 -translate-x-1/2 lg:translate-x-0 z-[4] w-[360px] h-[360px] sm:w-[460px] sm:h-[460px] lg:w-[540px] lg:h-[540px] xl:w-[600px] xl:h-[600px] pointer-events-none select-none opacity-40 lg:opacity-100 transition-opacity duration-500"
    >
      {/* Background ambient radial light */}
      <div
        className="absolute inset-4 rounded-full blur-3xl opacity-70"
        style={{
          background:
            "radial-gradient(circle, rgba(249,115,22,0.2) 0%, rgba(245,158,11,0.08) 45%, transparent 75%)",
        }}
      />
      {/* Three.js Canvas Container with radial blend mask */}
      <div
        ref={mountRef}
        className="w-full h-full relative z-10"
        style={{
          maskImage:
            "radial-gradient(circle at center, black 62%, transparent 95%)",
          WebkitMaskImage:
            "radial-gradient(circle at center, black 62%, transparent 95%)",
        }}
      />
    </div>
  );
}
