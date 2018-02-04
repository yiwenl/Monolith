// ViewTerrainTile.js

import alfrid, { GL } from 'alfrid';
import vs from 'shaders/terrainTile.vert';
import fs from 'shaders/terrain.frag';
import Assets from './Assets';

class ViewTerrainTile extends alfrid.View {
	
	constructor() {
		super(vs, fs);
	}


	_init() {
		const size = 10;
		this.numTiles = 4 * 1;
		const s = size / this.numTiles;
		this.tileSize = s;
		this.sx = -size / 2 + this.tileSize/2;
		this.sz = size / 2 - this.tileSize/2;
		this.mesh = alfrid.Geom.plane(s, s, 100, 'xz');

		this.height = 1.5;

		this.roughness = 1;
		this.specular = 0;
		this.metallic = 0;
		this.baseColor = [1, 1, 1];
	}


	render(lightPos, texture, textureNormal, textureRad, textureIrr) {
		const { numTiles } = this;
		this.shader.bind();
		this.shader.uniform("texture", "uniform1i", 0);
		texture.bind(0);
		this.shader.uniform("textureNormal", "uniform1i", 1);
		textureNormal.bind(1);
		this.shader.uniform("uHeight", "float", this.height);
		this.shader.uniform("uLightPos", "vec3", lightPos);

		this.shader.uniform('uRadianceMap', 'uniform1i', 3);
		this.shader.uniform('uIrradianceMap', 'uniform1i', 2);
		textureRad.bind(3);
		textureIrr.bind(2);

		this.shader.uniform('uBaseColor', 'uniform3fv', this.baseColor);
		this.shader.uniform('uRoughness', 'uniform1f', this.roughness);
		this.shader.uniform('uMetallic', 'uniform1f', this.metallic);
		this.shader.uniform('uSpecular', 'uniform1f', this.specular);

		this.shader.uniform('uExposure', 'uniform1f', params.exposure);
		this.shader.uniform('uGamma', 'uniform1f', params.gamma);

		const uvOffset = [1/numTiles, 1/numTiles, 0, 0];
		let u, v, x, z;
		for(let i=0; i<numTiles; i++) {
			for(let j=0; j<numTiles; j++) {
				u = i/numTiles;
				v = j/numTiles;
				uvOffset[2] = u;
				uvOffset[3] = v;
				x = this.sx + i * this.tileSize;
				z = this.sz - j * this.tileSize;
				this.shader.uniform("uUVOffset", "vec4", uvOffset);
				this.shader.uniform("uPosition", "vec3", [x, 0, z]);
				GL.draw(this.mesh);

			}
		}
		
	}


}

export default ViewTerrainTile;