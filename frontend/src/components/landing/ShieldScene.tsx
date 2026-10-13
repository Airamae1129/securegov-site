import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function ShieldCore() {
  const spin = useRef<THREE.Group>(null!);

  const shieldGeo = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 1.35);
    s.lineTo(0.98, 0.88);
    s.lineTo(0.98, -0.12);
    s.quadraticCurveTo(0.98, -0.92, 0, -1.38);
    s.quadraticCurveTo(-0.98, -0.92, -0.98, -0.12);
    s.lineTo(-0.98, 0.88);
    s.closePath();
    const g = new THREE.ExtrudeGeometry(s, {
      depth: 0.22, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 3, curveSegments: 28,
    });
    g.center();
    return g;
  }, []);

  const edges = useMemo(() => new THREE.EdgesGeometry(shieldGeo, 18), [shieldGeo]);

  const ringPoints = useMemo(() => {
    const n = 90;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      pos[i * 3] = Math.cos(a) * 2.05;
      pos[i * 3 + 1] = Math.sin(a) * 2.05 * 0.36;
      pos[i * 3 + 2] = Math.sin(a) * 0.6;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);

  useFrame((state, delta) => {
    spin.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.45) * 0.55;
    const p = state.pointer;
    spin.current.rotation.x = THREE.MathUtils.lerp(spin.current.rotation.x, p.y * 0.18, 0.05);
    spin.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.08;
  });

  return (
    <group ref={spin}>
      <mesh geometry={shieldGeo}>
        <meshStandardMaterial color="#2A0E55" emissive="#7C4DDB" emissiveIntensity={0.45} metalness={0.55} roughness={0.28} transparent opacity={0.92} />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color="#A98BF0" transparent opacity={0.9} />
      </lineSegments>
      <mesh position={[0, 0.05, 0.28]}>
        <sphereGeometry args={[0.52, 18, 14]} />
        <meshBasicMaterial color="#CFC4E4" wireframe transparent opacity={0.55} />
      </mesh>
      <group position={[0, -0.18, 0.5]}>
        <mesh>
          <boxGeometry args={[0.4, 0.32, 0.14]} />
          <meshStandardMaterial color="#FFFFFF" emissive="#A98BF0" emissiveIntensity={0.55} metalness={0.3} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.2, 0]} rotation={[0, 0, 0]}>
          <torusGeometry args={[0.13, 0.038, 10, 24, Math.PI]} />
          <meshStandardMaterial color="#FFFFFF" emissive="#A98BF0" emissiveIntensity={0.55} metalness={0.3} roughness={0.4} />
        </mesh>
      </group>
      <mesh rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[2.05, 0.008, 8, 128]} />
        <meshBasicMaterial color="#0A84FF" transparent opacity={0.5} />
      </mesh>
      <mesh rotation={[Math.PI / 2.7, 0, 0]}>
        <torusGeometry args={[1.7, 0.005, 8, 128]} />
        <meshBasicMaterial color="#A98BF0" transparent opacity={0.4} />
      </mesh>
      <points geometry={ringPoints} rotation={[0, 0, 0]}>
        <pointsMaterial color="#A98BF0" size={0.045} transparent opacity={0.9} sizeAttenuation />
      </points>
    </group>
  );
}

function Particles({ count = 220 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null!);
  const geo = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const speed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 5.2;
      pos[i * 3 + 1] = -3 + Math.random() * 6;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 2.4;
      speed[i] = 0.25 + Math.random() * 0.6;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.userData.speed = speed;
    return g;
  }, [count]);

  useFrame((_, delta) => {
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const speed = geo.userData.speed as Float32Array;
    for (let i = 0; i < count; i++) {
      let y = pos.getY(i) + speed[i] * delta;
      if (y > 3.2) y = -3.2;
      pos.setY(i, y);
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial color="#7C4DDB" size={0.03} transparent opacity={0.75} blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}

export default function ShieldScene() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.15, 6.4], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
      aria-hidden="true"
    >
      <ambientLight intensity={0.55} />
      <pointLight position={[4, 3, 4]} intensity={42} color="#7C4DDB" />
      <pointLight position={[-4, -2, 3]} intensity={26} color="#0A84FF" />
      <ShieldCore />
      <Particles />
    </Canvas>
  );
}
