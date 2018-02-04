// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
varying vec3 vNormal;
uniform sampler2D textureFront;
uniform sampler2D textureBack;
uniform mat4 uMatrixFront;
uniform mat4 uMatrixBack;

varying vec3 vWsPosition;

float getZ(sampler2D texture, mat4 shadowMatrix) {
	vec4 shadowCoord = shadowMatrix * vec4(vWsPosition, 1.0);
	shadowCoord /= shadowCoord.w;
	return texture2D(texture, shadowCoord.xy).z;
}

void main(void) {

	float zFront = getZ(textureFront, uMatrixFront);
	float zBack = getZ(textureBack, uMatrixBack);

	float t = 0.0;
	if(vWsPosition.z < zFront && vWsPosition.z > zBack) {
		t = 1.0;
	}

	if(t < 0.5) {
		discard;
	}
	// if(vWsPosition.z < zBack) discard;


    gl_FragColor = vec4(vNormal * .5 + .5, 1.0);
}