import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import * as THREE from "three";

export function modelLoader(
  GLTF,
  armTextureURL,
  diffTextureURL,
  roughTextureURL,
  scene,
  position,
  scale
) {
  const loader = new GLTFLoader();

  loader.load(`${GLTF}`, function (gltf) {
    const textureLoader = new THREE.TextureLoader();

    textureLoader.load(`${armTextureURL}`, function (armTexture) {
      textureLoader.load(`${diffTextureURL}`, function (diffTexture) {
        // textureLoader.load(`${norTextureURL}`, function (norTexture) {
        textureLoader.load(`${roughTextureURL}`, function (roughTexture) {
          gltf.scene.traverse(function (node) {
            if (node.isMesh) {
              console.log("fsdfd");
              if (node.material.map) {
                if (node.name.includes("arm")) {
                  node.material.map = armTexture;
                } else if (node.name.includes("diff")) {
                  node.material.map = diffTexture;
                  // } else if (node.name.includes("nor")) {
                  //   node.material.map = norTexture;
                } else if (node.name.includes("rough")) {
                  node.material.map = roughTexture;
                }
              }

              node.material.needsUpdate = true;
            }
          });

          gltf.scene.position.copy(position || new THREE.Vector3(0, 0, 0));
          gltf.scene.scale.copy(scale || new THREE.Vector3(10, 10, 10));

          scene.add(gltf.scene);
        });
      });
    });
  });
}

// Example usage:
// const position = new THREE.Vector3(0, 15, -20);
// const scale = new THREE.Vector3(10, 8, 10);
// DmodelLoader("your_model.gltf", "arm_texture.jpg", "diff_texture.jpg", "nor_texture.jpg", yourScene, position, scale);
