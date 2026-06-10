"use client";

/*
 * Hero ambient grain — full-bleed animated film-grain shader plane
 * (webgl-r3f-scenes skill pattern). Cheap fragment shader, dpr capped at 1,
 * pointer-events none. CSS grain overlay remains the no-WebGL fallback.
 */

import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const frag = /* glsl */ `
  uniform float uTime;
  uniform float uOpacity;
  varying vec2 vUv;
  float rand(vec2 n) { return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453); }
  void main() {
    float noise = rand(vUv * 500.0 + fract(uTime * 0.5));
    gl_FragColor = vec4(vec3(noise), uOpacity * noise);
  }
`;

const vert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

function GrainPlane() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();

  useFrame((_, dt) => {
    if (mat.current) mat.current.uniforms.uTime.value += dt;
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={mat}
        vertexShader={vert}
        fragmentShader={frag}
        uniforms={{ uTime: { value: 0 }, uOpacity: { value: 0.16 } }}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

export default function HeroCanvas() {
  return (
    <Canvas
      dpr={1}
      gl={{ antialias: false, powerPreference: "high-performance", stencil: false, alpha: true }}
      camera={{ position: [0, 0, 1] }}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 25,
        pointerEvents: "none",
      }}
    >
      <GrainPlane />
    </Canvas>
  );
}
