import * as THREE from "three"
import { scene, setupScene } from "./modules/scene.js"
import { createWalls } from "./modules/walls.js"
import { setupLighting } from "./modules/lighting.js"
import { setupFloor } from "./modules/floor.js"
import { createCeiling } from "./modules/ceiling.js"
import { createBoundingBoxes } from "./modules/boundingBox.js"
import { setupRendering } from "./modules/rendering.js"
import { setupEventListeners } from "./modules/eventListeners.js"
import { addObjectsToScene } from "./modules/sceneHelpers.js"
import { setupPlayButton } from "./modules/menu.js"
import { setupAudio } from "./modules/audioGuide.js"
import { clickHandling } from "./modules/clickHandling.js"

import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"
import { fadeInText } from "./modules/animations.js"
import { startAudio } from "./modules/audioGuide.js"

const loader = new GLTFLoader()

let { camera, controls, renderer } = setupScene()

setupAudio(camera)

async function fetchPaintingData(collectionId) {
  console.log('call api Painting', collectionId);
  if (!collectionId) {
    collectionId = 'modern-room';
  }
  let output = [];
  try {
    const response = await fetch(`http://141.11.182.36:8000/api/rooms/${collectionId}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    if (Array.isArray(data.images)) {
      data.images.forEach((img, i) => {
        const wall = i % 4
        let position, rotationY

        switch (wall) {
          case 0: // Front
            position = { x: -20 + 15 * (i % 4), y: 4, z: -39.9 }
            rotationY = 0
            break
          case 1: // Back
            position = { x: -15 + 10 * (i % 4), y: 2, z: 29.9 }
            rotationY = Math.PI
            break
          case 2: // Left
            position = { x: -29.9, y: 2, z: -35 + 10 * (i % 4) }
            rotationY = Math.PI / 2
            break
          case 3: // Right
            position = { x: 29.9, y: 2, z: -5 + 10 * (i % 4) }
            rotationY = -Math.PI / 2
            break
        }

        output.push({
          imgSrc: img.image,
          width: 7,
          height: 5,
          position,
          rotationY,
          info: {
            title: `${data.title} ${i + 1}`,
            artist: data.title,
            description: img.caption,
            year: `Year ${i + 1}`,
            link: "#",
          },
        });
        // return {
        //   imgSrc: img.image,
        //   width: 5,
        //   height: 3,
        //   position,
        //   rotationY,
        //   info: {
        //     title: `${data.title} ${i + 1}`,
        //     artist: data.title,
        //     description: img.caption,
        //     year: `Year ${i + 1}`,
        //     link: "https://github.com/Aliozzaim",
        //   },
        // }
      });
      return output;
    }

  } catch (error) {
    console.error("Error fetching painting data:", error);
    return [];
  }
}

// Add this function to handle collection changes
function handleCollectionChange(collectionId) {
  // Clear existing paintings
  scene.children = scene.children.filter(child => child.userData.type !== 'painting');

  // Reinitialize gallery with new collection
  initGallery(collectionId);
}

// Modify initGallery to accept collectionId
async function initGallery(collectionId = 'classic-room') {
  const textureLoader = new THREE.TextureLoader()
  const paintingData = await fetchPaintingData(collectionId);

  console.log("Painting Data:", paintingData);

  async function createPaintings(scene, textureLoader) {
    let paintings = [];

    paintingData.forEach((data) => {
      const geometry = new THREE.PlaneGeometry(data.width, data.height);
      const texture = textureLoader.load(data.imgSrc);
      const material = new THREE.MeshLambertMaterial({ map: texture });

      const painting = new THREE.Mesh(geometry, material);

      painting.position.set(data.position.x, data.position.y, data.position.z);
      painting.rotation.y = data.rotationY;

      painting.userData = {
        type: "painting",
        info: data.info,
        url: data.info.link,
      };

      painting.castShadow = true;
      painting.receiveShadow = true;

      paintings.push(painting);
    });


    return paintings;
  }

  Promise.all([
    createWalls(scene, textureLoader),
    setupFloor(scene),
    createCeiling(scene, textureLoader),

    createPaintings(scene, textureLoader),
  ])
    .then(([walls, floor, ceiling, paintings]) => {
      const lighting = setupLighting(scene, paintings)

      createBoundingBoxes(walls, scene)
      createBoundingBoxes(paintings, scene)

      addObjectsToScene(scene, paintings)

      setupPlayButton(controls)

      // Setup event listeners for controls and camera
      setupEventListeners(controls, camera)

      // Handle click events on paintings
      clickHandling(renderer, camera, paintings)

      // Setup rendering
      setupRendering(scene, camera, renderer, paintings, controls, walls)
    })
    .catch((error) => {
      console.error("Error loading assets:", error)
    })

  loader.load("scanes/Chandelier_01_4k.gltf", function (gltf) {
    // Create a texture loader
    var textureLoader = new THREE.TextureLoader()

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
                        node.material.map = armTexture
                      } else if (node.name.includes("diff")) {
                        node.material.map = diffTexture
                      } else if (node.name.includes("nor")) {
                        node.material.map = norTexture
                      }
                      // Optional: You can set other texture-related properties here
                      // node.material.map.repeat.set(2, 2);
                      // node.material.map.offset.set(0.5, 0.5);
                      // Update the material to reflect the changes
                      node.material.needsUpdate = true
                    }
                  }
                })

                gltf.scene.position.set(0, 15, -20)
                gltf.scene.scale.set(10, 8, 10)
                scene.add(gltf.scene)
              }
            )
          }
        )
      }
    )
  })
  fadeInText()
}

// Add event listener for collection change
document.addEventListener('DOMContentLoaded', () => {
  const collectionSelect = document.getElementById('collection-select');
  if (collectionSelect) {
    collectionSelect.addEventListener('change', (e) => {
      const selectedValue = e.target.value;
      const url = new URL(window.location.href);
      const params = url.searchParams;

      // اگر مقدار انتخاب‌شده قبلاً در URL بود، حذفش کن (toggle)
      if (params.get('collection') === selectedValue) {
        params.delete('collection');
      } else {
        params.set('collection', selectedValue);
      }

      // آپدیت URL بدون رفرش صفحه
      window.history.replaceState({}, '', `${url.pathname}?${params.toString()}`);

      window.location.reload();
      // handleCollectionChange(e.target.value);
    });
  }
});

const params = new URLSearchParams(window.location.search);
const collectionFromURL = params.get('collection');
console.log(collectionFromURL);
if (collectionFromURL) {
  document.getElementById('collection-select').value = collectionFromURL;
  // Initial gallery load
  initGallery(collectionFromURL);
}
window.addEventListener("load", () => {
  const loadingPage = document.getElementById("loading-screen")
  loadingPage.style.display = "none"
})

window.handleCollectionChange = handleCollectionChange;
