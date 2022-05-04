import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// import {FlyControls} from "three/examples/jsm/controls/FlyControls.js"
import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// Loading
import { Mesh, AnimationMixer } from 'three';

// import {
//     AnimationClip,
//     AnimationMixer,
//   } from 'three';


const textureLoader = new THREE.TextureLoader();
const normalTexture = textureLoader.load('/Texture/NormalMap.png');

// let controls;
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const geometry = new THREE.SphereGeometry(.5, 64, 64);

// Materials

// const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
let model;
const loader = new GLTFLoader();
loader.load('Flamingo.glb', function (glb) {
    model = glb.scene;
    model.scale.set(0.01, 0.01, 0.01);
    scene.add(model);

})

// Lights

const pointLight = new THREE.PointLight('white', 3)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

const light1 = gui.addFolder('Light1');
light1.add(pointLight.position, 'x').min(-6).max(6).step(0.01);
light1.add(pointLight.position, 'y').min(-6).max(6).step(0.01);
light1.add(pointLight.position, 'z').min(-6).max(6).step(0.01);
light1.add(pointLight, 'intensity').min(0).max(10).step(0.01);


const light2Color = {
    color: 0xff0000
}
light1.addColor(pointLight, 'color').onChange(() => {
    pointLight.color.set(light2Color.color);
})

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.5);
scene.add(pointLightHelper)
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)



// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */

const  renderer = new THREE.WebGLRenderer({
    alpha: true,
    canvas: canvas
  });
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// controls = new OrbitControls(camera, renderer.domElement);
// const flyControls = new FlyControls(camera, renderer.domElement);

// flyControls.movementSpeed = 1;
// flyControls.rollSpeed = 0.005;
// flyControls.autoForward = true;
// flyControls.dragToLook = false;

/**
 * Animate
 */

document.addEventListener('mousemove', onDocumentMourseMove);

let mouseX = 0;
let mouseY = 0;

let targetY = 0;
let targetX = 0;

const windowX = window.innerWidth / 2;
const windowY = window.innerHeight / 2;

function onDocumentMourseMove(event) {
    mouseX = (event.clientX - windowX);
    mouseY = (event.clientY - windowY);
}

const clock = new THREE.Clock()
const mesh = new Mesh();

// turn it into an animated mesh by connecting it to a mixer

// const moveBlinkClip = new AnimationClip('move-n-blink', -1, [
//     positionKF,
//     opacityKF,
//   ]);
const mixer = new AnimationMixer(mesh);
// const action = mixer.clipAction(moveBlinkClip);
// const clock = new Clock();
// const action = mixer.clipAction(walkClip);

// immediately set the animation to play
// action.play();

// mesh.tick = (delta) => mixer.update(delta);

// updatables.push(mesh);
// you must do this every frame


const Animate = () => {

    targetX = mouseX * .001
    targetY = mouseY * .001
    // flyControls.update(0.5);
    const elapsedTime = clock.getElapsedTime()
    
    
    const delta = clock.getDelta();
    mixer.update(delta);
    // console.log(mixer.update(1));
    
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(Animate)
}

Animate()