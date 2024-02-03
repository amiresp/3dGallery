import * as THREE from "three"
import { displayPaintingInfo, hidePaintingInfo } from "./paintingInfo.js"
import { updateMovement } from "./movement.js"

export const setupRendering = (
  scene,
  camera,
  renderer,
  paintings,
  controls,
  walls,
  horseStatue
) => {
  const sittingAnimationInfoBox = document.getElementById(
    "sittingAnimationInfoBox"
  )

  // Function to show the information box
  function showInfoBox() {
    sittingAnimationInfoBox.style.display = "block"
  }

  // Function to hide the information box
  function hideInfoBox() {
    sittingAnimationInfoBox.style.display = "none"
  }

  // Function to handle sitting animation completion
  function onSittingAnimationComplete() {
    // Hide the information box when the animation is complete
    hideInfoBox()
  }

  const clock = new THREE.Clock()

  const areaBoundaries = {
    minX: 19.7,
    maxX: 29,
    minY: 1.4,
    maxY: 2.1,
    minZ: -33,
    maxZ: -21,
  }

  let isInsideSofaArea = false // Track if the user is inside the sofa area

  let render = function () {
    const delta = clock.getDelta()

    updateMovement(delta, controls, camera, walls)

    // Check if the camera is inside the sofa area
    const { x, y, z } = camera.position
    if (
      x >= areaBoundaries.minX &&
      x <= areaBoundaries.maxX &&
      y >= areaBoundaries.minY &&
      y <= areaBoundaries.maxY &&
      z >= areaBoundaries.minZ &&
      z <= areaBoundaries.maxZ
    ) {
      if (!isInsideSofaArea) {
        // If the user entered the area, show the info box
        showInfoBox()
        isInsideSofaArea = true
      }
    } else {
      if (isInsideSofaArea) {
        // If the user left the area, hide the info box
        hideInfoBox()
        isInsideSofaArea = false
      }
    }

    const distanceThreshold = 8
    let paintingToShow
    paintings.forEach((painting) => {
      const distanceToPainting = camera.position.distanceTo(painting.position)
      if (distanceToPainting < distanceThreshold) {
        paintingToShow = painting
      }
    })

    if (paintingToShow) {
      displayPaintingInfo(paintingToShow.userData.info)
    } else {
      hidePaintingInfo()
    }

    renderer.gammaOutput = true
    renderer.gammaFactor = 2.2

    renderer.render(scene, camera)
    requestAnimationFrame(render)
  }

  render()
}
