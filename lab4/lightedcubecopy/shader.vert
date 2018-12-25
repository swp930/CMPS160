attribute vec4 a_Position;
attribute vec4 a_Color;
attribute vec4 a_Normal; // Normal

uniform mat4 u_MvpMatrix;
uniform float val;
uniform vec3 u_DiffuseLight;  // Diffuse light color
uniform vec3 u_LightDirection; // Diffuse light direction (in the world coordinate, normalized)
uniform vec3 u_AmbientLight; // Color of an ambient light
varying vec4 v_Color;

void main() {

  gl_Position = a_Position;
  // Make the length of the normal 1.0

  vec3 normal = normalize(a_Normal.xyz);
  // The dot product of the light direction and the normal (the orientation of a surface)

  float nDotL = max(dot(u_LightDirection, normal), 0.0);
  // Calculate the color due to diffuse reflection

  vec3 diffuse = u_DiffuseLight * a_Color.rgb * nDotL * val;
  // Calculate the color due to ambient reflection

  vec3 ambient = u_AmbientLight * a_Color.rgb;
  // Add the surface colors due to diffuse reflection and ambient reflection

  vec3 squareColor = a_Color.rgb * val;
  v_Color = vec4(squareColor, a_Color.a);
}
