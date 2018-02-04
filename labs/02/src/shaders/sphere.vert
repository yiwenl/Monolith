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
	vec4 position = uLocalMatrix * vec4(aVertexPosition, 1.0);
	gl_Position   = uProjectionMatrix * uViewMatrix * uModelMatrix * position;
	vTextureCoord = aTextureCoord;
	vNormal       = (uLocalMatrix * vec4(aNormal, 1.0)).xyz;
	vWsPosition   = position.xyz;
}