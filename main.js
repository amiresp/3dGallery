import * as THREE from "three"
import { scene, setupScene } from "./modules/scene.js"
import { createPaintings } from "./modules/paintings.js"
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

const loader = new GLTFLoader()

let { camera, controls, renderer } = setupScene()

setupAudio(camera)

const textureLoader = new THREE.TextureLoader()

const walls = await createWalls(scene, textureLoader)
const floor = setupFloor(scene)
const ceiling = createCeiling(scene, textureLoader)
const paintings = createPaintings(scene, textureLoader)
const lighting = setupLighting(scene, paintings)

createBoundingBoxes(walls, scene)
createBoundingBoxes(paintings, scene)

addObjectsToScene(scene, paintings)

setupPlayButton(controls)

setupEventListeners(controls, camera)

clickHandling(renderer, camera, paintings)

setupRendering(scene, camera, renderer, paintings, controls, walls)

//setupVR(renderer)

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

const ottoman = modelLoader(
  "./scanes/ottoman/ottoman_01_4k.gltf",
  "./scanes/ottoman/textures/ottoman_01_arm_4k.jpg",
  "./scanes/ottoman/textures/ottoman_01_diff_4k.jpg",
  "./scanes/ottoman/textures/ottoman_01_nor_gl_4k.jpg",
  scene,
  new THREE.Vector3(15, -4, 14.457978829375882),
  new THREE.Vector3(6, 5, 6)
)

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

              console.log("Camera Position:", camera.position)
              console.log("Model Position:", gltf.scene.position)
              console.log("Model Scale:", gltf.scene.scale)
              // const isColliding = updateMovement(camera, gltf.scene);
              // console.log("Collision with model:", isColliding);
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

window.addEventListener("load", () => {
  const loadingPage = document.getElementById("loading-screen")
  loadingPage.style.display = "none"
})
