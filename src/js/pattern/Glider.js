/**
 * @class GOL.pattern.Glider
 * @extends GOL.pattern.Pattern
 */
Ext.define("GOL.pattern.Glider", {
    extend: "GOL.pattern.AbstractCoordinatePattern",
    
    /**
     * {@link GOL.pattern.Pattern#applyPattern} implementation
     */
    applyPattern: function(gameOfLife) {
        var coordinates = [
            [1, 1],
            [2, 2],
            [3, 2],
            [1, 3],
            [2, 3]
        ];
        
        this.applyCoordinates(grid, coordinates);
    }
});

GOL.registerPattern("Glider", new GOL.pattern.Glider());