/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var vertShaderSrc = __webpack_require__(1);
	var fragShaderSrc = __webpack_require__(2);
	var tfm = __webpack_require__(3);
	var geometries = __webpack_require__(4)
	var canvas = document.getElementById('myCanvas');
	canvas.width = document.body.clientWidth;
	canvas.height = document.body.clientHeight;
	var gl = canvas.getContext('webgl');

	var vertShader = createShader(gl, gl.VERTEX_SHADER, vertShaderSrc);
	var fragShader = createShader(gl, gl.FRAGMENT_SHADER, fragShaderSrc);
	var program = createProgram(gl, vertShader, fragShader);
	gl.useProgram(program);
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
	gl.clearColor(1, 0.90, 0.99, 1.0);
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
	  fudgeFactor: 1.0,
	  cameraX: 100,
	  cameraY: 100,
	  cameraZ: 100,
	  lookAtX: 0,
	  lookAtY: 0,
	  lookAtZ: 0

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

	  f2.add(params, 'fudgeFactor', 0.0, 20.0).onChange(drawScene);
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
	  transformationMat = tfm.multiply(transformationMat, tfm.project(canvas.width, canvas.height, 10000));
	  gl.uniformMatrix4fv(worldViewProjectionLocation, false, transformationMat);

	  gl.uniform1f(fudgeLocation, params.fudgeFactor);


	  gl.uniform3f(lightColorLocation, 1.0, 1.0, 1.0);
	  gl.uniform3f(lightDirectionLocation, -1.0, -0.5, -0.2);


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


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = "attribute vec4 a_position;\nattribute vec4 a_color;\nattribute vec4 a_normal;\n\nvarying vec4 v_color;\n\nuniform float u_fudgeFactor;\nuniform vec3 u_lightColor;\nuniform vec3 u_lightDirection;\nuniform mat4 u_viewMatrix;\n\n\nuniform mat4 u_worldViewProjection; //with camera view\nuniform mat4 u_world; //original pos\n\nvoid main() {\n  //calculate position\n  vec4 position = u_worldViewProjection  * a_position;\n  float zToDivideBy = 1.0 - position.z * u_fudgeFactor;\n  gl_Position = vec4(position.xy / zToDivideBy, position.zw);\n\n\n  //calculate color\n  vec3 normal = normalize(mat3(u_world) *  vec3(a_normal));\n  vec3 reverseLightDirection = normalize(u_lightDirection * -1.0);\n  float dotProduct = dot(reverseLightDirection, normal);\n  // vec3 diffuse = u_lightColor * a_color.xyz * dotProduct;\n  vec3 diffuse = u_lightColor * vec3(0.8, 0.8, 0.8) * dotProduct;\n\n  v_color = vec4(diffuse, a_color.a);\n  // v_color = a_color;\n}\n"

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = "precision mediump float;\n\nvarying vec4 v_color;\n\nvoid main() {\n  gl_FragColor = v_color;\n}\n"

/***/ },
/* 3 */
/***/ function(module, exports) {

	var tfm = {
	  project: function(w, h, d) {
	    return [
	      2 / w, 0, 0, 0,
	      0, 2 / h, 0, 0,
	      0, 0, 2 / d, 0,
	      0, 0, 0, 1
	    ];
	  },
	  translate: function(tx, ty, tz) {
	    return [
	       1,  0,  0,  0,
	       0,  1,  0,  0,
	       0,  0,  1,  0,
	       tx, ty, tz, 1
	    ];
	  },
	  scale: function(sx, sy, sz) {
	    return [
	      sx, 0,  0,  0,
	      0, sy,  0,  0,
	      0,  0, sz,  0,
	      0,  0,  0,  1,
	    ];
	  },
	  rotateX: function(angleInRadians) {
	    var c = Math.cos(angleInRadians);
	    var s = Math.sin(angleInRadians);

	    return [
	      1, 0, 0, 0,
	      0, c, s, 0,
	      0, -s, c, 0,
	      0, 0, 0, 1
	    ];
	  },
	  rotateY: function(angleInRadians) {
	    var c = Math.cos(angleInRadians);
	    var s = Math.sin(angleInRadians);

	    return [
	      c, 0, -s, 0,
	      0, 1, 0, 0,
	      s, 0, c, 0,
	      0, 0, 0, 1
	    ];
	  },
	  rotateZ: function(angleInRadians) {
	    var c = Math.cos(angleInRadians);
	    var s = Math.sin(angleInRadians);

	    return [
	       c, s, 0, 0,
	       -s, c, 0, 0,
	       0, 0, 1, 0,
	       0, 0, 0, 1,
	    ];
	  },
	  multiply: function(a, b) {
	    var a00 = a[0*4+0];
	    var a01 = a[0*4+1];
	    var a02 = a[0*4+2];
	    var a03 = a[0*4+3];
	    var a10 = a[1*4+0];
	    var a11 = a[1*4+1];
	    var a12 = a[1*4+2];
	    var a13 = a[1*4+3];
	    var a20 = a[2*4+0];
	    var a21 = a[2*4+1];
	    var a22 = a[2*4+2];
	    var a23 = a[2*4+3];
	    var a30 = a[3*4+0];
	    var a31 = a[3*4+1];
	    var a32 = a[3*4+2];
	    var a33 = a[3*4+3];
	    var b00 = b[0*4+0];
	    var b01 = b[0*4+1];
	    var b02 = b[0*4+2];
	    var b03 = b[0*4+3];
	    var b10 = b[1*4+0];
	    var b11 = b[1*4+1];
	    var b12 = b[1*4+2];
	    var b13 = b[1*4+3];
	    var b20 = b[2*4+0];
	    var b21 = b[2*4+1];
	    var b22 = b[2*4+2];
	    var b23 = b[2*4+3];
	    var b30 = b[3*4+0];
	    var b31 = b[3*4+1];
	    var b32 = b[3*4+2];
	    var b33 = b[3*4+3];
	    return [a00 * b00 + a01 * b10 + a02 * b20 + a03 * b30,
	            a00 * b01 + a01 * b11 + a02 * b21 + a03 * b31,
	            a00 * b02 + a01 * b12 + a02 * b22 + a03 * b32,
	            a00 * b03 + a01 * b13 + a02 * b23 + a03 * b33,
	            a10 * b00 + a11 * b10 + a12 * b20 + a13 * b30,
	            a10 * b01 + a11 * b11 + a12 * b21 + a13 * b31,
	            a10 * b02 + a11 * b12 + a12 * b22 + a13 * b32,
	            a10 * b03 + a11 * b13 + a12 * b23 + a13 * b33,
	            a20 * b00 + a21 * b10 + a22 * b20 + a23 * b30,
	            a20 * b01 + a21 * b11 + a22 * b21 + a23 * b31,
	            a20 * b02 + a21 * b12 + a22 * b22 + a23 * b32,
	            a20 * b03 + a21 * b13 + a22 * b23 + a23 * b33,
	            a30 * b00 + a31 * b10 + a32 * b20 + a33 * b30,
	            a30 * b01 + a31 * b11 + a32 * b21 + a33 * b31,
	            a30 * b02 + a31 * b12 + a32 * b22 + a33 * b32,
	            a30 * b03 + a31 * b13 + a32 * b23 + a33 * b33];
	  },
	  cross: function(a, b) {
	    return [
	      a[1] * b[2] - a[2] * b[1],
	      a[2] * b[0] - a[0] * b[2],
	      a[0] * b[1] - a[1] * b[0]
	    ];
	  },
	  normalize3v: function(a) {
	    var l = Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);
	    if (l > 0.00001) {
	      return [
	        a[0] / l,
	        a[1] / l,
	        a[2] / l,
	      ];
	    }
	    else {
	      return [0, 0, 0]
	    }

	  },
	  inverse: function(m) {
	    var m00 = m[0 * 4 + 0];
	    var m01 = m[0 * 4 + 1];
	    var m02 = m[0 * 4 + 2];
	    var m03 = m[0 * 4 + 3];
	    var m10 = m[1 * 4 + 0];
	    var m11 = m[1 * 4 + 1];
	    var m12 = m[1 * 4 + 2];
	    var m13 = m[1 * 4 + 3];
	    var m20 = m[2 * 4 + 0];
	    var m21 = m[2 * 4 + 1];
	    var m22 = m[2 * 4 + 2];
	    var m23 = m[2 * 4 + 3];
	    var m30 = m[3 * 4 + 0];
	    var m31 = m[3 * 4 + 1];
	    var m32 = m[3 * 4 + 2];
	    var m33 = m[3 * 4 + 3];
	    var tmp_0  = m22 * m33;
	    var tmp_1  = m32 * m23;
	    var tmp_2  = m12 * m33;
	    var tmp_3  = m32 * m13;
	    var tmp_4  = m12 * m23;
	    var tmp_5  = m22 * m13;
	    var tmp_6  = m02 * m33;
	    var tmp_7  = m32 * m03;
	    var tmp_8  = m02 * m23;
	    var tmp_9  = m22 * m03;
	    var tmp_10 = m02 * m13;
	    var tmp_11 = m12 * m03;
	    var tmp_12 = m20 * m31;
	    var tmp_13 = m30 * m21;
	    var tmp_14 = m10 * m31;
	    var tmp_15 = m30 * m11;
	    var tmp_16 = m10 * m21;
	    var tmp_17 = m20 * m11;
	    var tmp_18 = m00 * m31;
	    var tmp_19 = m30 * m01;
	    var tmp_20 = m00 * m21;
	    var tmp_21 = m20 * m01;
	    var tmp_22 = m00 * m11;
	    var tmp_23 = m10 * m01;

	    var t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
	        (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
	    var t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
	        (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
	    var t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
	        (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
	    var t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
	        (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);

	    var d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

	    return [
	      d * t0,
	      d * t1,
	      d * t2,
	      d * t3,
	      d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
	            (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30)),
	      d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
	            (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30)),
	      d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
	            (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30)),
	      d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
	            (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20)),
	      d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
	            (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33)),
	      d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
	            (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33)),
	      d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
	            (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33)),
	      d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
	            (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23)),
	      d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
	            (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22)),
	      d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
	            (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02)),
	      d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
	            (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12)),
	      d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
	            (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02))
	    ];
	  }
	}

	module.exports = tfm;


/***/ },
/* 4 */
/***/ function(module, exports) {

	var geometries = {
	  cube: function(l) {
	    var u =  l / 2;
	    return [
	      //top
	      -u, -u, u,
	      u, -u, u,
	      -u, u, u,
	      -u, u, u,
	      u, -u, u,
	      u, u, u,

	      //right
	      u, -u, u,
	      u, -u, -u,
	      u, u, u,
	      u, u, u,
	      u, -u, -u,
	      u, u, -u,

	      //back
	      u, -u, -u,
	      -u, -u, -u,
	      u, u, -u,
	      u, u, -u,
	      -u, -u, -u,
	      -u, u, -u,

	      //left
	      -u, -u, -u,
	      -u, -u, u,
	      -u, u, -u,
	      -u, u, -u,
	      -u, -u, u,
	      -u, u, u,

	      //top
	      -u, u, u,
	      u, u, u,
	      -u, u, -u,
	      -u, u, -u,
	      u, u, u,
	      u, u, -u,

	      //bottom
	      -u, -u, u,
	      -u, -u, -u,
	      u, -u, u,
	      u, -u, u,
	      -u, -u, -u,
	      u, -u, -u
	    ];
	  },
	  cubeColors: function() {
	    return [
	      //front RED
	      255, 0, 0,
	      255, 0, 0,
	      255, 0, 0,
	      255, 0, 0,
	      255, 0, 0,
	      255, 0, 0,

	      //right YELLOW
	      255, 255, 0,
	      255, 255, 0,
	      255, 255, 0,
	      255, 255, 0,
	      255, 255, 0,
	      255, 255, 0,

	      //back PINK
	      255, 0, 255,
	      255, 0, 255,
	      255, 0, 255,
	      255, 0, 255,
	      255, 0, 255,
	      255, 0, 255,

	      //left BLUE
	      0, 0, 255,
	      0, 0, 255,
	      0, 0, 255,
	      0, 0, 255,
	      0, 0, 255,
	      0, 0, 255,

	      //top GREEN
	      0, 255, 0,
	      0, 255, 0,
	      0, 255, 0,
	      0, 255, 0,
	      0, 255, 0,
	      0, 255, 0,

	      //bottom LIGHT BLUE
	      0, 255, 255,
	      0, 255, 255,
	      0, 255, 255,
	      0, 255, 255,
	      0, 255, 255,
	      0, 255, 255
	    ];
	  },
	  cubeNormals: function() {
	    return [
	      //top
	      0, 0, 1,
	      0, 0, 1,
	      0, 0, 1,
	      0, 0, 1,
	      0, 0, 1,
	      0, 0, 1,

	      //right
	      1, 0, 0,
	      1, 0, 0,
	      1, 0, 0,
	      1, 0, 0,
	      1, 0, 0,
	      1, 0, 0,

	      //back
	      0, 0, -1,
	      0, 0, -1,
	      0, 0, -1,
	      0, 0, -1,
	      0, 0, -1,
	      0, 0, -1,

	      //left
	      -1, 0, 0,
	      -1, 0, 0,
	      -1, 0, 0,
	      -1, 0, 0,
	      -1, 0, 0,
	      -1, 0, 0,

	      //top
	      0, 1, 0,
	      0, 1, 0,
	      0, 1, 0,
	      0, 1, 0,
	      0, 1, 0,
	      0, 1, 0,

	      //bottom
	      0, -1, 0,
	      0, -1, 0,
	      0, -1, 0,
	      0, -1, 0,
	      0, -1, 0,
	      0, -1, 0,
	    ];
	  }
	}

	module.exports = geometries;


/***/ }
/******/ ]);