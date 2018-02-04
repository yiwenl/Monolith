// SceneApp.js

import alfrid, { Scene, GL } from 'alfrid';
import ViewTerrainTile from './ViewTerrainTile';
import ViewSquare from './ViewSquare';
import ViewNoise from './ViewNoise';
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
		this.normalMatrix = mat4.create();
		// mat4.translate(this.normalMatrix, this.normalMatrix, vec3.fromValues(0, -1, 0));

		this.useTile = true;
		gui.add(this, 'useTile');
	}

	_initTextures() {
		console.log('init textures');

		const size = 2048;
		const o = {
			minFilter:GL.LINEAR,
			magFilter:GL.LINEAR,
			type:GL.FLOAT
		};
		this._fboTerrain = new alfrid.FrameBuffer(size, size, o, 2);
	}


	_initViews() {
		console.log('init views');

		this._bCopy = new alfrid.BatchCopy();
		this._bAxis = new alfrid.BatchAxis();
		this._bDots = new alfrid.BatchDotsPlane();
		this._bBall = new alfrid.BatchBall();

		this._vTerrainTile = new ViewTerrainTile();
		this._vSquare = new ViewSquare();
		this._vNoise = new ViewNoise();

		this._fboTerrain.bind();
		GL.clear();
		this._vNoise.render();
		this._fboTerrain.unbind();
	}


	render() {
		vec3.transformMat3(this._lightPos, this._lightSource, GL._inverseModelViewMatrix);
		GL.clear(0, 0, 0, 0);
		GL.rotate(this.normalMatrix);

		this._bAxis.draw();
		this._vTerrainTile.render(this._lightPos, this.heightMap, this.normalMap, Assets.get('studio_radiance'), Assets.get('irr'));	
		
		

		// this._vSquare.render();

		// GL.disable(GL.DEPTH_TEST);
		this._bBall.draw(this._lightPos, [.1, .1, .1], [1, 0, 0])
		// GL.enable(GL.DEPTH_TEST);

		//*/
		const s = 200;
		GL.viewport(0, 0, s, s);
		this._bCopy.draw(this.heightMap);
		GL.viewport(s, 0, s, s);
		this._bCopy.draw(this.normalMap);
		//*/
	}


	resize() {
		const { innerWidth, innerHeight, devicePixelRatio } = window;
		GL.setSize(innerWidth, innerHeight);
		this.camera.setAspectRatio(GL.aspectRatio);
	}

	get heightMap() {
		return this._fboTerrain.getTexture(0);
	}

	get normalMap() {
		return this._fboTerrain.getTexture(1);
	}
}


export default SceneApp;