import * as THREE from "three";
import { scene, setupScene } from "./modules/scene.js";
import { createPaintings } from "./modules/paintings.js";
import { createWalls } from "./modules/walls.js";
import { setupLighting } from "./modules/lighting.js";
import { setupFloor } from "./modules/floor.js";
import { createCeiling } from "./modules/ceiling.js";
import { createBoundingBoxes } from "./modules/boundingBox.js";
import { setupRendering } from "./modules/rendering.js";
import { setupEventListeners } from "./modules/eventListeners.js";
import { addObjectsToScene } from "./modules/sceneHelpers.js";
import { setupPlayButton } from "./modules/menu.js";
import { setupAudio } from "./modules/audioGuide.js";
import { clickHandling } from "./modules/clickHandling.js";
import { setupVR } from "./modules/VRSupport.js";
import { loadStatueModel } from "./modules/statue.js";

let { camera, controls, renderer } = setupScene();

setupAudio(camera);

const textureLoader = new THREE.TextureLoader();

const walls = createWalls(scene, textureLoader);
const floor = setupFloor(scene);
const ceiling = createCeiling(scene, textureLoader);
const paintings = createPaintings(scene, textureLoader);
const lighting = setupLighting(scene, paintings);

createBoundingBoxes(walls);
createBoundingBoxes(paintings);

addObjectsToScene(scene, paintings);

setupPlayButton(controls);

setupEventListeners(controls);

clickHandling(renderer, camera, paintings);

setupRendering(scene, camera, renderer, paintings, controls, walls);

loadStatueModel(scene);

setupVR(renderer);

const moonGeometry = new THREE.SphereGeometry(50, 35, 35);
const moonMaterial = new THREE.MeshBasicMaterial({
  color: "white",
  map: new THREE.TextureLoader().load("/img/moon-texture.jpg"),
});
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.position.set(500, 35, -20);
scene.add(moon);

//application gltf loader
// const loader = new THREE.GLTFLoader();
// const url = "/scanes/model.gltf";
// loader.load(
//   url,
//   function (gltf) {
//     scene.add(gltf.scene);
//   },
//   undefined,
//   function (error) {
//     console.error(error);
//   }
// );

// create stars

// function createStarsInRange(
//   scene,
//   minRadius,
//   maxRadius,
//   numStars,
//   starSize,
//   starColor,
//   rotationSpeed
// ) {
//   const starGeometry = new THREE.SphereGeometry(starSize, 24, 24);
//   const starMaterial = new THREE.MeshBasicMaterial({ color: starColor });

//   const angleStep = (2 * Math.PI) / numStars;
//   const stars = new THREE.Group();

//   for (let i = 0; i < numStars; i++) {
//     const angle = i * angleStep;
//     const radius = minRadius + Math.random() * (maxRadius - minRadius);
//     const x = radius * Math.cos(angle);
//     const z = radius * Math.sin(angle);
//     const y = radius * Math.random() * 2 - radius;

//     const star = new THREE.Mesh(starGeometry, starMaterial);
//     star.position.set(x, y, z);
//     stars.add(star);
//   }

//   scene.add(stars);
//   stars.rotation.y += rotationSpeed;

//   return stars;
// }

// const starGroup = createStarsInRange(
//   scene,
//   100,
//   180,
//   400,
//   0.2,
//   "white",
//   -0.0004
// );
// const starGroup2 = createStarsInRange(
//   scene,
//   75,
//   250,
//   400,
//   0.23,
//   "#b3b3ff",
//   -0.0004
// );
// const starGroup3 = createStarsInRange(
//   scene,
//   200,
//   400,
//   4000,
//   0.2,
//   "white",
//   -0.0004
// );

// // create the bounding box for picture
// function createPicture(pictureUrl, width, height, position) {
//   const pictureGeometry = new THREE.BoxGeometry(width, height, 0.2);
//   const pictureMaterial = new THREE.MeshBasicMaterial({
//     map: new THREE.TextureLoader().load(pictureUrl),
//   });
//   const picture = new THREE.Mesh(pictureGeometry, pictureMaterial);
//   picture.position.set(position.x, position.y, position.z);
//   scene.add(picture);
// }
// const picture1 = createPicture("/artworks/0.jpg", 10, 10, {
//   x: 0,
//   y: 5,
//   z: -21.99,
// });
// const picture2 = createPicture("/artworks/1.jpg", 10, 10, {
//   x: -12,
//   y: 5,
//   z: -21.99,
// });
// const picture3 = createPicture("/artworks/2.jpg", 10, 10, {
//   x: 12,
//   y: 5,
//   z: -21.99,
// });
