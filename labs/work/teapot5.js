"use strict";

var numDivisions = 5;

var index = 0;

var points = [];
var normals = [];

var modelViewMatrix = [];
var projectionMatrix = [];
var normalMatrix, normalMatrixLoc;

var axis =0;

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var theta = [0, 0, 0];
var dTheta = 5.0;

var flag = true;

var program;
var canvas, render, gl;


onload = function init()  {

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );

    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);


    document.getElementById("ButtonX").onclick = function(){axis = xAxis;};
    document.getElementById("ButtonY").onclick = function(){axis = yAxis;};
    document.getElementById("ButtonZ").onclick = function(){axis = zAxis;};
    document.getElementById("ButtonT").onclick = function(){flag = !flag;};

    
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    var vert_32 = new  Float32Array(vert)
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, vert_32, gl.STATIC_DRAW );


    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    var norm_32 = new  Float32Array(norm)
    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, norm_32 , gl.STATIC_DRAW );

    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );

    projectionMatrix = ortho(-4, 4, -4, 4, -200, 200);
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"), false, flatten(projectionMatrix));

    var lightPosition = vec4(10.0, 10.0, 10.0, 0.0 );
    var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
    var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
    var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

    var materialAmbient = vec4( 1.0, 0.0, 1.0, 1.0 );
    var materialDiffuse = vec4( 1.0, 0.8, 0.0, 1.0 );
    var materialSpecular = vec4( 1.0, 0.8, 0.0, 1.0 );
    var materialShininess = 200.0;

    var ambientProduct = mult(lightAmbient, materialAmbient);
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);

    gl.uniform4fv( gl.getUniformLocation(program, "ambientProduct"),flatten(ambientProduct ));
    gl.uniform4fv( gl.getUniformLocation(program, "diffuseProduct"), flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "specularProduct"),flatten(specularProduct));
    gl.uniform4fv( gl.getUniformLocation(program, "lightPosition"), flatten(lightPosition ));
    gl.uniform1f( gl.getUniformLocation(program, "shininess"),materialShininess );
    gl.uniform1f( gl.getUniformLocation(program, "scalef"),scalef );

        normalMatrixLoc = gl.getUniformLocation( program, "normalMatrix" );


    render();
}

var render = function(){
            gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            if(flag) theta[axis] += 0.5;

            modelViewMatrix = mat4();

            
            modelViewMatrix = mult(modelViewMatrix, rotate(theta[xAxis], [1, 0, 0]));
            modelViewMatrix = mult(modelViewMatrix, rotate(theta[yAxis], [0, 1, 0]));
            modelViewMatrix = mult(modelViewMatrix, rotate(theta[zAxis], [0, 0, 1]));

            
  

            gl.uniformMatrix4fv( gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelViewMatrix) );

                normalMatrix = [
        vec3(modelViewMatrix[0][0], modelViewMatrix[0][1], modelViewMatrix[0][2]),
        vec3(modelViewMatrix[1][0], modelViewMatrix[1][1], modelViewMatrix[1][2]),
        vec3(modelViewMatrix[2][0], modelViewMatrix[2][1], modelViewMatrix[2][2])
    ];
        gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix) );


            gl.drawArrays( gl.TRIANGLES, 0, vert.length/3 );

            requestAnimFrame(render);
        }
