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
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { modelLoader } from "./modules/3dmodelLoader.js";

const loader = new GLTFLoader();

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

//loadStatueModel(scene);

setupVR(renderer);

const sideTable = modelLoader(
  "./scanes/sidetable/side_table_tall_01_4k.gltf",
  "./scanes/sidetable/textures/side_table_tall_01_arm_4k.jpg",
  "./scanes/sidetable/textures/side_table_tall_01_diff_4k.jpg",
  "./scanes/sidetable/textures/side_table_tall_01_nor_gl_4k.jpg",
  scene,
  new THREE.Vector3(0, -4, -19.457978829375882), // Corrected syntax for position
  new THREE.Vector3(8, 7, 8) // Corrected syntax for scale
);
modelLoader(
  "./scanes/bust/marble_bust_01_4k.gltf",
  "./scanes/bust/textures/marble_bust_01_diff_4k.jpg",
  "./scanes/bust/textures/marble_bust_01_rough_4k.jpg",
  "./scanes/bust/textures/marble_bust_01_nor_gl_4k.jpg",
  scene,
  new THREE.Vector3(0, 0.9, -19.457978829375882), // Corrected syntax for position
  new THREE.Vector3(10, 7.5, 10) // Corrected syntax for scale
);

const ottoman = modelLoader(
  "./scanes/ottoman/ottoman_01_4k.gltf",
  "./scanes/ottoman/textures/ottoman_01_arm_4k.jpg",
  "./scanes/ottoman/textures/ottoman_01_diff_4k.jpg",
  "./scanes/ottoman/textures/ottoman_01_nor_gl_4k.jpg",
  scene,
  new THREE.Vector3(15, -4, 14.457978829375882), // Corrected syntax for position
  new THREE.Vector3(6, 5, 6) // Corrected syntax for scale
);
// const checkCollision = (camera, horseStatue) => {
//   console.log(horseStatue);
//   if (!horseStatue || !horseStatue.geometry) {
//     console.error("Invalid horseStatue object");
//     return false;
//   }

//   // Check if the horseStatue has the updateWorldMatrix method
//   if (!horseStatue.updateWorldMatrix) {
//     console.error(
//       "The horseStatue object does not have the updateWorldMatrix method"
//     );
//     return false;
//   }

//   const playerBoundingBox = new THREE.Box3();
//   const cameraWorldPosition = new THREE.Vector3();
//   camera.getWorldPosition(cameraWorldPosition);
//   playerBoundingBox.setFromCenterAndSize(
//     cameraWorldPosition,
//     new THREE.Vector3(2, 2, 2)
//   );

//   // Update the bounding box for the horse statue
//   const horseBoundingBox = new THREE.Box3().setFromObject(horseStatue);

//   // Check for collision with the horse statue
//   if (playerBoundingBox.intersectsBox(horseBoundingBox)) {
//     console.log("Collision with horse statue!");
//     // You can handle the collision with the horse statue here
//     return true; // Indicate that there is a collision
//   }

//   return false; // No collision
// };

// setTimeout(() => {
//   console.log("Checking collision...");
//   console.log("Camera Position:", sideTable);
//   checkCollision(camera, sideTable);
// }, 8000);

loader.load("scanes/sofa2/sofa_02_4k.gltf", function (gltf) {
  var textureLoader = new THREE.TextureLoader();

  textureLoader.load(
    "scanes/sofa2/textures/sofa_02_arm_4k.jpg",
    function (armTexture) {
      // Load diff texture
      textureLoader.load(
        "scanes/sofa2/textures/sofa_02_diff_4k.jpg",
        function (diffTexture) {
          // Load normal texture
          textureLoader.load(
            "scanes/sofa2/textures/sofa_02_nor_gl_4k.jpg",
            function (norTexture) {
              // Iterate through all the materials in the model
              gltf.scene.traverse(function (node) {
                if (node.isMesh) {
                  // Check if the material has a map property (supports textures)
                  if (node.material.map) {
                    // Assign the appropriate texture based on your naming convention
                    if (node.name.includes("arm")) {
                      node.material.map = armTexture;
                    } else if (node.name.includes("diff")) {
                      node.material.map = diffTexture;
                    } else if (node.name.includes("nor")) {
                      node.material.map = norTexture;
                    }
                    // Optional: You can set other texture-related properties here
                    // node.material.map.repeat.set(2, 2);
                    // node.material.map.offset.set(0.5, 0.5);
                    // Update the material to reflect the changes
                    node.material.needsUpdate = true;
                  }
                }
              });

              gltf.scene.position.set(26, -5, -26);
              gltf.scene.rotation.y = -Math.PI / 2;
              gltf.scene.scale.set(8, 8, 8);
              scene.add(gltf.scene);
              const spotlight = new THREE.PointLight(0xffffff, 50);

              spotlight.position.set(26, 5, -26);

              scene.add(spotlight);
              const modalLight2 = new THREE.PointLight(0xfcbe03, 50);
              modalLight2.position.set(
                26.01742655802701,
                1,
                -17.795158750061965
              );
              modalLight2.castShadow = true;

              scene.add(modalLight2);
              const modalLight3 = new THREE.PointLight(0xfcbe03, 50);
              modalLight3.position.set(
                24.84175427100156,
                0.5,
                -34.07476250026224
              );
              modalLight3.castShadow = true;

              scene.add(modalLight3);

              console.log("Camera Position:", camera.position);
              console.log("Model Position:", gltf.scene.position);
              console.log("Model Scale:", gltf.scene.scale);
              // const isColliding = updateMovement(camera, gltf.scene);
              // console.log("Collision with model:", isColliding);
            }
          );
        }
      );
    }
  );
});

// export function modelLoader2(
//   GLTF,
//   defaultTextureURL,
//   diffTextureURL,
//   norTextureURL,
//   roughTextureURL,
//   scene,
//   position,
//   scale
// ) {
//   const loader = new GLTFLoader();

//   loader.load(`${GLTF}`, function (gltf) {
//     const textureLoader = new THREE.TextureLoader();

//     textureLoader.load(`${defaultTextureURL}`, function (defaultTexture) {
//       textureLoader.load(`${diffTextureURL}`, function (diffTexture) {
//         textureLoader.load(`${norTextureURL}`, function (norTexture) {
//           textureLoader.load(`${roughTextureURL}`, function (roughTexture) {
//             gltf.scene.traverse(function (node) {
//               if (node.isMesh) {
//                 if (node.material.map) {
//                   if (node.name.includes("diff")) {
//                     node.material.map = diffTexture;
//                   } else if (node.name.includes("nor")) {
//                     node.material.map = norTexture;
//                   } else if (node.name.includes("rough")) {
//                     node.material.map = roughTexture;
//                   } else {
//                     // Use the default texture for unspecified parts
//                     node.material.map = defaultTexture;
//                   }

//                   // Optional: You can set other texture-related properties here
//                   // node.material.map.repeat.set(2, 2);
//                   // node.material.map.offset.set(0.5, 0.5);

//                   // Update the material to reflect the changes
//                   node.material.needsUpdate = true;
//                 }
//               }
//             });

//             // Set position and scale
//             gltf.scene.position.copy(position || new THREE.Vector3(0, 0, 0));
//             gltf.scene.scale.copy(scale || new THREE.Vector3(1, 1, 1));

//             scene.add(gltf.scene);
//           });
//         });
//       });
//     });
//   });
// }
// const moonGeometry = new THREE.SphereGeometry(50, 35, 35);
// const moonMaterial = new THREE.MeshBasicMaterial({
//   color: "white",
//   map: new THREE.TextureLoader().load("/img/moon-texture.jpg"),
// });
// const moon = new THREE.Mesh(moonGeometry, moonMaterial);
// moon.position.set(500, 35, -20);
// scene.add(moon);

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

loader.load("scanes/Chandelier_01_4k.gltf", function (gltf) {
  // Create a texture loader
  var textureLoader = new THREE.TextureLoader();

  // Load arm texture
  textureLoader.load(
    "scanes/textures/Chandelier_01_arm_4k.jpg",
    function (armTexture) {
      // Load diff texture
      textureLoader.load(
        "scanes/textures/Chandelier_01_diff_4k.jpg",
        function (diffTexture) {
          // Load normal texture
          textureLoader.load(
            "scanes/textures/Chandelier_01_nor_gl_4k.jpg",
            function (norTexture) {
              // Iterate through all the materials in the model
              gltf.scene.traverse(function (node) {
                if (node.isMesh) {
                  // Check if the material has a map property (supports textures)
                  if (node.material.map) {
                    // Assign the appropriate texture based on your naming convention
                    if (node.name.includes("arm")) {
                      node.material.map = armTexture;
                    } else if (node.name.includes("diff")) {
                      node.material.map = diffTexture;
                    } else if (node.name.includes("nor")) {
                      node.material.map = norTexture;
                    }
                    // Optional: You can set other texture-related properties here
                    // node.material.map.repeat.set(2, 2);
                    // node.material.map.offset.set(0.5, 0.5);
                    // Update the material to reflect the changes
                    node.material.needsUpdate = true;
                  }
                }
              });

              gltf.scene.position.set(0, 15, -20);
              gltf.scene.scale.set(10, 8, 10);
              scene.add(gltf.scene);
            }
          );
        }
      );
    }
  );
});
