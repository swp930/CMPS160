// PerspectiveView.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = null;
var FSHADER_SOURCE = null;

function setShader(gl, canvas, shader, shader_src) {
    if (shader == gl.VERTEX_SHADER)
        VSHADER_SOURCE = shader_src;
    if (shader == gl.FRAGMENT_SHADER)
        FSHADER_SOURCE = shader_src;
    if (VSHADER_SOURCE && FSHADER_SOURCE)
        start(gl, canvas);
}

function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  loadFile("shader.vert", function(shader_src) { setShader(gl, canvas, gl.VERTEX_SHADER, shader_src); });
  loadFile("shader.frag", function(shader_src) { setShader(gl, canvas, gl.FRAGMENT_SHADER, shader_src); });
}

function start(gl, canvas){
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Set the vertex coordinates and color (the blue triangle is in the front)

  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1);

  // get the storage locations of u_ViewMatrix and u_ProjMatrix
  var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  var u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
  if (!u_ViewMatrix || !u_ProjMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix and/or u_ProjMatrix');
    return;
  }

  var viewMatrix = new Matrix4();　// The view matrix
  var projMatrix = new Matrix4();  // The projection matrix

  // calculate the view matrix and projection matrix
  viewMatrix.setLookAt(0, 0, 5, 0, 0, -100, 0, 1, 0);
  projMatrix.setPerspective(30, canvas.width/canvas.height, 1, 100);
  //projMatrix.setOrtho(-2, 2, -2, 2, 5, 100)
  // Pass the view and projection matrix to u_ViewMatrix, u_ProjMatrix
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
  gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw the triangles
  var n = initVertexBuffers3(gl);
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}

function initVertexBuffers(gl) {
  // Create a cube
  //    v6----- v5
  //   /|      /|
  //  v1------v0|
  //  | |     | |
  //  | |v7---|-|v4
  //  |/      |/
  //  v2------v3
  // Coordinates
  var vertices = new Float32Array([
     0.25,  0.5,  -4.0,
     0.25, -0.5,  -4.0,
     1.25, -0.5,  -4.0,
     1.25,  0.5,  -4.0
  ]);

  // Colors
  var colors = new Float32Array([
    1.0,  1.0,  0.4,
    1.0,  1.0,  0.4,
    1.0,  0.4,  0.4,
    1.0,  0.4,  0.4
 ]);

  // Normal
  var normals = new Float32Array([
    0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0, 0.0, 0.0, 1.0
  ]);

 var indices = new Uint8Array([
   0,1,2,
   3,0,2
 ])

  // Write the vertex property to buffers (coordinates, colors and normals)
  if (!initArrayBuffer(gl, 'a_Position', vertices, 3)) return -1;
  if (!initArrayBuffer(gl, 'a_Color', colors, 3)) return -1;
  if (!initArrayBuffer(gl, 'a_Normal', normals, 3)) return -1;

  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // Write the indices to the buffer object
  var indexBuffer = gl.createBuffer();
  if (!indexBuffer) {
    console.log('Failed to create the buffer object');
    return false;
  }
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  return indices.length;
}

function initVertexBuffers2(gl) {
  // Create a cube
  //    v6----- v5
  //   /|      /|
  //  v1------v0|
  //  | |     | |
  //  | |v7---|-|v4
  //  |/      |/
  //  v2------v3
  // Coordinates


  var vertices = new Float32Array([
    0.25,  0.5,   0.0,
    0.25, -0.5,   0.0,
    1.25, -0.5,   0.0,
    1.25,  0.5,   0.0
  ]);

  // Colors
  var colors = new Float32Array([
    0.4,  0.4,  1.0,  // The front blue one
    0.4,  0.4,  1.0,
    1.0,  0.4,  0.4,
    1.0,  0.4,  0.4
 ]);

  // Normal
  var normals = new Float32Array([
    0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0, 0.0, 0.0, 1.0
  ]);

 var indices = new Uint8Array([
   0,1,2,
   3,0,2
 ])

  // Write the vertex property to buffers (coordinates, colors and normals)
  if (!initArrayBuffer(gl, 'a_Position', vertices, 3)) return -1;
  if (!initArrayBuffer(gl, 'a_Color', colors, 3)) return -1;
  if (!initArrayBuffer(gl, 'a_Normal', normals, 3)) return -1;

  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // Write the indices to the buffer object
  var indexBuffer = gl.createBuffer();
  if (!indexBuffer) {
    console.log('Failed to create the buffer object');
    return false;
  }
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  return indices.length;
}

function initVertexBuffers3(gl) {
  // Create a cube
  //    v6----- v5
  //   /|      /|
  //  v1------v0|
  //  | |     | |
  //  | |v7---|-|v4
  //  |/      |/
  //  v2------v3
  // Coordinates
  var vert = [
    0.25,  0.5,   0.0,
    0.25, -0.5,   0.0,
    1.25, -0.5,   0.0,
    1.25,  0.5,   0.0]


  var col = [
    0.4,  0.4,  1.0,  // The front blue one
    0.4,  0.4,  1.0,
    1.0,  0.4,  0.4,
    1.0,  0.4,  0.4
  ]
  // Color

  var norm = [
    0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0, 0.0, 0.0, 1.0
  ]

  var vert2 = [
     0.25,  0.5,  -4.0,
     0.25, -0.5,  -4.0,
     1.25, -0.5,  -4.0,
     1.25,  0.5,  -4.0
  ];

  // Colors
  var col2 = [
    1.0,  1.0,  0.4,
    1.0,  1.0,  0.4,
    1.0,  0.4,  0.4,
    1.0,  0.4,  0.4
 ];

  // Normal
  var norm2 = [
    0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0, 0.0, 0.0, 1.0
  ];
  // Normal

  addAllToArray(vert, vert2)
  addAllToArray(col, col2)
  addAllToArray(norm, norm2)

  var vertices = new Float32Array(vert);
  var colors = new Float32Array(col);
  var normals = new Float32Array(norm);

  var indices = new Uint8Array([
    0,1,2,
    3,0,2,
    4,5,6,
    7,4,6
  ])

  // Write the vertex property to buffers (coordinates, colors and normals)
  if (!initArrayBuffer(gl, 'a_Position', vertices, 3)) return -1;
  if (!initArrayBuffer(gl, 'a_Color', colors, 3)) return -1;
  if (!initArrayBuffer(gl, 'a_Normal', normals, 3)) return -1;

  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // Write the indices to the buffer object
  var indexBuffer = gl.createBuffer();
  if (!indexBuffer) {
    console.log('Failed to create the buffer object');
    return false;
  }
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  return indices.length;
}

function addAllToArray(arr1, arr2){
  var i =0
  for(i = 0; i < arr2.length; i++){
    arr1.push(arr2[i])
  }
}

function initArrayBuffer(gl, attribute, data, num) {
  // Create a buffer object
  var buffer = gl.createBuffer();
  if (!buffer) {
    console.log('Failed to create the buffer object');
    return false;
  }
  // Write date into the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  // Assign the buffer object to the attribute variable
  var a_attribute = gl.getAttribLocation(gl.program, attribute);
  if (a_attribute < 0) {
    console.log('Failed to get the storage location of ' + attribute);
    return false;
  }
  gl.vertexAttribPointer(a_attribute, num, gl.FLOAT, false, 0, 0);
  // Enable the assignment of the buffer object to the attribute variable
  gl.enableVertexAttribArray(a_attribute);

  return true;
}
