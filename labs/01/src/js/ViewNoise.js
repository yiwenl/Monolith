// ViewNoise.js

import alfrid, { GL } from 'alfrid';
import fs from 'shaders/noise.frag';
import Assets from './Assets';

class ViewNoise extends alfrid.View {
	
	constructor() {
		super(alfrid.ShaderLibs.bigTriangleVert, fs);
	}


	_init() {
		this.mesh = alfrid.Geom.bigTriangle();
		this.texture = Assets.get('height');
	}


	render() {
		this.shader.bind();
		this.shader.uniform("uSeed", "float", Math.random() * 0xFF);
		this.shader.uniform("texture", "uniform1i", 0);
		this.texture.bind(0);
		GL.draw(this.mesh);
	}


}

export default ViewNoise;