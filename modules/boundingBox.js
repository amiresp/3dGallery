import * as THREE from "three"

export const createBoundingBoxes = (objects) => {
  console.log(objects)

  if (!Array.isArray(objects)) {
    objects = objects.children
  }

  objects.forEach((object) => {
    object.BoundingBox = new THREE.Box3()
    object.BoundingBox.setFromObject(object)
  })
}
