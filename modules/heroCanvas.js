import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls" // Updated import path
import { TextureLoader } from "three"
import { addBoundingBox } from "./3dmodelLoader"

export default function heroCanvas() {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )

  const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("hero_canvas"),
  })
  renderer.setSize(window.innerWidth, window.innerHeight)

  camera.position.z = 3.4
  camera.position.y = 0.5
  camera.position.x = -0.5

  const lighting = new THREE.AmbientLight(0xffffff, 0.5) // Adjust intensity

  scene.add(lighting)
  const spotLight = new THREE.SpotLight(0x00ff00, 5) // Adjust intensity
  spotLight.position.set(0, 2, 2)
  spotLight.castShadow = true
  spotLight.shadow.mapSize.width = 1024
  spotLight.shadow.mapSize.height = 1024
  spotLight.shadow.camera.near = 500
  spotLight.shadow.camera.far = 4000
  spotLight.shadow.camera.fov = 30
  spotLight.target.position.set(0, -4.5, 0)
  scene.add(spotLight)
  // const directionalLight = new THREE.DirectionalLight(0xffffff, 1) // Adjust intensity
  // directionalLight.position.set(0, 0, 1)

  // scene.add(directionalLight)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.25
  controls.enableZoom = true
  controls.autoRotate = true
  controls.autoRotateSpeed = 0.5

  const loader = new GLTFLoader()

  loader.load(
    "scanes/Rhetorician/scene.gltf",
    function (gltf) {
      const textureLoader = new TextureLoader()
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          if (child.material.map) {
            child.material.map.colorSpace = THREE.sRGBEncoding // Corrected property name
            const baseColorTexture = textureLoader.load(
              "scanes/Rhetorician/textures/Crown_baseColor.png"
            )
            const emissiveTexture = textureLoader.load(
              "scanes/Rhetorician/textures/Stone_emissive.png"
            )
            child.material.map = baseColorTexture
            child.material.emissiveMap = emissiveTexture
          }
        }
      })
      // Check if animations are present in the loaded GLTF
      if (gltf.animations && gltf.animations.length) {
        const animations = gltf.animations
        const mixer = new THREE.AnimationMixer(gltf.scene)
        animations.forEach((clip) => {
          mixer.clipAction(clip).play()
        })

        // Define deltaTime variables for animation loop
        let clock = new THREE.Clock()

        // Update the mixer in your render loop
        function animate() {
          requestAnimationFrame(animate)
          let deltaTime = clock.getDelta() // Get the time elapsed since the last frame
          mixer.update(deltaTime)
          renderer.render(scene, camera)
        }
        animate()
      }
      gltf.scene.position.set(0, -4.5, 0)
      // Add the GLTF scene to your Three.js scene
      gltf.scene.scale.set(1.3, 1.2, 1.3)
      scene.add(gltf.scene)
    },
    undefined,
    function (error) {
      console.error(error)
    }
  )
  // const wall = new THREE.Mesh(
  //   new THREE.PlaneGeometry(25, 25),
  //   new THREE.MeshStandardMaterial({
  //     color: 0x000000,
  //     metalness: 0.4,
  //     roughness: 0.4,
  //   })
  // )
  // wall.rotation.x = -Math.PI / 8
  // wall.position.y = -5

  // const wallSpotLight = new THREE.SpotLight(0xffffff, 50) // Adjust intensity

  // function addBoundingBox(light, color) {
  //   const bboxGeometry = new THREE.BoxGeometry()
  //   const bboxMaterial = new THREE.MeshBasicMaterial({
  //     color: color,
  //     wireframe: true,
  //   })
  //   const bboxMesh = new THREE.Mesh(bboxGeometry, bboxMaterial)
  //   bboxMesh.position.copy(light.position)
  //   bboxMesh.scale.set(1, 1, 1) // Set scale as needed
  //   scene.add(bboxMesh)
  // }

  // wallSpotLight.position.set(0, 5, -2) // Adjusted position
  // wallSpotLight.castShadow = true
  // wallSpotLight.shadow.mapSize.width = 1024
  // wallSpotLight.shadow.mapSize.height = 1024
  // wallSpotLight.shadow.camera.near = 500
  // wallSpotLight.shadow.camera.far = 4000
  // wallSpotLight.shadow.camera.fov = 30
  // wallSpotLight.angle = Math.PI / 4
  // wallSpotLight.penumbra = 1
  // wallSpotLight.decay = 2
  // wallSpotLight.intensity = 250
  // wallSpotLight.distance = 200

  // // Create and position a target for the spotlight
  // const spotlightTarget = new THREE.Object3D()
  // spotlightTarget.position.set(2, -5, -3) // Adjusted position
  // scene.add(spotlightTarget)
  // wallSpotLight.target = spotlightTarget

  // // Add bounding box to the spotlight
  // addBoundingBox(wallSpotLight, 0x00ff00)

  // // Add the spotlight to the scene
  // scene.add(wallSpotLight)
  // scene.add(wall)

  function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
  }
  animate()
}
