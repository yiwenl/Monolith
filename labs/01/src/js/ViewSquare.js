// ViewSquare.js

import alfrid, { GL } from 'alfrid';
import vs from 'shaders/square.vert';

class ViewSquare extends alfrid.View {
	
	constructor() {
		super(vs);
	}


	_init() {
		this.mesh = alfrid.Geom.plane(1.5, 5, 1);
		this.position = [0, 1, -.25];
	}


	render() {
		this.shader.bind();
		this.shader.uniform("uPosition", "vec3", this.position);
		GL.draw(this.mesh);
	}


}

export default ViewSquare;