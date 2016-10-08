attribute vec4 a_position;
attribute vec4 a_color;
attribute vec4 a_normal;

varying vec4 v_color;

uniform float u_fudgeFactor;
uniform vec3 u_lightColor;
uniform vec3 u_lightDirection;
uniform mat4 u_viewMatrix;


uniform mat4 u_worldViewProjection; //with camera view
uniform mat4 u_world; //original pos

void main() {
  //calculate position
  vec4 position = u_worldViewProjection  * a_position;
  float zToDivideBy = 1.0 - position.z * u_fudgeFactor;
  gl_Position = vec4(position.xy / zToDivideBy, position.zw);


  //calculate color
  vec3 normal = normalize(mat3(u_world) *  vec3(a_normal));
  vec3 reverseLightDirection = normalize(u_lightDirection * -1.0);
  float dotProduct = dot(reverseLightDirection, normal);
  // vec3 diffuse = u_lightColor * a_color.xyz * dotProduct;
  vec3 diffuse = u_lightColor * vec3(0.8, 0.8, 0.8) * dotProduct;

  v_color = vec4(diffuse, a_color.a);
  // v_color = a_color;
}
