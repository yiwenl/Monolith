// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
uniform sampler2D texture;
uniform vec3 uFogColor;
uniform float uFogDensity;

varying vec3 vWsPosition;


float fogFactorExp2(
  const float dist,
  const float density
) {
  const float LOG2 = -1.442695;
  float d = density * dist;
  return 1.0 - clamp(exp2(d * d * LOG2), 0.0, 1.0);
}


void main(void) {
	vec4 color        = texture2D(texture, vTextureCoord);
	
	float fogDistance = gl_FragCoord.z / gl_FragCoord.w;
	float fogAmount   = fogFactorExp2(fogDistance, uFogDensity);
	
	color.rgb         = mix(color.rgb, uFogColor, fogAmount);
	
	gl_FragColor      = color;
}