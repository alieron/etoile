import { useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import type { StarCategory, StarRecord } from '../types';

// 1 scene unit = 1 parsec. Raise/lower to tune visible star scale.
export const STAR_SIZE_SCALE = 0.55;

export type StarFilters = {
  categories: Set<number>;
  ranks: Set<number>;
};

type StarPayload = Record<string, StarRecord>;
type CategoryPayload = Record<string, StarCategory>;

type LoadedData = {
  stars: StarRecord[];
  categories: Map<number, StarCategory>;
};

const vertexShader = `
attribute float size;
attribute float glow;
attribute float halo;
attribute float visible;
attribute vec3 starColor;

uniform float pixelRatio;

varying vec3 vColor;
varying float vGlow;
varying float vHalo;
varying float vVisible;

void main() {
  vColor = starColor;
  vGlow = glow;
  vHalo = halo;
  vVisible = visible;

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  float depthScale = 300.0 / max(1.0, -mvPosition.z);
  gl_PointSize = visible * size * pixelRatio * depthScale;
  gl_Position = projectionMatrix * mvPosition;
}
`;

const fragmentShader = `
varying vec3 vColor;
varying float vGlow;
varying float vHalo;
varying float vVisible;

void main() {
  if (vVisible <= 0.0) discard;

  vec2 uv = gl_PointCoord - vec2(0.5);
  float dist = length(uv) * 2.0;
  if (dist > 1.0) discard;

  float core = smoothstep(0.28, 0.0, dist);
  float halo = smoothstep(1.0, 0.05, dist) * vHalo * 0.32;
  float alpha = max(core, halo) * (0.55 + vGlow);
  vec3 color = mix(vColor * 0.45, vColor, core + vGlow * 0.35);

  gl_FragColor = vec4(color, alpha);
}
`;

function starPosition(star: StarRecord): [number, number, number] {
  const ra = THREE.MathUtils.degToRad(star.ra);
  const dec = THREE.MathUtils.degToRad(star.dec);
  const cosDec = Math.cos(dec);

  return [
    star.dist * cosDec * Math.cos(ra),
    star.dist * Math.sin(dec),
    star.dist * cosDec * Math.sin(ra),
  ];
}

function categorySize(category: StarCategory, rank: number) {
  const radiusBoost = Math.log10(Math.max(1, category.radius) + 1) * 0.38;
  const rankBoost = 1 + Math.max(0, 5 - rank) * 0.16;
  return STAR_SIZE_SCALE * (category.point + radiusBoost) * rankBoost;
}

export function StarField({ filters }: { filters: StarFilters }) {
  const [data, setData] = useState<LoadedData | null>(null);

  useEffect(() => {
    let active = true;

    Promise.all([
      fetch('data/stars.json').then((response) => response.json() as Promise<StarPayload>),
      fetch('data/star-categories.json').then((response) => response.json() as Promise<CategoryPayload>),
    ]).then(([starsPayload, categoriesPayload]) => {
      if (!active) return;
      setData({
        stars: Object.values(starsPayload),
        categories: new Map(Object.values(categoriesPayload).map((category) => [category.id, category])),
      });
    });

    return () => {
      active = false;
    };
  }, []);

  const geometry = useMemo(() => {
    if (!data) return null;

    const positions: number[] = [];
    const sizes: number[] = [];
    const glows: number[] = [];
    const halos: number[] = [];
    const colors: number[] = [];
    const visible: number[] = [];
    const fallback = data.categories.get(0);

    for (const star of data.stars) {
      const category = data.categories.get(star.cat) ?? fallback;
      if (!category) continue;

      positions.push(...starPosition(star));
      sizes.push(categorySize(category, star.rank));
      glows.push(category.glow);
      halos.push(category.halo);
      colors.push(...category.color);
      visible.push(filters.categories.has(star.cat) && filters.ranks.has(star.rank) ? 1 : 0);
    }

    const bufferGeometry = new THREE.BufferGeometry();
    bufferGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    bufferGeometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
    bufferGeometry.setAttribute('glow', new THREE.Float32BufferAttribute(glows, 1));
    bufferGeometry.setAttribute('halo', new THREE.Float32BufferAttribute(halos, 1));
    bufferGeometry.setAttribute('starColor', new THREE.Float32BufferAttribute(colors, 3));
    bufferGeometry.setAttribute('visible', new THREE.Float32BufferAttribute(visible, 1));
    return bufferGeometry;
  }, [data, filters.categories, filters.ranks]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { pixelRatio: { value: Math.min(window.devicePixelRatio, 2) } },
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  );

  useEffect(() => {
    if (!geometry) return undefined;
    return () => geometry.dispose();
  }, [geometry]);

  useEffect(() => () => material.dispose(), [material]);

  if (!geometry) return null;

  return <points geometry={geometry} material={material} frustumCulled={false} />;
}
