
v_shaders = {}
f_shaders = {}
var verticesTriangle = [-0.6, 0.7, 0,
                       -0.6, 1.6, 0,
                       -0.1, 1.6, 0,
                       -0.1, 0.7, 0,
                       -0.1, 0.7, 0,
                       -0.1, 1.6, 0,
                        0.4, 1.6, 0,
                        0.4, 0.7, 0]
var indicesTriangle = [0, 1, 2, 2, 0, 3,
                       4, 5, 6, 6, 4, 7]
var uvsTriangle = [0,1.0,0,
                   0,0,0,
                   1.0,0.0,0,
                   1.0,1.0,0,
                   0,1.0,0,
                   0,0,0,
                   1.0,0.0,0,
                   1.0,1.0,0]
var currSquare = []
var currLen = 0
// called when page is loaded
function main() {
    // retrieve <canvas> element
    var canvas = document.getElementById('webgl');

    // get the rendering context for WebGL
    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    v_shaders["cube"] = "";
    f_shaders["cube"] = "";
    v_shaders["sphere"] = "";
    f_shaders["sphere"] = "";
    v_shaders["triang"] = "";
    f_shaders["triang"] = "";

    // load shader files (calls 'setShader' when done loading)
    loadFile("shaders/cube_shader.vert", function(shader_src) {
        setShader(gl, canvas, "cube", gl.VERTEX_SHADER, shader_src);
    });

    loadFile("shaders/cube_shader.frag", function(shader_src) {
        setShader(gl, canvas, "cube", gl.FRAGMENT_SHADER, shader_src);
    });

    loadFile("shaders/cube2_shader.vert", function(shader_src) {
        setShader(gl, canvas, "cube2", gl.VERTEX_SHADER, shader_src);
    });

    loadFile("shaders/cube2_shader.frag", function(shader_src) {
        setShader(gl, canvas, "cube2", gl.FRAGMENT_SHADER, shader_src);
    });

    // load shader files (calls 'setShader' when done loading)
    loadFile("shaders/sphere_shader.vert", function(shader_src) {
        setShader(gl, canvas, "sphere", gl.VERTEX_SHADER, shader_src);
    });

    loadFile("shaders/sphere_shader.frag", function(shader_src) {
        setShader(gl, canvas, "sphere", gl.FRAGMENT_SHADER, shader_src);
    });

    // load shader files (calls 'setShader' when done loading)
    loadFile("shaders/triang_shader.vert", function(shader_src) {
        setShader(gl, canvas, "triang", gl.VERTEX_SHADER, shader_src);
    });

    loadFile("shaders/triang_shader.frag", function(shader_src) {
        setShader(gl, canvas, "triang", gl.FRAGMENT_SHADER, shader_src);
    });
}

// set appropriate shader and start if both are loaded
function setShader(gl, canvas, name, shader, shader_src) {
    if (shader == gl.VERTEX_SHADER)
       v_shaders[name] = shader_src;

    if (shader == gl.FRAGMENT_SHADER)
	   f_shaders[name] = shader_src;

    vShadersLoaded = 0;
    for (var shader in v_shaders) {
       if (v_shaders.hasOwnProperty(shader) && v_shaders[shader] != "") {
           vShadersLoaded += 1;
       }
    }

    fShadersLoaded = 0;
    for (var shader in f_shaders) {
        if (f_shaders.hasOwnProperty(shader) && f_shaders[shader] != "") {
            fShadersLoaded += 1;
        }
    }

    if(vShadersLoaded == Object.keys(v_shaders).length &&
       fShadersLoaded == Object.keys(f_shaders).length) {
        start(gl, canvas);
    }
}

function start(gl, canvas) {

    // Create camera
    var camera = new PerspectiveCamera(60, 1, 1, 100);
    //camera.move(1.4,0,0,1);
    //camera.move(3.0,1,0,0);
    //camera.rotate(10,0,1,0);

    camera.move(5.0,0,0,1);
    camera.move(0,1,0,0);
    camera.rotate(0,0,1,0);
    console.log(camera.position.elements);

    // Create scene
    var scene = new Scene(gl, camera);

    // Create a cube
    var cube = new CubeGeometry(12);
    cube.setVertexShader(v_shaders["cube"]);
    cube.setFragmentShader(f_shaders["cube"]);
    cube.setRotation(new Vector3([1,0,0]));
    cube.setPosition(new Vector3([0,0.0,0.0]));
    cube.setScale(new Vector3([0.75,0.75,0.75]));
    scene.addGeometry(cube);

    var triang = new Geometry();
    triang.vertices = verticesTriangle
    triang.indices = indicesTriangle
    var uvs = uvsTriangle
    var i = 0
    triang.addAttribute("a_uv", uvs);


    triang.setVertexShader(v_shaders["triang"]);
    triang.setFragmentShader(f_shaders["triang"]);
    scene.addGeometry(triang);

    // Create a Sphere
    var sphere = new SphereGeometry(0.5, 32, 8);
    sphere.v_shader = v_shaders["sphere"];
    sphere.f_shader = f_shaders["sphere"];
    sphere.setPosition(new Vector3([-1.2,0.0,0.0]));
    sphere.addUniform("u_EyePosition", "v3", camera.position.elements);
    //setUniform(type, location, data)
    scene.addGeometry(sphere);
    //var eyePositionShaderLocation = gl.getUniformLocation(gl.program, 'u_EyePosition');
    //scene.setUniform("v3", eyePositionShaderLocation, camera.position.elements);
    var cube2 = new CubeGeometry(0.5);
    cube2.setVertexShader(v_shaders["cube2"]);
    cube2.setFragmentShader(f_shaders["cube2"]);
    cube2.setPosition(new Vector3([0.5,0.0,0.0]));
    cube2.setScale(new Vector3([0.75,0.75,0.75]));
    cube2.setRotation(new Vector3([1,45,45]));
    scene.addGeometry(cube2);

    scene.draw();

    var tex4 = new Texture3D(gl, [
        'img/beach/negx.jpg',
        'img/beach/negx.jpg',
        'img/beach/negx.jpg',
        'img/beach/negx.jpg',
        'img/beach/negx.jpg',
        'img/beach/negx.jpg'
    ], function(tex) {
        cube2.addUniform("u_cubeTex", "t3", tex);
        scene.draw();
    });

    var tex3 = new Texture3D(gl, [
        'img/beach/negx.jpg',
        'img/beach/posx.jpg',
        'img/beach/negy.jpg',
        'img/beach/posy.jpg',
        'img/beach/negz.jpg',
        'img/beach/posz.jpg'
    ], function(tex) {
        sphere.addUniform("u_cubeTex", "t3", tex);
        scene.draw();
    });

    var tex2 = new Texture2D(gl, 'img/beach/posz.jpg', function(tex) {
        console.log(tex);
        triang.addUniform("u_tex", "t2", tex);
        scene.draw();
    });

    var tex = new Texture3D(gl, [
        'img/beach/negx.jpg',
        'img/beach/posx.jpg',
        'img/beach/negy.jpg',
        'img/beach/posy.jpg',
        'img/beach/negz.jpg',
        'img/beach/posz.jpg'
    ], function(tex) {
        cube.addUniform("u_cubeTex", "t3", tex);
        scene.draw();
    });

    /*var tex = new Texture3D(gl, [
        'img/beach/negx.jpg',
        'img/beach/negx.jpg',
        'img/beach/negx.jpg',
        'img/beach/negx.jpg',
        'img/beach/negx.jpg',
        'img/beach/negx.jpg'
    ], function(tex) {
        cube.addUniform("u_cubeTex", "t3", tex);
        scene.draw();
    });*/

    document.getElementById('shiftLeft').onclick = function(ev) { shiftLeft(camera, sphere, scene) }
    document.getElementById('shiftRight').onclick = function(ev) { shiftRight(camera, sphere, scene) }
    document.getElementById('moveUp').onclick = function(ev) { moveUp(camera, sphere, scene) }
    document.getElementById('moveDown').onclick = function(ev) { moveDown(camera, sphere, scene) }
    document.getElementById('moveForward').onclick = function(ev) { moveForward(camera, sphere, scene) }
    document.getElementById('moveBackward').onclick = function(ev) { moveBackward(camera, sphere, scene) }
    document.getElementById('rotateLeft').onclick = function(ev) { rotateLeft(camera, sphere, scene) }
    document.getElementById('rotateRight').onclick = function(ev) { rotateRight(camera, sphere, scene) }
    document.getElementById('loadTexture').onclick = function(ev) { loadTexture(gl, cube2, scene) }
    document.getElementById('increasePlaneSize').onclick = function(ev) { increasePlaneSize(triang, scene) }
    document.getElementById('decreasePlaneSize').onclick = function(ev) { decreasePlaneSize(triang, scene) }
}

function shiftLeft(camera, sphere, scene){
  camera.move(-0.5,1,0,0);
  sphere.addUniform("u_EyePosition", "v3", camera.position.elements);
  scene.draw();
}

function shiftRight(camera, sphere, scene){
  camera.move(0.5,1,0,0);
  sphere.addUniform("u_EyePosition", "v3", camera.position.elements);
  scene.draw();
}

function moveUp(camera, sphere, scene){
  camera.move(0.5,0,1,0);
  sphere.addUniform("u_EyePosition", "v3", camera.position.elements);
  scene.draw();
}

function moveDown(camera, sphere, scene){
  camera.move(-0.5,0,1,0);
  sphere.addUniform("u_EyePosition", "v3", camera.position.elements);
  scene.draw();
}

function moveForward(camera, sphere, scene){
  camera.move(-0.5,0,0,1);
  sphere.addUniform("u_EyePosition", "v3", camera.position.elements);
  scene.draw();
}

function moveBackward(camera, sphere, scene){
  camera.move(0.5,0,0,1);
  sphere.addUniform("u_EyePosition", "v3", camera.position.elements);
  scene.draw();
}

function rotateLeft(camera, sphere, scene){
  camera.rotate(30, 0,1,0)
  sphere.addUniform("u_EyePosition", "v3", camera.position.elements);
  scene.draw();
}

function rotateRight(camera, sphere, scene){
  camera.rotate(-30, 0,1,0)
  sphere.addUniform("u_EyePosition", "v3", camera.position.elements);
  scene.draw();
}

function loadTexture(gl, cube2, scene){
  var tex4 = new Texture3D(gl, [
      'img/flowers/blueflower.jpg',
      'img/flowers/7herbs.jpg',
      'img/flowers/blueflower2.jpg',
      'img/flowers/lightblueflower.jpg',
      'img/flowers/pinkflower.jpg',
      'img/flowers/redflower.jpg'
  ], function(tex) {
      cube2.addUniform("u_cubeTex", "t3", tex);
      scene.draw();
  });
}

function increasePlaneSize(triang, scene){
  currLen += 0.1
  var n = verticesTriangle.length/3
  if(currLen <= 0.5){
    currSquare = []
    var x = -0.6
    if(verticesTriangle.length > 0)
    x = verticesTriangle[verticesTriangle.length - 3]
    currSquare.push(x)
    currSquare.push(0.7)
    currSquare.push(0)

    currSquare.push(x)
    currSquare.push(1.6)
    currSquare.push(0)

    currSquare.push(x+currLen)
    currSquare.push(1.6)
    currSquare.push(0)

    currSquare.push(x+currLen)
    currSquare.push(0.7)
    currSquare.push(0)
    var vertices = []
    var i = 0
    for(i = 0; i < verticesTriangle.length; i++)
      vertices.push(verticesTriangle[i])
    for(i = 0; i < currSquare.length; i++)
      vertices.push(currSquare[i])
    var indices = []
    for(i = 0; i < indicesTriangle.length; i++)
      indices.push(indicesTriangle[i])
    indices.push(n)
    indices.push(n+1)
    indices.push(n+2)
    indices.push(n+2)
    indices.push(n)
    indices.push(n+3)
    var uvs = []
    for(i = 0; i < uvsTriangle.length; i++)
      uvs.push(uvsTriangle[i])
    var constLength = uvsTriangle.length
    uvs.push(0)
    uvs.push(1)
    uvs.push(0)

    uvs.push(0)
    uvs.push(0)
    uvs.push(0)

    uvs.push(currLen*2)
    uvs.push(0)
    uvs.push(0)

    uvs.push(currLen*2)
    uvs.push(1)
    uvs.push(0)

    //var triang = new Geometry();
    triang.vertices = vertices
    triang.indices = indices
    //var uvs = uvs
    var i = 0
    triang.addAttribute("a_uv", uvs);


    triang.setVertexShader(v_shaders["triang"]);
    triang.setFragmentShader(f_shaders["triang"]);
    scene.draw();
    if(currLen == 0.5){
      var i = 0
      for(i = 0; i < currSquare.length; i++)
        verticesTriangle.push(currSquare[i])
      indicesTriangle.push(n)
      indicesTriangle.push(n+1)
      indicesTriangle.push(n+2)
      indicesTriangle.push(n+2)
      indicesTriangle.push(n)
      indicesTriangle.push(n+3)

      uvsTriangle.push(0)
      uvsTriangle.push(1)
      uvsTriangle.push(0)

      uvsTriangle.push(0)
      uvsTriangle.push(0)
      uvsTriangle.push(0)

      uvsTriangle.push(1)
      uvsTriangle.push(0)
      uvsTriangle.push(0)

      uvsTriangle.push(1)
      uvsTriangle.push(1)
      uvsTriangle.push(0)
      currLen = 0
      currSquare = []
    }
  }
}

function decreasePlaneSize(triang, scene){
  if(currLen <= 0.1 && verticesTriangle.length == 0)
    return
  var n = verticesTriangle.length/3
  currLen -= 0.1
  if(currLen < 0){
    verticesTriangle.splice(verticesTriangle.length - 12)
    indicesTriangle.splice(indicesTriangle.length - 6)
    uvsTriangle.splice(uvsTriangle.length - 12)
    n = verticesTriangle.length/3
    currLen = 0.4
  }
  if(currLen >= 0){
    currSquare = []
    var x = -0.6
    if(verticesTriangle.length > 0)
    var x = verticesTriangle[verticesTriangle.length - 3]
    currSquare.push(x)
    currSquare.push(0.7)
    currSquare.push(0)

    currSquare.push(x)
    currSquare.push(1.6)
    currSquare.push(0)

    currSquare.push(x+currLen)
    currSquare.push(1.6)
    currSquare.push(0)

    currSquare.push(x+currLen)
    currSquare.push(0.7)
    currSquare.push(0)
    var vertices = []
    var i = 0
    for(i = 0; i < verticesTriangle.length; i++)
      vertices.push(verticesTriangle[i])
    for(i = 0; i < currSquare.length; i++)
      vertices.push(currSquare[i])
    var indices = []
    for(i = 0; i < indicesTriangle.length; i++)
      indices.push(indicesTriangle[i])
    indices.push(n)
    indices.push(n+1)
    indices.push(n+2)
    indices.push(n+2)
    indices.push(n)
    indices.push(n+3)
    var uvs = []
    for(i = 0; i < uvsTriangle.length; i++)
      uvs.push(uvsTriangle[i])
    var constLength = uvsTriangle.length
    uvs.push(0)
    uvs.push(1)
    uvs.push(0)

    uvs.push(0)
    uvs.push(0)
    uvs.push(0)

    uvs.push(currLen*2)
    uvs.push(0)
    uvs.push(0)

    uvs.push(currLen*2)
    uvs.push(1)
    uvs.push(0)

    //var triang = new Geometry();
    triang.vertices = vertices
    triang.indices = indices
    //var uvs = uvs
    var i = 0
    triang.addAttribute("a_uv", uvs);


    triang.setVertexShader(v_shaders["triang"]);
    triang.setFragmentShader(f_shaders["triang"]);
    scene.draw();
  }
}
