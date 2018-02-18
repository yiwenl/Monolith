// ViewSnow.js


import alfrid, { GL } from 'alfrid';
import vs from 'shaders/snow.vert';
import fs from 'shaders/snow.frag';

var random = function(min, max) { return min + Math.random() * (max - min);	}

class ViewSnow extends alfrid.View {
	
	constructor() {
		super(vs, fs);
		this.time = Math.random() * 0xFF;
	}


	_init() {
		const positions = [];
		const extras = [];
		const indices = [];
		const num = 20000;
		const range = 20;

		for(let i=0; i<num; i++) {
			positions.push([random(-range, range), random(-range, range), random(-range, range)]);
			extras.push([Math.random(), Math.random(), Math.random()])
			indices.push(i);
		}

		this.mesh = new alfrid.Mesh(GL.POINTS);
		this.mesh.bufferVertex(positions);
		this.mesh.bufferNormal(extras);
		this.mesh.bufferIndex(indices);
	}


	render() {
		this.time += 0.01;
		this.shader.bind();
		this.shader.uniform('uViewport', 'vec2', [GL.width, GL.height]);
		this.shader.uniform('time', 'float', this.time);
		GL.draw(this.mesh);
	}


}

export default ViewSnow;