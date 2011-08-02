/**
 * @class GOL.pattern.Pattern
 * An interface for patterns.
 */
Ext.define("GOL.pattern.Pattern", {
    /**
     * Applies the pattern to the specified Grid.
     * @param {GOL.model.Grid} grid
     */
    applyPattern: GOL.abstractFn
});
/**
 * @class GOL.pattern.AbstractCoordinatePattern
 * @extends GOL.pattern.Pattern
 */
Ext.define("GOL.pattern.AbstractCoordinatePattern", {
    extend: "GOL.pattern.Pattern",
    
    /**
     * Applies a set of coordinates to a Grid model.
     * @param {GOL.model.Grid} grid
     * @param {Array} coordinates A 2D array (rows/cols) of Cell coordinates.
     */
    applyCoordinates: function(grid, coordinates) {
        var coordinate;
        
        for (var i=0; i<coordinates.length; i++) {
            coordinate = coordinates[i];
            
            grid.getCell(coordinate[1], coordinate[0]).revive().commit();
        }
    }
});
Ext.ns("GOL.pattern");

/**
 * @class GOL.pattern.Registry
 * Serves as a registry of Patterns.
 */
GOL.pattern.Registry = new GOL.registry.Registry();

/**
 * Shortcut for {GOL.pattern.Registry#register}
 * @member GOL
 * @method registerPattern
 */
GOL.registerPattern = Ext.bind(GOL.pattern.Registry.register, GOL.pattern.Registry);
/**
 * @class GOL.pattern.Random
 * @extends GOL.pattern.Pattern A pattern that randomly (50/50) either kills or revives a Cell.
 */
Ext.define("GOL.pattern.Random", {
    extend: "GOL.pattern.Pattern",
    
    /**
     * {@link GOL.pattern.Pattern#applyPattern} implementation
     */
    applyPattern: function(grid) {
        grid.eachCell(function(cell) {
            if (Math.random() > 0.5) {
                cell.kill();
            }
            else {
                cell.revive();
            }
            cell.commit();
        });
    }
});

GOL.registerPattern("Random", new GOL.pattern.Random());
/**
 * @class GOL.pattern.Beacon
 * @extends GOL.pattern.Pattern
 */
Ext.define("GOL.pattern.Beacon", {
    extend: "GOL.pattern.AbstractCoordinatePattern",
    
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

GOL.registerPattern("Beacon", new GOL.pattern.Beacon());
/**
 * @class GOL.pattern.Glider
 * @extends GOL.pattern.Pattern
 */
Ext.define("GOL.pattern.Glider", {
    extend: "GOL.pattern.AbstractCoordinatePattern",
    
    /**
     * {@link GOL.pattern.Pattern#applyPattern} implementation
     */
    applyPattern: function(grid) {
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
/**
 * @class GOL.pattern.GliderGun
 * @extends GOL.pattern.Pattern
 */
Ext.define("GOL.pattern.GliderGun", {
    extend: "GOL.pattern.AbstractCoordinatePattern",
    
    /**
     * {@link GOL.pattern.Pattern#applyPattern} implementation
     */
    applyPattern: function(grid) {
        var coordinates = [
            [2, 6],
            [2, 7],
            [3, 6],
            [3, 7],
            [12, 6],
            [12, 7],
            [12, 8],
            [13, 5],
            [13, 9],
            [14, 4],
            [14, 10],
            [15, 4],
            [15, 10],
            [16, 7],
            [17, 5],
            [17, 9],
            [18, 6],
            [18, 7],
            [18, 8],
            [19, 7],
            [22, 4],
            [22, 5],
            [22, 6],
            [23, 4],
            [23, 5],
            [23, 6],
            [24, 3],
            [24, 7],
            [26, 2],
            [26, 3],
            [26, 7],
            [26, 8],
            [36, 4],
            [36, 5],
            [37, 4],
            [37, 5]
        ];
        
        this.applyCoordinates(grid, coordinates);
    }
});

GOL.registerPattern("Glider Gun", new GOL.pattern.GliderGun());
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
