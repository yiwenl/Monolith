// SceneApp.js

import alfrid, { Scene, GL } from 'alfrid';
import ViewMonolith from './ViewMonolith';
import ViewSphere from './ViewSphere';
import PositionCapture from './PositionCapture';
import Assets from './Assets';

const AXIS_Y = vec3.fromValues(0, 1, 0);

class SceneApp extends Scene {
	constructor() {
		super();
		this.resize();
		GL.enableAlphaBlending();
		this.orbitalControl.rx.value = this.orbitalControl.ry.value = 0.3;
		this.orbitalControl.radius.value = 11;

		this._mtxRotationMono = mat4.create();

		const f = gui.addFolder('Camera');
		const cam = {
			y:0
		}

		const updateCameraY = () => {
			this.orbitalControl.center[1] = cam.y;
			this.orbitalControl.positionOffset[1] = cam.y;
		}

		updateCameraY();

		f.add(this.orbitalControl.radius, 'value', 5, 20).name('Zoom');
		f.add(cam, 'y', -10, 10).name('Camera Y').onChange( updateCameraY );
		f.open();

		const fMono = gui.addFolder('monolith');
		fMono.open();
		fMono.add(params.monolith, 'uRoughness', 0, 1);
		fMono.add(params.monolith, 'uSpecular', 0, 1);
		fMono.add(params.monolith, 'uMetallic', 0, 1);
	}

	_initTextures() {
		console.log('init textures');
	}


	_initViews() {
		console.log('init views');

		this._bCopy = new alfrid.BatchCopy();
		this._bAxis = new alfrid.BatchAxis();
		this._bDots = new alfrid.BatchDotsPlane();

		// this._vModel = new ViewObjModel();
		this._vMono = new ViewMonolith();
		this._vSphere = new ViewSphere();

		this._captureCylinder = new PositionCapture();
		this._captureSphere = new PositionCapture();
		this._captureCylinder.capture(this._vMono);
	}


	render() {
		mat4.fromRotation(this._mtxRotationMono, alfrid.Scheduler.deltaTime * .2, AXIS_Y);
		this._vMono.update(this._mtxRotationMono);
		this._vSphere.update(this._mtxRotationMono);

		this._captureCylinder.capture(this._vMono);
		this._captureSphere.capture(this._vSphere);

		GL.setMatrices(this.camera);
		GL.clear(0, 0, 0, 0);

		// this._bSky.draw(Assets.get('studio_radiance'));

		this._bAxis.draw();
		this._bDots.draw();

		// this._vModel.render(Assets.get('studio_radiance'), Assets.get('irr'), Assets.get('aomap'));
		this._vMono.render(this._captureSphere.front, this._captureSphere.back, this._captureSphere.frontMatrix, this._captureSphere.backMatrix, Assets.get('studio_radiance'), Assets.get('irr'));
		this._vSphere.render(this._captureCylinder.front, this._captureCylinder.back, this._captureCylinder.frontMatrix, this._captureCylinder.backMatrix, Assets.get('studio_radiance'), Assets.get('irr'));
		// this._vMono.renderPosition();
		// this._vSphere.render();


		/*.
		let s = 200;
		GL.viewport(0, 0, s, s);
		this._bCopy.draw(this._captureCylinder.front);

		GL.viewport(s, 0, s, s);
		this._bCopy.draw(this._captureCylinder.back);

		GL.viewport(s * 2, 0, s, s);
		this._bCopy.draw(this._captureSphere.front);

		GL.viewport(s * 3, 0, s, s);
		this._bCopy.draw(this._captureSphere.back);
		//*/
	}


	resize() {
		const { innerWidth, innerHeight, devicePixelRatio } = window;
		GL.setSize(innerWidth, innerHeight);
		this.camera.setAspectRatio(GL.aspectRatio);
	}
}


export default SceneApp;