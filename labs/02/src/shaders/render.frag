precision highp float;

varying vec4 vColor;

#define uMapSize vec2(1024.0)
#define FOG_DENSITY 0.2
#define LIGHT_POS vec3(0.0, 10.0, 0.0)


float rand(vec4 seed4) {
	float dot_product = dot(seed4, vec4(12.9898,78.233,45.164,94.673));
	return fract(sin(dot_product) * 43758.5453);
}


float fogFactorExp2(const float dist, const float density) {
	const float LOG2 = -1.442695;
	float d = density * dist;
	return 1.0 - clamp(exp2(d * d * LOG2), 0.0, 1.0);
}


float diffuse(vec3 N, vec3 L) {
	return max(dot(N, normalize(L)), 0.0);
}


vec3 diffuse(vec3 N, vec3 L, vec3 C) {
	return diffuse(N, L) * C;
}

void main(void) {
	if(distance(gl_PointCoord, vec2(.5)) > .5) discard;
	
	vec4 color = vec4(1.0);

	float fogDistance = gl_FragCoord.z / gl_FragCoord.w;
	float fogAmount = fogFactorExp2(fogDistance - 4.5, FOG_DENSITY);
	const vec4 fogColor = vec4(0.0, 0.0, 0.0, 1.0); // white

	gl_FragColor = mix(color, fogColor, fogAmount);
}