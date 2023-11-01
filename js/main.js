import * as THREE from "three";

// Create a new scene
const scene = new THREE.Scene();

// Create a perspective camera
const camera = new THREE.PerspectiveCamera(
  75, // Field of view
  window.innerWidth / window.innerHeight, // Aspect ratio
  0.1, // Near clipping plane
  1000 // Far clipping plane
);

scene.add(camera);

// Set the camera position
camera.position.set(0, 0, 5);

// Create a WebGLRenderer with antialiasing
const renderer = new THREE.WebGLRenderer({ antialias: true });

// Set the renderer size to match the window size
renderer.setSize(window.innerWidth, window.innerHeight);

// Set the background color to black
renderer.setClearColor(0x000000, 1);

// Append the renderer's canvas element to the HTML body
document.body.appendChild(renderer.domElement);

// Create an ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 1);

// Set the ambient light position
ambientLight.position.set(0, 0, 5);

// Add the ambient light to the scene
scene.add(ambientLight);

// Create a directional light
const sunlight = new THREE.DirectionalLight(0xffffff, 1);

// Set the position of the directional light
sunlight.position.set(0, 15, 0);

// Add the directional light to the scene
scene.add(sunlight);

// Create a cube geometry
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);

// Create a basic material with red color
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

// Create a cube mesh with the geometry and material
const cube = new THREE.Mesh(cubeGeometry, material);
scene.add(cube);

//event listeners for keydown and keyup

document.addEventListener("keydown", onKeyDown, false);
document.addEventListener("keyup", onKeyUp, false);

function onKeyDown(event) {
  let keyCode = event.which;

  if (keyCode == 39) {
    camera.rotation.x += 0.1;
  } else if (keyCode == 37) {
    camera.rotation.x -= 0.1;
  }
}
///2:03:49 -- 2:04:00
function onKeyUp(event) {
  let keyCode = event.which;

  if (keyCode == 38) {
    camera.rotation.y -= 0.1;
  } else if (keyCode == 39) {
    camera.rotation.y += 0.1;
  }
}

let render = function () {
  requestAnimationFrame(render);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);

  requestAnimationFrame(render);
};

render();
