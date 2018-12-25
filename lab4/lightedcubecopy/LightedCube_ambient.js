// LightedCube_ambient.js (c) 2012 matsuda
// Vertex shader program
var FSIZE = 4;
var VSHADER_SOURCE = null
var FSHADER_SOURCE = null

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

  var success = initVertexBuffer(gl);
  success = success && initIndexBuffer(gl);
  success = success && initAttributes(gl);
  if (!success) {
      console.log('Failed to initialize buffers.');
      return;
  }

  // Set the clear color and enable the depth test
  gl.clearColor(0, 0, 0, 1);
  //gl.enable(gl.DEPTH_TEST);

  // Get the storage locations of uniform variables and so on
  var u_DiffuseLight = gl.getUniformLocation(gl.program, 'u_DiffuseLight');
  var u_LightDirection = gl.getUniformLocation(gl.program, 'u_LightDirection');
  var u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight');
  var val = gl.getUniformLocation(gl.program, 'val');
  console.log(val)
  if (!u_DiffuseLight || !u_LightDirection || !u_AmbientLight) {
    console.log('Failed to get the storage location');
    return;
  }

  gl.uniform1f(val, 1.0);
  // Set the light color (white)
  gl.uniform3f(u_DiffuseLight, 1.0, 1.0, 1.0);
  // Set the light direction (in the world coordinate)
  var lightDirection = new Vector3([0.2, 9.0, 4.0]);
  lightDirection.normalize();     // Normalize
  gl.uniform3fv(u_LightDirection, lightDirection.elements);
  // Set the ambient light
  gl.uniform3f(u_AmbientLight, 0.2, 0.2, 0.2);
  gl.clear(gl.COLOR_BUFFER_BIT);

  var vertices = [
    0, 0.5, 0, 0, 0, 1, 1,
    0.5, 0.5, 0, 0, 0, 1, 1,
    0.5, 0, 0, 0, 0, 1, 1,
    0, 0, 0, 0, 0, 1, 1
  ]

  drawSquare(vertices, gl, 0, 0)
  // Clear color and depth buffer
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

// initialize vertex buffer
function initVertexBuffer(gl) {
    // create buffer object
    var vertex_buffer = gl.createBuffer();
    if (!vertex_buffer) {
        console.log("failed to create vertex buffer");
        return false;
    }
    // bind buffer objects to targets
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    return true;
}

// initialize index buffer
function initIndexBuffer(gl) {
    // create buffer object
    var index_buffer = gl.createBuffer();
    if (!index_buffer) {
        console.log("failed to create index buffer");
        return false;
    }
    // bind buffer objects to targets
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
    return true;
}

function initAttributes(gl) {
    // assign buffers and enable assignment
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    var a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
    console.log(a_Normal)

    if (a_Position < 0) {
        console.log("failed to get storage location of a_Position");
        return false;
    }
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 7, 0);
    gl.enableVertexAttribArray(a_Position);
    gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, FSIZE * 7, FSIZE * 3);
    gl.enableVertexAttribArray(a_Color);
    return true;
}

function setVertexBuffer(gl, vertices) {
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
}

function setIndexBuffer(gl, indices) {
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
}

function drawSquare(vertices, gl, index, centerCylinder){
  if(vertices.length != 28)
    return
  var arr = []
  var coordinate = []
  var i = 0
  for(i = 0; i+6 < vertices.length; i+=7) {
    var point = []
    point.push(vertices[i])
    point.push(vertices[i+1])
    point.push(vertices[i+2])
    coordinate.push(point)
  }

  var col = [0, 0, 1, 1]
  for(i = 0; i+6 < vertices.length; i+=7) {
    arr.push(vertices[i])
    arr.push(vertices[i+1])
    arr.push(vertices[i+2])
    arr.push(col[0])
    arr.push(col[1])
    arr.push(col[2])
    arr.push(col[3])
  }
  var ind = [0,1,2,
             3,0,2]
  setVertexBuffer(gl, new Float32Array(arr));
  setIndexBuffer(gl, new Uint16Array(ind));
  gl.drawElements(gl.TRIANGLES, ind.length, gl.UNSIGNED_SHORT, 0);
}
