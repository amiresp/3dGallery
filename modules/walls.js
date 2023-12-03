import * as THREE from "three";
import { modelLoader } from "./3dmodelLoader";

export function createWalls(scene, textureLoader) {
  let wallGroup = new THREE.Group();
  scene.add(wallGroup);

  const normalTexture = textureLoader.load(
    "wallTexture/smooth-stucco-Normal-dx.png"
  );
  const roughnessTexture = textureLoader.load(
    "wallTexture/smooth-stucco-Roughness.png"
  );
  const metalTexture = textureLoader.load(
    "wallTexture/smooth-stucco-Metallic.png"
  );
  const aoTexture = textureLoader.load("wallTexture/smooth-stucco-ao.png");
  const albedoTexture = textureLoader.load(
    "wallTexture/smooth-stucco-albedo.png"
  );
  // const heightTexture = textureLoader.load(
  //   "wallTexture/smooth-stucco-height.png"
  // );
  normalTexture.wrapS = normalTexture.wrapT = THREE.RepeatWrapping;
  roughnessTexture.wrapS = roughnessTexture.wrapT = THREE.RepeatWrapping;
  metalTexture.wrapS = metalTexture.wrapT = THREE.RepeatWrapping;
  aoTexture.wrapS = aoTexture.wrapT = THREE.RepeatWrapping;
  albedoTexture.wrapS = albedoTexture.wrapT = THREE.RepeatWrapping;

  const wallMaterial = new THREE.MeshStandardMaterial({
    color: 0xadadae,
    normalMap: normalTexture,
    roughnessMap: roughnessTexture,
    metalnessMap: metalTexture,
    aoMap: aoTexture,
    map: albedoTexture,

    side: THREE.DoubleSide,
  });
  // Front Wall
  const frontWall = new THREE.Mesh(
    new THREE.BoxGeometry(80, 30, 0.001),
    wallMaterial
  );

  frontWall.position.z = -40;

  // Left Wall
  const leftWall = new THREE.Mesh(
    new THREE.BoxGeometry(80, 30, 0.001),
    wallMaterial
  );
  //boardWall ataturk
  // const boardWall = new THREE.Mesh(
  //   new THREE.BoxGeometry(10, 20, 0.3),
  //   wallMaterial
  // );

  leftWall.rotation.y = Math.PI / 2;
  leftWall.position.x = -30;

  // Right Wall
  const rightWall = new THREE.Mesh(
    new THREE.BoxGeometry(80, 30, 0.001),
    wallMaterial
  );

  rightWall.position.x = 30;
  rightWall.rotation.y = Math.PI / 2;

  // Back Wall
  const backWall = new THREE.Mesh(
    new THREE.BoxGeometry(80, 30, 0.001),
    wallMaterial
  );
  backWall.position.z = 30;

  async function loadModel() {
    try {
      const horseStatue = await modelLoader(
        "./scanes/horseStatue/horse_statue_01_4k.gltf",
        "./scanes/horseStatue/textures/horse_statue_01_arm_4k.jpg",
        "./scanes/horseStatue/textures/horse_statue_01_diff_4k.jpg",
        "./scanes/horseStatue/textures/horse_statue_01_nor_gl_4k.jpg",
        scene,
        new THREE.Vector3(-17, -4, 13.949511202295831),
        new THREE.Vector3(60, 50, 60),
        Math.PI / 1.5,
        0.006
      );

      console.log("Model loaded successfully:", horseStatue);
    } catch (error) {
      console.error("Error loading the model:", error);
    }
  }

  loadModel();
  console.log("Model loaded successfully:", loadModel());

  const clasicConsole = modelLoader(
    "./scanes/classicConsole/ClassicConsole_01_4k.gltf",
    "./scanes/classicConsole/textures/ClassicConsole_01_arm_4k.jpg",
    "./scanes/classicConsole/textures/ClassicConsole_01_diff_4k.jpg",
    "./scanes/classicConsole/textures/ClassicConsole_01_nor_gl_4k.jpg",
    scene,
    new THREE.Vector3(1.1476914998039847, -4, -3),
    new THREE.Vector3(5, 4, 5),
    Math.PI / 1
  );
  wallGroup.add(frontWall, backWall, leftWall, rightWall, loadModel());

  return wallGroup;
}
