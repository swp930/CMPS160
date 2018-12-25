attribute vec4 a_Position;
attribute vec4 a_Color;
attribute vec3 a_Normal; // Normal
 
varying vec4 v_Color;
varying vec3 v_Normal;
varying vec3 v_Position;

void main() {

  gl_Position = a_Position;

  v_Position = a_Position.xyz;

  vec3 normal = normalize(a_Normal.xyz);

  v_Normal = normal;

  v_Color = a_Color;
}
