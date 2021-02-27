class Room extends GfObject {
    constructor(startId, color, shininess, objType){
        super(startId, color, shininess, objType);

        this.SX = 1;
        this.SY = 1;
        this.SZ = 1;
        super.S = scalem(1, 1, 1);

        this.calculateRoom();
        super.updateNormals();

        GfObject.setBuffers();
    }

    calculateRoom(){
        //front
        vertices.push(vec4( -1, -1, 1, 1 ));
        vertices.push(vec4( -1, 1, 1, 1 ));
        vertices.push(vec4( 1, -1, 1, 1 ));

        vertices.push(vec4( -1, 1, 1, 1 ));
        vertices.push(vec4( 1, -1, 1, 1 ));
        vertices.push(vec4( 1, 1, 1, 1 ));

        colors.push(vec4( 0, 0, 1, 1 ));
        colors.push(vec4( 0, 0, 1, 1 ));
        colors.push(vec4( 0, 0, 1, 1 ));
        colors.push(vec4( 0, 0, 1, 1 ));
        colors.push(vec4( 0, 0, 1, 1 ));
        colors.push(vec4( 0, 0, 1, 1 ));

        //left
        vertices.push(vec4( -1, -1, 1, 1 ));
        vertices.push(vec4( -1, 1, 1, 1 ));
        vertices.push(vec4( -1, -1, -1, 1 ));

        vertices.push(vec4( -1, 1, 1, 1 ));
        vertices.push(vec4( -1, -1, -1, 1 ));
        vertices.push(vec4( -1, 1, -1, 1 ));

        colors.push(vec4( 0, 1, 0, 1 ));
        colors.push(vec4( 0, 1, 0, 1 ));
        colors.push(vec4( 0, 1, 0, 1 ));
        colors.push(vec4( 0, 1, 0, 1 ));
        colors.push(vec4( 0, 1, 0, 1 ));
        colors.push(vec4( 0, 1, 0, 1 ));

        //back
        vertices.push(vec4( -1, -1, -1, 1 ));
        vertices.push(vec4( -1, 1, -1, 1 ));
        vertices.push(vec4( 1, -1, -1, 1 ));

        vertices.push(vec4( -1, 1, -1, 1 ));
        vertices.push(vec4( 1, -1, -1, 1 ));
        vertices.push(vec4( 1, 1, -1, 1 ));

        colors.push(vec4( 1, 0, 0, 1 ));
        colors.push(vec4( 1, 0, 0, 1 ));
        colors.push(vec4( 1, 0, 0, 1 ));
        colors.push(vec4( 1, 0, 0, 1 ));
        colors.push(vec4( 1, 0, 0, 1 ));
        colors.push(vec4( 1, 0, 0, 1 ));

        //right
        vertices.push(vec4( 1, -1, -1, 1 ));
        vertices.push(vec4( 1, 1, -1, 1 ));
        vertices.push(vec4( 1, -1, 1, 1 ));

        vertices.push(vec4( 1, 1, -1, 1 ));
        vertices.push(vec4( 1, -1, 1, 1 ));
        vertices.push(vec4( 1, 1, 1, 1 ));

        colors.push(vec4( 1, 1, 0, 1 ));
        colors.push(vec4( 1, 1, 0, 1 ));
        colors.push(vec4( 1, 1, 0, 1 ));
        colors.push(vec4( 1, 1, 0, 1 ));
        colors.push(vec4( 1, 1, 0, 1 ));
        colors.push(vec4( 1, 1, 0, 1 ));

        //down
        vertices.push(vec4( -1, -1, 1, 1 ));
        vertices.push(vec4( -1, -1, -1, 1 ));
        vertices.push(vec4( 1, -1, 1, 1 ));

        vertices.push(vec4( -1, -1, -1, 1 ));
        vertices.push(vec4( 1, -1, 1, 1 ));
        vertices.push(vec4( 1, -1, -1, 1 ));

        colors.push(vec4( 1, 0, 1, 1 ));
        colors.push(vec4( 1, 0, 1, 1 ));
        colors.push(vec4( 1, 0, 1, 1 ));
        colors.push(vec4( 1, 0, 1, 1 ));
        colors.push(vec4( 1, 0, 1, 1 ));
        colors.push(vec4( 1, 0, 1, 1 ));

        //up
        vertices.push(vec4( -1, 1, 1, 1 ));
        vertices.push(vec4( -1, 1, -1, 1 ));
        vertices.push(vec4( 1, 1, 1, 1 ));

        vertices.push(vec4( -1, 1, -1, 1 ));
        vertices.push(vec4( 1, 1, 1, 1 ));
        vertices.push(vec4( 1, 1, -1, 1 ));

        colors.push(vec4( 0, 1, 1, 1 ));
        colors.push(vec4( 0, 1, 1, 1 ));
        colors.push(vec4( 0, 1, 1, 1 ));
        colors.push(vec4( 0, 1, 1, 1 ));
        colors.push(vec4( 0, 1, 1, 1 ));
        colors.push(vec4( 0, 1, 1, 1 ));

        this.count = 36;
    }
}