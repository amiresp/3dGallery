import * as THREE from "three";

export const setupFloor = (scene) => {
  const textureLoader = new THREE.TextureLoader();

  // Load the textures
  const colorTexture = textureLoader.load(
    "/WoodFloor040_4K-JPG/Marble006_1K_Color.jpg"
  );
  const displacementTexture = textureLoader.load(
    "/WoodFloor040_4K-JPG/Marble006_1K_Displacement.jpg"
  );
  const normalTexture = textureLoader.load(
    "/WoodFloor040_4K-JPG/Marble006_1K_Normal.jpg"
  );
  const roughnessTexture = textureLoader.load(
    "/WoodFloor040_4K-JPG/Marble006_1K_Roughness.jpg"
  );
  // const aoTexture = textureLoader.load("/WoodFloor040_4K-JPG/Granite.jpg");

  // create floor

  // Set texture parameters
  colorTexture.wrapS = colorTexture.wrapT = THREE.RepeatWrapping;
  displacementTexture.wrapS = displacementTexture.wrapT = THREE.RepeatWrapping;
  normalTexture.wrapS = normalTexture.wrapT = THREE.RepeatWrapping;
  roughnessTexture.wrapS = roughnessTexture.wrapT = THREE.RepeatWrapping;
  //aoTexture.wrapS = aoTexture.wrapT = THREE.RepeatWrapping;

  const planeGeometry = new THREE.PlaneGeometry(90, 90);
  const planeMaterial = new THREE.MeshStandardMaterial({
    map: colorTexture,
    displacementMap: displacementTexture,
    normalMap: normalTexture,
    roughnessMap: roughnessTexture,
    // aoMap: aoTexture,
    displacementScale: 1,
    side: THREE.DoubleSide,
  });

  const floorPlane = new THREE.Mesh(planeGeometry, planeMaterial);

  floorPlane.rotation.x = Math.PI / 2;
  floorPlane.position.y = -Math.PI;

  scene.add(floorPlane);
};
