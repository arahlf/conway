/**
 * @class GOL.pattern.Beacon
 * @extends GOL.pattern.Pattern
 */
Ext.define('GOL.pattern.Beacon', {
    extend: 'GOL.pattern.AbstractCoordinatePattern',
    
    /**
     * {@link GOL.pattern.Pattern#applyPattern} implementation
     */
    applyPattern: function(grid) {
        var coordinates = [
            [1, 1],
            [1, 2],
            [2, 1],
            //
            [4, 3],
            [3, 4],
            [4, 4]
        ];
        
        this.applyCoordinates(grid, coordinates);
    }
});

GOL.registerPattern('Beacon', new GOL.pattern.Beacon());