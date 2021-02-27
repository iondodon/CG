class GfObject {
    constructor(startId, color, shininess, objType){
        this.startId = startId;
        this.count = 0;

        this.objType = objType;
        
        this.TLR = 0;
        this.TUD = 0;
        this.TFB = 0;
        
        this.SX = 0;
        this.SY = 0;
        this.SZ = 0;
    
        this.RX = 0;
        this.RY = 0;
        this.RZ = 0;

        this.color = color;

        this.materialAmbient = color;
        this.materialDiffuse = vec4( 1.0, 0.8, 0.0, 1.0 );
        this.materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
        this.materialShininess = shininess;
        
        this.R = rotate(0, [1, 0, 0]);
        this.S = scalem(0.08, 0.08, 0.08);
        this.T = translate(0.0, 0.0, 0.0);
    }
    
    get getColor(){
        return this.color;
    }

    changeColor(color){
        this.color = color;
        this.materialAmbient = color;
        for(let i = this.startId; i < this.startId + this.count; i++){
            colors[i] =  color;
        }

        // for(let i = 0; i < nLights; i++){s
        //     this.ambientProduct = mult(lights[i].ambient, this.materialAmbient);
        // }
        
        GfObject.setBuffers();
    }

    changeShininess(shininess){
        this.materialShininess = shininess;
    }

    updateNormals(){
        function normalVector(p1, p2, p3){
            let u = subtract(p2, p1);
            let v = subtract(p3, p1);

            let n = vec4();
            
            n[0] = (u[1] * v[2]) - (u[2] * v[1]);
            n[1] = (u[2] * v[0]) - (u[0] * v[2]);
            n[2] = (u[0] * v[1]) - (u[1] * v[0]);

            n[3] = 0;

            return n;
        }

        

        var aux = 0;
        for(let i = this.startId; i < this.startId+this.count-2; i+=3){
            let currentNormal;
            
            if(this.objType == "sphere"){
                aux = aux + 1;
                if(aux % 2 == 1){
                    currentNormal = normalVector(vertices[i], vertices[i+1], vertices[i+2]);
                } else {
                    currentNormal = normalVector(vertices[i+1], vertices[i], vertices[i+2]);
                }
            } else {
                currentNormal = normalVector(vertices[i+1], vertices[i], vertices[i+2]);
            }
            
            normals[i] = currentNormal;
            normals[i+1] = currentNormal;
            normals[i+2]   = currentNormal;
        }
    }

    static setBuffers(){
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
        
        var normalsId = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalsId);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW);
        var vNormal = gl.getAttribLocation(program, "vNormal");
        gl.vertexAttribPointer(vNormal, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vNormal);
    }

    updateMatrices(TLR, TUD, TFB, SX,  SY,  SZ, RX,  RY,  RZ){
        this.TLR = TLR;
        this.TUD = TUD;
        this.TFB = TFB;
        
        this.SX = SX;
        this.SY = SY;
        this.SZ = SZ;
    
        this.RX = RX;
        this.RY = RY;
        this.RZ = RZ;

        this.T = translate(TLR, TUD, TFB);

        (SX == 0) ? SX = 0.08 : SX;
        (SY == 0) ? SY = 0.08 : SY;
        (SZ == 0) ? SZ = 0.08 : SZ;
        this.S = scalem(SX, SY, SZ);
        
        var R = mat4();
        R = mult(rotateZ(RZ), rotateY(RY));
        R = mult(R, rotateX(RX));
        this.R = R;
    }
    
    draw(){
        gl.uniformMatrix4fv(RLoc, false, flatten(this.R));
        gl.uniformMatrix4fv(SLoc, false, flatten(this.S));
        gl.uniformMatrix4fv(TLoc, false, flatten(this.T));

        var ambientProduct;
        var diffuseProduct;
        var specularProduct;
        
        for(let i = 0; i < nLights; i++){
            // ambientProduct = mult(lights[i].ambient, this.materialAmbient);
            // diffuseProduct = mult(lights[i].diffuse, this.materialDiffuse);
            // specularProduct = mult(lights[i].specular, this.materialSpecular);
            // gl.uniform4fv( gl.getUniformLocation(program, "ambientProduct[" + i + "]"),flatten(ambientProduct) );
            // gl.uniform4fv( gl.getUniformLocation(program, "diffuseProduct[" + i + "]"),flatten(diffuseProduct) );
            // gl.uniform4fv( gl.getUniformLocation(program, "specularProduct[" + i + "]"),flatten(specularProduct) );
            // gl.uniform4fv( gl.getUniformLocation(program, "lightPosition[" + i + "]"),flatten(lights[i].position) );
            //----------------------------------------------------------------------------------------------------------------
            ambientProduct = mult(lights[i].ambient, this.materialAmbient);
            // diffuseProduct = mult(lights[i].diffuse, this.materialDiffuse);
            // specularProduct = mult(lights[i].specular, this.materialSpecular);
            gl.uniform4fv( gl.getUniformLocation(program, "ambientProduct[" + i + "]"),flatten(ambientProduct) );
            gl.uniform4fv( gl.getUniformLocation(program, "diffuseProduct[" + i + "]"),flatten(lights[i].diffuse) );
            gl.uniform4fv( gl.getUniformLocation(program, "specularProduct[" + i + "]"),flatten(lights[i].specular) );
            gl.uniform4fv( gl.getUniformLocation(program, "lightPosition[" + i + "]"),flatten(lights[i].position) );
        }

        // gl.uniform4fv( gl.getUniformLocation(program, "ambientProduct"),flatten(ambientProduct) );
        // gl.uniform4fv( gl.getUniformLocation(program, "diffuseProduct"),flatten(diffuseProduct) );
        // gl.uniform4fv( gl.getUniformLocation(program, "specularProduct"),flatten(specularProduct) );
        gl.uniform1f( gl.getUniformLocation(program, "shininess"), this.materialShininess );

        gl.drawArrays(gl.TRIANGLES, this.startId, this.count);
    }
}