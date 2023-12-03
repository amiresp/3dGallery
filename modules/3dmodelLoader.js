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
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();

    const armMaterial = new THREE.MeshStandardMaterial({
      map: new THREE.TextureLoader().load(armTextureURL),
      roughness: 0.2,
      metalness: 0.5,
    });

    const diffMaterial = new THREE.MeshStandardMaterial({
      map: new THREE.TextureLoader().load(diffTextureURL),
    });

    const roughMaterial = new THREE.MeshStandardMaterial({
      map: new THREE.TextureLoader().load(roughTextureURL),
    });

    let object3D;

    loader.load(
      `${GLTF}`,
      function (gltf) {
        object3D = new THREE.Object3D();

        gltf.scene.traverse(function (node) {
          if (node.isMesh) {
            if (node.material.map) {
              if (node.name.includes("arm")) {
                node.material = armMaterial;
              } else if (node.name.includes("diff")) {
                node.material = diffMaterial;
              } else if (node.name.includes("rough")) {
                node.material = roughMaterial;
              }
            }
            node.material.needsUpdate = true;
          }
        });

        object3D.add(gltf.scene);

        object3D.position.copy(position || new THREE.Vector3(0, 0, 0));
        object3D.scale.copy(scale || new THREE.Vector3(10, 10, 10));
        object3D.rotation.y = rotation || 0;

        if (animationSpeed !== undefined) {
          function animate() {
            object3D.rotation.y += animationSpeed;
            requestAnimationFrame(animate);
          }

          animate();
        }

        scene.add(object3D);

        console.log("Type of loaded object:", object3D.constructor.name);

        if (object3D instanceof THREE.Object3D) {
          resolve(object3D);
        } else {
          reject("Loaded object is not an instance of THREE.Object3D");
        }
      },
      undefined,
      function (error) {
        console.error("Error loading the model:", error);
        reject(error);
      }
    );
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
