// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
uniform sampler2D texture;

varying vec3 vWsPosition;


void main(void) {
	vec4 color = texture2D(texture, vTextureCoord);

	float d = length(vWsPosition.xz);
	d = smoothstep(12.5, 0.0, d);

	color.rgb *= d;

    gl_FragColor = color;
}