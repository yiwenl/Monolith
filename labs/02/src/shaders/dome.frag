// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec3 vWsPosition;

uniform sampler2D texture;
uniform float uSize;

void main(void) {

	float y = abs(vWsPosition.y / uSize);
	y = smoothstep(0.0, 0.5, y);
	vec4 color = texture2D(texture, vec2(.5, y));
	gl_FragColor = color;

}