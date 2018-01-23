// ViewTerrain.js

import alfrid, { GL } from 'alfrid';
import vs from 'shaders/terrain.vert';
import fs from 'shaders/terrain.frag';
import Assets from './Assets';

class ViewTerrain extends alfrid.View {
	
	constructor() {
		super(vs, fs);
	}


	_init() {
		const size = 10;
		this.mesh = alfrid.Geom.plane(size, size, 100, 'xz');
		this.texture = Assets.get('height');
		this.textureNormal = Assets.get('normal');

		this.height = 1.0;
		gui.add(this, 'height', 0, 3);
	}


	render(lightPos) {
		this.shader.bind();
		this.shader.uniform("texture", "uniform1i", 0);
		this.texture.bind(0);
		this.shader.uniform("textureNormal", "uniform1i", 1);
		this.textureNormal.bind(1);
		this.shader.uniform("uHeight", "float", this.height);
		this.shader.uniform("uLightPos", "vec3", lightPos);
		GL.draw(this.mesh);
	}


}

export default ViewTerrain;