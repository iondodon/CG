class Pyramid extends GfObject {
    constructor(startId, leng, width, height, color, shininess, objType){
        super(startId, color, shininess, objType);

        this.leng = leng;
        this.width = width;
        this.height = height;

        this.calculatePyramid();
        super.updateNormals();

        GfObject.setBuffers();
    }

    calculatePyramid(){
        let leng = this.leng;
        let width = this.width;
        let height = this.height;

        //front
        vertices.push(vec4( -leng/2, 0, width/2, 1 ));
        colors.push(super.getColor);

        vertices.push(vec4( 0, height, 0, 1 ));
        colors.push(super.getColor);

        vertices.push(vec4( leng/2, 0, width/2, 1 ));
        colors.push(super.getColor);

        //left
        vertices.push(vec4( -leng/2, 0, width/2, 1 ));
        colors.push(super.getColor);

        vertices.push(vec4( 0, height, 0, 1 ));
        colors.push(super.getColor);

        vertices.push(vec4( -leng/2, 0, -width/2, 1 ));
        colors.push(super.getColor);

        //back
        vertices.push(vec4( -leng/2, 0, -width/2, 1 ));
        colors.push(super.getColor);

        vertices.push(vec4( 0, height, 0, 1 ));
        colors.push(super.getColor);

        vertices.push(vec4( leng/2, 0, -width/2, 1 ));
        colors.push(super.getColor);

        //right
        vertices.push(vec4( leng/2, 0, -width/2, 1 ));
        colors.push(super.getColor);

        vertices.push(vec4( 0, height, 0, 1 ));
        colors.push(super.getColor);

        vertices.push(vec4( leng/2, 0, width/2, 1 ));
        colors.push(super.getColor);

        //bottom
        vertices.push(vec4( -leng/2, 0, width/2, 1 ));
        colors.push(super.getColor);

        vertices.push(vec4( leng/2, 0, width/2, 1 ));
        colors.push(super.getColor);

        vertices.push(vec4( -leng/2, 0, -width/2, 1 ));
        colors.push(super.getColor);

        vertices.push(vec4( leng/2, 0, width/2, 1 ));
        colors.push(super.getColor);

        vertices.push(vec4( -leng/2, 0, -width/2, 1 ));
        colors.push(super.getColor);

        vertices.push(vec4( leng/2, 0, -width/2, 1 ));
        colors.push(super.getColor);

        super.count = 18;
    }
}