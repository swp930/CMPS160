
v_shaders = {}
f_shaders = {}

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
    v_shaders["first2d"] = "";
    f_shaders["first2d"] = "";
	v_shaders["second2d"] = "";
    f_shaders["second2d"] = "";

    // load shader files (calls 'setShader' when done loading)
    loadFile("shaders/cube_shader.vert", function(shader_src) {
        setShader(gl, canvas, "cube", gl.VERTEX_SHADER, shader_src);
    });

    loadFile("shaders/cube_shader.frag", function(shader_src) {
        setShader(gl, canvas, "cube", gl.FRAGMENT_SHADER, shader_src);
    });

    loadFile("shaders/skycube_shader.vert", function(shader_src) {
        setShader(gl, canvas, "skycube", gl.VERTEX_SHADER, shader_src);
    });

    loadFile("shaders/skycube_shader.frag", function(shader_src) {
        setShader(gl, canvas, "skycube", gl.FRAGMENT_SHADER, shader_src);
    });

    // load shader files (calls 'setShader' when done loading)
    loadFile("shaders/sphere_shader.vert", function(shader_src) {
        setShader(gl, canvas, "sphere", gl.VERTEX_SHADER, shader_src);
    });

    loadFile("shaders/sphere_shader.frag", function(shader_src) {
        setShader(gl, canvas, "sphere", gl.FRAGMENT_SHADER, shader_src);
    });

    // load shader files (calls 'setShader' when done loading)
    loadFile("shaders/first2d_shader.vert", function(shader_src) {
        setShader(gl, canvas, "first2d", gl.VERTEX_SHADER, shader_src);
    });

    loadFile("shaders/first2d_shader.frag", function(shader_src) {
        setShader(gl, canvas, "first2d", gl.FRAGMENT_SHADER, shader_src);
    });

	loadFile("shaders/second2d_shader.vert", function(shader_src) {
        setShader(gl, canvas, "second2d", gl.VERTEX_SHADER, shader_src);
    });

    loadFile("shaders/second2d_shader.frag", function(shader_src) {
        setShader(gl, canvas, "second2d", gl.FRAGMENT_SHADER, shader_src);
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
    camera.move(10,0,0,1);
    camera.move(2,1,0,0);
    camera.rotate(10,0,1,0);

    // Create scene
    var scene = new Scene(gl, camera);

    // Create a cube
    var cube = new CubeGeometry(1);
    cube.setVertexShader(v_shaders["cube"]);
    cube.setFragmentShader(f_shaders["cube"]);
    cube.setRotation(new Vector3([1,45,45]));
    cube.setPosition(new Vector3([3,0.0,0.0]));
    cube.setScale(new Vector3([0.75,0.75,0.75]));
	  var baseColor = (new Vector4([0.0, 0.0, 0.3]));
	  //cube.addAttribute("a_Color", baseColor);
    scene.addGeometry(cube);

	  var skyCube = new CubeGeometry(1);
    skyCube.setVertexShader(v_shaders["skycube"]);
    skyCube.setFragmentShader(f_shaders["skycube"]);
    skyCube.setRotation(new Vector3([0,0,0]));
    skyCube.setPosition(new Vector3([0.0,0.0,0.0]));
    skyCube.setScale(new Vector3([10,10,10]));
    scene.addGeometry(skyCube);

    var first2d = new Geometry();
    first2d.vertices = [-1, -1, 0.0,	 0.0, -1, 0.0,	 0.0, 1.0, 0.0];
    first2d.indices = [0, 1, 2];
    var uvs = [0.0, 0.0, 0.0,	 0.0, 1.0, 0.0,	 	1.0, 1.0, 0.0];
    first2d.addAttribute("a_uv", uvs);

    first2d.setVertexShader(v_shaders["first2d"]);
    first2d.setFragmentShader(f_shaders["first2d"]);
    scene.addGeometry(first2d);


	var second2d = new Geometry();
    second2d.vertices = [0.0, -1.0, 0.0,	 	1.0, -1.0, 0.0,		 0.0, 1.0, 0.0];
    second2d.indices = [0, 1, 2];
    var uvs = [0.0, 0.0, 0.0,	 0.0, 1.0, 0.0,	 1.0, 0.0, 0.0];
    second2d.addAttribute("a_uv", uvs);

    second2d.setVertexShader(v_shaders["second2d"]);
    second2d.setFragmentShader(f_shaders["second2d"]);
    scene.addGeometry(second2d);

    // Create a Sphere
    var sphere = new SphereGeometry(1, 32, 8);
    sphere.v_shader = v_shaders["sphere"];
    sphere.f_shader = f_shaders["sphere"];
    sphere.setPosition(new Vector3([-3,0.0,0.0]));
    sphere.addUniform("u_CameraPosition", "v3", camera.position.elements);
    scene.addGeometry(sphere);

    scene.draw();

    var tex2 = new Texture2D(gl, 'img/beach/posz.jpg', function(tex) {
        console.log(tex);
        first2d.addUniform("u_tex", "t2", tex);
        scene.draw();
    });

	var tex3 = new Texture2D(gl, 'img/beach/posz.jpg', function(tex) {
        console.log(tex);
        second2d.addUniform("u_tex", "t2", tex);
        scene.draw();
    });

    var tex = new Texture3D(gl, [
        'img/beach/posz.jpg',
        'img/beach/posz.jpg',
        'img/beach/posz.jpg',
        'img/beach/posz.jpg',
        'img/beach/posz.jpg',
        'img/beach/posz.jpg'
    ], function(tex) {
        cube.addUniform("u_cubeTex", "t3", tex);
        scene.draw();
    });

	var texSky = new Texture3D(gl, [
        'img/beach/negx.jpg',
        'img/beach/posx.jpg',
        'img/beach/negy.jpg',
        'img/beach/posy.jpg',
        'img/beach/negz.jpg',
        'img/beach/posz.jpg'
    ], function(tex) {
        skyCube.addUniform("u_cubeTex", "t3", tex);
        sphere.addUniform("u_cubeTex", "t3", tex);
        scene.draw();
    });

	document.getElementById('camRotateRight').onclick = function(ev){ camRotateRight(camera, scene, sphere); };
	document.getElementById('camRotateLeft').onclick = function(ev){ camRotateLeft(camera, scene, sphere); };
  document.getElementById('camLeft').onclick = function(ev){ camLeft(camera, scene, sphere); };
  document.getElementById('camRight').onclick = function(ev){ camRight(camera, scene, sphere); };
  document.getElementById('camForward').onclick = function(ev){ camForward(camera, scene, sphere) }
  document.getElementById('newTextures').onclick = function(ev){ newTextures(gl, skyCube, sphere, scene) }
}

function newTextures(gl, skyCube, sphere, scene){
  var texSky = new Texture3D(gl, [
        'tex2/black.png',
        'tex2/blue.png',
        'tex2/green.png',
        'tex2/pink.png',
        'tex2/red.png',
        'tex2/white.png'
    ], function(tex) {
        skyCube.addUniform("u_cubeTex", "t3", tex);
        sphere.addUniform("u_cubeTex", "t3", tex);
        scene.draw();
    });
}

function camForward(camera, scene, sphere){
  camera.move(-0.3,0,0,1)
  camera.update()
  sphere.addUniform("u_CameraPosition", "v3", camera.position.elements);
  scene.draw()
}

function camBackward(camera, scene, sphere){
  camera.move(0.3,0,0,1)
  camera.update()
  sphere.addUniform("u_CameraPosition", "v3", camera.position.elements);
  scene.draw()
}

function camRight(camera, scene, sphere){
  camera.move(0.3,1,0,0);
  camera.update()
  sphere.addUniform("u_CameraPosition", "v3", camera.position.elements);
  scene.draw()
}

function camLeft(camera, scene, sphere){
  camera.move(-0.3,1,0,0);
  camera.update()
  sphere.addUniform("u_CameraPosition", "v3", camera.position.elements);
  scene.draw()
}

function camRotateRight(camera, scene, sphere){
	camera.rotate(30, 0, 1, 0);
	camera.update();
  sphere.addUniform("u_CameraPosition", "v3", camera.position.elements);
	scene.draw();
}

function camRotateLeft(camera, scene){
	camera.rotate(-30, 0, 1, 0);
  camera.update();
  sphere.addUniform("u_CameraPosition", "v3", camera.position.elements);
  scene.draw();
}
