import "./style.scss";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";

/**
 * GUI
 */
const params = {};

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
  console.log(data.words, data.positions);
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
let controls = null;

if (innerWidth <= 1024) {
  addControls();
} else {
  camera.position.z = 20;
  const windowHalf = new THREE.Vector2(
    window.innerWidth / 2,
    window.innerHeight / 2
  );

  addEventListener("mousemove", (event) => {
    mouse.x = event.clientX - windowHalf.x;
    mouse.y = event.clientY - windowHalf.y;
  });
}

function addControls() {
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

function disposeControls() {
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
    addControls();
  } else {
    disposeControls();

    camera.position.z = 20;
    const windowHalf = new THREE.Vector2(
      window.innerWidth / 2,
      window.innerHeight / 2
    );

    addEventListener("mousemove", (event) => {
      mouse.x = event.clientX - windowHalf.x;
      mouse.y = event.clientY - windowHalf.y;
    });
  }
});

function animate() {
  if (innerWidth <= 1024) {
    controls.update();
  } else {
    disposeControls();

    target.x = -(1 - mouse.x) * 0.02;
    target.y = (1 - mouse.y) * 0.02;

    camera.position.x += 0.1 * (target.x - camera.position.x + 5);
    camera.position.y += 0.1 * (target.y - camera.position.y + 5);

    camera.lookAt(new THREE.Vector3());
  }

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
