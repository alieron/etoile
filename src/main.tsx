import * as THREE from 'three';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import { App } from './App';
import { createCamera } from './scene/camera';
import { createScene } from './scene/createScene';

const canvas = document.querySelector<HTMLCanvasElement>('#three-canvas');
const uiRoot = document.querySelector<HTMLDivElement>('#ui-root');

if (!canvas) {
  throw new Error('Canvas element not found');
}

if (!uiRoot) {
  throw new Error('UI root element not found');
}

createRoot(uiRoot).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: false,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const { scene, cube } = createScene();
const { camera, controls } = createCamera(canvas);

function resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', resize);

function animate() {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.005;
  cube.rotation.y += 0.008;

  controls.update();
  renderer.render(scene, camera);
}

animate();
