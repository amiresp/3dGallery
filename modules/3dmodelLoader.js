import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"
import * as THREE from "three"
import { checkCollision } from "./movement"

export function addBoundingBox(object3D, scene) {
  const boundingBox = new THREE.Box3().setFromObject(object3D)

  const wireframeMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    wireframe: true,
  })

  const boundingBoxGeometry = new THREE.BoxGeometry(
    boundingBox.max.x - boundingBox.min.x,
    boundingBox.max.y - boundingBox.min.y,
    boundingBox.max.z - boundingBox.min.z
  )

  const boundingBoxMesh = new THREE.Mesh(boundingBoxGeometry, wireframeMaterial)

  boundingBoxMesh.position.set(
    (boundingBox.max.x + boundingBox.min.x) / 2,
    (boundingBox.max.y + boundingBox.min.y) / 2,
    (boundingBox.max.z + boundingBox.min.z) / 2
  )

  scene.add(boundingBoxMesh)
}
export function modelLoader(
  GLTF,
  armTextureURL,
  diffTextureURL,
  roughTextureURL,
  scene,
  position,
  scale,
  rotation = undefined,
  animationSpeed = undefined
) {
  const loader = new GLTFLoader()

  const armMaterial = new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load(armTextureURL),
    roughness: 0.2,
    metalness: 0.5,
  })

  const diffMaterial = new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load(diffTextureURL),
  })

  const roughMaterial = new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load(roughTextureURL),
  })

  const object3D = new THREE.Object3D()

  loader.load(
    `${GLTF}`,
    function (gltf) {
      gltf.scene.traverse(function (node) {
        if (node.isMesh) {
          if (node.material.map) {
            if (node.name.includes("arm")) {
              node.material = armMaterial
            } else if (node.name.includes("diff")) {
              node.material = diffMaterial
            } else if (node.name.includes("rough")) {
              node.material = roughMaterial
            }
          }
          node.material.needsUpdate = true
        }
      })

      object3D.add(gltf.scene)

      object3D.position.copy(position || new THREE.Vector3(0, 0, 0))
      object3D.scale.copy(scale || new THREE.Vector3(10, 10, 10))
      object3D.rotation.y = rotation || 0

      if (animationSpeed !== undefined) {
        function animate() {
          object3D.rotation.y += animationSpeed
          requestAnimationFrame(animate)
        }

        animate()
      }

      scene.add(object3D)

      // Add bounding box for collision detection
      new THREE.Box3().setFromObject(object3D)
    },
    undefined,
    function (error) {
      console.error("Error loading the model:", error)
    }
  )

  return object3D
}
