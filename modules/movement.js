import * as THREE from "three"

export const keysPressed = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
  e: false,
  w: false,
  a: false,
  s: false,
  d: false,
  space: false,
}

export const updateMovement = (delta, controls, camera, walls) => {
  const moveSpeed = 25 * delta

  const previousPosition = camera.position.clone()

  if (keysPressed.ArrowRight || keysPressed.d) {
    controls.moveRight(moveSpeed)
  }
  if (keysPressed.ArrowLeft || keysPressed.a) {
    controls.moveRight(-moveSpeed)
  }
  if (keysPressed.ArrowUp || keysPressed.w) {
    controls.moveForward(moveSpeed)
  }
  if (keysPressed.ArrowDown || keysPressed.s) {
    controls.moveForward(-moveSpeed)
  }
  if (keysPressed.space) {
    console.log("space pressed")
    controls.getObject().position.y += moveSpeed
  }

  if (checkCollision(camera, walls)) {
    console.log("walls walls", walls)
    camera.position.copy(previousPosition)
  }
}

export const checkCollision = (camera, walls) => {
  const playerBoundingBox = new THREE.Box3()
  const cameraWorldPosition = new THREE.Vector3()
  camera.getWorldPosition(cameraWorldPosition)
  playerBoundingBox.setFromCenterAndSize(
    cameraWorldPosition,
    new THREE.Vector3(2, 2, 2)
  )

  const customBoundingBoxes = [
    new THREE.Box3(
      new THREE.Vector3(-2.5, -5, -4.450995365358674),
      new THREE.Vector3(6, 1.0, -1.3083628757721228)
    ),
    new THREE.Box3(
      new THREE.Vector3(-1.8, -5, -21),
      new THREE.Vector3(1.5, 4.0, -18)
    ),
    new THREE.Box3(
      new THREE.Vector3(24, 1.9, -33),
      new THREE.Vector3(29, 2.1, -18)
    ),
  ]

  for (let i = 0; i < customBoundingBoxes.length; i++) {
    const customBoundingBox = customBoundingBoxes[i]
    if (playerBoundingBox.intersectsBox(customBoundingBox)) {
      return true
    }
  }

  for (let i = 0; i < walls.children.length; i++) {
    const wall = walls.children[i]
    if (playerBoundingBox.intersectsBox(wall.BoundingBox)) {
      return true
    }
  }

  return false
}
