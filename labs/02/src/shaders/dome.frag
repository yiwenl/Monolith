// copy.frag
precision highp float;
varying vec3 vWsPosition;

uniform sampler2D texture;
uniform sampler2D texture1;
uniform sampler2D textureNoise;
uniform float uSize;
uniform vec3 uFogColor;
uniform float uFogDensity;
uniform vec2 uResolution;

float fogFactorExp2(
  const float dist,
  const float density
) {
  const float LOG2 = -1.442695;
  float d = density * dist;
  return 1.0 - clamp(exp2(d * d * LOG2), 0.0, 1.0);
}


float luma(vec3 color) {
  return dot(color, vec3(0.299, 0.587, 0.114));
}


void main(void) {

	vec2 uvNoise 		  = gl_FragCoord.xy / uResolution * 3.0;
	vec2 colorNoise  = texture2D(textureNoise, uvNoise).rg - 0.5;;
	float y           = abs(vWsPosition.y / uSize) * 0.5 + 0.5;

	vec2 uv 		  = vec2(.5, y) + colorNoise * 0.015;
	vec4 color        = texture2D(texture, uv);

	float br = 1.0 - luma(color.rgb);
	vec2 uvGrad = vec2(.5, br);
	vec3 colorGrad = texture2D(texture1, uvGrad).rgb;
	color.rgb 		= mix(color.rgb, colorGrad, .5);
	
	float fogDistance = gl_FragCoord.z / gl_FragCoord.w;
	float fogAmount   = fogFactorExp2(fogDistance, uFogDensity);
	
	vec3 fogColor     = mix(color.rgb, uFogColor, fogAmount);
	float yOffset     = smoothstep(0.6, 0.5, y);
	color.rgb         = mix(color.rgb, fogColor, yOffset);

	
	
	gl_FragColor      = color;
	// gl_FragColor      = vec4(colorNoise, 1.0);

}