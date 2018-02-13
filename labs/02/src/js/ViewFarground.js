// ViewFarground.js

import alfrid, { GL } from 'alfrid';
import Assets from './Assets';
import fs from 'shaders/fg.frag';

class ViewFarground extends alfrid.View {
	
	constructor() {
		super(null, fs);
	}


	_init() {
		const h = 12;
		const r = 15;
		const num = 24;
		const positions = [];
		const uvs = [];
		const indices = [];
		let count = 0;

		const getPos = (i, j) => {
			let a = -i/num * Math.PI * 2.0;
			const y = (j - .5 ) * h - 2;
			const x = Math.cos(a) * r;
			const z = Math.sin(a) * r;
			return [x, y, z];
		}

		for(let i=0; i<num; i++) {
			positions.push(getPos(i, 1));
			positions.push(getPos(i+1, 1));
			positions.push(getPos(i+1, 0));
			positions.push(getPos(i, 0));

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
		this.mesh.bufferIndex(indices);

		this.texture = Assets.get('mountains');
		this.texture.wrapS = GL.MIRRORED_REPEAT;
		this.texture.wrapT = GL.MIRRORED_REPEAT;
	}


	render() {
		this.shader.bind();
		this.shader.uniform("texture", "uniform1i", 0);
		this.texture.bind(0);
		GL.draw(this.mesh);
	}


}

export default ViewFarground;