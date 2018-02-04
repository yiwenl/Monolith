// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix;
uniform mat3 uModelViewMatrixInverse;

uniform sampler2D texture;
uniform float uHeight;
uniform vec3 uPosition;
uniform vec4 uUVOffset;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vWsPosition;
varying vec3 vEyePosition;
varying vec3 vWsNormal;

void main(void) {
	vec2 uv                 = aTextureCoord * uUVOffset.xy + uUVOffset.zw;
	float h                 = texture2D(texture, uv).r;
	vec3 position           = aVertexPosition + uPosition;
	position.y              = h * uHeight;
	vec4 worldSpacePosition = uModelMatrix * vec4(position, 1.0);
	vec4 viewSpacePosition  = uViewMatrix * worldSpacePosition;
	
	vNormal                 = uNormalMatrix * aNormal;
	vPosition               = viewSpacePosition.xyz;
	vWsPosition             = worldSpacePosition.xyz;
	
	vec4 eyeDirViewSpace    = viewSpacePosition - vec4( 0, 0, 0, 1 );
	vEyePosition            = -vec3( uModelViewMatrixInverse * eyeDirViewSpace.xyz );
	vWsNormal               = normalize( vNormal );
	
	gl_Position             = uProjectionMatrix * viewSpacePosition;
	
	vTextureCoord           = uv;
}