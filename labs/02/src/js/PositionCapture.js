// PositionCapture.js

import alfrid, { GL } from 'alfrid';

const biasMatrix = mat4.fromValues(
	0.5, 0.0, 0.0, 0.0,
	0.0, 0.5, 0.0, 0.0,
	0.0, 0.0, 0.5, 0.0,
	0.5, 0.5, 0.5, 1.0
);

class PositionCapture {

	constructor() {
		let s = 4;
		let y = 0;
		//	static front and back cameras
		this.pointSource0 = vec3.fromValues(0, y, 5);
		this.pointSource1 = vec3.fromValues(0, y, -5);

		this._cameraLight0 = new alfrid.CameraOrtho();
		this._cameraLight0.ortho(-s, s, -s, s, 1, 50);
		this._cameraLight0.lookAt(this.pointSource0, [0, y, 0]);

		this._cameraLight1 = new alfrid.CameraOrtho();
		this._cameraLight1.ortho(-s, s, -s, s, 1, 50);
		this._cameraLight1.lookAt(this.pointSource1, [0, y, 0]);

		this._shadowMatrix0 = mat4.create();
		this._shadowMatrix1 = mat4.create();

		mat4.multiply(this._shadowMatrix0, this._cameraLight0.projection, this._cameraLight0.viewMatrix);
		mat4.multiply(this._shadowMatrix0, biasMatrix, this._shadowMatrix0);

		mat4.multiply(this._shadowMatrix1, this._cameraLight1.projection, this._cameraLight1.viewMatrix);
		mat4.multiply(this._shadowMatrix1, biasMatrix, this._shadowMatrix1);

		//	frame buffers
		const size = 512 * 1;
		const params = {
			type:GL.FLOAT,
			minFilter:GL.LINEAR,
			magFilter:GL.LINEAR,
		};
		this._fboFront = new alfrid.FrameBuffer(size, size, params);
		this._fboBack = new alfrid.FrameBuffer(size, size, params);
	}


	capture(mView) {
		if(mView.renderPosition) {
			this._fboFront.bind();
			GL.clear(0, 0, 0, 0);
			GL.setMatrices(this._cameraLight0);
			mView.renderPosition();
			this._fboFront.unbind();

			this._fboBack.bind();
			GL.clear(0, 0, 0, 0);
			GL.setMatrices(this._cameraLight1);
			mView.renderPosition();
			this._fboBack.unbind();
		}
	}


	get front() {	return this._fboFront.getTexture();	}

	get back() {	return this._fboBack.getTexture();	}

	get frontMatrix() {
		return this._shadowMatrix0;
	}

	get backMatrix() {
		return this._shadowMatrix1;
	}
}

export default PositionCapture;