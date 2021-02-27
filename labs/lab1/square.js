"use strict";

var gl;
var points;

var NumPoints = 5000;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the corners of our gasket with three points.

    var vertices = [
        vec2(  0,  0   ),
        vec2(  0,  0.5 ),
        vec2( -1,  0 ),

        vec2(  0,  0   ),
        vec2(  0,  0.5 ),
        vec2(  1,  0 )
    ];

    var colors = [
        vec4(1.0, 0, 0, 1),
        vec4(0, 1.0, 0, 1),
        vec4(0, 0, 1.0, 1),

        vec4(0, 0, 1.0, 1),
        vec4(1.0, 0, 0, 1),
        vec4(0, 1.0, 0, 1)
    ];


    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU

    //triangle1
    var verticesId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, verticesId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW   );
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    var colorsId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, colorsId);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW   );
    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    render();
};


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, 6 );
}
