#ifdef GL_ES
precision mediump float;
#endif
uniform vec3 u_DiffuseLight;  // Diffuse light color
uniform vec3 u_LightDirection; // Diffuse light direction (in the world coordinate, normalized)
uniform vec3 u_AmbientLight; // Color of an ambient light
uniform vec3 u_ViewDirection;
uniform vec3 u_SpecularLight;
uniform vec3 u_UniformGreen; // Color of an ambient light
uniform float p;

varying vec3 v_Normal;
varying vec3 v_Position;
varying vec4 v_Color;

void main() {
  // The dot product of the light direction and the normal (the orientation of a surface)
  vec3 normal = v_Normal;

  vec3 u_LightDirectionNew = normalize(u_LightDirection - v_Position);
  float nDotL = max(dot(u_LightDirectionNew, normal), 0.0);
  vec3 diffuse = u_DiffuseLight * v_Color.rgb * nDotL;
  vec3 ambient = u_AmbientLight;
  vec3 reflectVector = 2.0*dot(u_LightDirectionNew, normal)*normal - u_LightDirectionNew;
  vec3 specular = u_SpecularLight * v_Color.rgb * pow(max(dot(reflectVector,u_ViewDirection), 0.0), p);
  vec3 total = diffuse + ambient + specular;
  gl_FragColor = vec4(total, v_Color.a);
}
