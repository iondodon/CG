class Scene {
    static setGrlobalVariables(){
        canvas = document.getElementById("canvas_id");
        gl = WebGLUtils.setupWebGL(canvas);

        if(!gl){
            console.log('WebGL not supported, falling back on experimental-webgl');
            gl = canvas.getContext('webgl');
        }
        
        if(!gl){
            alert('Your browser does not support WebGL');
        }
        
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

        RWXir = document.getElementById('RWX');
        RWYir = document.getElementById('RWY');
        RWZir = document.getElementById('RWZ');

        SEyeXir = document.getElementById('SEyeX');
        SEyeYir = document.getElementById('SEyeY');
        SEyeZir = document.getElementById('SEyeZ');
        
        SCenXir = document.getElementById('SCenX');
        SCenYir = document.getElementById('SCenY');
        SCenZir = document.getElementById('SCenZ');

        SLightXir = document.getElementById('SLightX');
        SLightYir = document.getElementById('SLightY');
        SLightZir = document.getElementById('SLightZ');

        objMenu = document.getElementById("objMenu");
        addedObjectsMenu = document.getElementById("addedObjectsMenu");
        addedLightsMenu = document.getElementById("addedLightsMenu");
        projMenu = document.getElementById("projMenu");
        visibleChkB = document.getElementById("visibleChkB");
        colorInput = document.getElementById("colorInput");
        lightColorInput = document.getElementById("lightColorInput");

        nLightsLoc = gl.getUniformLocation(program, "nLights");
        ///// first required light
        lights.push(new Light(-5.0, -5.0, -5.0, 0.0));
        var option = document.createElement("option");
        option.text = "light";
        addedLightsMenu.add(option, addedLightsMenu[nLights]);
        addedLightsMenu.selectedIndex = nLights;
        Scene.addedLightsMenuOnChange();
        nLights++;
        gl.uniform1i(nLightsLoc, nLights);
        /////////////////////////////////////////////////////

        matViewUniformLocation = gl.getUniformLocation(program, 'mView');
        matProjUniformLocation = gl.getUniformLocation(program, 'mProj');
        matNormUniformLocation = gl.getUniformLocation(program, 'mNormal');

        viewMatrix = new Float32Array(4*4);
        projMatrix = new Float32Array(4*4);
        normMatrix = new Float32Array(3*3);
    
        identity4(viewMatrix);
        lookAt(viewMatrix, /*eye*/[0, 0, -1], /*center*/[0, 0, 0], /*up*/[0, 1, 0]);

        Scene.setProjectionType();

        normMatrix = [
            vec3(viewMatrix[0][0], viewMatrix[0][1], viewMatrix[0][2]),
            vec3(viewMatrix[1][0], viewMatrix[1][1], viewMatrix[1][2]),
            vec3(viewMatrix[2][0], viewMatrix[2][1], viewMatrix[2][2])
        ];
        gl.uniformMatrix3fv(matNormUniformLocation, false, flatten(normMatrix) );
        

        gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
        gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);
    }

    static hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    
    static inputRangeOnInput(){
        objects[addedObjectsMenu.selectedIndex].updateMatrices(+TLRir.value, +TUDir.value, +TFBir.value,
                                                               +SXir.value, +SYir.value, +SZir.value,
                                                               +RXir.value, +RYir.value, +RZir.value);
    }

    static lightInputRangeOnChange(){
        lights[addedLightsMenu.selectedIndex].updateLightXYZ(+SLightXir.value, +SLightYir.value, +SLightZir.value);
    }

    static addedObjectsMenuOnChange(){
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

    static addedLightsMenuOnChange(){
        SLightXir.value = (lights[addedLightsMenu.selectedIndex].X).toString();
        SLightYir.value = (lights[addedLightsMenu.selectedIndex].Z).toString();
        SLightZir.value = (lights[addedLightsMenu.selectedIndex].Y).toString();
    }

    static changeColor(){
        let r = Scene.hexToRgb(colorInput.value).r / 255;
        let g = Scene.hexToRgb(colorInput.value).g / 255;
        let b = Scene.hexToRgb(colorInput.value).b / 255;
        
        if(addedObjectsMenu.selectedIndex > -1){
            objects[addedObjectsMenu.selectedIndex].changeColor(vec4(r, g, b, 1));
        }
    }

    static changeLightColor(){
        let r = Scene.hexToRgb(lightColorInput.value).r / 255;
        let g = Scene.hexToRgb(lightColorInput.value).g / 255;
        let b = Scene.hexToRgb(lightColorInput.value).b / 255;

        if(addedLightsMenu.selectedIndex > -1){
            lights[addedLightsMenu.selectedIndex].changeColor(vec4(r, g, b, 1.0));
        }
    }

    static addObj(){
        let r = Scene.hexToRgb(colorInput.value).r / 255;
        let g = Scene.hexToRgb(colorInput.value).g / 255;
        let b = Scene.hexToRgb(colorInput.value).b / 255;
    
        switch(objMenu.options[objMenu.selectedIndex].value){
            case 'sphere':
                objects.push(new Sphere(vertices.length, 1.0, 1, vec4(r, g, b, 1), 1000.0, "sphere"));
                var option = document.createElement("option");
                option.text = objMenu.options[objMenu.selectedIndex].value;
                addedObjectsMenu.add(option, addedObjectsMenu[numObj]);
                addedObjectsMenu.selectedIndex = numObj;
                Scene.addedObjectsMenuOnChange();
                numObj++;
                break;

            case 'cone':
                objects.push(new Cone(vertices.length, 0.5, 1, 1, vec4(r, g, b, 1), 10.0, "cone"));
                var option = document.createElement("option");
                option.text = objMenu.options[objMenu.selectedIndex].value;
                addedObjectsMenu.add(option, addedObjectsMenu[numObj]);
                addedObjectsMenu.selectedIndex = numObj;
                Scene.addedObjectsMenuOnChange();
                numObj++;
                break;
    
            case 'pyramid':
                objects.push(new Pyramid(vertices.length, 1, 1, 1, vec4(r, g, b, 1), 20.0, "pyramid"));
                var option = document.createElement("option");
                option.text = objMenu.options[objMenu.selectedIndex].value;
                addedObjectsMenu.add(option, addedObjectsMenu[numObj]);
                addedObjectsMenu.selectedIndex = numObj;
                Scene.addedObjectsMenuOnChange();
                numObj++;
                break;

            case 'room':
                objects.push(new Room(vertices.length, vec4(r, g, b, 1), 20.0, "room"));
                var option = document.createElement("option");
                option.text = objMenu.options[objMenu.selectedIndex].value;
                addedObjectsMenu.add(option, addedObjectsMenu[numObj]);
                addedObjectsMenu.selectedIndex = numObj;
                Scene.addedObjectsMenuOnChange();
                numObj++;
                break;
                
            case 'light':
                if(nLights + 1 > 9) break;
                lights.push(new Light(-5.0, -5.0, -5.0, 0.0));
                var option = document.createElement("option");
                option.text = objMenu.options[objMenu.selectedIndex].value;
                addedLightsMenu.add(option, addedLightsMenu[nLights]);
                addedLightsMenu.selectedIndex = nLights;
                Scene.addedLightsMenuOnChange();
                nLights++;
                gl.uniform1i(nLightsLoc, nLights);
                break;
        }
    }

    static deleteObj(){
        if(numObj < 0) return;
        for(let i = addedObjectsMenu.selectedIndex + 1; i < objects.length; i++){
            objects[i].startId -= objects[addedObjectsMenu.selectedIndex].count;
        }
        vertices.splice(objects[addedObjectsMenu.selectedIndex].startId, objects[addedObjectsMenu.selectedIndex].count);
        colors.splice(objects[addedObjectsMenu.selectedIndex].startId, objects[addedObjectsMenu.selectedIndex].count);
        normals.splice(objects[addedObjectsMenu.selectedIndex].startId, objects[addedObjectsMenu.selectedIndex].count);
        objects.splice(addedObjectsMenu.selectedIndex, 1);
        addedObjectsMenu.remove(addedObjectsMenu.selectedIndex);
    
        GfObject.setBuffers();
        
        numObj--;
        addedObjectsMenu.selectedIndex = numObj - 1;
    }

    static deleteLight(){
        if(nLights < 2){
            alert("There should be at least 1 light.");
            return;
        }

        lights.splice(addedLightsMenu.selectedIndex, 1);
        addedLightsMenu.remove(addedLightsMenu.selectedIndex);
    
        nLights--;
        gl.uniform1i(nLightsLoc, nLights);
        addedLightsMenu.selectedIndex = nLights - 1;
    }

    static setEyeCenterUp(){
        identity4(viewMatrix);
        lookAt(viewMatrix, 
            /*eye*/[+SEyeXir.value, +SEyeYir.value, +SEyeZir.value], 
            /*center*/[+SCenXir.value, +SCenYir.value, +SCenZir.value], 
            /*up*/[0, 1, 0]
        );

        normMatrix = [
            vec3(viewMatrix[0][0], viewMatrix[0][1], viewMatrix[0][2]),
            vec3(viewMatrix[1][0], viewMatrix[1][1], viewMatrix[1][2]),
            vec3(viewMatrix[2][0], viewMatrix[2][1], viewMatrix[2][2])
        ];

        gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, flatten(viewMatrix) );
        gl.uniformMatrix3fv(matNormUniformLocation, gl.FALSE, flatten(normMatrix) );
    }
    
    static setProjectionType(){
        switch(projMenu.options[projMenu.selectedIndex].value){
            case 'perspective':  
                perspective(projMatrix, radians(45), (canvas.width)/(canvas.height), 0.1, 1000.0);       
                break;
            case 'orthogonal':
                ortho(projMatrix, -1, 1, -1, 1, -1, 1);
                break;
        }
        gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);
    }

    static render(){
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        for(let i = 0; i < objects.length; i++){
            objects[i].draw();
        }
        window.requestAnimFrame(Scene.render);
    }
}