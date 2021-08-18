import "./style.scss";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();

// Sizes
const sizes = {
  width: innerWidth,
  height: innerHeight,
};

/**
 * lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1.5, 4, 2);

// Lights helper
const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  1
)
// scene.add(directionalLight, directionalLightHelper);

/**
 * Camera
 */

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  500
);


// Shadows Camera Helper 
// const cameraHelper  = new THREE.CameraHelper(directionalLight.shadow.camera)
// scene.add(cameraHelper)

/**
 * Renderer
 */
const renderer = new THREE.WebGL1Renderer();
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

/**
 * Controls
 */
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Smooth camera movement

/**
 * Update Canvas on Resize
 */
addEventListener("resize", () => {
  sizes.height = innerHeight;
  sizes.width = innerWidth;
  
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  
  renderer.setSize(sizes.width, sizes.height);
});

/**
 * rendering frames
 */
document.body.appendChild(renderer.domElement); // add canvas to scene

function animate() {
  renderer.render(scene, camera);

  controls.update();
  // cameraHelper.update()

  requestAnimationFrame(animate);
}
animate();
