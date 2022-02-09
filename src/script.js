import "./CSS/style.css";
import "./CSS/normalize.css";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();

// Sizes
const sizes = {
  width: innerWidth,
  height: innerHeight,
};

const target = new THREE.Vector2();
const mouse = new THREE.Vector2();

/**
 * Objects
 */
const fontLoader = new THREE.FontLoader();
fontLoader.load("/fonts/Poppins-SemiBold.json", (font) => {
  const material = new THREE.MeshNormalMaterial();
  const sentence = "creative developer awesome designs";
  const data = {
    words: sentence.split(" "),
    positions: [
      1.5 / 2 + 0.4 + 0.8 + 1.5,
      1.5 / 2 + 0.4,
      -(1.5 / 2 + 0.4),
      -(1.5 / 2 + 0.4 + 0.8 + 1.5),
    ],
  };
  let mesh;
  for (let i = 0; i < data.words.length; i++) {
    const textGeometry = new THREE.TextBufferGeometry(data.words[i], {
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
    mesh.position.y = data.positions[i];

    scene.add(mesh);
  }
  animate();
});

// Rings and boxes
const params = {};
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
    ringMesh.rotation.y = Math.cos(Math.random() * params.rotation);
    ringMesh.rotation.x = Math.sin(Math.random() * params.rotation);
    objectGroup.add(ringMesh);

    cubeMesh = new THREE.Mesh(cubeGeometry, Material);
    cubeMesh.position.x = (Math.random() - 0.5) * params.size;
    cubeMesh.position.y = (Math.random() - 0.5) * params.size;
    cubeMesh.position.z = (Math.random() - 0.5) * params.size;

    cubeMesh.rotation.z = Math.sin(Math.random() * params.rotation);
    cubeMesh.rotation.y = Math.cos(Math.random() * params.rotation);
    objectGroup.add(cubeMesh);
  }
  scene.add(objectGroup);
}
addObjects();

// Particles
const particleGeometry = new THREE.BufferGeometry();
const particleCount = 800;

const positions = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 30;
}

particleGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);
const particleMaterial = new THREE.PointsMaterial({
  size: 0.2,
  sizeAttenuation: true,
  fog: false,
  color: 0xf7f7ff,
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
camera.position.z = 20;

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
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;

/**
 * Controls
 */
let controls = null;

if (innerWidth <= 1024) {
  addControls();
} else {
  camera.position.set(0, 0, 20);

  addEventListener("mousemove", (event) => {
    mouse.x = event.clientX / window.innerWidth - 0.5;
    mouse.y = -(event.clientY / window.innerHeight - 0.5);
  });
}

function addControls() {
  camera.position.y = 4;
  camera.position.x = 4;
  camera.position.z = 40;

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.minPolarAngle = (Math.PI * 1) / 3;
  controls.maxPolarAngle = (Math.PI * 2) / 3;
  controls.minDistance = 8;
  controls.maxDistance = 45;

  controls.addEventListener("change", () => {
    renderer.render(scene, camera);
  });
}

function disposeMobileControls() {
  if (controls) controls.dispose();
}

/**
 * Update Canvas on Resize
 */
addEventListener("resize", () => {
  sizes.height = innerHeight;
  sizes.width = innerWidth;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);

  if (innerWidth <= 1024) {
    disposeMobileControls();
    addControls();
  } else {
    disposeMobileControls();
    camera.position.set(0, 0, 20);

    addEventListener("mousemove", (event) => {
      mouse.x = event.clientX / window.innerWidth - 0.5;
      mouse.y = -(event.clientY / window.innerHeight - 0.5);
    });
  }
});

const clock = new THREE.Clock();

function animate() {
  const elapsedTime = clock.getElapsedTime();

  if (objectGroup !== null) {
    objectGroup.rotation.y += Math.sin(elapsedTime) * 0.01;
    objectGroup.rotation.x += Math.sin(elapsedTime) * 0.01;

    if (innerWidth >= 1024) {
      camera.position.x += Math.sin(elapsedTime) * 3;
      camera.position.y += Math.sin(-elapsedTime) * 3;
    }
    camera.position.z += Math.sin(elapsedTime) * 0.05;

    particlePoints.rotation.y += Math.sin(elapsedTime) * 0.01;
    particlePoints.rotation.x += Math.cos(elapsedTime) * 0.01;
  }
  if (innerWidth <= 1024) {
    controls.update();
  } else {
    disposeMobileControls();

    target.x = mouse.x * 50;
    target.y = mouse.y * 50;

    camera.position.x += 0.1 * (target.x - camera.position.x);
    camera.position.y += 0.1 * (target.y - camera.position.y);
    camera.lookAt(new THREE.Vector3());
  }
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
