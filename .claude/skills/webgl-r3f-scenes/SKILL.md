---
name: webgl-r3f-scenes
description: Akshar Realty R3F/drei patterns. Invoke for any Three.js, WebGL, shader, or 3D canvas work. Akshar uses WebGL conservatively — one shader grain overlay and optionally a subtle depth-of-field on the hero canvas. Contains Canvas setup and shaderMaterial patterns.
---

# WebGL R3F — Akshar Realty

Akshar uses WebGL conservatively. The only planned WebGL feature is an optional ambient grain/noise shader that runs full-screen behind the hero — everything else is CSS + GSAP. Only add more 3D if a specific section calls for it.

## Canvas (always lazy, ssr:false)
```tsx
const HeroCanvas = dynamic(() => import('./_components/hero/HeroCanvas'), { ssr: false })
// Inside HeroCanvas.tsx:
<Canvas dpr={[1,1.5]} gl={{ antialias:false, powerPreference:'high-performance', stencil:false }}
  frameloop="demand" style={{ position:'absolute', inset:0, zIndex:0, pointerEvents:'none' }}>
  <Suspense fallback={null}>
    <GrainPlane />
  </Suspense>
</Canvas>
```

## Grain / noise shader (optional hero texture, lighter than CSS grain)
```tsx
const GrainMaterial = shaderMaterial(
  { uTime: 0, uOpacity: 0.04 },
  `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
  `uniform float uTime; uniform float uOpacity; varying vec2 vUv;
   float rand(vec2 n){ return fract(sin(dot(n,vec2(12.9898,4.1414)))*43758.5453); }
   void main(){
     float noise = rand(vUv * 500.0 + fract(uTime * 0.5));
     gl_FragColor = vec4(vec3(noise), uOpacity);
   }`
)
extend({ GrainMaterial })
function GrainPlane(){ const r=useRef(); useFrame((_,dt)=>{ if(r.current) r.current.uTime+=dt }); return <mesh scale={[2,2,1]}><planeGeometry/><grainMaterial ref={r}/></mesh> }
```

## Perf rules (enforce always)
- `frameloop="demand"` — invalidate only when needed
- `dpr={[1,1.5]}` cap — no 2x on WebGL for this project
- `pointer-events:none` on the canvas — let DOM handle all events
- Code-split with `next/dynamic ssr:false`
- Wrap in `<Suspense fallback={null}>`
- Always provide CSS fallback (the grain.png CSS overlay from globals.css is the fallback)
