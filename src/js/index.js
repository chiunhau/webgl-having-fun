var vertShaderSrc = require('../glsl/vertex.glsl');
var fragShaderSrc = require('../glsl/fragment.glsl');
var tfm = require('./tfm.js');
var geometries = require('./geometries.js')
var canvas = document.getElementById('myCanvas');
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;
var gl = canvas.getContext('webgl');

var vertShader = createShader(gl, gl.VERTEX_SHADER, vertShaderSrc);
var fragShader = createShader(gl, gl.FRAGMENT_SHADER, fragShaderSrc);
var program = createProgram(gl, vertShader, fragShader);
gl.useProgram(program);
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
gl.clearColor(0, 0, 0, 1.0);
// gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.enable(gl.CULL_FACE);
gl.enable(gl.DEPTH_TEST);

var params = {
  translateX: 0.0,
  translateY: 0.0,
  translateZ: 0.0,
  rotateX: 0.0,
  rotateY: 0.0,
  rotateZ: 0,
  scaleX: 1.0,
  scaleY: 1.0,
  scaleZ: 1.0,
  cameraX: 200,
  cameraY: 200,
  cameraZ: 200,
  lookAtX: 0,
  lookAtY: 0,
  lookAtZ: 0,
  fieldOfView: 1.0,
  directionX: -6.5,
  directionY: -10,
  directionZ: -2.5,
  colorR: 1.0,
  colorG: 1.0,
  colorB: 1.0,

}

window.onload = function() {
  var gui = new dat.GUI();
  var f1 = gui.addFolder('Cube Attributes');

  f1.add(params, 'translateX', -500, 500).onChange(drawScene);
  f1.add(params, 'translateY', -500, 500).onChange(drawScene);
  f1.add(params, 'translateZ', -400, 400).onChange(drawScene);
  f1.add(params, 'rotateX', 0, 10).onChange(drawScene);
  f1.add(params, 'rotateY', 0, 10).onChange(drawScene);
  f1.add(params, 'rotateZ', 0, 10).onChange(drawScene);
  f1.add(params, 'scaleX', 1, 5).onChange(drawScene);
  f1.add(params, 'scaleY', 1, 5).onChange(drawScene);
  f1.add(params, 'scaleZ', 1, 5).onChange(drawScene);

  f1.open();

  var f2 = gui.addFolder('Camera Settings');

  f2.add(params, 'cameraX', 0.0, 500).onChange(drawScene);
  f2.add(params, 'cameraY', 0.0, 500).onChange(drawScene);
  f2.add(params, 'cameraZ', 0.0, 500).onChange(drawScene);
  f2.add(params, 'lookAtX', -500, 500).onChange(drawScene);
  f2.add(params, 'lookAtY', -500, 500).onChange(drawScene);
  f2.add(params, 'lookAtZ', -500, 500).onChange(drawScene);
  f2.add(params, 'fieldOfView', 0, 3.14).onChange(drawScene);

  f2.open();

  var f3 = gui.addFolder('Directional Light Settings');
  f3.add(params, 'directionX', -10, 10).onChange(drawScene);
  f3.add(params, 'directionY', -10, 10).onChange(drawScene);
  f3.add(params, 'directionZ', -10, 10).onChange(drawScene);
  f3.add(params, 'colorR', 0.0, 1.0).onChange(drawScene);
  f3.add(params, 'colorG', 0.0, 1.0).onChange(drawScene);
  f3.add(params, 'colorB', 0.0, 1.0).onChange(drawScene);

  f3.open();
}

var positionAttribLocation = gl.getAttribLocation(program, 'a_position');
var positionBuffer = gl.createBuffer();


var colorAttribLocation = gl.getAttribLocation(program, 'a_color');
var colorBuffer = gl.createBuffer();


var normalAttribLocation = gl.getAttribLocation(program, 'a_normal');
var normalBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
gl.enableVertexAttribArray(normalAttribLocation);
gl.vertexAttribPointer(normalAttribLocation, 3, gl.FLOAT, false, 0, 0);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geometries.cubeNormals()), gl.STATIC_DRAW);


// var transformationUniLocation = gl.getUniformLocation(program, 'u_transformation');
var fudgeLocation = gl.getUniformLocation(program, 'u_fudgeFactor');
var lightColorLocation = gl.getUniformLocation(program, 'u_lightColor');
var lightDirectionLocation = gl.getUniformLocation(program, 'u_lightDirection');
// var viewMatrixUniLocation = gl.getUniformLocation(program, 'u_viewMatrix');

var worldViewProjectionLocation = gl.getUniformLocation(program, 'u_worldViewProjection');
var worldLocation = gl.getUniformLocation(program, 'u_world');

drawScene()
// var frameCount = 0;
function drawScene() {
  gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

  //position
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.enableVertexAttribArray(positionAttribLocation);
  gl.vertexAttribPointer(positionAttribLocation, 3, gl.FLOAT, false, 0, 0);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geometries.cube(100)), gl.STATIC_DRAW);

  var transformationMat = tfm.multiply(tfm.scale(params.scaleX, params.scaleY, params.scaleZ), tfm.rotateX(params.rotateX));

  transformationMat = tfm.multiply(transformationMat, tfm.rotateY(params.rotateY));
  transformationMat = tfm.multiply(transformationMat, tfm.rotateZ(params.rotateZ));
  transformationMat = tfm.multiply(transformationMat, tfm.translate(params.translateX, params.translateY, params.translateZ));
  gl.uniformMatrix4fv(worldLocation, false, transformationMat);

  transformationMat = tfm.multiply(transformationMat, tfm.inverse(lookAt(params.cameraX, params.cameraY, params.cameraZ, params.lookAtX, params.lookAtY, params.lookAtZ, 0, 1, 0)))
  transformationMat = tfm.multiply(transformationMat, tfm.makePerspective(params.fieldOfView, canvas.width / canvas.height, 1, 10000));
  gl.uniformMatrix4fv(worldViewProjectionLocation, false, transformationMat);

  gl.uniform1f(fudgeLocation, params.fudgeFactor);


  gl.uniform3f(lightColorLocation, params.colorR, params.colorG, params.colorB);
  gl.uniform3f(lightDirectionLocation, params.directionX, params.directionY, params.directionZ);


  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.enableVertexAttribArray(colorAttribLocation);
  gl.vertexAttribPointer(colorAttribLocation, 3, gl.UNSIGNED_BYTE, true, 0, 0);
  gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(geometries.cubeColors()), gl.STATIC_DRAW);

  gl.drawArrays(gl.TRIANGLES, 0, 36);

}

//tools

function createShader(gl, type, src) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);

  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    return shader
  }
  else {
    console.log(gl.getShaderInfo(shader));
    gl.deleteShader(shader);
  }
}

function createProgram(gl, vertShader, fragShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertShader);
  gl.attachShader(program, fragShader);
  gl.linkProgram(program);

  if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
    return program
  }
  else {
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
  }
}

function lookAt(ex, ey, ez, lx, ly, lz, ux, uy, uz) {
  var f = [lx - ex, ly - ey, lz - ez];
  var u = [ux, uy, uz];
  var fN = tfm.normalize3v(f);
  var uN = tfm.normalize3v(u);
  var s = tfm.cross(fN, uN);
  var u = tfm.cross(s, fN);
  var matrix = [
    s[0], s[1], s[2], 0,
    u[0], u[1], u[2], 0,
    -fN[0], -fN[1], -fN[2], 0,
    ex, ey, ez, 1
  ];

  return matrix
}
