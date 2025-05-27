import * as THREE from "three"
import { scene, setupScene } from "./modules/scene.js"
// import { createPaintings } from "./modules/paintings.js"
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
//import { setupVR } from "./modules/VRSupport.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"
import { modelLoader } from "./modules/3dmodelLoader.js"
import { fadeInText } from "./modules/animations.js"
import heroCanvas from "./modules/heroCanvas.js"
import { startAudio } from "./modules/audioGuide.js"

const loader = new GLTFLoader()

let { camera, controls, renderer } = setupScene()

setupAudio(camera)

async function fetchPaintingData(collectionId) {
  try {
    let artist, imgNumber;

    switch (collectionId) {
      case 'monet':
        artist = "Claude Monet";
        imgNumber = "2";
        break;
      case 'picasso':
        artist = "Pablo Picasso";
        imgNumber = "3";
        break;
      default:
        artist = "Vincent van Gogh";
        imgNumber = "1";
    }

    return [
      // Front Wall
      ...Array.from({ length: 4 }, (_, i) => ({
        imgSrc: `artworks/${imgNumber}.jpg`,
        width: 8,
        height: 8,
        position: { x: -20 + 15 * i, y: 4, z: -39.9 },
        rotationY: 0,
        info: {
          title: `${artist.split(' ')[1]} ${i + 1}`,
          artist: artist,
          description: `This is one of the masterpieces by ${artist}, showcasing unique style and emotional honesty. Artwork ${i + 1} perfectly encapsulates the artist's vision.`,
          year: `Year ${i + 1}`,
          link: "https://github.com/Aliozzaim",
        },
      })),

      // Back Wall
      ...Array.from({ length: 4 }, (_, i) => ({
        imgSrc: `artworks/${imgNumber}.jpg`,
        width: 5,
        height: 3,
        position: { x: -15 + 10 * i, y: 2, z: 29.9 },
        rotationY: Math.PI,
        info: {
          title: `${artist.split(' ')[1]} ${i + 5}`,
          artist: artist,
          description: `Artwork ${i + 5} by ${artist} is an exceptional piece showcasing remarkable ability to capture emotion and atmosphere.`,
          year: `Year ${i + 5}`,
          link: "https://github.com/Aliozzaim",
        },
      })),

      // Left Wall
      ...Array.from({ length: 4 }, (_, i) => ({
        imgSrc: `artworks/${imgNumber}.jpg`,
        width: 5,
        height: 3,
        position: { x: -29.9, y: 2, z: -35 + 10 * i },
        rotationY: Math.PI / 2,
        info: {
          title: `${artist.split(' ')[1]} ${i + 9}`,
          artist: artist,
          description: `With its striking use of color and brushwork, Artwork ${i + 9} is a testament to ${artist}'s artistic genius.`,
          year: `Year ${i + 9}`,
          link: "https://github.com/Aliozzaim",
        },
      })),

      // Right Wall
      ...Array.from({ length: 4 }, (_, i) => ({
        imgSrc: `artworks/${imgNumber}.jpg`,
        width: 5,
        height: 3,
        position: { x: 29.9, y: 2, z: -5 + 10 * i },
        rotationY: -Math.PI / 2,
        info: {
          title: `${artist.split(' ')[1]} ${i + 13}`,
          artist: artist,
          description: `Artwork ${i + 13} is a captivating piece by ${artist}, reflecting distinctive style and deep passion for art.`,
          year: `Year ${i + 13}`,
          link: "https://github.com/Aliozzaim",
        },
      })),
    ];
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
async function initGallery(collectionId = 'van-gogh') {
  const textureLoader = new THREE.TextureLoader()
  const paintingData = await fetchPaintingData(collectionId);

  function createPaintings(scene, textureLoader) {
    let paintings = [];

    paintingData.forEach((data) => {
      const painting = new THREE.Mesh(
        new THREE.PlaneGeometry(data.width, data.height),
        new THREE.MeshLambertMaterial({ map: textureLoader.load(data.imgSrc) })
      );

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
  startAudio()
  //setupVR(renderer)
  heroCanvas()
  const sideTable = modelLoader(
    "./scanes/sidetable/side_table_tall_01_4k.gltf",
    "./scanes/sidetable/textures/side_table_tall_01_arm_4k.jpg",
    "./scanes/sidetable/textures/side_table_tall_01_diff_4k.jpg",
    "./scanes/sidetable/textures/side_table_tall_01_nor_gl_4k.jpg",
    scene,
    new THREE.Vector3(0, -4, -19.457978829375882),
    new THREE.Vector3(8, 7, 8)
  )
  modelLoader(
    "./scanes/bust/marble_bust_01_4k.gltf",
    "./scanes/bust/textures/marble_bust_01_diff_4k.jpg",
    "./scanes/bust/textures/marble_bust_01_rough_4k.jpg",
    "./scanes/bust/textures/marble_bust_01_nor_gl_4k.jpg",
    scene,
    new THREE.Vector3(0, 0.9, -19.457978829375882),
    new THREE.Vector3(10, 7.5, 10)
  )

  // const ottoman = modelLoader(
  //   "./scanes/ottoman/ottoman_01_4k.gltf",
  //   "./scanes/ottoman/textures/ottoman_01_arm_4k.jpg",
  //   "./scanes/ottoman/textures/ottoman_01_diff_4k.jpg",
  //   "./scanes/ottoman/textures/ottoman_01_nor_gl_4k.jpg",
  //   scene,
  //   new THREE.Vector3(15, -4, 14.457978829375882),
  //   new THREE.Vector3(6, 5, 6)
  // )

  loader.load("scanes/sofa2/sofa_02_4k.gltf", function (gltf) {
    var textureLoader = new THREE.TextureLoader()

    textureLoader.load(
      "scanes/sofa2/textures/sofa_02_arm_4k.jpg",
      function (armTexture) {
        textureLoader.load(
          "scanes/sofa2/textures/sofa_02_diff_4k.jpg",
          function (diffTexture) {
            textureLoader.load(
              "scanes/sofa2/textures/sofa_02_nor_gl_4k.jpg",
              function (norTexture) {
                gltf.scene.traverse(function (node) {
                  if (node.isMesh) {
                    if (node.material.map) {
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

                      node.material.needsUpdate = true
                    }
                  }
                })

                gltf.scene.position.set(26, -5, -26)
                gltf.scene.rotation.y = -Math.PI / 2
                gltf.scene.scale.set(8, 8, 8)
                scene.add(gltf.scene)
                const spotlight = new THREE.PointLight(0xffffff, 50)

                spotlight.position.set(26, 5, -26)

                scene.add(spotlight)
                const modalLight2 = new THREE.PointLight(0xfcbe03, 50)
                modalLight2.position.set(
                  26.01742655802701,
                  1,
                  -17.795158750061965
                )
                modalLight2.castShadow = true

                scene.add(modalLight2)
                const modalLight3 = new THREE.PointLight(0xfcbe03, 50)
                modalLight3.position.set(
                  24.84175427100156,
                  0.5,
                  -34.07476250026224
                )
                modalLight3.castShadow = true

                scene.add(modalLight3)
              }
            )
          }
        )
      }
    )
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
document.getElementById('collection-select').value = collectionFromURL;
// Initial gallery load
initGallery(collectionFromURL);
window.addEventListener("load", () => {
  const loadingPage = document.getElementById("loading-screen")
  loadingPage.style.display = "none"
})
