class LoadedObject extends GfObject {
    constructor(startId, lines, color, shininess, objType){
        super(startId, color, shininess, objType);
        
        this.lines = lines;
        this.getVertices();
        this.arrangeArrays();
        
        GfObject.setBuffers();
    }

    getVertices(){
        for(let i = 0; i < this.lines.length; i++){
            if(this.lines[i].substring(0, 2) == "v "){
                var vertex_string = this.lines[i].substring(3, this.lines[i].length);
                var vertex = vertex_string.split(" ");
                vertex[0] = parseFloat(vertex[0]);
                vertex[1] = parseFloat(vertex[1]);
                vertex[2] = parseFloat(vertex[2]);
                vertex.push(1.0);
                vertices_aux.push(vertex);
            } 
            else if(this.lines[i].substring(0, 2) == "vn"){
                var normal_string = this.lines[i].substring(3, this.lines[i].length);
                var normal = normal_string.split(" ");
                normal[0] = parseFloat(normal[0]);
                normal[1] = parseFloat(normal[1]);
                normal[2] = parseFloat(normal[2]);
                normal.push(1.0);
                normals_aux.push(normal);
            } 
            else if(this.lines[i].substring(0, 2) == "f ") {
                var index_string = this.lines[i].substring(2, this.lines[i].length);
                var index = index_string.split(" ");
                var point;
                
                point = index[0].split("/");
                index_vertex.push( parseInt(point[0]) );
                index_normal.push( parseInt(point[2]) );

                point = index[1].split("/");
                index_vertex.push( parseInt(point[0]) );
                index_normal.push( parseInt(point[2]) );

                point = index[2].split("/");
                index_vertex.push( parseInt(point[0]) );
                index_normal.push( parseInt(point[2]) );

                this.count += 3;
            }
        }
    }

    arrangeArrays(){
        for(let i = 0; i < this.count; i++){
            vertices.push( vertices_aux[index_vertex[i]-1] );
            normals.push( normals_aux[index_normal[i]-1] );
            colors.push(super.getColor);
        }
        vertices_aux = [];
        normals_aux = [];
    }
}