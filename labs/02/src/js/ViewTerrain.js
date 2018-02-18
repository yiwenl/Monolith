// ViewTerrain.js

import alfrid, { GL } from 'alfrid';
import vs from 'shaders/terrain.vert';
import fs from 'shaders/terrain.frag';

class ViewTerrain extends alfrid.View {
	
	constructor() {
		super(vs, fs);
	}


	_init() {
		const size = 25;
		this.numTiles = 4;
		const s = size / this.numTiles;
		this.tileSize = s;
		this.sx = -size / 2 + this.tileSize/2;
		this.sz = size / 2 - this.tileSize/2;
		this.mesh = alfrid.Geom.plane(s, s, 80, 'xz');

		this.height = 1.5;

		this.roughness = 1;
		this.specular = .1;
		this.metallic = 0;

		const g = .15;
		this.baseColor = [g, g, g ];
		this.y = -2.5;


		this.sparkle = {
			uSparkleScale:20,
			uSparkleIntensity:14.0,
		}

	}

	render(texture, textureNormal, textureRad, textureIrr, textureGradient, textureNoise) {
		const { numTiles } = this;
		this.shader.bind();
		this.shader.uniform(params.fog);
		this.shader.uniform(this.sparkle);
		this.shader.uniform("texture", "uniform1i", 0);
		texture.bind(0);
		this.shader.uniform("textureNormal", "uniform1i", 1);
		textureNormal.bind(1);
		this.shader.uniform("textureGradient", "uniform1i", 2);
		textureGradient.bind(2);
		this.shader.uniform("textureNoise", "uniform1i", 3);
		textureNoise.bind(3);
		this.shader.uniform("uHeight", "float", this.height);

		this.shader.uniform('uRadianceMap', 'uniform1i', 5);
		this.shader.uniform('uIrradianceMap', 'uniform1i', 4);
		textureRad.bind(5);
		textureIrr.bind(4);

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
				this.shader.uniform("uPosition", "vec3", [x-2.25, this.y, z]);
				GL.draw(this.mesh);

			}
		}
	}


}

export default ViewTerrain;