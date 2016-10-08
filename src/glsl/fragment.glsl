precision mediump float;

uniform vec3 u_lightColor;
uniform vec3 u_lightDirection;

varying vec4 v_color;
varying vec4 v_normal;

void main() {
  vec3 reverseLightDirection = normalize(u_lightDirection * -1.0);
  vec4 normal = normalize(v_normal);
  float dotProduct = dot(reverseLightDirection, normal.xyz);
  // vec3 diffuse = u_lightColor * v_color.xyz * dotProduct;
  vec3 diffuse = u_lightColor * vec3(1.0, 1.0, 1.0) * dotProduct;
  //
  //
  gl_FragColor = vec4(diffuse.xyz, 1.0);
}
