import { useEffect, useMemo } from 'react';
import * as THREE from 'three';

function buildRadialGrid(rings = 50, spokes = 32, radius = 50) {
  const ringSegments = 96;
  const positions: number[] = [];

  for (let ring = 1; ring <= rings; ring += 1) {
    const currentRadius = (radius * ring) / rings;

    for (let segment = 0; segment < ringSegments; segment += 1) {
      const a0 = (segment / ringSegments) * Math.PI * 2;
      const a1 = ((segment + 1) / ringSegments) * Math.PI * 2;

      positions.push(Math.cos(a0) * currentRadius, 0, Math.sin(a0) * currentRadius);
      positions.push(Math.cos(a1) * currentRadius, 0, Math.sin(a1) * currentRadius);
    }
  }

  for (let spoke = 0; spoke < spokes; spoke += 1) {
    const angle = (spoke / spokes) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    positions.push(0, 0, 0, x, 0, z);
  }

  return new Float32Array(positions);
}

export function RadialGrid() {
  const geometry = useMemo(() => {
    const bufferGeometry = new THREE.BufferGeometry();
    bufferGeometry.setAttribute('position', new THREE.BufferAttribute(buildRadialGrid(), 3));
    return bufferGeometry;
  }, []);

  useEffect(() => {
    return () => geometry.dispose();
  }, [geometry]);

  return (
    <lineSegments geometry={geometry} frustumCulled={false}>
      <lineBasicMaterial color="#5aa9ff" linewidth={100} transparent opacity={0.18} />
    </lineSegments>
  );
}
