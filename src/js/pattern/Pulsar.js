/**
 * @class GOL.pattern.Pulsar
 * @extends GOL.pattern.Pattern
 */
Ext.define("GOL.pattern.Pulsar", {
    extend: "GOL.pattern.AbstractCoordinatePattern",
    
    /**
     * {@link GOL.pattern.Pattern#applyPattern} implementation
     */
    applyPattern: function(grid) {
        var coordinates = [
            [4, 2],
            [5, 2],
            [6, 2],
            [10, 2],
            [11, 2],
            [12, 2],
            //
            [2, 4],
            [7, 4],
            [9, 4],
            [14, 4],
            //
            [2, 5],
            [7, 5],
            [9, 5],
            [14, 5],
            //
            [2, 6],
            [7, 6],
            [9, 6],
            [14, 6],
            //
            [4, 7],
            [5, 7],
            [6, 7],
            [10, 7],
            [11, 7],
            [12, 7],
            //
            [4, 9],
            [5, 9],
            [6, 9],
            [10, 9],
            [11, 9],
            [12, 9],
            //
            [2, 10],
            [7, 10],
            [9, 10],
            [14, 10],
            //
            [2, 11],
            [7, 11],
            [9, 11],
            [14, 11],
            //
            [2, 12],
            [7, 12],
            [9, 12],
            [14, 12],
            //
            [4, 14],
            [5, 14],
            [6, 14],
            [10, 14],
            [11, 14],
            [12, 14]
        ];
        
        this.applyCoordinates(grid, coordinates);
    }
});

GOL.registerPattern("Pulsar", new GOL.pattern.Pulsar());