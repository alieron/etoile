import * as THREE from 'three';

export function createScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x020617);

  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.45 }),
  );
  scene.add(cube);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
  keyLight.position.set(3, 4, 5);
  scene.add(keyLight);

  const grid = new THREE.GridHelper(8, 8, 0x334155, 0x1e293b);
  grid.position.y = -0.75;
  scene.add(grid);

  return { scene, cube };
}
