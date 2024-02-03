import { keysPressed } from "./movement.js" // import the keysPressed object
import { showMenu, hideMenu } from "./menu.js" // import the showMenu function
import { startAudio, stopAudio } from "./audioGuide.js"
import { cameraAnimation } from "./cameraAnimation.js"
import { cameraJumpAnimation } from "./cameraAnimation.js"
let lockPointer = true
let showMenuOnUnlock = false

// add the controls parameter which is the pointer lock controls and is passed from main.js where setupEventListeners is called

export const setupEventListeners = (controls, camera, scene) => {
  // add the event listeners to the document which is the whole page

  document.addEventListener(
    "keydown",
    (event) => onKeyDown(event, controls, camera),
    false
  )
  document.addEventListener("keyup", (event) => onKeyUp(event, controls), false)

  controls.addEventListener("unlock", () => {
    if (showMenuOnUnlock) {
      showMenu()
    }
    showMenuOnUnlock = false
  })

  // Add event listeners for the audio guide buttons
  document.getElementById("start_audio").addEventListener("click", startAudio)
  document.getElementById("stop_audio").addEventListener("click", stopAudio)
}

// toggle the pointer lock
function togglePointerLock(controls) {
  if (lockPointer) {
    controls.lock()
  } else {
    showMenuOnUnlock = false
    controls.unlock()
  }
  lockPointer = !lockPointer // toggle the lockPointer variable
}

function onKeyDown(event, controls, camera) {
  // event is the event object that has the key property
  if (event.key in keysPressed) {
    // check if the key pressed by the user is in the keysPressed object
    keysPressed[event.key] = true // if yes, set the value of the key pressed to true
  }

  if (event.key === "Escape") {
    // if the "ESC" key is pressed
    showMenu() // show the menu
    showMenuOnUnlock = true
    controls.unlock() // unlock the pointer
    lockPointer = false
  }

  if (event.key === "p") {
    // if the "SPACE" key is pressed
    controls.unlock() // unlock the pointer
    lockPointer = false
  }

  // if key prss}ed is enter or return for mac
  if (event.key === "Enter" || event.key === "Return") {
    // if the "ENTER" key is pressed
    hideMenu() // hide the menu
    controls.lock() // lock the pointer
    lockPointer = true
  }

  if (event.key === " ") {
    // if the "p" key is pressed
    console.log("space pressed")
    cameraJumpAnimation(camera)
  }

  if (event.key === "g") {
    // if the "a" key is pressed
    startAudio() // start the audio guide
  }

  if (event.key === "p") {
    // if the "s" key is pressed
    stopAudio() // stop the audio guide
  }

  if (event.key === "m") {
    // if the "h" key is pressed
    showMenu() // show the menu
    showMenuOnUnlock = true
    controls.unlock() // unlock the pointer
    lockPointer = false
  }

  if (event.key === "r") {
    location.reload()
  }

  const areaBoundaries = {
    // for sofa aniamtion area
    minX: 19.7,
    maxX: 29,
    minY: 1.4,
    maxY: 2.1,
    minZ: -33,
    maxZ: -21,
  }

  function isPointInsideArea(point) {
    const { x, y, z } = point
    const { minX, maxX, minY, maxY, minZ, maxZ } = areaBoundaries

    return (
      x >= minX && x <= maxX && y >= minY && y <= maxY && z >= minZ && z <= maxZ
    )
  }
  // Declare isSitting variable at an appropriate scope level
  let isSitting = false

  // Function to show the information box
  function showInfoBox() {
    sittingAnimationInfoBox.textContent =
      isSitting && camera.position.y === 1.4
        ? "Press E to relax on the sofa"
        : "Press E to stand up"
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

  document.addEventListener("keydown", function (event) {
    if (event.key === "e" && isPointInsideArea(camera.position)) {
      console.log("e pressed inside the specified area", camera)
      // Remove the declaration of isSitting here
      // let isSitting = true;

      // Update the value of isSitting
      isSitting = !isSitting

      // Call showInfoBox to update the UI based on the new value of isSitting
      showInfoBox()

      // Call cameraAnimation function
      cameraAnimation(camera)
    }
  })
}

function onKeyUp(event, controls) {
  if (event.key in keysPressed) {
    keysPressed[event.key] = false
  }
}

document.getElementById("toggle-info").addEventListener("click", () => {
  document.getElementById("info-panel").classList.toggle("collapsed")
  document.getElementById("toggle-info").innerText = document
    .getElementById("info-panel")
    .classList.contains("collapsed")
    ? "Show"
    : "Hide"
})

document.getElementById("about_button").addEventListener("click", function () {
  document.getElementById("about-overlay").classList.add("show")
})

document.getElementById("close-about").addEventListener("click", function () {
  document.getElementById("about-overlay").classList.remove("show")
})
