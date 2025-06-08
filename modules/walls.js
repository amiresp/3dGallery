import * as THREE from "three"
// import { modelLoader } from "./3dmodelLoader"

export async function createWalls(scene, textureLoader) {
  let wallGroup = new THREE.Group()
  scene.add(wallGroup)

  const normalTexture = textureLoader.load(
    "wallTexture/smooth-stucco-Normal-dx.png"
  )
  const roughnessTexture = textureLoader.load(
    "wallTexture/smooth-stucco-Roughness.png"
  )
  const metalTexture = textureLoader.load(
    "wallTexture/smooth-stucco-Metallic.png"
  )
  const aoTexture = textureLoader.load("wallTexture/smooth-stucco-ao.png")
  const albedoTexture = textureLoader.load(
    "wallTexture/smooth-stucco-albedo.png"
  )

  // Set wrap modes
  normalTexture.wrapS = normalTexture.wrapT = THREE.RepeatWrapping
  roughnessTexture.wrapS = roughnessTexture.wrapT = THREE.RepeatWrapping
  metalTexture.wrapS = metalTexture.wrapT = THREE.RepeatWrapping
  aoTexture.wrapS = aoTexture.wrapT = THREE.RepeatWrapping
  albedoTexture.wrapS = albedoTexture.wrapT = THREE.RepeatWrapping

  const wallMaterial = new THREE.MeshStandardMaterial({
    color: 0xadadae,
    normalMap: normalTexture,
    roughnessMap: roughnessTexture,
    metalnessMap: metalTexture,
    aoMap: aoTexture,
    map: albedoTexture,
    side: THREE.DoubleSide,
  })

  const frontWall = new THREE.Mesh(
    new THREE.BoxGeometry(80, 30, 0.001),
    wallMaterial
  )
  frontWall.position.z = -40

  const leftWall = new THREE.Mesh(
    new THREE.BoxGeometry(80, 30, 0.001),
    wallMaterial
  )
  leftWall.rotation.y = Math.PI / 2
  leftWall.position.x = -30

  const rightWall = new THREE.Mesh(
    new THREE.BoxGeometry(80, 30, 0.001),
    wallMaterial
  )
  rightWall.position.x = 30
  rightWall.rotation.y = Math.PI / 2

  const backWall = new THREE.Mesh(
    new THREE.BoxGeometry(80, 30, 0.001),
    wallMaterial
  )
  backWall.position.z = 30

  wallGroup.add(frontWall, backWall, leftWall, rightWall)

  // try {
  //   const clasicConsole = modelLoader(
  //     "./scanes/classicConsole/ClassicConsole_01_4k.gltf",
  //     "./scanes/classicConsole/textures/ClassicConsole_01_arm_4k.jpg",
  //     "./scanes/classicConsole/textures/ClassicConsole_01_diff_4k.jpg",
  //     "./scanes/classicConsole/textures/ClassicConsole_01_nor_gl_4k.jpg",
  //     scene,
  //     new THREE.Vector3(1.1476914998039847, -4, -3),
  //     new THREE.Vector3(5, 4, 5),
  //     Math.PI / 1
  //   )

  //   if (clasicConsole instanceof THREE.Object3D) {
  //     wallGroup.add(clasicConsole)
  //   }
  // } catch (error) {
  //   console.error("Error loading models:", error)
  //   throw error
  // }

  return wallGroup
}
