import * as THREE from "three";

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
  //boardWall
  const boardWall = new THREE.Mesh(
    new THREE.BoxGeometry(10, 20, 0.3),
    wallMaterial
  );

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

  wallGroup.add(frontWall, backWall, leftWall, rightWall, boardWall);

  return wallGroup;
}
