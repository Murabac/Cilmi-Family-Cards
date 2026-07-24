"use client";

import { useEffect, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import { Color, TOUCH, Vector3 } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { TreeNode } from "@/lib/types";
import { Neighborhood } from "./Neighborhood";
import { COLORS } from "@/lib/colors";

/** Mostly top-down, slight side tilt, a bit closer. */
const TOP_VIEW = new Vector3(0, 7.2, 4.2);
const LOOK_AT = new Vector3(0, 0, 0);

function TopViewCamera({ focusId }: { focusId: string }) {
  const controls = useThree((s) => s.controls) as OrbitControlsImpl | null;
  const camera = useThree((s) => s.camera);
  const ready = useRef(false);

  useEffect(() => {
    camera.position.copy(TOP_VIEW);
    camera.up.set(0, 1, 0);
    camera.lookAt(LOOK_AT);
    camera.updateProjectionMatrix();

    if (controls) {
      controls.target.copy(LOOK_AT);
      controls.update();
    }
    ready.current = true;
  }, [focusId, camera, controls]);

  return null;
}

export function TreeScene({
  current,
  connected,
  onSelect,
}: {
  current: TreeNode;
  connected: TreeNode[];
  onSelect: (id: string) => void;
}) {
  return (
    <Canvas
      style={{ width: "100%", height: "100%", display: "block", touchAction: "none" }}
      dpr={[1, 1.5]}
      camera={{ position: [0, 7.2, 4.2], fov: 42, near: 0.1, far: 80 }}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      onCreated={({ gl, camera }) => {
        gl.setClearColor(new Color(COLORS.bg), 1);
        camera.position.copy(TOP_VIEW);
        camera.lookAt(LOOK_AT);
      }}
    >
      <color attach="background" args={[COLORS.bg]} />
      <ambientLight intensity={0.9} />
      <directionalLight position={[5, 8, 4]} intensity={1.3} color="#F0E6D6" />
      <hemisphereLight args={[COLORS.sky, COLORS.bg, 0.7]} />
      <pointLight position={[0, 2, 3]} intensity={1} color={COLORS.sun} />

      <Neighborhood current={current} connected={connected} onSelect={onSelect} />

      <ContactShadows
        position={[0, -1.5, 0]}
        opacity={0.4}
        scale={16}
        blur={2}
        far={8}
        color="#0d1f2a"
      />

      <TopViewCamera focusId={current.id} />

      {/* Drag to spin · scroll/pinch to zoom · two-finger pan */}
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        enablePan
        enableZoom
        enableRotate
        minDistance={2.5}
        maxDistance={16}
        minPolarAngle={0.15}
        maxPolarAngle={Math.PI * 0.85}
        target={[0, 0, 0]}
        touches={{
          ONE: TOUCH.ROTATE,
          TWO: TOUCH.DOLLY_PAN,
        }}
      />
    </Canvas>
  );
}
