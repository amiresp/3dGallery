import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import * as THREE from "three";
import PropTypes from "prop-types";
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
  const loader = new GLTFLoader();

  loader.load(`${GLTF}`, function (gltf) {
    const textureLoader = new THREE.TextureLoader();

    textureLoader.load(`${armTextureURL}`, function (armTexture) {
      textureLoader.load(`${diffTextureURL}`, function (diffTexture) {
        textureLoader.load(`${roughTextureURL}`, function (roughTexture) {
          const object3D = new THREE.Object3D(); // Create a new Object3D

          gltf.scene.traverse(function (node) {
            if (node.isMesh) {
              if (node.material.map) {
                if (node.name.includes("arm")) {
                  node.material.map = armTexture;
                } else if (node.name.includes("diff")) {
                  node.material.map = diffTexture;
                } else if (node.name.includes("rough")) {
                  node.material.map = roughTexture;
                }
              }

              node.material.needsUpdate = true;
            }
          });

          object3D.add(gltf.scene);

          object3D.position.copy(position || new THREE.Vector3(0, 0, 0));
          object3D.scale.copy(scale || new THREE.Vector3(10, 10, 10));
          object3D.rotation.y = rotation || 0;
          console.log(object3D);
          if (animationSpeed !== undefined) {
            function animate() {
              object3D.rotation.y += animationSpeed;

              requestAnimationFrame(animate);
            }

            animate();
          }

          scene.add(object3D);
          return object3D;
        });
      });
    });
  });
}

modelLoader.propTypes = {
  GLTF: PropTypes.string.isRequired,
  armTextureURL: PropTypes.string.isRequired,
  diffTextureURL: PropTypes.string.isRequired,
  roughTextureURL: PropTypes.string.isRequired,
  scene: PropTypes.object.isRequired,
  position: PropTypes.object.isRequired,
  scale: PropTypes.object.isRequired,
  rotation: PropTypes.number,
  animationSpeed: PropTypes.number,
};

// Example usage:
// const position = new THREE.Vector3(0, 15, -20);
// const scale = new THREE.Vector3(10, 8, 10);
// DmodelLoader("your_model.gltf", "arm_texture.jpg", "diff_texture.jpg", "nor_texture.jpg", yourScene, position, scale);
