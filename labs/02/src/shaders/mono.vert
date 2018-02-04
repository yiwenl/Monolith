// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uLocalMatrix;
uniform mat3 uNormalMatrix;
uniform mat3 uModelViewMatrixInverse;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vWsPosition;
varying vec3 vEyePosition;
varying vec3 vWsNormal;

void main(void) {
	const float range = 2.0;
	float yScale  = (-aVertexPosition.y + range) / (range * 2.0);
	vec3 adjPos   = aVertexPosition;
	adjPos.xz     *= 0.4 + yScale * 0.7;
	vec3 position = (uLocalMatrix * vec4(adjPos, 1.0)).xyz;


	vec4 worldSpacePosition	= uModelMatrix * vec4(position, 1.0);
	vec4 viewSpacePosition	= uViewMatrix * worldSpacePosition;
	
	vNormal					= uNormalMatrix * (uLocalMatrix * vec4(aNormal, 1.0)).xyz;
	vPosition				= viewSpacePosition.xyz;
	vWsPosition				= worldSpacePosition.xyz;
	
	vec4 eyeDirViewSpace	= viewSpacePosition - vec4( 0, 0, 0, 1 );
	vEyePosition			= -vec3( uModelViewMatrixInverse * eyeDirViewSpace.xyz );
	vWsNormal				= normalize( uModelViewMatrixInverse * vNormal );
	
	gl_Position				= uProjectionMatrix * viewSpacePosition;

	vTextureCoord			= aTextureCoord;
}