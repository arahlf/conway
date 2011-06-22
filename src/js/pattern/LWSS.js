/**
 * @class GOL.pattern.LWSS
 * @extends GOL.pattern.Pattern
 */
Ext.define("GOL.pattern.LWSS", {
    extend: "GOL.pattern.AbstractCoordinatePattern",
    
    /**
     * {@link GOL.pattern.Pattern#applyPattern} implementation
     */
    applyPattern: function(grid) {
        var coordinates = [
            [1, 1],
            [4, 1],
            [5, 2],
            [1, 3],
            [5, 3],
            [2, 4],
            [3, 4],
            [4, 4],
            [5, 4]
        ];
        
        this.applyCoordinates(grid, coordinates);
    }
});

GOL.registerPattern("LWSS", new GOL.pattern.LWSS());