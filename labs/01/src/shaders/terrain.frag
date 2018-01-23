// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
varying vec3 vPosition;
uniform sampler2D texture;
uniform sampler2D textureNormal;
uniform vec3 uLightPos;

float diffuse(vec3 N, vec3 L) {
	return max(dot(N, normalize(L)), 0.0);
}


vec3 diffuse(vec3 N, vec3 L, vec3 C) {
	return diffuse(N, L) * C;
}


void main(void) {

	vec3 height = texture2D(texture, vTextureCoord).rbg;
	vec3 normal = texture2D(textureNormal, vTextureCoord).rbg;
	normal = normal * 2.0 - 1.0;
	normal.rb *= -1.0;
	normal.y *= 0.5;
	normal = normalize(normal);

	vec3 dirLight = uLightPos - vPosition;
	float d = diffuse(normal, dirLight);

    gl_FragColor = vec4(vec3(d), 1.0);
    gl_FragColor = vec4(vec3(vPosition.y), 1.0);
    gl_FragColor = vec4(height, 1.0);
}