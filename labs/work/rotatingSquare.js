"use strict";
var gl;

var vertices = [
    vec4(-0.5, -0.5, 0.0, 1.0),
    vec4(-0.5,  0.5, 0.0, 1.0),
    vec4( 0.5, -0.5, 0.0, 1.0),

    vec4(-0.5,  0.5, 0.0, 1.0),
    vec4( 0.5, -0.5, 0.0, 1.0),
    vec4( 0.5,  0.5, 0.0, 1.0),

    vec4(-0.2, -0.2, 0.0, 1.0),
    vec4(-0.2,  0.2, 0.0, 1.0),
    vec4( 0.2, -0.2, 0.0, 1.0),

    vec4(-0.2,  0.2, 0.0, 1.0),
    vec4( 0.2, -0.2, 0.0, 1.0),
    vec4( 0.2,  0.2, 0.0, 1.0)
];

var colors = [
    vec4(1.0, 0.0, 0.0, 1.0),
    vec4(1.0, 0.0, 0.0, 1.0),
    vec4(1.0, 0.0, 0.0, 1.0),

    vec4(1.0, 0.0, 0.0, 1.0),
    vec4(1.0, 0.0, 0.0, 1.0),
    vec4(1.0, 0.0, 0.0, 1.0),

    vec4(0.0, 1.0, 0.0, 1.0),
    vec4(0.0, 1.0, 0.0, 1.0),
    vec4(0.0, 1.0, 0.0, 1.0),

    vec4(0.0, 1.0, 0.0, 1.0),
    vec4(0.0, 1.0, 0.0, 1.0),
    vec4(0.0, 1.0, 0.0, 1.0)
];

window.onload = function init() {
    var canvas = document.getElementById('gl-canvas');

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        console.log('WebGL not supported, falling back on experimental-webgl');
        gl = canvas.getContext('webgl');
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

    // Load the data into the GPU
    var verticesId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, verticesId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var colorsId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorsId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    var inputRange = document.getElementById('inputRange');

    var RLoc = gl.getUniformLocation(program, "R");
    var SLoc = gl.getUniformLocation(program, "S");
    var TLoc = gl.getUniformLocation(program, "T");

    var R, S, T;
    
    var squareTheta = 0.1;
    var squareSpeed = 0.0;
    var render = function(){
        squareSpeed = +inputRange.value;
        squareTheta += squareSpeed;

        gl.clear(gl.COLOR_BUFFER_BIT);

        R = rotateX(squareTheta);
        S = scalem(1.0, 1.0, 1.0);
        T = translate(0.0, 0.0, 0.0);
        gl.uniformMatrix4fv(RLoc, false, flatten(R));
        gl.uniformMatrix4fv(SLoc, false, flatten(S));
        gl.uniformMatrix4fv(TLoc, false, flatten(T));
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        R = rotateY(squareTheta);
        S = scalem(2.0, 2.0, 1.0);
        T = translate(0.5, 0.0, 0.0);
        gl.uniformMatrix4fv(RLoc, false, flatten(R));
        gl.uniformMatrix4fv(SLoc, false, flatten(S));
        gl.uniformMatrix4fv(TLoc, false, flatten(T));
        gl.drawArrays(gl.TRIANGLES, 6, 6);
        
        window.requestAnimFrame(render);
    };

    render();
};