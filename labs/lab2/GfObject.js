class GfObject {
    constructor(startId, color){
        this.startId = startId;
        this.count = 0;

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

        this.R = rotate(0, [1, 0, 0]);
        this.S = scalem(0.3, 0.3, 1.0);
        this.T = translate(0.0, 0.0, 0.0);
    }
    
    get getColor(){
        return this.color;
    }
    
    changeColor(color){

        this.color = color;
        for(let i = this.startId; i < this.startId + this.count; i++){
            colors[i] =  color;
        }
        GfObject.setBuffers();
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

        (SX == 0) ? SX = 0.3 : SX;
        (SY == 0) ? SY = 0.3 : SY;
        (SZ == 0) ? SZ = 0.3 : SZ;
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
        gl.drawArrays(gl.TRIANGLES, this.startId, this.count);
        
        blackOnLoc = gl.getUniformLocation(program, "blackOn");
        gl.uniform1i(blackOnLoc, 1);
        gl.drawArrays(gl.LINES, this.startId, this.count);
        gl.uniform1i(blackOnLoc, 0);
    }
}