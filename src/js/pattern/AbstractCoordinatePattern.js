/**
 * @class GOL.pattern.AbstractCoordinatePattern
 * @extends GOL.pattern.Pattern
 */
Ext.define('GOL.pattern.AbstractCoordinatePattern', {
    extend: 'GOL.pattern.Pattern',
    
    /**
     * Applies a set of coordinates to a Grid model.
     * @param {GOL.model.Grid} grid
     * @param {Array} coordinates A 2D array (rows/cols) of Cell coordinates.
     */
    applyCoordinates: function(grid, coordinates) {
        var coordinate;
        
        for (var i = 0, length = coordinates.length; i < length; i++) {
            coordinate = coordinates[i];
            
            grid.getCell(coordinate[1], coordinate[0]).revive().commit();
        }
    }
});