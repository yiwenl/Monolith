// copy.frag

precision highp float;
varying vec3 vWsPosition;

void main(void) {
    gl_FragColor = vec4(vWsPosition, 1.0);
}