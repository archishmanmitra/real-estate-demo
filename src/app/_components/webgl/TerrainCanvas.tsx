"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const vert = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  varying float vElev;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 p = position;

    float wave =
      sin(p.x * 1.4 + uTime * 0.6) * 0.22 +
      cos(p.y * 1.1 + uTime * 0.45) * 0.18 +
      sin((p.x + p.y) * 0.7 + uTime * 0.3) * 0.12;

    // cursor swell — local bump around uMouse (plane-space)
    float d = distance(p.xy, uMouse);
    wave += exp(-d * d * 1.6) * 0.5;

    p.z += wave;
    vElev = wave;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const frag = /* glsl */ `
  uniform vec3 uStone;
  uniform vec3 uAmber;
  varying float vElev;
  varying vec2 vUv;

  void main() {
    // edge fade vignette
    float edge = smoothstep(0.0, 0.18, vUv.x) * smoothstep(1.0, 0.82, vUv.x)
               * smoothstep(0.0, 0.15, vUv.y) * smoothstep(1.0, 0.8, vUv.y);
    vec3 color = mix(uStone, uAmber, smoothstep(0.15, 0.65, vElev));
    gl_FragColor = vec4(color, edge * 0.55);
  }
`;

function Terrain() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const mouse = useRef(new THREE.Vector2(0, 0));
  const targetVec = useRef(new THREE.Vector2(0, 0));

  useFrame(({ pointer }, dt) => {
    const m = mat.current;
    if (!m) return;
    m.uniforms.uTime.value += dt;
    // pointer (-1..1) → plane space (plane is 10 × 7); no per-frame allocations
    targetVec.current.set(pointer.x * 5, pointer.y * 3.5);
    mouse.current.lerp(targetVec.current, 0.06);
    (m.uniforms.uMouse.value as THREE.Vector2).copy(mouse.current);
  });

  return (
    <mesh rotation={[-Math.PI / 2.45, 0, 0]} position={[0, -0.7, 0]}>
      <planeGeometry args={[10, 7, 110, 80]} />
      <shaderMaterial
        ref={mat}
        vertexShader={vert}
        fragmentShader={frag}
        uniforms={{
          uTime: { value: 0 },
          uMouse: { value: new THREE.Vector2(0, 0) },
          uStone: { value: new THREE.Color("#C8B89A") },
          uAmber: { value: new THREE.Color("#D4873A") },
        }}
        wireframe
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

export default function TerrainCanvas() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: false, powerPreference: "high-performance", stencil: false, alpha: true }}
      camera={{ position: [0, 1.1, 3.2], fov: 55 }}
      style={{ position: "absolute", inset: 0, zIndex: 0 }}
    >
      <Terrain />
    </Canvas>
  );
}
