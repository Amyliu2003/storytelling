import './style.css'
import * as THREE from 'three'
import { addBoilerPlateMesh, addStandardMesh } from './addMeshes'
import { addLight } from './addLights'
import Model from './Model'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { MeshBVH, acceleratedRaycast } from 'three-mesh-bvh'

const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer({ antialias: true })
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	100
)
camera.position.set(0, 0, 5)
let bvh
const raycaster = new THREE.Raycaster()

//Globals
const meshes = {}
const lights = {}
const mixers = []
const clock = new THREE.Clock()
const controls = new OrbitControls(camera, renderer.domElement)
THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree
THREE.Mesh.prototype.raycast = acceleratedRaycast

init()
function init() {
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

	//meshes
	meshes.default = addBoilerPlateMesh()
	meshes.standard = addStandardMesh()

	//lights
	lights.defaultLight = addLight()

	//changes
	meshes.default.scale.set(2, 2, 2)

	//scene operations
	scene.add(meshes.default)
	scene.add(meshes.standard)
	scene.add(lights.defaultLight)

	const mesh1 = new THREE.Mesh(
		new THREE.SphereGeometry(2, 20, 20),
		new THREE.MeshBasicMaterial()
	)
	const geometry1 = mesh1.geometry
	geometry1.boundsTree = new MeshBVH(geometry1)

	models()
	resize()
	animate()
}

function models() {
	const dungeon = new Model({
		url: 'dungeon.glb',
		scene: scene,
		meshes: meshes,
		name: 'dungeon',
	})
	dungeon.init()
}

function resize() {
	window.addEventListener('resize', () => {
		renderer.setSize(window.innerWidth, window.innerHeight)
		camera.aspect = window.innerWidth / window.innerHeight
		camera.updateProjectionMatrix()
	})
}

function checkCollision() {
	// Update the matrices of the meshes
	meshes.dungeon.updateMatrix()
	mesh2.updateMatrix()

	// Compute the bounding box of mesh1 in world space
	const box1 = new THREE.Box3().setFromObject(mesh1)

	// Iterate over the vertices of mesh2
	const vertices = mesh2.geometry.attributes.position
	for (let i = 0; i < vertices.count; i++) {
		const vertex = new THREE.Vector3().fromBufferAttribute(vertices, i)

		// Transform the vertex to world space
		vertex.applyMatrix4(mesh2.matrixWorld)

		// Check if the vertex is inside the bounding box of mesh1
		if (box1.containsPoint(vertex)) {
			// Perform raycast from the vertex towards mesh1
			raycaster.set(
				vertex,
				new THREE.Vector3()
					.subVectors(vertex, mesh1.position)
					.normalize()
			)
			const intersects = raycaster.intersectObject(mesh1, true)

			if (intersects.length > 0) {
				// Collision detected
				console.log('Collision detected between mesh1 and mesh2!')
				// Handle the collision as needed
			}
		}
	}
}

function animate() {
	requestAnimationFrame(animate)
	const delta = clock.getDelta()

	meshes.default.rotation.x += 0.01
	meshes.default.rotation.z += 0.01

	meshes.standard.rotation.x += 0.01
	meshes.standard.rotation.z += 0.01

	// meshes.default.scale.x += 0.01
	if (!modelFlag) {
		bvh = new MeshBVH(meshes.dungeon)
		modelFlag = true
	}
	// console.log(meshes.dungeon)

	renderer.render(scene, camera)
}
