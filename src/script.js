import "./style.scss";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";

/**
 * GUI
 */
const gui = new dat.GUI();
const params = {};

const scene = new THREE.Scene();

// Sizes
const sizes = {
  width: innerWidth,
  height: innerHeight,
};

/**
 * Objects
 */
let mesh;
let mesh2;
let mesh3;
let mesh4;
const fontLoader = new THREE.FontLoader();
fontLoader.load("/fonts/Poppins-SemiBold.json", (font) => {
  const material = new THREE.MeshNormalMaterial();

  const textGeometry = new THREE.TextBufferGeometry(`creative`, {
    font: font,
    size: 1.5,
    height: 1.8,
    curveSegments: 12,
    bevelEnabled: true,
    bevelSize: 0.05,
    bevelThickness: 0.03,
    bevelOffset: 0,
    bevelSegments: 5,
  });
  textGeometry.center();
  mesh = new THREE.Mesh(textGeometry, material);
  mesh.position.y = 1.5 / 2 + 0.8 + 0.4 + 1.5;

  scene.add(mesh);

  const textGeometry2 = new THREE.TextBufferGeometry(`developer`, {
    font: font,
    size: 1.5,
    height: 1.8,
    curveSegments: 12,
    bevelEnabled: true,
    bevelSize: 0.05,
    bevelThickness: 0.03,
    bevelOffset: 0,
    bevelSegments: 5,
  });
  textGeometry2.center();

  mesh2 = new THREE.Mesh(textGeometry2, material);
  mesh2.position.y = 1.5 / 2 + 0.4;
  scene.add(mesh2);

  const textGeometry3 = new THREE.TextBufferGeometry(`awesome`, {
    font: font,
    size: 1.5,
    height: 1.8,
    curveSegments: 12,
    bevelEnabled: true,
    bevelSize: 0.05,
    bevelThickness: 0.03,
    bevelOffset: 0,
    bevelSegments: 5,
  });
  textGeometry3.center();
  mesh3 = new THREE.Mesh(textGeometry3, material);
  mesh3.position.y = -(1.5 / 2 + 0.4);
  scene.add(mesh3);

  const textGeometry4 = new THREE.TextBufferGeometry(`designs`, {
    font: font,
    size: 1.5,
    height: 1.8,
    curveSegments: 12,
    bevelEnabled: true,
    bevelSize: 0.05,
    bevelThickness: 0.03,
    bevelOffset: 0,
    bevelSegments: 5,
  });
  textGeometry4.center();
  mesh4 = new THREE.Mesh(textGeometry4, material);
  mesh4.position.y = -(1.5 / 2 + 0.8 + 0.4 + 1.5);
  scene.add(mesh4);

  animate();
});

// Rings and boxes
params.count = 500;
params.size = 88;
params.rotation = 10;

let ringGeometry = null;
let cubeGeometry = null;
let Material = null;
let ringMesh = null;
let cubeMesh = null;

let objectGroup = null;

function addObjects() {
  if (objectGroup !== null) {
    ringGeometry.dispose();
    cubeGeometry.dispose();

    Material.dispose();
    scene.remove(objectGroup);
  }
  objectGroup = new THREE.Group();

  ringGeometry = new THREE.TorusBufferGeometry(0.3, 0.17, 16, 120);
  cubeGeometry = new THREE.BoxBufferGeometry(0.6, 0.6, 0.6);

  Material = new THREE.MeshNormalMaterial();

  for (let i = 0; i < params.count; i++) {
    ringMesh = new THREE.Mesh(ringGeometry, Material);
    ringMesh.position.x = (Math.random() - 0.5) * params.size;
    ringMesh.position.y = (Math.random() - 0.5) * params.size;
    ringMesh.position.z = (Math.random() - 0.5) * params.size;

    ringMesh.rotation.z = Math.sin(Math.random() * params.rotation);
    ringMesh.rotation.y = Math.sin(Math.random() * params.rotation);
    objectGroup.add(ringMesh);

    cubeMesh = new THREE.Mesh(cubeGeometry, Material);
    cubeMesh.position.x = (Math.random() - 0.5) * params.size;
    cubeMesh.position.y = (Math.random() - 0.5) * params.size;
    cubeMesh.position.z = (Math.random() - 0.5) * params.size;

    cubeMesh.rotation.z = Math.sin(Math.random() * params.rotation);
    cubeMesh.rotation.y = Math.sin(Math.random() * params.rotation);
    objectGroup.add(cubeMesh);
  }
  scene.add(objectGroup);
}
addObjects();

gui.add(params, "count").min(200).max(2000).step(1).onFinishChange(addObjects);

gui.add(params, "size").min(20).max(200).step(0.1).onFinishChange(addObjects);

gui
  .add(params, "rotation")
  .min(0)
  .max(30)
  .step(0.01)
  .onFinishChange(addObjects);

// Particles
const particleGeometry = new THREE.BufferGeometry();
const particleCount = 5000;

const positions = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 70;
}

particleGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);
const particleMaterial = new THREE.PointsMaterial({
  size: 0.2,
  sizeAttenuation: true,
  fog: false,
});

const particlePoints = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particlePoints);

/**
 * Camera
 */

const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  500
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 20;

// gui.add(camera.position, "x").min(-15).max(15).step(0.01);
// gui.add(camera.position, "y").min(-15).max(15).step(0.01);
// gui.add(camera.position, "z").min(-15).max(15).step(0.01);

/**
 * Renderer
 */
const renderer = new THREE.WebGL1Renderer({
  canvas: document.querySelector(".webgl"),
  alpha: true,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

/**
 * Controls
 */
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enablePan = false;
// controls.enableDamping = true; // Smooth camera movement
// controls.minPolarAngle = (Math.PI * 1) / 3;
// controls.maxPolarAngle = (Math.PI * 2) / 3;
// controls.minDistance = 8;
// controls.maxDistance = 25;

// controls.addEventListener("change", () => {
//   renderer.render(scene, camera);
// });

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

// Animations
const target = new THREE.Vector2();
const mouse = new THREE.Vector2();

const windowHalf = new THREE.Vector2(
  window.innerWidth / 2,
  window.innerHeight / 2
);

addEventListener("mousemove", (event) => {
  mouse.x = event.clientX - windowHalf.x;
  mouse.y = event.clientY - windowHalf.y;
});

const clock = new THREE.Clock();

function animate() {
  const elapsedTime = clock.getElapsedTime() * 0.1;

  // controls.update();

  target.x = -(1 - mouse.x) * 0.02;
  target.y = (1 - mouse.y) * 0.02;

  camera.position.x += 0.1 * (target.x - camera.position.x + 5);
  camera.position.y += 0.1 * (target.y - camera.position.y + 5);

  camera.lookAt(new THREE.Vector3());

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
