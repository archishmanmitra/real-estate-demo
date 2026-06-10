"use client";

import { Suspense, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

// Canvas must never SSR
const Scene = dynamic(() => import("./Scene"), { ssr: false });

/**
 * Wrapper: WebGL distortion on motion-safe fine-pointer devices,
 * a plain next/image everywhere else.
 */
export function DistortedImage({ src, alt }: { src: string; alt: string }) {
  const [useWebGL, setUseWebGL] = useState(false);

  useEffect(() => {
    setUseWebGL(
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
        window.matchMedia("(pointer: fine)").matches
    );
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "clamp(24rem, 70vh, 42rem)",
        overflow: "hidden",
      }}
    >
      {useWebGL ? (
        <Suspense fallback={null}>
          <Scene src={src} />
        </Suspense>
      ) : (
        <div
          style={{
            position: "absolute",
            inset: "0",
            margin: "auto",
            width: "70%",
            aspectRatio: "3/2",
            maxHeight: "100%",
          }}
        >
          <Image src={src} alt={alt} fill sizes="70vw" style={{ objectFit: "cover" }} />
        </div>
      )}
      {/* Screen-reader description when WebGL renders */}
      {useWebGL && <span className="sr-only">{alt}</span>}
    </div>
  );
}
