import { keysPressed } from "./movement.js"
import { showMenu, hideMenu } from "./menu.js"
import { startAudio, stopAudio } from "./audioGuide.js"
import {
  cameraAnimation,
  cameraJumpAnimation,
  startLieDownAnimation,
  endLieDownAnimation,
} from "./cameraAnimation.js"

let lockPointer = true
let showMenuOnUnlock = false
let lieDownAnimationActive = false

export const setupEventListeners = (controls, camera, scene) => {
  document.addEventListener(
    "keydown",
    (event) => onKeyDown(event, controls, camera),
    false
  )
  document.addEventListener(
    "keyup",
    (event) => onKeyUp(event, controls, camera),
    false
  )

  controls.addEventListener("unlock", () => {
    if (showMenuOnUnlock) {
      showMenu()
    }
    showMenuOnUnlock = false
  })

  document.getElementById("stop_audio").addEventListener("click", stopAudio)
}

function onKeyDown(event, controls, camera) {
  if (event.key in keysPressed) {
    keysPressed[event.key] = true
  }

  if (event.key === "Escape") {
    showMenu()
    showMenuOnUnlock = true
    controls.unlock()
    lockPointer = false
  }

  if (event.key === "p") {
    controls.unlock()
    lockPointer = false
  }
  if (event.key === "e") {
    cameraAnimation(camera)
  }

  if (event.key === "Enter" || event.key === "Return") {
    hideMenu()
    controls.lock()
    lockPointer = true
  }

  if (event.key === " ") {
    cameraJumpAnimation(camera)
  }

  if (event.key === "g") {
    startAudio()
  }

  if (event.key === "p") {
    stopAudio()
  }

  if (event.key === "m") {
    showMenu()
    showMenuOnUnlock = true
    controls.unlock()
    lockPointer = false
  }

  if (event.key === "r") {
    location.reload()
  }

  if (event.ctrlKey) {
    startLieDownAnimation(camera)
    lieDownAnimationActive = true
  }
}

function onKeyUp(event, controls, camera) {
  if (event.key in keysPressed) {
    keysPressed[event.key] = false
  }

  if (!event.ctrlKey && lieDownAnimationActive) {
    endLieDownAnimation(camera)
    lieDownAnimationActive = false
  }
}

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOMContentLoaded event fired")

  const toggleInfoButton = document.getElementById("toggle-info")
  console.log("toggleInfoButton:", toggleInfoButton)
  toggleInfoButton.addEventListener("click", function () {
    const infoPanel = document.getElementById("info-panel")

    infoPanel.classList.toggle("collapsed")

    toggleInfoButton.innerText = infoPanel.classList.contains("collapsed")
      ? "Show"
      : "Hide"
  })

  toggleInfoButton.innerText = document
    .getElementById("info-panel")
    .classList.contains("collapsed")
    ? "Show"
    : "Hide"
  toggleInfoButton.click()
})

// document.getElementById("about_button").addEventListener("click", function () {
//   document.getElementById("about-overlay").classList.add("show")
// })

document.getElementById("close-about").addEventListener("click", function () {
  document.getElementById("about-overlay").classList.remove("show")
})
