import * as THREE from 'three';
import { colors, 
  groundMaterial, 
  floorMaterial, 
  roofMaterial, 
  windowMaterial, 
  wallMaterial, 
  woodMaterial, 
  normalMaterial, 
  standartMaterial, 
  lambert, 
  phongMaterial } from './materials';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { IWallSettings } from './shapes/baseShapes';




// init scene
let scene = new THREE.Scene();

scene.background = new THREE.Color(colors.background);

// init camera
const isocamera = false;

let camera: THREE.OrthographicCamera | THREE.PerspectiveCamera;
//test camera
// camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// camera.position.z = 5;

let cameraSettings = {
  position: new THREE.Vector3(),
  lookAt: new THREE.Vector3(),
  fov: 45,
  far: 250,
};

if (isocamera) {
  const aspect = window.innerWidth / window.innerHeight;
  const d = 20;
  camera = new THREE.OrthographicCamera(
    -d * aspect,
    d * aspect,
    d,
    -d,
    1,
    4000
  );

  camera.position.set(20, 20, 20);
  camera.rotation.order = "YXZ";
  camera.rotation.y = -Math.PI / 4;
  camera.rotation.x = Math.atan(-1 / Math.sqrt(2));
} else {
  let cameraPositionFront = {
    fov: 15,
    far: 250,
    position: new THREE.Vector3(0, 7, 60),
    lookAt: new THREE.Vector3(0, 5, 0),
  };
  let cameraPositionAngled = {
    fov: 45,
    far: 250,
    position: new THREE.Vector3(15, 15, 20),
    lookAt: new THREE.Vector3(0, 5, 0),
  };
  let cameraPositionISO = {
    fov: 15,
    far: 250,
    position: new THREE.Vector3(50, 20, 50),
    lookAt: new THREE.Vector3(0, 5, 0),
  };
  cameraSettings = cameraPositionAngled;
  camera = new THREE.PerspectiveCamera(
    cameraSettings.fov,
    window.innerWidth / window.innerHeight,
    0.1,
    cameraSettings.far
  );
  camera.position.copy(cameraSettings.position);
}


// init renderer
const canvas = document.querySelector('.webgl') as HTMLCanvasElement;
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener("resize", (event) => {
    renderer.setSize(window.innerWidth, window.innerHeight);
});


// init controls
let controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = true;
controls.target = cameraSettings.lookAt;

// add light 
const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
scene.add(ambientLight);

// Add a directional light for better illumination
const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // white light with full intensity
directionalLight.position.set(0, 1, 1); // adjust as needed
scene.add(directionalLight);

// add a ground plane
const groundPlane = new THREE.Mesh(
    new THREE.CylinderGeometry(30, 30, 1, 32),
    groundMaterial
  );
groundPlane.position.y = -0.5;
groundPlane.castShadow = true;
groundPlane.receiveShadow = true;
// The ground plane is at y = -0.5, and its height is 1
const groundPlaneHeight = 1;
const groundPlaneYPosition = -0.5;
scene.add(groundPlane);

let wallWidth = 0.2;
let wallHeight = 2;
const wall1Depth = 5; // Depth of wall1
const wall2Depth = 2; // Depth of wall2
const floorThickness = 0.05; // thickness of the floor


// Define and add the floor
const floorSettings = {
  width: wall2Depth + (wallWidth),
  height: wallWidth,
  depth: wall1Depth,
  material: new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide}),
  position: {
    x: (wall2Depth / 2),
    y: groundPlaneYPosition + (groundPlaneHeight / 2) + (floorThickness / 2)
  }
};

const floorGeometry = new THREE.BoxGeometry(floorSettings.width, floorSettings.height, floorSettings.depth);
const floor = new THREE.Mesh(floorGeometry, floorSettings.material);
floor.position.x = floorSettings.position.x;
floor.position.y = floorSettings.position.y;
scene.add(floor);

const wallsSettings: IWallSettings[] = [
  { // Wall 1
    width: wallWidth,
    height: wallHeight,
    depth: wall1Depth,
    material: wallMaterial,
    position: { y: (floorThickness / 2) + groundPlaneYPosition + (groundPlaneHeight / 2) + (wallHeight / 2) }
  },
  { // Wall 2
    width: wallWidth,
    height: wallHeight,
    depth: wall2Depth,
    material: wallMaterial,
    position: { x: (wallWidth / 2) + (wall2Depth /2 ), y: (floorThickness / 2) + groundPlaneYPosition + (groundPlaneHeight / 2) + (wallHeight / 2), z: (wall1Depth / 2) - (wallWidth / 2) },
    rotation: { y: Math.PI / 2 }
  },
  { // Wall 3
    width: wallWidth,
    height: wallHeight,
    depth: wall1Depth,
    material: wallMaterial,
    position: { x: (wall2Depth - wallWidth) + wallWidth, y: (floorThickness / 2) + groundPlaneYPosition + (groundPlaneHeight / 2) + (wallHeight / 2) }
  },
  { // Wall 4
    width: wallWidth,
    height: wallHeight,
    depth: wall2Depth,
    material: wallMaterial,
    position: { x: (wallWidth / 2) + (wall2Depth /2 ), y: (floorThickness / 2) + groundPlaneYPosition + (groundPlaneHeight / 2) + (wallHeight / 2), z: -((wall1Depth / 2) - (wallWidth / 2)) },
    rotation: { y: Math.PI / 2 }
  }
];

wallsSettings.forEach(wallSetting => {
  const geometry = new THREE.BoxGeometry(wallSetting.width, wallSetting.height, wallSetting.depth);
  const wall = new THREE.Mesh(geometry, wallSetting.material);

  if (wallSetting.position.x !== undefined) wall.position.x = wallSetting.position.x;
  wall.position.y = wallSetting.position.y;
  if (wallSetting.position.z !== undefined) wall.position.z = wallSetting.position.z;

  if (wallSetting.rotation) {
    if (wallSetting.rotation.x !== undefined) wall.rotation.x = wallSetting.rotation.x;
    if (wallSetting.rotation.y !== undefined) wall.rotation.y = wallSetting.rotation.y;
    if (wallSetting.rotation.z !== undefined) wall.rotation.z = wallSetting.rotation.z;
  }

  scene.add(wall);
});


function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();