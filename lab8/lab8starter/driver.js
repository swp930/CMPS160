
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
    v_shaders["triang"] = "";
    f_shaders["triang"] = "";

    // load shader files (calls 'setShader' when done loading)
    loadFile("shaders/cube_shader.vert", function(shader_src) {
        setShader(gl, canvas, "cube", gl.VERTEX_SHADER, shader_src);
    });

    loadFile("shaders/cube_shader.frag", function(shader_src) {
        setShader(gl, canvas, "cube", gl.FRAGMENT_SHADER, shader_src);
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
    scene.addGeometry(cube);

    var triang = new Geometry();
    //triang.vertices = [-1, -1, 0.0, 0.0, 1.0, 0.0, 1, -1, 0.0];
    //triang.indices = [0, 1, 2];
    //var uvs = [0.0, 0.0, 0.0, 0.5, 1.0, 0.0, 1.0, 0.0, 0.0];
    triang.vertices = [-1, -1, 0, -1, 1, 0, 1.5, 1, 0, 1.5, -1, 0]
    triang.indices = [0, 1, 2, 2, 0, 3]
    var uvs = [-0.3,1.7,0,  -0.3,-0.2,0, 1.7,1.7,0, 1.7,-0.2,0]
    //var uvs = [0,0,0, 0,1.0,0, 1.0,1.0,0, 1.0,0,0]
    var i = 0
    //for(i = 0; i < uvs.length; i++)
    //  uvs[i] /= 2
    //var uvs = [0.0, 0.0, 0.0, 0.5, 1.0, 0.0, 1.0, 0.0, 0.0];
    triang.addAttribute("a_uv", uvs);


    triang.setVertexShader(v_shaders["triang"]);
    triang.setFragmentShader(f_shaders["triang"]);
    scene.addGeometry(triang);

    // Create a Sphere
    var sphere = new SphereGeometry(1, 32, 8);
    sphere.v_shader = v_shaders["sphere"];
    sphere.f_shader = f_shaders["sphere"];
    sphere.setPosition(new Vector3([-3,0.0,0.0]));
    scene.addGeometry(sphere);

    scene.draw();

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
}
