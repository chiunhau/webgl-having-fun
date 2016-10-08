attribute vec4 a_position;
attribute vec4 a_color;
attribute vec4 a_normal;

varying vec4 v_color;
varying vec4 v_normal;


uniform mat4 u_worldViewProjection; //with camera view
uniform mat4 u_world; //original pos

void main() {
  //calculate position
  vec4 position = u_worldViewProjection  * a_position;
  // float zToDivideBy = 1.0 - position.z * u_fudgeFactor;
  // gl_Position = vec4(position.xy / zToDivideBy, position.zw);
  gl_Position = position;
  //
  v_color = a_color;
  v_normal = normalize(u_world * a_normal);

}
