"use strict";
var gl;
var vertices = [];
var colors = [];

var radius;
var phi, theta;

function X(theta, phi){
    return radius * Math.sin(radians(theta)) * Math.cos(radians(phi));
}

function Y(theta, phi){
    return radius * Math.sin(radians(theta)) * Math.sin(radians(phi));
}

function Z(theta){
    return radius * Math.cos(radians(theta));
}

function createSphereVertices(){
    phi = 10;
    theta = 10;
    radius = 0.75;
    var delta = 10;

    for(theta = 0; theta < 180; theta += delta){
        for (phi = 0; phi < 360; phi += delta){
            vertices.push(vec3( X(theta, phi), Y(theta, phi), Z(theta) ));
            colors.push(vec4(1, 0, 0, 1));

            vertices.push(vec3( X(theta+delta, phi), Y(theta+delta, phi), Z(theta+delta) ));
            colors.push(vec4(1, 0, 0, 1));
            
            vertices.push(vec3( X(theta, phi+delta), Y(theta, phi+delta), Z(theta) ));
            colors.push(vec4(1, 0, 0, 1));


            vertices.push(vec3( X(theta+delta, phi), Y(theta+delta, phi), Z(theta+delta) ));
            colors.push(vec4(0, 1, 1, 1));

            vertices.push(vec3( X(theta, phi+delta), Y(theta, phi+delta), Z(theta) ));
            colors.push(vec4(0, 1, 1, 1));

            vertices.push(vec3( X(theta+delta, phi+delta), Y(theta+delta, phi+delta), Z(theta+delta) ));
            colors.push(vec4(0, 1, 1, 1));
        }
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
    gl.enable(gl.DEPTH_TEST);


    //  Load shaders and initialize attribute buffers
    var program = initShaders(gl, 'vertex-shader', 'fragment-shader');
    gl.useProgram(program);

    createSphereVertices();

    // Load the data into the GPU
    var verticesId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, verticesId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var colorsId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorsId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
    var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
    var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

    var worldMatrix = new Float32Array(4*4);
    var viewMatrix = new Float32Array(4*4);
    var projMatrix = new Float32Array(4*4);

    identity4(worldMatrix);
    
    // identity4(viewMatrix);
    lookAt(viewMatrix, /*eye*/[0, 0, -2], /*center*/[0, 0, 0], /*up*/[0, 1, 0]);

    // identity4(projMatrix);
    perspective(projMatrix, radians(45), canvas.width/canvas.height, 0.1, 1000.0);

    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
    gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

    var identityMatrix = new Float32Array(16);
    identity4(identityMatrix);
    var rotationAngle;
    var renderLoop = function() {
        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
        gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
        gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

        rotationAngle = performance.now() / 1000 / 6 * 2 * Math.PI;
        rotateFromGLMatrix(worldMatrix, identityMatrix, rotationAngle, [0, 1, 0]);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
        gl.drawArrays( gl.TRIANGLES, 0, vertices.length);

        window.requestAnimFrame(renderLoop);
    };

    renderLoop();
};