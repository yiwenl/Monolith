// ViewDome.js

import alfrid, { GL } from 'alfrid';
import vs from 'shaders/dome.vert';
import fs from 'shaders/dome.frag';
import Assets from './Assets';

class ViewDome extends alfrid.View {
	
	constructor() {
		super(vs, fs);
	}


	_init() {
		this.size = 20;
		this.mesh = alfrid.Geom.sphere(20, 24, true);
		this.texture = Assets.get('gradient');
	}


	render() {

		this.shader.bind();
		this.shader.uniform("uSize", "float", this.size);
		this.shader.uniform("texture", "uniform1i", 0);
		this.texture.bind(0);
		GL.draw(this.mesh);

	}


}

export default ViewDome;