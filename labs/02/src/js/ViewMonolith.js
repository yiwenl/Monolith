// ViewMonolith.js

import alfrid, { GL } from 'alfrid';
import Assets from './Assets';
import vs from 'shaders/mono.vert';
import fs from 'shaders/mono.frag';
import fsPosition from 'shaders/position.frag';
import Drag from './utils/Drag';

var random = function(min, max) { return min + Math.random() * (max - min);	}

class ViewMonolith extends alfrid.View {
	
	constructor() {
		super(vs, fs);

		this.shaderPosition = new alfrid.GLShader(vs, fsPosition);

		this.mtx = mat4.create();
		this.axis = vec3.fromValues(random(-1, 1), 8, random(-1, 1));
		vec3.normalize(this.axis, this.axis);
		
		this._theta = Math.random() * 0xFF;
		this.angle = new alfrid.EaseNumber(this._theta, 0.04);

		this._drag = new Drag();
		this._drag.on('onDragStart', ()=> {
			this._theta = this.angle.value;
		});

		this._drag.on('onDrag', (e)=> {
			this.angle.value = this._theta - e.detail.dist.x * 0.025;
		});
	}


	_init() {
		const h = 3;
		const r = 0.5;
		const num = 7;
		const positions = [];
		const normals = [];
		const uvs = [];
		const indices = [];
		let count = 0;

		let angles = [];
		let total = 0;
		for(let i=0; i<num; i++) {
			let a = random(.1, .5);
			angles.push(a);
			total += a;
		}

		angles = angles.map( a=> a/total);
		let t = 0;
		angles = angles.map( a => {
			let na = a + t;
			t += a;
			return na;
		});
		angles.unshift(0);

		const getPos = (i, j) => {
			// let a = i/num * Math.PI * 2.0;
			let a = angles[i] * Math.PI * 2.0;
			const y = (j - .5 ) * h;
			const x = Math.cos(a) * r;
			const z = Math.sin(a) * r;
			return [x, y, z];
		}

		const getNormal = (i) => {
			let a0 = angles[i] * Math.PI * 2.0;
			let a1 = angles[i+1] * Math.PI * 2.0;
			let a = (a0 + a1) * 0.5;
			const v = vec3.fromValues(Math.cos(a) * r, 0, Math.sin(a) * r);

			return v;
		}

		for(let i=0; i<num; i++) {
			positions.push(getPos(i, 1));
			positions.push(getPos(i+1, 1));
			positions.push(getPos(i+1, 0));
			positions.push(getPos(i, 0));

			let n = getNormal(i);
			normals.push(n);
			normals.push(n);
			normals.push(n);
			normals.push(n);

			uvs.push([i/num, 0]);
			uvs.push([(i+1)/num, 0]);
			uvs.push([(i+1)/num, 1]);
			uvs.push([i/num, 1]);

			indices.push(count * 4 + 0);
			indices.push(count * 4 + 1);
			indices.push(count * 4 + 2);
			indices.push(count * 4 + 0);
			indices.push(count * 4 + 2);
			indices.push(count * 4 + 3);

			count ++;
		}


		this.mesh = new alfrid.Mesh();
		this.mesh.bufferVertex(positions);
		this.mesh.bufferTexCoord(uvs);
		this.mesh.bufferNormal(normals);
		this.mesh.bufferIndex(indices);
	}


	update(mtxGlobalRot) {
		mat4.fromRotation(this.mtx, this.angle.value, this.axis);
		mat4.multiply(this.mtx, mtxGlobalRot, this.mtx);
	}



	render(textureFront, textureBack, mtxFront, mtxBack, textureRad, textureIrr) {
		this.shader.bind();
		this.shader.uniform("uLocalMatrix", "mat4", this.mtx);
		this.shader.uniform("textureFront", "uniform1i", 0);
		textureFront.bind(0);
		this.shader.uniform("textureBack", "uniform1i", 1);
		textureBack.bind(1);
		this.shader.uniform("uMatrixFront", "mat4", mtxFront);
		this.shader.uniform("uMatrixBack", "mat4", mtxBack);

		this.shader.uniform("textureDiffuse", "uniform1i", 2);
		Assets.get('ink').bind(2);

		this.shader.uniform("textureNormal", "uniform1i", 3);
		Assets.get('concreteNormal').bind(3);


		this.shader.uniform('uRadianceMap', 'uniform1i', 4);
		this.shader.uniform('uIrradianceMap', 'uniform1i', 5);
		textureRad.bind(4);
		textureIrr.bind(5);

		this.shader.uniform('uExposure', 'uniform1f', params.exposure);
		this.shader.uniform('uGamma', 'uniform1f', params.gamma);
		this.shader.uniform(params.monolith);

		this.shader.uniform("uResolution", "vec2", [window.innerWidth, window.innerHeight]);

		GL.draw(this.mesh);
	}


	renderPosition() {
		this.shaderPosition.bind();
		this.shaderPosition.uniform("uLocalMatrix", "mat4", this.mtx);
		GL.draw(this.mesh);
	}


}

export default ViewMonolith;