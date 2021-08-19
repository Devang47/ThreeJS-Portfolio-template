import "./style.scss";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Mesh } from "three";

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

/**
 * Objects
 */
const fontLoader = new THREE.FontLoader();
fontLoader.load("/fonts/Poppins-SemiBold.json", (font) => {
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
  const material = new THREE.MeshNormalMaterial();
  const mesh = new THREE.Mesh(textGeometry, material);
  mesh.position.y = 1 / 2 + 2.5;

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
  const material2 = new THREE.MeshNormalMaterial();
  const mesh2 = new THREE.Mesh(textGeometry2, material2);
  mesh2.position.y = 1 / 2;
  scene.add(mesh2);

  const textGeometry3 = new THREE.TextBufferGeometry(`beautiful`, {
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
  const material3 = new THREE.MeshNormalMaterial();
  const mesh3 = new THREE.Mesh(textGeometry3, material3);
  mesh3.position.y = 1 / 2 - 2.5;
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
  const material4 = new THREE.MeshNormalMaterial();
  const mesh4 = new THREE.Mesh(textGeometry4, material4);
  mesh4.position.y = 1 / 2 - 5;
  scene.add(mesh4);
});

// Rings and boxes
let itemsCount = 300;
const ringGeometry = new THREE.TorusBufferGeometry(0.3, 0.17, 16, 120);
const cubeGeometry = new THREE.BoxBufferGeometry(0.6, 0.6, 0.6);
const Material = new THREE.MeshNormalMaterial();

for (let i = 0; i < itemsCount; i++) {
  const ringMesh = new THREE.Mesh(ringGeometry, Material);
  ringMesh.position.x = (Math.random() - 0.5) * 80;
  ringMesh.position.y = (Math.random() - 0.5) * 80;
  ringMesh.position.z = (Math.random() - 0.5) * 80;

  ringMesh.rotation.z = Math.sin(Math.random() * 10);
  ringMesh.rotation.y = Math.sin(Math.random() * 10);
  scene.add(ringMesh);

  const cubeMesh = new THREE.Mesh(cubeGeometry, Material);
  cubeMesh.position.x = (Math.random() - 0.5) * 80;
  cubeMesh.position.y = (Math.random() - 0.5) * 80;
  cubeMesh.position.z = (Math.random() - 0.5) * 80;

  cubeMesh.rotation.z = Math.sin(Math.random() * 10);
  cubeMesh.rotation.y = Math.sin(Math.random() * 10);
  scene.add(cubeMesh);
}

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
});

const particlePoints = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particlePoints);


/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
  55,
  sizes.width / sizes.height,
  0.1,
  500
);
camera.position.set(-2, -2, 10);


/**
 * Renderer
 */
const renderer = new THREE.WebGL1Renderer({
  canvas: document.querySelector(".webgl"),
  alpha: true,
});
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

const clock = new THREE.Clock();
function animate() {
  const elapsedTime = clock.getElapsedTime() * 0.1;

  renderer.render(scene, camera);
  controls.update();

  requestAnimationFrame(animate);
}
animate();
