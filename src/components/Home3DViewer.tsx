"use client";

import { Suspense, useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  Text,
  ContactShadows,
  Float
} from "@react-three/drei";
import * as THREE from "three";

interface Home3DViewerProps {
  objectType: "apartment" | "house" | "office" | "";
  zones: Record<string, boolean>;
  features: Record<string, boolean>;
  level: "basic" | "optimal" | "premium" | "";
}

// Компонент для комнаты
function Room({ position, size, color, label, isActive }: {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  label: string;
  isActive: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current && isActive) {
      const mat: any = meshRef.current.material;
      mat.opacity = 0.25 + Math.sin(state.clock.elapsedTime * 2) * 0.08;
      mat.emissiveIntensity = isActive ? 0.25 : 0;
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        position={[0, size[1] / 2, 0]}
      >
        <boxGeometry args={size} />
        <meshStandardMaterial
          color={isActive ? color : "#2a2a3a"}
          metalness={0.1}
          roughness={isActive ? 0.45 : 0.9}
          transparent
          opacity={isActive ? 0.85 : 0.6}
          emissive={isActive ? color : "#000000"}
          emissiveIntensity={isActive ? 0.18 : 0}
        />
      </mesh>
      {isActive && (
        <Text
          position={[0, size[1] + 0.5, 0]}
          fontSize={0.3}
          color="#10b981"
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      )}
    </group>
  );
}

// Устройство умного дома
function SmartDevice({ position, type, isActive }: {
  position: [number, number, number];
  type: "light" | "climate" | "security" | "shades" | "multimedia";
  isActive: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const colors: Record<string, string> = {
    light: "#ffd700",
    climate: "#00bfff",
    security: "#ff4444",
    shades: "#9370db",
    multimedia: "#ff69b4"
  };

  useFrame((state) => {
    if (meshRef.current && isActive) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.1;
    }
  });

  if (!isActive) return null;

  return (
    <Float rotationIntensity={0.5} floatIntensity={0.6} speed={1}>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[0.18, 24, 24]} />
        <meshStandardMaterial
          color={colors[type]}
          emissive={colors[type]}
          emissiveIntensity={0.9}
          metalness={0.2}
          roughness={0.2}
        />
      </mesh>
    </Float>
  );
}

// Основная сцена
function Scene({ objectType, zones, features, level }: Home3DViewerProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  const activeFeatures = useMemo(
    () => Object.keys(features).filter((k) => features[k]).join(", "),
    [features]
  );

  // Определяем размеры в зависимости от типа объекта
  const getLayout = () => {
    if (objectType === "apartment") {
      return {
        rooms: [
          { name: "Гостиная", pos: [-2, 0, 0], size: [3, 2.5, 3], color: "#10b981" },
          { name: "Спальня", pos: [2, 0, 0], size: [2.5, 2.5, 2.5], color: "#3b82f6" },
          { name: "Кухня", pos: [-2, 0, -3], size: [2, 2.5, 2], color: "#f59e0b" },
          { name: "Холл", pos: [0, 0, -1.5], size: [1.5, 2.5, 1.5], color: "#8b5cf6" }
        ]
      };
    } else if (objectType === "house") {
      return {
        rooms: [
          { name: "Гостиная", pos: [-3, 0, 0], size: [4, 3, 4], color: "#10b981" },
          { name: "Спальня 1", pos: [3, 0, 0], size: [3, 3, 3], color: "#3b82f6" },
          { name: "Спальня 2", pos: [3, 0, -3], size: [3, 3, 3], color: "#3b82f6" },
          { name: "Кухня", pos: [-3, 0, -4], size: [3, 3, 3], color: "#f59e0b" },
          { name: "Холл", pos: [0, 0, -2], size: [2, 3, 2], color: "#8b5cf6" },
          { name: "Улица", pos: [0, 0, 4], size: [6, 0.2, 4], color: "#64748b" }
        ]
      };
    } else {
      return {
        rooms: [
          { name: "Офис", pos: [-2, 0, 0], size: [4, 3, 4], color: "#10b981" },
          { name: "Переговорная", pos: [2, 0, 0], size: [3, 3, 3], color: "#3b82f6" },
          { name: "Холл", pos: [0, 0, -2], size: [2, 3, 2], color: "#8b5cf6" }
        ]
      };
    }
  };

  const layout = getLayout();
  const zoneMap: Record<string, string> = {
    living: "Гостиная",
    bedroom: "Спальня",
    kitchen: "Кухня",
    hallway: "Холл",
    outdoor: "Улица",
    officeArea: "Офис"
  };

  return (
    <>
      <hemisphereLight
        args={["#0f172a", "#05060a", 0.35]}
      />
      <ambientLight intensity={0.25} />
      <directionalLight
        position={[6, 10, 6]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      <pointLight position={[0, 5, 0]} intensity={features.light ? 1.1 : 0.35} color="#ffd700" />

      {/* Пол с отражением/материалом */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#0f1720" metalness={0.1} roughness={0.6} envMapIntensity={0.6} />
      </mesh>

      {/* Комнаты */}
      {layout.rooms.map((room, idx) => {
        const zoneKey = Object.keys(zoneMap).find((key) => zoneMap[key] === room.name);
        const isActive = zoneKey ? zones[zoneKey] : false;

        return (
          <Room
            key={idx}
            position={room.pos as [number, number, number]}
            size={room.size as [number, number, number]}
            color={room.color}
            label={room.name}
            isActive={isActive}
          />
        );
      })}

      {/* Устройства умного дома (цвет и интенсивность зависят от уровня) */}
      {features.light && (
        <>
          <SmartDevice position={[-2, 1.7, 0]} type="light" isActive={zones.living} />
          <SmartDevice position={[2, 1.7, 0]} type="light" isActive={zones.bedroom} />
        </>
      )}
      {features.climate && <SmartDevice position={[0, 1.2, -2]} type="climate" isActive={true} />}
      {features.security && (
        <>
          <SmartDevice position={[-2, 2.2, -3]} type="security" isActive={zones.kitchen} />
          <SmartDevice position={[0, 2.2, 0]} type="security" isActive={zones.hallway} />
        </>
      )}
      {features.shades && <SmartDevice position={[-2, 1, 0]} type="shades" isActive={zones.living} />}
      {features.multimedia && <SmartDevice position={[1.2, 1.2, -0.6]} type="multimedia" isActive={zones.living} />}

      {/* Тёмная/светлая подсветка для премиум */}
      {level === "premium" && <pointLight position={[0, 3.5, 0]} intensity={0.6} color="#10b981" />}

      {/* Тематическая панель — показывает активные функции и уровень */}
      <group position={[3.5, 2.5, -1.5]}>
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[2.2, 1.2, 8, 8]} />
          <meshStandardMaterial color="#071022" emissive={level === "premium" ? "#052e1f" : "#000000"} metalness={0.1} roughness={0.25} />
        </mesh>
        <Text position={[0, 0.28, 0.01]} fontSize={0.16} color="#9ee6c4" anchorX="center" anchorY="top">
          {level ? `Уровень: ${level}` : "Уровень: —"}
        </Text>
        <Text position={[0, -0.02, 0.01]} fontSize={0.11} color="#cbd5e1" anchorX="center" anchorY="middle">
          {activeFeatures || "Нет выбранных функций"}
        </Text>
      </group>

      <ContactShadows position={[0, -0.1, 0]} opacity={0.6} width={10} blur={2} far={10} />
    </>
  );
}

export function Home3DViewer({ objectType, zones, features, level }: Home3DViewerProps) {
  if (!objectType) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 rounded-xl">
        <div className="text-center text-slate-400">
          <div className="text-4xl mb-2">🏠</div>
          <div className="text-sm">Выберите тип объекта для 3D визуализации</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[420px] rounded-xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950 relative">
      <div className="absolute -inset-px rounded-xl p-[1px] pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(5,150,105,0.04))', borderRadius: '12px' }} />
      <div className="absolute top-4 left-4 z-10 flex items-center gap-3">
        <div className="icon-badge">
          <svg className="w-4 h-4 text-[#0a0a0f]" viewBox="0 0 24 24" fill="none"><path d="M12 2l3 6 6 1-4.5 4.5L19 20l-7-3-7 3 1.5-6.5L3 9l6-1 3-6z" fill="currentColor"/></svg>
        </div>
        <div>
          <div className="text-xs font-semibold text-white">{objectType === 'apartment' ? 'Квартира' : objectType === 'house' ? 'Дом' : 'Офис'}</div>
          <div className="text-[11px] text-[#94a3b8]">Нажмите и вращайте, чтобы осмотреть</div>
        </div>
      </div>
      <Canvas shadows dpr={[1, 2]} style={{ touchAction: 'none' }}>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={(() => {
            // slightly different camera positions to emphasize each object type
            if (objectType === 'apartment') return [7, 4.5, 7];
            if (objectType === 'house') return [10, 7, 10];
            return [8, 5.5, 8];
          })()} fov={48} />
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={4}
            maxDistance={22}
            autoRotate={false}
            autoRotateSpeed={0.5}
          />
          <Environment preset={level === "premium" ? "city" : "studio"} />
          <Scene objectType={objectType} zones={zones} features={features} level={level} />
        </Suspense>
      </Canvas>
      <div className="absolute bottom-4 right-4 z-10 text-xs text-[#cbd5e1] bg-white/5 px-3 py-1 rounded-md border border-white/10">3D Preview</div>
    </div>
  );
}

