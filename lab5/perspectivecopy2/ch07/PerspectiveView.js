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
  //projMatrix.setPerspective(30, canvas.width/canvas.height, 1, 100);
  projMatrix.setOrtho(-2, 2, -2, 2, 1, 100)
  // Pass the view and projection matrix to u_ViewMatrix, u_ProjMatrix
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
  gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  var n = initVertexBuffers3(gl);
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }
  //gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);

  //test(gl)
  test2(gl)
}

function test2(gl){
  var vertices = [
      0.25, -1.0,   0.0,
      0.75,  1.0,   0.0,
      0.75,  1.0,  .25,
      0.25, -1.0,  .25
  ];
  var vertices2 = [
      0, 0, 0.25,
      0.75, 0, 0.25,
      -0.25, 0, 0,
      0.5, 0, 0
    ]

  var colors = [
    0.0,  1.0,  0.0,  // The front blue one
    0.0,  1.0,  0.0,
    0.0,  1.0,  0.0,
    0.0,  1.0,  0.0
 ];
  // Normal
  var normals = [
    0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0, 0.0, 0.0, 1.0
  ];
  var n = initVertexBuffers4(vertices, colors, normals, gl)
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}

function test(gl){
  var center = [0,0]
  var center2 = [0.75,0]
  var arr = getCirclePoint(center, 4, 0.25)
  var arr2 = getCirclePoint(center2, 4, 0.25)
  arr = rotatePoint(arr, 90, center, 4)
  arr2 = rotatePoint(arr2, 90, center2, 4)
  var vertices = [
      0.25, -1.0,   0.0,
      0.75,  1.0,   0.0,
      0.75,  1.0,  -2.0,
      0.25, -1.0,  -2.0
  ];
  var colors = [
    0.0,  1.0,  0.0,  // The front blue one
    0.0,  1.0,  0.0,
    0.0,  1.0,  0.0,
    0.0,  1.0,  0.0
 ];
  // Normal
  var normals = [
    0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0, 0.0, 0.0, 1.0
  ];
  var n = initVertexBuffers4(arr, colors, normals, gl)
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
  n = initVertexBuffers4(arr2, colors, normals, gl)
  //gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
  connectSquares(arr, arr2, gl)
}

function connectSquares(arr, arr2, gl){
  var i = 0
  var squares = []
  var sqArr = []
  var last1 = []
  var last2 = []
  var curr1 = []
  var curr2 = []
  for(i = 0; i+2 < arr.length; i+=3) {
      curr1 = []
      curr2 = []
      addToArray(curr1, arr, i, i+3)
      addToArray(curr2, arr2, i, i+3)
      if(last1.length != 0){
        addAllToArray(sqArr, last1)
        addAllToArray(sqArr, curr1)
        addAllToArray(sqArr, curr2)
        addAllToArray(sqArr, last2)
        squares.push(sqArr)
        sqArr = []
      }
      last1 = curr1
      last2 = curr2
  }
  console.log(squares)
  var colors = [
    0.0,  1.0,  0.0,  // The front blue one
    0.0,  1.0,  0.0,
    0.0,  1.0,  0.0,
    0.0,  1.0,  0.0
 ];
 var colors2 = [
   1.0,  0.0,  0.0,  // The front blue one
   1.0,  0.0,  0.0,
   1.0,  0.0,  0.0,
   1.0,  0.0,  0.0
];
var colors3 = [
  0.0, 0.0,  1.0,  // The front blue one
  0.0, 0.0,  1.0,
  0.0, 0.0,  1.0,
  0.0, 0.0,  1.0
];
  // Normal
  var normals = [
    0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0, 0.0, 0.0, 1.0
  ];
  n = initVertexBuffers4(squares[0], colors, normals, gl)
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
  n = initVertexBuffers4(squares[1], colors, normals, gl)
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
  n = initVertexBuffers4(squares[2], colors, normals, gl)
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}

function addAllToArray(arr1, arr2){
  var i = 0;
  for(i = 0; i < arr2.length; i++)
    arr1.push(arr2[i])
}

function addToArray(arr1, arr2, start, end){
  var i = 0;
  for(i = start; i < end; i++)
    arr1.push(arr2[i])
}

function getCirclePoint(center, numSides, radius){
  var arr = []
  var degree = 360/numSides
  var i = 0
  for(i = 1; i <= numSides; i++){
    arr.push(radius*Math.cos(toRadians(i*degree))+center[0])
    arr.push(center[1])
    arr.push(radius*Math.sin(toRadians(i*degree)))
  }
  return arr
}

function toRadians (angle) {
  return angle * (Math.PI / 180);
}

function toDegrees (angle) {
  return angle * (180 / Math.PI)
}

function rotatePoint(arr, deg, point, numSides){
  deg = -deg
  if(point.length != 2)
    return
  var a = point[0]
  var b = point[1]
  var rArr = []
  if(arr.length%numSides != 0)
    return
  var i = 0

  for(i = 0; i+2 < arr.length; i+=3){
    var x = arr[i]
    var y = arr[i+1]
    rArr.push((x-a)*Math.cos(toRadians(deg)) - (y-b)*Math.sin(toRadians(deg))+a)
    rArr.push((x-a)*Math.sin(toRadians(deg)) + (y-b)*Math.cos(toRadians(deg))+b)
    rArr.push(arr[i+2])
  }
  return rArr
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

  var shift = 0.5

  var vertices = new Float32Array([
      0.25, -1.0,   0.0,
      0.75,  1.0,   0.0,
      0.75,  1.0,  -2.0,
      0.25, -1.0,  -2.0
  ]);

  // Colors
  var colors = new Float32Array([
    0.0,  1.0,  0.0,  // The front blue one
    0.0,  1.0,  0.0,
    0.0,  1.0,  0.0,
    0.0,  1.0,  0.0
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

function initVertexBuffers4(vert, col, norm, gl) {
  // Create a cube
  //    v6----- v5
  //   /|      /|
  //  v1------v0|
  //  | |     | |
  //  | |v7---|-|v4
  //  |/      |/
  //  v2------v3
  // Coordinates

  var shift = 0.5

  /*var vertices = new Float32Array([
      0.25, -1.0,   0.0,
      0.75,  1.0,   0.0,
      0.75,  1.0,  -2.0,
      0.25, -1.0,  -2.0
  ]);*/
  var vertices = new Float32Array(vert);

  // Colors
  /*var colors = new Float32Array([
    0.0,  1.0,  0.0,  // The front blue one
    0.0,  1.0,  0.0,
    0.0,  1.0,  0.0,
    0.0,  1.0,  0.0
 ]);*/
 var colors = new Float32Array(col)

  // Normal
  /*var normals = new Float32Array([
    0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0, 0.0, 0.0, 1.0
  ]);*/
  var normals = new Float32Array(norm)

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
