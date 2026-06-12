import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { RadialGrid } from "./RadialGrid";
import { StarField, type StarFilters } from "./StarField";

export function StarScene({ gridVisible, filters }: { gridVisible: boolean; filters: StarFilters }) {
  return (
    <Canvas
      className="absolute inset-0"
      dpr={[1, 2]}
      camera={{ position: [0, 3, 120], fov: 60, near: 0.001, far: 25000 }}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
    >
      <color attach="background" args={["#010101"]} />
      <StarField filters={filters} />
      {gridVisible && <RadialGrid />}
      <OrbitControls enableDamping />
    </Canvas>

  );
}
