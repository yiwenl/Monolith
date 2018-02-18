// SceneApp.js

import alfrid, { Scene, GL, TouchDetector } from 'alfrid';
import ViewMonolith from './ViewMonolith';
import ViewSphere from './ViewSphere';
import ViewTerrain from './ViewTerrain';
import ViewSave from './ViewSave';
import ViewRender from './ViewRender';
import ViewSim from './ViewSim';
import ViewDome from './ViewDome';
import PositionCapture from './PositionCapture';
import Assets from './Assets';

const AXIS_Y = vec3.fromValues(0, 1, 0);

class SceneApp extends Scene {
	constructor() {
		super();

		this._count = 0;
		this.resize();
		GL.enableAlphaBlending();

		const viewAngle = -0.15;
		this.orbitalControl.rx.value = this.orbitalControl.ry.value = viewAngle;
		this.orbitalControl.radius.value = 10;
		this.orbitalControl.rx.limit(viewAngle, viewAngle);

		this._mtxRotationMono = mat4.create();

		const cam = {
			y:0
		}

		const updateCameraY = () => {
			this.orbitalControl.center[1] = cam.y;
			this.orbitalControl.positionOffset[1] = cam.y;
		}

		updateCameraY();

		const s = 0.8;
		const mesh = alfrid.Geom.sphere(s, 12);
		this._detector = new TouchDetector(mesh, this.camera);
		this._detector.on('onHit', ()=>this._onHit());
		this._detector.on('onUp', ()=>this._onUp());
		this._touchOffset = new alfrid.EaseNumber(0);
	}


	_onHit() {
		this._touchOffset.value = 1;
	}

	_onUp() {
		this._touchOffset.value = 0;
	}

	_initTextures() {
		console.log('init textures');

		const numParticles = params.numParticles;
		const o = {
			minFilter:GL.NEAREST,
			magFilter:GL.NEAREST,
			type:GL.FLOAT
		};

		const numTargets = 5;

		this._fboCurrent  	= new alfrid.FrameBuffer(numParticles, numParticles, o, numTargets);
		this._fboTarget  	= new alfrid.FrameBuffer(numParticles, numParticles, o, numTargets);
	}


	_initViews() {
		console.log('init views');

		// this._bCopy = new alfrid.BatchCopy();
		this._vMono = new ViewMonolith();
		this._vSphere = new ViewSphere();
		this._vTerrain = new ViewTerrain();
		this._vDome = new ViewDome();

		this._captureCylinder = new PositionCapture();
		this._captureSphere = new PositionCapture();
		this._captureCylinder.capture(this._vMono);

		//	views
		this._vRender = new ViewRender();
		this._vSim 	  = new ViewSim();

		this._vSave = new ViewSave();
		GL.setMatrices(this.cameraOrtho);


		this._fboCurrent.bind();
		GL.clear(0, 0, 0, 0);
		this._vSave.render();
		this._fboCurrent.unbind();

		this._fboTarget.bind();
		GL.clear(0, 0, 0, 0);
		this._vSave.render();
		this._fboTarget.unbind();

		GL.setMatrices(this.camera);
	}


	updateFbo() {
		this._fboTarget.bind();
		GL.clear(0, 0, 0, 1);
		this._vSim.render(
			this._fboCurrent.getTexture(1), 
			this._fboCurrent.getTexture(0), 
			this._fboCurrent.getTexture(2),
			this._fboCurrent.getTexture(3),
			this._fboCurrent.getTexture(4),
			this._touchOffset.value
		);
		this._fboTarget.unbind();


		let tmp          = this._fboCurrent;
		this._fboCurrent = this._fboTarget;
		this._fboTarget  = tmp;

	}

	_renderParticles() {
		let p = this._count / params.skipCount;
		this._vRender.render(
			this._fboTarget.getTexture(0), 
			this._fboCurrent.getTexture(0), 
			p, 
			this._fboCurrent.getTexture(2),
			this._fboCurrent.getTexture(4)
		);
	}


	render() {
		this._count ++;
		if(this._count % params.skipCount == 0) {
			this._count = 0;
			this.updateFbo();
		}

		mat4.fromRotation(this._mtxRotationMono, alfrid.Scheduler.deltaTime * .2, AXIS_Y);
		this._vMono.update(this._mtxRotationMono);
		this._vSphere.update(this._mtxRotationMono);

		this._captureCylinder.capture(this._vMono);
		this._captureSphere.capture(this._vSphere);

		GL.setMatrices(this.camera);
		GL.clear(0, 0, 0, 0);


		this._vDome.render();
		this._vTerrain.render(this.heightMap, this.normalMap, Assets.get('studio_radiance'), Assets.get('irr'), Assets.get('gradient1'), Assets.get('noise'));	

		this._vMono.render(this._captureSphere.front, this._captureSphere.back, this._captureSphere.frontMatrix, this._captureSphere.backMatrix, Assets.get('studio_radiance'), Assets.get('irr'));
		this._vSphere.render(this._captureCylinder.front, this._captureCylinder.back, this._captureCylinder.frontMatrix, this._captureCylinder.backMatrix, Assets.get('studio_radiance'), Assets.get('irr'));
		this._renderParticles();
	}


	resize() {
		const { innerWidth, innerHeight, devicePixelRatio } = window;
		GL.setSize(innerWidth, innerHeight);
		this.camera.setAspectRatio(GL.aspectRatio);
	}

	get heightMap() {
		return Assets.get('height');
	}

	get normalMap() {
		return Assets.get('normal');
	}
}


export default SceneApp;