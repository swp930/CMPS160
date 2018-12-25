// PickFace.js (c) 2012 matsuda and kanda
// Vertex shader program

var VSHADER_SOURCE = null;


// Fragment shader program
var FSHADER_SOURCE = null;

var ANGLE_STEP = 20.0; // Rotation angle (degrees/second)

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

  // Set the vertex information
  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }

  // Set the clear color and enable the depth test
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  // Get the storage locations of uniform variables
  //var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix'); //MVP Matrix
  var u_PickedFace = gl.getUniformLocation(gl.program, 'u_PickedFace');
  //var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix'); //V P Matrix
  //var u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix'); //V P Matrix
  //if (!u_MvpMatrix || !u_PickedFace) {                                      //MVP Matrix
  //  console.log('Failed to get the storage location of uniform variable');  //MVP Matrix
  //  return;                                                                 //MVP Matrix
  //}                                                                         //MVP Matrix

  //var viewMatrix = new Matrix4();　// The view matrix          //V P Matrix
  //var projMatrix = new Matrix4();  // The projection matrix   //V P Matrix

  // calculate the view matrix and projection matrix
  //viewMatrix.setLookAt(0, 0, 5, 0, 0, -100, 0, 1, 0);                 //V P Matrix
  //projMatrix.setPerspective(40, canvas.width/canvas.height, 1, 100);  //V P Matrix
  //projMatrix.setOrtho(-2, 2, -2, 2, 3, 100)                           //V P Matrix
  // Pass the view and projection matrix to u_ViewMatrix, u_ProjMatrix
  //gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);      //V P Matrix
  //gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);      //V P Matrix

  // Calculate the view projection matrix
  //var viewProjMatrix = new Matrix4();                                             //MVP Matrix
  //viewProjMatrix.setPerspective(30.0, canvas.width / canvas.height, 1.0, 100.0);  //MVP Matrix
  //viewProjMatrix.lookAt(0.0, 0.0, 7.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);             //MVP Matrix

  // Initialize selected surface
  gl.uniform1i(u_PickedFace, -1);

  //var currentAngle = 0.0; //MVP Matrix

  // Caliculate The model view projection matrix and pass it to u_MvpMatrix
  //var g_MvpMatrix = new Matrix4(); // Model view projection matrix            //MVP Matrix
  //g_MvpMatrix.set(viewProjMatrix);                                            //MVP Matrix
  //g_MvpMatrix.rotate(currentAngle, 1.0, 0.0, 0.0); // Rotate appropriately    //MVP Matrix
  //g_MvpMatrix.rotate(currentAngle, 0.0, 1.0, 0.0);                            //MVP Matrix
  //g_MvpMatrix.rotate(currentAngle, 0.0, 0.0, 1.0);                            //MVP Matrix
  //gl.uniformMatrix4fv(u_MvpMatrix, false, g_MvpMatrix.elements);              //MVP Matrix

  canvas.onmousedown = function(ev) { click(ev, gl) }

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);     // Clear buffers
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);   // Draw
}

function click(ev, gl) {
  var x = ev.clientX, y = ev.clientY;
  var rect = ev.target.getBoundingClientRect();
  if (rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom) {
    var x_in_canvas = x - rect.left, y_in_canvas = rect.bottom - y;
    var pixels = new Uint8Array(4);
    test1(gl)
    test2(gl)
    gl.readPixels(x_in_canvas, y_in_canvas, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    console.log(pixels);
  }
}

function test1(gl){
  initVertexBuffers2(gl)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);     // Clear buffers
  gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_BYTE, 0);   // Draw
}

function test2(gl){
  initVertexBuffers(gl)
  gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_BYTE, 0);   // Draw
}

function initVertexBuffers(gl) {
  var vertices = new Float32Array([   // Vertex coordinates
     0.5, 0.5, 0.5,  -0.5, 0.5, 0.5,  -0.5,-0.5, 0.5
  ]);

  var colors = new Float32Array([   // Colors
    0.20, 0.14, 0.45, 0.5,  0.21, 0.18, 0.56, 1,  0.32, 0.18, 0.56, 1,
   ]);

  var faces = new Uint8Array([   // Faces
    1, 1, 1     // v0-v1-v2-v3 front
  ]);

  var indices = new Uint8Array([   // Indices of the vertices
     0, 1, 2
  ]);

  // Create a buffer object
  var indexBuffer = gl.createBuffer();
  if (!indexBuffer) {
    return -1;
  }

  // Write vertex information to buffer object
  if (!initArrayBuffer(gl, vertices, gl.FLOAT, 3, 'a_Position')) return -1; // Coordinates Information
  if (!initArrayBuffer(gl, colors, gl.FLOAT, 4, 'a_Color')) return -1;      // Color Information
  //if (!initArrayBuffer(gl, faces, gl.UNSIGNED_BYTE, 1, 'a_Face')) return -1;// Surface Information

  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // Write the indices to the buffer object
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  return indices.length;
}

function initVertexBuffers2(gl) {
  var vertices = new Float32Array([   // Vertex coordinates
     0.5, 0.5, 0.5,  -0.5,-0.5, 0.5, 0.5, -0.5, 0.5
  ]);

  var colors = new Float32Array([   // Colors
    0.20, 0.14, 0.45, 0.5,  0.21, 0.18, 0.56, 1,  0.32, 0.18, 0.56, 1,
   ]);

  var faces = new Uint8Array([   // Faces
    1, 1, 1     // v0-v1-v2-v3 front
  ]);

  var indices = new Uint8Array([   // Indices of the vertices
     0, 1, 2
  ]);

  // Create a buffer object
  var indexBuffer = gl.createBuffer();
  if (!indexBuffer) {
    return -1;
  }

  // Write vertex information to buffer object
  if (!initArrayBuffer(gl, vertices, gl.FLOAT, 3, 'a_Position')) return -1; // Coordinates Information
  if (!initArrayBuffer(gl, colors, gl.FLOAT, 4, 'a_Color')) return -1;      // Color Information
  //if (!initArrayBuffer(gl, faces, gl.UNSIGNED_BYTE, 1, 'a_Face')) return -1;// Surface Information

  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // Write the indices to the buffer object
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  return indices.length;
}

function initArrayBuffer (gl, data, type, num, attribute) {
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
  gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
  // Enable the assignment to a_attribute variable
  gl.enableVertexAttribArray(a_attribute);

  return true;
}
