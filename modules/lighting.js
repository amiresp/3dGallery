import * as THREE from "three";
import { GUI } from "lil-gui";

export const setupLighting = (scene, paintings) => {
  // Initialize GUI
  // const gui = new GUI();

  // Ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  // GUI for Ambient Light
  // const ambientFolder = gui.addFolder("Ambient Light");
  // ambientFolder.add(ambientLight, "intensity", 0, 2);

  function createSpotlight(x, y, z, intensity, targetPosition) {
    const spotlight = new THREE.SpotLight(0xffffff, intensity);
    spotlight.position.set(x, y, z);
    spotlight.target.position.copy(targetPosition);
    spotlight.castShadow = true;
    spotlight.angle = 1.231;
    spotlight.penumbra = 0.2;
    spotlight.decay = 1;
    spotlight.distance = 40;
    spotlight.shadow.mapSize.width = 1024;
    spotlight.shadow.mapSize.height = 1024;

    // Add spotlight and its target to the scene
    scene.add(spotlight);
    scene.add(spotlight.target);

    // Add a helper for this spotlight
    // const spotlightHelper = new THREE.SpotLightHelper(spotlight);
    // scene.add(spotlightHelper);

    // Create a GUI folder for this spotlight

    return spotlight;
  }

  const frontWallSpotlight = createSpotlight(
    0,
    20,
    -42,
    10,
    new THREE.Vector3(0, 0, -20)
  );
  scene.add(frontWallSpotlight);
  const backWallSpotlight = createSpotlight(
    0,
    10,
    10,
    15,
    new THREE.Vector3(0, 0, 20)
  );
  scene.add(backWallSpotlight);
  const leftWallSpotlight = createSpotlight(
    -13,
    6.7,
    0,
    20,
    new THREE.Vector3(-20, 0, 0)
  );
  scene.add(leftWallSpotlight);
  const rightWallSpotlight = createSpotlight(
    13,
    8,
    0,
    15,
    new THREE.Vector3(20, 0, 5)
  );
  scene.add(rightWallSpotlight);
  const statueSpotlight = createSpotlight(
    0,
    15,
    2,
    100,
    new THREE.Vector3(0, -4.2, 0)
  ); // Spotlight for the statue

  scene.add(statueSpotlight);
  statueSpotlight.angle = 0.3;
  statueSpotlight.decay = 1.5;
  statueSpotlight.penumbra = 0.2;
  statueSpotlight.distance = 0;
  //model light
  const modelLight = new THREE.PointLight(0xfcbe03, 25);
  modelLight.position.set(0, 12, -20);

  scene.add(modelLight);
  const modelLight1 = new THREE.PointLight(0xfcbe03, 50);
  modelLight1.position.set(0, 9, -20);

  scene.add(modelLight1);
};
