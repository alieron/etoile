import * as THREE from 'three';
import './styles.css';
import { createCamera } from './scene/camera';
import { createScene } from './scene/createScene';

const canvas = document.querySelector<HTMLCanvasElement>('#three-canvas');

if (!canvas) {
  throw new Error('Canvas element not found');
}

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
