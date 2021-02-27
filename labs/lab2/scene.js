function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function inputRangeOnInput(){
    objects[addedObjectsMenu.selectedIndex].updateMatrices(+TLRir.value, +TUDir.value, +TFBir.value,
                                                           +SXir.value, +SYir.value, +SZir.value,
                                                           +RXir.value, +RYir.value, +RZir.value);
}

function addedObjectsMenuOnChange(){
    TLRir.value = (objects[addedObjectsMenu.selectedIndex].TLR).toString();
    TUDir.value = (objects[addedObjectsMenu.selectedIndex].TUD).toString();
    TFBir.value = (objects[addedObjectsMenu.selectedIndex].TFB).toString();

    SXir.value = (objects[addedObjectsMenu.selectedIndex].SX).toString();
    SYir.value = (objects[addedObjectsMenu.selectedIndex].SY).toString();
    SZir.value = (objects[addedObjectsMenu.selectedIndex].SZ).toString();

    RXir.value = (objects[addedObjectsMenu.selectedIndex].RX).toString();
    RYir.value = (objects[addedObjectsMenu.selectedIndex].RY).toString();
    RZir.value = (objects[addedObjectsMenu.selectedIndex].RZ).toString();
}

function changeColor(){
    let r = hexToRgb(colorInput.value).r / 255;
    let g = hexToRgb(colorInput.value).g / 255;
    let b = hexToRgb(colorInput.value).b / 255;
    
    if(addedObjectsMenu.selectedIndex > -1){
        objects[addedObjectsMenu.selectedIndex].changeColor(vec4(r, g, b, 1));
    }
}

function addObj(){
    let r = hexToRgb(colorInput.value).r / 255;
    let g = hexToRgb(colorInput.value).g / 255;
    let b = hexToRgb(colorInput.value).b / 255;

    switch(objMenu.options[objMenu.selectedIndex].value){
        case 'sphere':
            objects.push(new Sphere(vertices.length, 1.0, 10, vec4(r, g, b, 1)));
            break;

        case 'cone':
            objects.push(new Cone(vertices.length, 0.5, 1, 10, vec4(r, g, b, 1)));
            break;

        case 'pyramid':
            objects.push(new Pyramid(vertices.length, 1, 1, 1, vec4(r, g, b, 1)));
            break;
    }
    
    var option = document.createElement("option");
    option.text = objMenu.options[objMenu.selectedIndex].value;
    addedObjectsMenu.add(option, addedObjectsMenu[numObj]);

    addedObjectsMenu.selectedIndex = numObj;
    addedObjectsMenuOnChange();

    numObj++;
}

function deleteObj(){
    if(numObj < 0) return;
    for(let i = addedObjectsMenu.selectedIndex + 1; i < objects.length; i++){
        objects[i].startId -= objects[addedObjectsMenu.selectedIndex].count;
    }
    vertices.splice(objects[addedObjectsMenu.selectedIndex].startId, objects[addedObjectsMenu.selectedIndex].count);
    colors.splice(objects[addedObjectsMenu.selectedIndex].startId, objects[addedObjectsMenu.selectedIndex].count);
    objects.splice(addedObjectsMenu.selectedIndex, 1);
    addedObjectsMenu.remove(addedObjectsMenu.selectedIndex);
    
    GfObject.setBuffers();

    numObj--;
}

window.onload = function init(){
    canvas = document.getElementById("canvas_id");
    gl = WebGLUtils.setupWebGL(canvas);
    if(!gl){
        console.log('WebGL not supported, falling back on experimental-webgl');
        gl = canvas.getContext('webgl');
    }
    if(!gl){
        alert('Your browser does not support WebGL');
    }
    
    //  Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
	gl.frontFace(gl.CCW);
	gl.cullFace(gl.BACK);

    program = initShaders(gl, 'vertex-shader', 'fragment-shader');
    gl.useProgram(program);

    RLoc = gl.getUniformLocation(program, "R");
    SLoc = gl.getUniformLocation(program, "S");
    TLoc = gl.getUniformLocation(program, "T");

    TLRir = document.getElementById("TLR");
    TUDir = document.getElementById("TUD");
    TFBir = document.getElementById("TFB");

    SXir = document.getElementById("SX");
    SYir = document.getElementById("SY");
    SZir = document.getElementById("SZ");

    RXir = document.getElementById("RX");
    RYir = document.getElementById("RY");
    RZir = document.getElementById("RZ");

    objMenu = document.getElementById("objMenu");
    addedObjectsMenu = document.getElementById("addedObjectsMenu");
    visibleChkB = document.getElementById("visibleChkB");
    colorInput = document.getElementById("colorInput");

    render();
}

function render(){
    gl.clear(gl.COLOR_BUFFER_BIT);

    for(let i = 0; i < objects.length; i++){
        objects[i].draw();
    }

    window.requestAnimFrame(render);
}