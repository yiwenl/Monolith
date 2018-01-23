// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

uniform sampler2D texture;
uniform float uHeight;
uniform vec3 uPosition;
uniform vec4 uUVOffset;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vPosition;

void main(void) {
	vec2 uv       = aTextureCoord * uUVOffset.xy + uUVOffset.zw;
	float h       = texture2D(texture, uv).r;
	vec3 position = aVertexPosition + uPosition;
	position.y    = h * uHeight;
	vPosition     = position;
	gl_Position   = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(position, 1.0);
	vTextureCoord = uv;
	vNormal       = aNormal;
}