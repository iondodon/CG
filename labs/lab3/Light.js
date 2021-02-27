class Light {
    constructor(x, y, z, a){
        this.position = vec4(x, y, z, a );
        this.ambient = vec4(0.5, 0.2, 0.2, 1.0 );
        this.diffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
        this.specular = vec4( 1.0, 1.0, 1.0, 1.0 );

        this.X = x;
        this.Y = y;
        this.Z = z;

        gl.uniform4fv( gl.getUniformLocation(program, "lightPosition[" + nLights + "]"),flatten(this.position) );
    }

    updateLightXYZ(Xval, Yval, Zval){
        this.X = Xval;
        this.Y = Yval;
        this.Z = Zval;

        this.position = vec4(Xval, Yval, Zval, 0.0);
    }
    
    changeColor(color){
        this.diffuse = color;
    }
}