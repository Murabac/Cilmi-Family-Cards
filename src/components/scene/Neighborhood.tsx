"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { TreeNode } from "@/lib/types";
import { personColor, COLORS } from "@/lib/colors";

function displayName(person: TreeNode): string {
  return (person.full_name ?? "").trim() || "Unknown";
}

export function Neighborhood({
  current,
  connected,
  onSelect,
}: {
  current: TreeNode;
  connected: TreeNode[];
  onSelect: (id: string) => void;
}) {
  const spots = useMemo(() => {
    const n = connected.length;
    if (!n) return [];
    const radius = Math.min(4.6, 2.6 + n * 0.25);
    return connected.map((person, i) => {
      const a = (i / n) * Math.PI * 2 - Math.PI / 2;
      return {
        person,
        position: [
          Math.cos(a) * radius,
          Math.sin(a) * 0.3,
          Math.sin(a) * radius * 0.5,
        ] as [number, number, number],
      };
    });
  }, [connected]);

  const linePositions = useMemo(() => {
    const arr: number[] = [];
    for (const s of spots) arr.push(0, 0, 0, ...s.position);
    return new Float32Array(arr);
  }, [spots]);

  return (
    <group>
      <PersonOrb
        person={current}
        position={[0, 0.15, 0]}
        scale={1.4}
        active
        onSelect={onSelect}
      />

      {linePositions.length > 0 && (
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
          </bufferGeometry>
          <lineBasicMaterial color={COLORS.edge} transparent opacity={0.5} />
        </lineSegments>
      )}

      {spots.map(({ person, position }) => (
        <PersonOrb
          key={person.id}
          person={person}
          position={position}
          scale={0.9}
          onSelect={onSelect}
        />
      ))}
    </group>
  );
}

function PersonOrb({
  person,
  position,
  scale,
  active,
  onSelect,
}: {
  person: TreeNode;
  position: [number, number, number];
  scale: number;
  active?: boolean;
  onSelect: (id: string) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const name = displayName(person);
  const color = personColor({
    isRoot: person.isRoot,
    depth: person.depth,
    demographic: person.demographic,
    maritalStatus: person.marital_status,
    highlighted: active,
  });
  const avatarUrl = person.avatar_url?.trim() || null;
  const size = active ? 78 : 64;

  useFrame(({ clock }) => {
    if (!group.current) return;
    const pulse = active ? 1 + Math.sin(clock.elapsedTime * 2) * 0.05 : 1;
    group.current.scale.setScalar(scale * pulse);
  });

  return (
    <group position={position}>
      <group ref={group}>
        <mesh
          castShadow
          onClick={(e) => {
            e.stopPropagation();
            onSelect(person.id);
          }}
          onPointerOver={() => {
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            document.body.style.cursor = "auto";
          }}
        >
          <sphereGeometry args={[0.45, 32, 32]} />
          <meshStandardMaterial
            color={color}
            roughness={0.3}
            metalness={0.08}
            emissive={color}
            emissiveIntensity={active ? 0.25 : 0.08}
          />
        </mesh>

        {avatarUrl && (
          <Html
            center
            distanceFactor={6}
            zIndexRange={[60, 10]}
            occlude={false}
            style={{ pointerEvents: "none", userSelect: "none" }}
          >
            <div
              style={{
                width: size,
                height: size,
                borderRadius: "50%",
                overflow: "hidden",
                border: `3px solid ${color}`,
                boxShadow: "0 4px 14px rgba(0,0,0,0.45)",
                background: "#1B3A4B",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={avatarUrl}
                alt={name}
                draggable={false}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center top",
                  display: "block",
                }}
              />
            </div>
          </Html>
        )}
      </group>

      <Html
        position={[0, -0.78, 0]}
        center
        distanceFactor={6}
        zIndexRange={[40, 0]}
        style={{ pointerEvents: "none", userSelect: "none" }}
      >
        <div
          title={name}
          style={{
            color: "#F0E6D6",
            fontWeight: 800,
            fontSize: active ? 15 : 13,
            lineHeight: 1.2,
            textAlign: "center",
            whiteSpace: "nowrap",
            maxWidth: 220,
            overflow: "hidden",
            textOverflow: "ellipsis",
            textShadow: "0 1px 4px rgba(0,0,0,0.85), 0 0 8px rgba(0,0,0,0.5)",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          {name}
        </div>
      </Html>
    </group>
  );
}
