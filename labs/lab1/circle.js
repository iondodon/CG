"use strict";
var gl;
var radius = 0.5;
var angle = 20;
var num_triangles;

var vertices = [];
var colors = [];


function toRadians(angle){
    return angle * (Math.PI / 180);
}

function createVertices(){
    num_triangles = 360 / angle;
    var current_angle = angle;
    var lpetala = 0.5;
    var anglePetala = angle / 2;
    var r, g, b;

    for(var i = 0; i < num_triangles; i++){
        vertices.push(vec2(0, 0));
        vertices.push(vec2(radius*Math.cos(toRadians(current_angle)), radius*Math.sin(toRadians(current_angle))));
        vertices.push(vec2(radius*Math.cos(toRadians(current_angle+angle)), radius*Math.sin(toRadians(current_angle+angle))));

        vertices.push(vec2(radius*Math.cos(toRadians(current_angle)), radius*Math.sin(toRadians(current_angle))));
        vertices.push(vec2(radius*Math.cos(toRadians(current_angle+angle)), radius*Math.sin(toRadians(current_angle+angle))));
        vertices.push(
            vec2(
                (radius+lpetala)*Math.cos(toRadians(current_angle+angle-anglePetala)),
                (radius+lpetala)*Math.sin(toRadians(current_angle+angle-anglePetala))
            )
        );

        r = Math.floor(Math.random() * 2);
        g = Math.floor(Math.random() * 2);
        b = Math.floor(Math.random() * 2);

        colors.push(vec4(r, g, b, 1));
        colors.push(vec4(0, 1, 0, 0));
        colors.push(vec4(0, 0, 0, 0));

        colors.push(vec4(r, g, b, 0));
        colors.push(vec4(0, 1, 0, 0));
        colors.push(vec4(0, 0, 0, 1));

        current_angle += angle;
    }
}

window.onload = function init() {
    var canvas = document.getElementById('gl-canvas');

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        console.log('WebGL not supported, falling back on experimental-webgl');
        gl = canvas.getContext('experimental-webgl');
    }

    if (!gl) {
        alert('Your browser does not support WebGL');
    }

    //  Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    //  Load shaders and initialize attribute buffers
    var program = initShaders(gl, 'vertex-shader', 'fragment-shader');
    gl.useProgram(program);

    createVertices();

    // Load the data into the GPU
    var verticesId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, verticesId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var colorsId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorsId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    var render = function() {
        gl.clear( gl.COLOR_BUFFER_BIT );
        gl.drawArrays( gl.TRIANGLES, 0, vertices.length);
        window.requestAnimFrame(render);
    };

    render();
};
