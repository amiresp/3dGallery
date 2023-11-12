import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import * as THREE from "three";

function DmodelLoader(
  Url,
  textureURL,
  armTextureURL,
  diffTextureURL,
  norTextureURL,
  scene,
  position,
  scale
) {
  const loader = new GLTFLoader();

  loader.load(`${Url}`, function (gltf) {
    const textureLoader = new THREE.TextureLoader();

    textureLoader.load(`${armTextureURL}`, function (armTexture) {
      textureLoader.load(`${diffTextureURL}`, function (diffTexture) {
        textureLoader.load(`${norTextureURL}`, function (norTexture) {
          gltf.scene.traverse(function (node) {
            if (node.isMesh) {
              if (node.material.map) {
                if (node.name.includes("arm")) {
                  node.material.map = armTexture;
                } else if (node.name.includes("diff")) {
                  node.material.map = diffTexture;
                } else if (node.name.includes("nor")) {
                  node.material.map = norTexture;
                }
                node.material.needsUpdate = true;
              }
            }
          });

          // Set position and scale
          gltf.scene.position.copy(position || new THREE.Vector3(0, 0, 0));
          gltf.scene.scale.copy(scale || new THREE.Vector3(1, 1, 1));

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
