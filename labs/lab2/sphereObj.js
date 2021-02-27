class Sphere extends GfObject {
    constructor(startId, radius, delta, color){
        super(startId, color);
        
        this.radius = radius;
        this.delta = delta;

        this.calculateSphere();

        GfObject.setBuffers();
    }
    
    calculateSphere(){
        let delta = this.delta;
        let radius = this.radius;

        /**
         * @return {number}
         */
        function X(theta, phi){
            return radius * Math.sin(radians(theta)) * Math.cos(radians(phi));
        }
        
        /**
         * @return {number}
         */
        function Y(theta, phi){
            return radius * Math.sin(radians(theta)) * Math.sin(radians(phi));
        }

        /**
         * @return {number}
         */
        function Z(theta){
            return radius * Math.cos(radians(theta));
        }
        
        for(let theta = 0; theta < 180; theta += delta){
            for (let phi = 0; phi < 360; phi += delta){
                vertices.push(vec4( X(theta, phi), Y(theta, phi), Z(theta), 1));
                colors.push(super.getColor);

                vertices.push(vec4( X(theta+delta, phi), Y(theta+delta, phi), Z(theta+delta), 1));
                colors.push(super.getColor);

                vertices.push(vec4( X(theta, phi+delta), Y(theta, phi+delta), Z(theta), 1));
                colors.push(super.getColor);


                vertices.push(vec4( X(theta+delta, phi), Y(theta+delta, phi), Z(theta+delta), 1));
                colors.push(super.getColor);

                vertices.push(vec4( X(theta, phi+delta), Y(theta, phi+delta), Z(theta), 1));
                colors.push(super.getColor);

                vertices.push(vec4( X(theta+delta, phi+delta), Y(theta+delta, phi+delta), Z(theta+delta), 1));
                colors.push(super.getColor);
                
                this.count += 6;
            }
        }
    }
}