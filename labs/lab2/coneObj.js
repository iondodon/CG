class Cone extends GfObject {
    constructor(startId, radius, height, delta, color){
        super(startId, color);
        
        this.radius = radius;
        this.height = height;
        this.delta = delta;

        this.calculateCone();
        
        GfObject.setBuffers();
    }

    calculateCone(){
        let delta = this.delta;
        let radius = this.radius;

        /**
        * @return {number}
         */
        function X(phi){
            return radius * Math.cos(radians(phi));
        }
        
        /**
         * @return {number}
         */
        function Z(phi){
            return radius * Math.sin(radians(phi));
        }
        
        for(let phi = 0; phi < 360; phi += this.delta){
            vertices.push(vec4( 0, this.height, 0, 1));
            colors.push(super.getColor);

            vertices.push(vec4( X(phi), 0, Z(phi), 1));
            colors.push(super.getColor);

            vertices.push(vec4( X(phi+delta), 0, Z(phi+delta), 1));
            colors.push(super.getColor);

            vertices.push(vec4( X(phi), 0, Z(phi), 1));
            colors.push(super.getColor);

            vertices.push(vec4( X(phi+delta), 0, Z(phi+delta), 1));
            colors.push(super.getColor);

            vertices.push(vec4( 0, 0, 0, 1));
            colors.push(super.getColor);

            this.count += 6;
        }
    }
}