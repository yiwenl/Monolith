// ViewSphere.js

import alfrid, { GL } from 'alfrid';
import vs from 'shaders/sphere.vert';
import fs from 'shaders/sphere.frag';
import fsPos from 'shaders/position.frag';
import Assets from './Assets';
import Drag from './utils/Drag';

var random = function(min, max) { return min + Math.random() * (max - min);	}

class ViewSphere extends alfrid.View {
	
	constructor() {
		super(vs, fs);

		this.shaderPosition = new alfrid.GLShader(vs, fsPos);

		this.mtx = mat4.create();
		this.axis = vec3.fromValues(random(-1, 1), 2, random(-1, 1));
		vec3.normalize(this.axis, this.axis);
		this._theta = Math.random() * 0xFF;
		this.angle = new alfrid.EaseNumber(this._theta);

		this._drag = new Drag();
		this._drag.on('onDragStart', ()=> {
			this._theta = this.angle.value;
		});

		this._drag.on('onDrag', (e)=> {
			this.angle.value = this._theta + e.detail.dist.x * 0.1;
		});
	}


	_init() {
		this.mesh = Assets.get('sphere');
	}


	update(mtxGlobalRot) {
		mat4.fromRotation(this.mtx, this.angle.value, this.axis);
		mat4.multiply(this.mtx, mtxGlobalRot, this.mtx);
	}



	render(textureFront, textureBack, mtxFront, mtxBack) {
		this.shader.bind();
		this.shader.uniform("uLocalMatrix", "mat4", this.mtx);
		this.shader.uniform("textureFront", "uniform1i", 0);
		textureFront.bind(0);
		this.shader.uniform("textureBack", "uniform1i", 1);
		textureBack.bind(1);
		this.shader.uniform("uMatrixFront", "mat4", mtxFront);
		this.shader.uniform("uMatrixBack", "mat4", mtxBack);
		GL.draw(this.mesh);
	}


	renderPosition() {
		this.shaderPosition.bind();
		this.shaderPosition.uniform("uLocalMatrix", "mat4", this.mtx);
		GL.draw(this.mesh);
	}
}

export default ViewSphere;