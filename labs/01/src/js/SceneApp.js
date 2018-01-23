// SceneApp.js

import alfrid, { Scene, GL } from 'alfrid';
import ViewTerrain from './ViewTerrain';
import ViewSquare from './ViewSquare';
import Assets from './Assets';

class SceneApp extends Scene {
	constructor() {
		super();
		this.resize();
		GL.enableAlphaBlending();
		// this.orbitalControl.rx.value = this.orbitalControl.ry.value = 0.3;
		// this.orbitalControl.rx.limit(0, 0);
		this.orbitalControl.radius.value = 5;
		const cameraY = 0.75;
		this.orbitalControl.positionOffset[1] = cameraY;
		this.orbitalControl.center[1] = cameraY;


		this._lightSource = vec3.fromValues(0, 1.5, -1);
		this._lightPos = vec3.create();

		gui.add(this.orbitalControl.radius, 'value', 1, 5);

		this.normalMatrix = mat4.create();
		// mat4.translate(this.normalMatrix, this.normalMatrix, vec3.fromValues(0, -1, 0));
	}

	_initTextures() {
		console.log('init textures');
	}


	_initViews() {
		console.log('init views');

		this._bCopy = new alfrid.BatchCopy();
		this._bAxis = new alfrid.BatchAxis();
		this._bDots = new alfrid.BatchDotsPlane();
		this._bBall = new alfrid.BatchBall();

		this._vTerrain = new ViewTerrain();
		this._vSquare = new ViewSquare();
	}


	render() {
		vec3.transformMat3(this._lightPos, this._lightSource, GL._inverseModelViewMatrix);
		GL.clear(0, 0, 0, 0);
		GL.rotate(this.normalMatrix);

		this._bAxis.draw();
		this._vTerrain.render(this._lightPos);
		// this._vSquare.render();

		// GL.disable(GL.DEPTH_TEST);
		this._bBall.draw(this._lightPos, [.1, .1, .1], [1, 0, 0])
		// GL.enable(GL.DEPTH_TEST);
	}


	resize() {
		const { innerWidth, innerHeight, devicePixelRatio } = window;
		GL.setSize(innerWidth, innerHeight);
		this.camera.setAspectRatio(GL.aspectRatio);
	}
}


export default SceneApp;