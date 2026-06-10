"use client";

/*
 * Mouse image distortion — after blog.olivierlarose.com/tutorials/mouse-image-distortion.
 * A plane curves with sin(uv * PI) driven by smoothed mouse velocity, plus a subtle
 * RGB shift proportional to the offset. R3F + drei, refs only in useFrame (no setState).
 */

import { Suspense, useRef } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";

const vertex = /* glsl */ `
  uniform vec2 uOffset;
  varying vec2 vUv;

  #define M_PI 3.1415926535897932384626433832795

  vec3 deformationCurve(vec3 position, vec2 uv, vec2 offset) {
    position.x = position.x + (sin(uv.y * M_PI) * offset.x);
    position.y = position.y + (sin(uv.x * M_PI) * offset.y);
    return position;
  }

  void main() {
    vUv = uv;
    vec3 newPosition = deformationCurve(position, uv, uOffset);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

const fragment = /* glsl */ `
  uniform sampler2D uTexture;
  uniform float uAlpha;
  uniform vec2 uOffset;
  varying vec2 vUv;

  vec3 rgbShift(sampler2D textureImage, vec2 uv, vec2 offset) {
    float r = texture2D(textureImage, uv + offset).r;
    vec2 gb = texture2D(textureImage, uv).gb;
    return vec3(r, gb);
  }

  void main() {
    vec3 color = rgbShift(uTexture, vUv, uOffset * 0.5);
    gl_FragColor = vec4(color, uAlpha);
  }
`;

function DistortedPlane({ src }: { src: string }) {
  const mesh = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const texture = useLoader(THREE.TextureLoader, src);
  const { viewport } = useThree();

  // Smoothed mouse in viewport coords; offset = velocity of the lerp
  const mouse = useRef(new THREE.Vector2(0, 0));
  const smoothed = useRef(new THREE.Vector2(0, 0));

  useFrame(({ pointer }) => {
    mouse.current.set(
      (pointer.x * viewport.width) / 2,
      (pointer.y * viewport.height) / 2
    );
    smoothed.current.lerp(mouse.current, 0.1);

    if (mesh.current) {
      mesh.current.position.x = smoothed.current.x * 0.08;
      mesh.current.position.y = smoothed.current.y * 0.08;
    }
    if (material.current) {
      const u = material.current.uniforms.uOffset.value as THREE.Vector2;
      u.set(
        (mouse.current.x - smoothed.current.x) * 0.12,
        (mouse.current.y - smoothed.current.y) * 0.12
      );
    }
  });

  // Fit the plane to ~70% of viewport width, 3:2 ratio
  const w = viewport.width * 0.7;
  const h = (w * 2) / 3;

  return (
    <mesh ref={mesh} scale={[w, h, 1]}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial
        ref={material}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={{
          uTexture: { value: texture },
          uOffset: { value: new THREE.Vector2(0, 0) },
          uAlpha: { value: 1 },
        }}
        transparent
      />
    </mesh>
  );
}

export default function Scene({ src }: { src: string }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: false, powerPreference: "high-performance", stencil: false }}
      camera={{ position: [0, 0, 2], fov: 50 }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Suspense fallback={null}>
        <DistortedPlane src={src} />
      </Suspense>
    </Canvas>
  );
}
