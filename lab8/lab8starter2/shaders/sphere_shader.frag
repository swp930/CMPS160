#ifdef GL_ES
precision mediump float;
#endif

uniform vec3 u_EyePosition;
varying vec4 v_Position;

uniform samplerCube u_cubeTex;

void main() {
  vec3 norm = normalize(v_Position.xyz);
  vec3 position = v_Position.xyz;
  vec3 eyepos = u_EyePosition;
  vec3 eyeVector = eyepos - position;
  vec3 reflectVector = normalize(reflect(-eyeVector, norm));
  gl_FragColor = textureCube(u_cubeTex, reflectVector);
}
