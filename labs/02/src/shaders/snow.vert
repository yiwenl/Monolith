// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

uniform vec2 uViewport;
uniform float time;

varying vec2 vTextureCoord;
varying vec3 vNormal;


const float radius = 0.01;
const float range = 25.0;

void main(void) {
	vec3 position = aVertexPosition + time * mix(aNormal, vec3(1.0), .5);
	position = mod(position + range, range * 2.0);
	position -= range;

    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(position, 1.0);
    vTextureCoord = aTextureCoord;
    vNormal = aNormal;


    float distOffset = uViewport.y * uProjectionMatrix[1][1] * radius / gl_Position.w;
    gl_PointSize = distOffset;
}