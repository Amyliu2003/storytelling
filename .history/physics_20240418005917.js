import * as THREE from 'three'
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry'
import { MeshBVH, MeshBVHHelper, StaticGeometryGenerator } from 'three-mesh-bvh'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
let fwdPressed = false,
	bkdPressed = false,
	lftPressed = false,
	rgtPressed = false

const params = {
	firstPerson: false,

	displayCollider: false,
	displayBVH: false,
	visualizeDepth: 10,
	gravity: -30,
	playerSpeed: 10,
	physicsSteps: 5,

	// reset: reset,
}

export function character() {
	window.addEventListener('keydown', function (e) {
		switch (e.code) {
			case 'KeyW':
				console.log('w')
				fwdPressed = true
				break
			case 'KeyS':
				bkdPressed = true
				break
			case 'KeyD':
				rgtPressed = true
				break
			case 'KeyA':
				lftPressed = true
				break
			case 'Space':
				if (playerIsOnGround) {
					playerVelocity.y = 10.0
					playerIsOnGround = false
				}

				break
		}
	})

	window.addEventListener('keyup', function (e) {
		switch (e.code) {
			case 'KeyW':
				fwdPressed = false
				break
			case 'KeyS':
				bkdPressed = false
				break
			case 'KeyD':
				rgtPressed = false
				break
			case 'KeyA':
				lftPressed = false
				break
		}
	})

	let player = new THREE.Mesh(
		new RoundedBoxGeometry(1.0, 2.0, 1.0, 10, 0.5),
		new THREE.MeshStandardMaterial()
	)

	player.capsuleInfo = {
		radius: 0.5,
		segment: new THREE.Line3(
			new THREE.Vector3(),
			new THREE.Vector3(0, -1.0, 0.0)
		),
	}

	return player
}

export function colliderWorld() {
	new GLTFLoader().load('/dungeon.glb', (res) => {
		const gltfScene = res.scene
		gltfScene.scale.setScalar(0.01)
		const box = new THREE.Box3()

		//
	})
}
