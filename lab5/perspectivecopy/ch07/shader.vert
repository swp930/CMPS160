attribute vec4 a_Position;
attribute vec4 a_Color;
attribute vec3 a_Normal;
uniform mat4 u_ViewMatrix;
uniform mat4 u_ProjMatrix;
varying vec4 v_Color;
void main() {
  gl_Position = u_ProjMatrix * u_ViewMatrix * a_Position;
  vec3 normal = normalize(a_Normal.xyz);
  v_Color = a_Color;
}
