import { gsap } from "gsap";
import * as THREE from "three";

export function cameraAnimation(camera) {
  console.log("camera", Math.ceil(camera.position.y));

  if (camera.position.y == 2) {
    gsap.to(camera.position, {
      duration: 2,
      x: 28.127923611390482,
      y: 1.4,
      z: -26.188516595747853,
      onUpdate: function (tween) {
        const target = new THREE.Vector3(0, 0, 0); // Adjust the target vector as needed
        const currentPosition = camera.position.clone();
        const direction = target.sub(currentPosition).normalize();

        const lookAtMatrix = new THREE.Matrix4();
        lookAtMatrix.lookAt(currentPosition, target, camera.up);

        // Apply the rotation smoothly
        camera.quaternion.setFromRotationMatrix(lookAtMatrix);
      },
    });
  }

  if (camera.position.y == 1.4) {
    gsap.to(camera.position, {
      duration: 2,
      x: 21.029779818099268,
      y: 2,
      z: -26.850615065611173,
    });
  }
}
export function cameraJumpAnimation(camera) {
  const jumpTimeline = gsap.timeline({ paused: true });
  jumpTimeline
    .to(camera.position, { y: 4, duration: 0.5, ease: "power2.inOut" })
    .to(camera.position, { y: 2, duration: 0.5, ease: "power2.inOut" });

  document.addEventListener("keydown", (event) => {
    if (event.key === " ") {
      if (!jumpTimeline.isActive()) {
        jumpTimeline.restart();
      }
    }
  });
}
