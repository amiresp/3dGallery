import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export default function statueLoader(scene, textureLoader) {
  const loader = new GLTFLoader();

  // Load textures using the provided textureLoader (assuming it's correctly implemented elsewhere)
  const armTexture = textureLoader.load(
    "./scanes/horseStatue/textures/horse_statue_01_arm_4k.jpg"
  );
  const diffTexture = textureLoader.load(
    "./scanes/horseStatue/textures/horse_statue_01_diff_4k.jpg"
  );
  const roughTexture = textureLoader.load(
    "./scanes/horseStatue/textures/horse_statue_01_nor_gl_4k.jpg"
  );

  const armMaterial = new THREE.MeshStandardMaterial({
    map: armTexture,
    roughness: 0.2,
    metalness: 0.5,
  });

  const diffMaterial = new THREE.MeshStandardMaterial({
    map: diffTexture,
  });

  const roughMaterial = new THREE.MeshStandardMaterial({
    map: roughTexture,
  });

  const group = new THREE.Group(); // This will hold the entire group of objects

  const object3D = new THREE.Object3D(); // This is the main 3D object

  loader.load("./scanes/horseStatue/horse_statue_01_4k.gltf", function (gltf) {
    gltf.scene.traverse(function (node) {
      if (node.isMesh) {
        // Extract the material name without considering case
        const nodeName = node.name.toLowerCase();

        // Assign materials based on the material name
        if (nodeName.includes("arm")) {
          node.material = armMaterial;
        } else if (nodeName.includes("diff")) {
          node.material = diffMaterial;
        } else if (nodeName.includes("rough")) {
          node.material = roughMaterial;
        }

        node.material.needsUpdate = true;
      }
    });

    object3D.name = "statue";
    object3D.add(gltf.scene);

    const boundingBox = new THREE.BoxHelper(object3D, 0xff0000); // Red color (0xff0000)
    boundingBox.name = "statueBoundingBox"; // Set a name for reference
    boundingBox.visible = true; // Show the bounding box

    // Apply the bounding box transformation
    boundingBox.update();

    const position = new THREE.Vector3(-17, -4, 13.949511202295831);
    const scale = new THREE.Vector3(60, 50, 60);
    const rotation = new THREE.Euler(0, Math.PI / 1.5, 0);

    object3D.position.copy(position);
    object3D.scale.copy(scale);
    object3D.rotation.copy(rotation);

    group.add(boundingBox);
    group.add(object3D);

    // Create a plane geometry
    const planeGeometry = new THREE.PlaneGeometry(200, 200);
    const planeMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      side: THREE.DoubleSide,
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = Math.PI / 2; // Rotate the plane to be horizontal
    group.add(plane);

    // Create a cube geometry
    const cubeGeometry = new THREE.BoxGeometry(10, 10, 10);
    const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(20, 5, 0); // Set the position of the cube
    group.add(cube);
  });

  return group;
}
