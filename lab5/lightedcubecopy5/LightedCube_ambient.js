// LightedCube_ambient.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = null
var FSHADER_SOURCE = null

var g_points_vertices = []; // array of mouse presses
var g_points_colors = [];
var g_points_normals = [];
var open = false
var numSides = 20
var radius = 0.4
var volume = 0
var surfaceArea = 0
var cylinderInd = 0
var percent = 0.4;
var showNormals = false

var light = [1,1,1]
var light2 = [1,1,1]
var icol = [1,1,1]

var first1 = true
var first2 = true
var draw = false
var cylinderShift = 0

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

  //

  // Set the clear color and enable the depth test
  gl.clearColor(0, 0, 0, 1);
  gl.enable(gl.DEPTH_TEST);

  // Get the storage locations of uniform variables and so on
  var u_DiffuseLight = gl.getUniformLocation(gl.program, 'u_DiffuseLight');
  var u_LightDirection = gl.getUniformLocation(gl.program, 'u_LightDirection');
  var u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight');
  var u_UniformGreen = gl.getUniformLocation(gl.program, 'u_UniformGreen');
  var u_ViewDirection = gl.getUniformLocation(gl.program, 'u_ViewDirection');
  var u_SpecularLight = gl.getUniformLocation(gl.program, 'u_SpecularLight');
  var p = gl.getUniformLocation(gl.program, 'p');
  if (!u_DiffuseLight || !u_LightDirection || !u_AmbientLight) {
    console.log('Failed to get the storage location');
    return;
  }

  gl.uniform3f(u_UniformGreen, 0.0, 1.0, 0.0);
  // Set the light color (white)
  gl.uniform3f(u_DiffuseLight, 1.0, 0.0, 0.0);
  // Set the light direction (in the world coordinate)
  var lightDirection = new Vector3([1.0, 1.0, 1.0]);
  lightDirection.normalize();     // Normalize
  gl.uniform3fv(u_LightDirection, lightDirection.elements);
  // Set the ambient light
  gl.uniform3f(u_AmbientLight, 0.0, 0.0, 0.2);

  gl.uniform3f(u_ViewDirection, 0.0, 0.0, -1.0);

  gl.uniform3f(u_SpecularLight, 0.0, 1.0, 0.0);

  gl.uniform1f(p, 2.0);


  // Clear color and depth buffer
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  var vertices = [
    0.5, 0.5, 0.5,
    -0.5, 0.5, 0.5,
    -0.5,-0.5, 0.5,
    0.5,-0.5, 0.5
  ]

  var colors = [
    0, 0, 1, 1,
    0, 0, 1, 1,
    0, 0, 1, 1,
    0, 0, 1, 1
  ]

  var normals = [
    1, 1, 1,
    1, 1, 1,
    1, 1, 1,
    1, 1, 1
  ]
  //drawSquares(vertices, colors, normals, gl)
  //g_points_vertices = vertices;
  //g_points_colors = colors;
  //g_points_normals = normals;
  //drawPolyline(gl)
  var shift = 0
  var point1 = [-0.8+shift,-0.8]
  var point2 = [0.8+shift,0.8]
  drawCylinder(point1, point2, gl, numSides, radius, 0)
  document.getElementById('shiftLightLeft').onclick = function(){ shiftLight(canvas, gl, -1, 0); };
  document.getElementById('shiftLightRight').onclick = function(){ shiftLight(canvas, gl, 1, 0); };
  document.getElementById('shiftCylinderRight').onclick = function(){ shiftLight(canvas, gl, 0, 0.1); };
  document.getElementById('shiftCylinderLeft').onclick = function(){ shiftLight(canvas, gl, 0, -0.1); };
  //canvas.onmousedown = function(ev){ click(ev, gl, canvas); };
  //canvas.onmousemove = function(ev){ move(ev, gl, canvas) }
  var vertices = [
    0.5, 0.5, 0,
    0.0, 0.5, 0,
    0.5, 0.0, 0,
    -0.5, -0.5, 0
  ]
  //var n = drawLine(vertices, gl)
}

function drawLine(vert, gl){
  var vertices = new Float32Array(vert)

  // Colors
  var i = 0
  var col = []
  for(i = 0; i < vert.length/3; i++){
    col.push(0)
    col.push(1)
    col.push(0)
  }
  var colors = new Float32Array(col);

  var norm = []
  for(i = 0; i < vert.length/3; i++){
    norm.push(1)
    norm.push(1)
    norm.push(1)
  }
  // Normal
  var normals = new Float32Array(norm);

  var ind = []
  for(i = 0; i < vert.length/3; i++){
    ind.push(i)
  }
 var indices = new Uint8Array(ind)

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

  gl.drawElements(gl.LINE_STRIP, indices.length, gl.UNSIGNED_BYTE, 0);
}

function shiftLight(canvas, gl, disp, shift){
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  var u_LightDirection = gl.getUniformLocation(gl.program, 'u_LightDirection');
  light2[0] += disp*0.4
  cylinderShift += shift
  var lightDirection = new Vector3(light2);
  lightDirection.normalize();     // Normalize
  gl.uniform3fv(u_LightDirection, lightDirection.elements);
  var point1 = [-0.8+cylinderShift,-0.8]
  var point2 = [0.8+cylinderShift,0.8]
  drawCylinder(point1, point2, gl, numSides, radius, 0)
}

function drawSquares(vertices, colors, normals, gl){
  if (!initArrayBuffer(gl, 'a_Position', new Float32Array(vertices), 3)) return -1;
  if (!initArrayBuffer(gl, 'a_Color', new Float32Array(colors), 4)) return -1;
  if (!initArrayBuffer(gl, 'a_Normal', new Float32Array(normals), 3)) return -1;
  var indices = new Uint8Array([
    0,1,2,
    3,0,2
  ])
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
  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);
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

function click(ev, gl, canvas) {
    open = true
    move(ev,gl,canvas)
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();
    x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
    y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
    // Store the vertex information to g_points array
    g_points_vertices.push(x); // x-coordinate
    g_points_vertices.push(y); // y-coordinate
    g_points_vertices.push(0); // z-coordinate is 0; polyline lines in xy-plane z=0

    g_points_colors.push(0);
    g_points_colors.push(1);
    g_points_colors.push(0);
    g_points_colors.push(1);

    g_points_normals.push(1);
    g_points_normals.push(1);
    g_points_normals.push(1);

    // Clear canvas
    //gl.clear(gl.COLOR_BUFFER_BIT);
    // Draw polyline
    drawPolyline(gl);

    // If user right clicks, finish polyline and draw cylinder
    if (ev.button == 2) {
      gl.clear(gl.COLOR_BUFFER_BIT);
      open = false
      drawCylinderLines(gl)
	   canvas.onmousedown = null;
    }
}

function move(ev, gl, canvas) {
    if(!open)
      return
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();
    x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
    y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
    // Store the vertex information to g_points array
    //g_points = g_points.splice(0,g_points.length-10)
    g_points_vertices = g_points_vertices.splice(0, g_points_vertices.length-3)
    g_points_colors = g_points_colors.splice(0, g_points_colors.length-4)
    g_points_normals = g_points_normals.splice(0, g_points_normals.length-3)
    g_points_vertices.push(x); // x-coordinate
    g_points_vertices.push(y); // y-coordinate
    g_points_vertices.push(0); // z-coordinate is 0; polyline lines in xy-plane z=0

    g_points_colors.push(0);
    g_points_colors.push(1);
    g_points_colors.push(0);
    g_points_colors.push(1);

    g_points_normals.push(1);
    g_points_normals.push(1);
    g_points_normals.push(1);

    // Clear canvas
    gl.clear(gl.COLOR_BUFFER_BIT);
    // Draw polyline
    drawPolyline(gl);

    // If user right clicks, finish polyline and draw cylinder
    if (ev.button == 2) {
	// Clear canvas
	gl.clear(gl.COLOR_BUFFER_BIT);
	/* PUT CODE TO GENERATE VERTICES/INDICES OF CYLINDER AND DRAW HERE */
	//drawRectangles(gl); // EXAMPLE: Generates rectangles whose corners are connected
	// drawPolyline(gl); // EXAMPLE: Draw polyline
	// Remove click handle
	canvas.onmousedown = null;
    }
}

function drawPolyline(gl){
  if (!initArrayBuffer(gl, 'a_Position', new Float32Array(g_points_vertices), 3)) return -1;
  if (!initArrayBuffer(gl, 'a_Color', new Float32Array(g_points_colors), 4)) return -1;
  if (!initArrayBuffer(gl, 'a_Normal', new Float32Array(g_points_normals), 3)) return -1;
  var ind = []
  var i = 0
  for(i = 0; i < g_points_vertices.length/3; i++)
    ind.push(i)
  var indices = new Uint8Array(ind)
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
  gl.drawElements(gl.LINE_STRIP, indices.length, gl.UNSIGNED_BYTE, 0);
}

function drawCylinderLines(gl){
  gl.clear(gl.COLOR_BUFFER_BIT);
   var i = 0
   var last = []
   var arr = []

   for(i = 0; i+2 < g_points_vertices.length; i+=3){
     arr.push(g_points_vertices[i])
     arr.push(g_points_vertices[i+1])
   }

   var index = 0
   for(i = 0; i+1 < arr.length; i+=2){
     var point = [arr[i], arr[i+1]]
     if( last.length == 0){
         last.push(arr[i])
         last.push(arr[i+1])
     }
     else {
       index++;
       drawCylinder(last, point, gl, numSides, radius, index)
       last = []
       last = point
     }
   }
}

function drawCylinder(point1, point2, gl, numSides, radius, index){
  var centerCylinder = [(point1[0]+point2[0])/2, (point1[1]+point2[1])/2]
  var arr = getCirclePoint(point1, numSides, radius)
  var arr2 = getCirclePoint(point2, numSides, radius)

  var angle = toDegrees(Math.atan((point2[0]-point1[0])/(point2[1]-point1[1])))
  arr = rotatePoint(arr, angle, point1)
  arr2 = rotatePoint(arr2, angle, point2)

  var vertices = new Float32Array(arr)
  var vertices2 = new Float32Array(arr2)

  var indiceArr = []
  var i = 0
  for(i = 0; i < numSides; i++)
    indiceArr.push(i)
  indiceArr.push(0)
  var indices = new Int16Array(indiceArr)
  connectSquares(arr, arr2, point1, point2, gl, centerCylinder)
}

function connectSquares(arr, arr2,point1, point2, gl, centerCylinder){
  var points = []
  var points2 = []
  var a = 0

  for(a = 0; a+2 < arr.length; a+=3){
      var point = []
      var point2 = []
      var b = a
      for(b = a; b <= a+2; b++){
            point.push(arr[b])
            point2.push(arr2[b])
      }
      points.push(point)
      points2.push(point2)
  }

  var squares2 = []

  var last = []
  var last2 = []
  for(a = 0; a < points.length; a++){
    if(last.length == 0){
      last = points[a]
      last2 = points2[a]
    } else {
      var sqArr = []
      var c = 0
      for(c = 0; c < last.length; c++)
        sqArr.push(last[c])
      for(c = 0; c < last2.length; c++)
        sqArr.push(last2[c])
      for(c = 0; c < points2[a].length; c++)
        sqArr.push(points2[a][c])
      for(c = 0; c < points[a].length; c++)
        sqArr.push(points[a][c])
      squares2.push(sqArr)
      last = points[a]
      last2 = points2[a]
    }
  }
  var p1 = points[points.length-1]
  var p2 = points2[points2.length-1]
  var p3 = points2[0]
  var p4 = points[0]
  var lastPoint = [p1, p2, p3, p4]

  var d = 0
  var sqArr = []
  for(d = 0; d < lastPoint.length; d++){
    var e = 0
    for(e = 0; e < lastPoint[d].length; e++){
      sqArr.push(lastPoint[d][e])
    }
  }

  squares2.push(sqArr)
  var r = 0
  //9 7 8
  //0 1 2 3 4 5 6 13
  //for(r = squares2.length-1; r >= 0; r--)
  //  drawSquare(squares2[r], centerCylinder, r, gl)
  drawSquare(squares2[8], centerCylinder, 0, point1, point2, gl)
  drawSquare(squares2[7], centerCylinder, 0, point1, point2, gl)
  drawSquare(squares2[6], centerCylinder, 0, point1, point2, gl)
  drawSquare(squares2[5], centerCylinder, 0, point1, point2, gl)
  drawSquare(squares2[4], centerCylinder, 0, point1, point2, gl)
  drawSquare(squares2[3], centerCylinder, 0, point1, point2, gl)
  drawSquare(squares2[2], centerCylinder, 0, point1, point2, gl)
  drawSquare(squares2[1], centerCylinder, 0, point1, point2, gl)
  drawSquare(squares2[0], centerCylinder, 0, point1, point2, gl)
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

function drawSquare(vertices, centerCylinder, index, point1, point2, gl){
  var colors = []
  var normals = []

  var arr = []
  var coordinate = []
  var i = 0
  for(i = 0; i+2 < vertices.length; i+=3) {
    var point = []
    point.push(vertices[i])
    point.push(vertices[i+1])
    point.push(vertices[i+2])
    coordinate.push(point)
  }
  var vec1 = [coordinate[0][0]-point1[0], coordinate[0][1]-point1[1],coordinate[0][2]]
  var vec2 = [coordinate[1][0]-point2[0], coordinate[1][1]-point2[1],coordinate[1][2]]
  var vec3 = [coordinate[2][0]-point2[0], coordinate[2][1]-point2[1],coordinate[2][2]]
  var vec4 = [coordinate[3][0]-point1[0], coordinate[3][1]-point1[1],coordinate[3][2]]
  var normalArr2 = [vec1, vec2, vec3, vec4]
  var normalArray = [normalize(vec1), normalize(vec2), normalize(vec3), normalize(vec4)]

  var center = []
  center.push((coordinate[0][0] + coordinate[3][0])/2)
  center.push((coordinate[0][1] + coordinate[3][1])/2)
  center.push((coordinate[0][2] + coordinate[3][2])/2)

  var centerOpposite = []
  centerOpposite.push((coordinate[1][0] + coordinate[2][0])/2)
  centerOpposite.push((coordinate[1][1] + coordinate[2][1])/2)
  centerOpposite.push((coordinate[1][2] + coordinate[2][2])/2)

  var vectorLine = [centerOpposite[0] - center[0], centerOpposite[1] - center[1], centerOpposite[2] - center[2]]

  var n = findNormal(coordinate[0], coordinate[1], coordinate[2])
  var vectorCenter = [centerCylinder[0]-center[0], centerCylinder[1]-center[1], 0-center[2]]
  var dotprod = n[0]*vectorCenter[0] + n[1]*vectorCenter[1] + n[2]*vectorCenter[2]
  if(dotprod >= 0)
   n = [-n[0], -n[1], -n[2]]

  var col = shading(n)
  for(i = 0; i < 4; i++){
    colors.push(1)
    colors.push(0)
    colors.push(0)
    colors.push(1)
  }

  var i = 0;
  //for(i = 0; i < 4; i++){
  //    normals.push(n[0])
  //    normals.push(n[1])
  //    normals.push(n[2])
  //}
  for(i = 0; i < normalArray.length; i++){
    normals.push(normalArray[i][0])
    normals.push(normalArray[i][1])
    normals.push(normalArray[i][2])
  }

  var vert = []
  vert.push(point1[0])
  vert.push(point1[1])
  vert.push(0)
  vert.push(coordinate[0][0])
  vert.push(coordinate[0][1])
  vert.push(coordinate[0][2])
  //drawLine(vert, gl)
  /*for(i = 0; i < 4; i++){
    colors.push(col[0])
    colors.push(col[1])
    colors.push(col[2])
    colors.push(col[3])
  }*/

  if (!initArrayBuffer(gl, 'a_Position', new Float32Array(vertices), 3)) return -1;
  if (!initArrayBuffer(gl, 'a_Color', new Float32Array(colors), 4)) return -1;
  if (!initArrayBuffer(gl, 'a_Normal', new Float32Array(normals), 3)) return -1;
  var indices = new Uint8Array([
    0,1,2,
    3,0,2
  ])

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
  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);
}

function shading(norm){
  var vlt = light
  var vlt = normalize(vlt)
  var dotprod = norm[0]*vlt[0] + norm[1]*vlt[1] + norm[2]*vlt[2]
  if(dotprod < 0)
    dotprod = 0
  var col = [0, 1*dotprod, 0, 1]
  return col
}

function rotatePoint(arr, deg, point){
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

function findNormal(a, b, c, gl){
  var v1 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]]
  var v2 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  var vert = [b, a, c, a]
  var n = getCross(v1, v2)
  n = normalize(n)
  return n
}

function getCross(v1, v2){
  if(v1.length != 3 || v2.length != 3)
    return
  var x = v1[1]*v2[2] - v1[2]*v2[1]
  var y = -(v1[0]*v2[2] - v2[0]*v1[2])
  var z = v1[0]*v2[1] - v2[0]*v1[1]
  var n = [x, y, z]
  return n
}

function normalize(v1){
  var dist = Math.sqrt(Math.pow(v1[0], 2) + Math.pow(v1[1], 2) + Math.pow(v1[2], 2))
  var n = [v1[0]/dist, v1[1]/dist, v1[2]/dist]
  return n
}

function toRadians (angle) {
  return angle * (Math.PI / 180);
}

function toDegrees (angle) {
  return angle * (180 / Math.PI)
}
