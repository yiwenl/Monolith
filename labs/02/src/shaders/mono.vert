// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uLocalMatrix;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vWsPosition;

void main(void) {
	const float range = 3.0;
	float yScale = (-aVertexPosition.y + range) / (range * 2.0);
	vec3 adjPos = aVertexPosition;
	adjPos.xz 		*= 0.5 + yScale * 0.6;
	vec4 position = uLocalMatrix * vec4(adjPos, 1.0);
	gl_Position   = uProjectionMatrix * uViewMatrix * uModelMatrix * position;
	vTextureCoord = aTextureCoord;
	vNormal       = (uLocalMatrix * vec4(aNormal, 1.0)).xyz;
	vWsPosition   = position.xyz;
}