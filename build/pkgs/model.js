/**
 * @class GOL.model.Grid
 * The grid model.
 */
Ext.define("GOL.model.Grid", {
    
    mixins: {
        observable: "Ext.util.Observable"
    },
    
    /**
     * @constructor
     * @param {Number} rows
     * @param {Number} cols
     * @param {GOL.rules.Rules} rules
     */
    constructor: function(rows, cols, cellFactory, rules) {
        Ext.apply(this, {
            rows: rows,
            cols: cols,
            rules: rules,
            generations: 0
        });
        
        this.addEvents(
            /**
             * @event generationchange
             * @param {Number} count The new generation count.
             */
            "generationchange",
            
            /**
             * @event reconfigure
             */
            "reconfigure"
        );
        
        this.configure(cellFactory);
    },
    
    /**
     * @param cellFactory {GOL.model.factory.CellFactory}
     * @private
     */
    configure: function(cellFactory) {
        var cells = this.cells = [], row;
        
        for (var r = 0; r < this.rows; r++) {
            row = [];
            
            for (var c = 0; c < this.cols; c++) {
                row.push(cellFactory.createModel(r, c));
            }
            
            cells.push(row);
        }
        
        this.compositeCell = new GOL.model.CompositeCell(Ext.Array.flatten(cells));
        this.compositeCell.each(this.assignCellNeighbors, this);
    },
    
    reconfigure: function(cellFactory) {
        Ext.destroy(this.cells);
        
        this.configure(cellFactory);
        
        this.fireEvent("reconfigure");
    },
    
    assignCellNeighbors: function(cell) {
        var row = cell.getRow(), col = cell.getCol(), neighbors = [];
        
        for (var r = row - 1; r <= row + 1; r++) {
            for (var c = col - 1; c <= col + 1; c++) {
                if (this.cells[r] && this.cells[r][c] && this.cells[r][c] != cell) {
                    neighbors.push(this.cells[r][c]);
                }
            }
        }
        
        cell.setNeighbors(neighbors);
    },
    
    getRows: function() {
        return this.rows;
    },
    
    getCols: function() {
        return this.cols;
    },
    
    getCell: function(row, col) {
        return this.cells[row][col];
    },
    
    killAllCells: function() {
        this.compositeCell.kill().commit();
        
        this.fireEvent("generationchange", (this.generations = 0));
    },
    
    /**
     * Calls the given method on each Cell in the Grid.
     */
    eachCell: function(fn, scope) {
        this.compositeCell.each(fn, scope);
    },
    
    /**
     * Executes the given rules to create the next generation of Cells and fires
     * the 'generation' event.
     */
    nextGeneration: function() {
        var cells = this.compositeCell.getCells();
        
        for (var i=0; i<cells.length; i++) {
            this.rules.applyRules(cells[i]);
        }
        
        this.compositeCell.commit();
        
        this.fireEvent("generationchange", ++this.generations);
    },
    
    /**
     * Applies a pattern to the Grid.
     * @param {GOL.pattern.Pattern} pattern
     */
    applyPattern: function(pattern) {
        this.killAllCells();
        pattern.applyPattern(this);
    }
});
/**
 * An interface for Cells.
 */
Ext.define("GOL.model.Cell", {
    mixins: {
        observable: "Ext.util.Observable"
    },

    constructor: function() {
        this.addEvents(
            /**
             * @event commit
             * Fired when the Cell's temporary state is committed.
             * @param {GOL.cells.Cell} this
             */
            "commit"
        );
    },

    /**
     * Gets the Cell's row.
     * @return {Number}
     */
    getRow: GOL.abstractFn,

    /**
     * Gets the Cell's column.
     * @return {Number}
     */
    getCol: GOL.abstractFn,

    /**
     * Commits the temporary state of the Cell and fires the "commit" event.
     * @return {GOL.cells.Cell} this
     */
    commit: GOL.abstractFn,

    /**
     * Returns the count of the Cell's alive neighbors.
     * @return {Number}
     */
    getAliveNeighborsCount: GOL.abstractFn,

    /**
     * Sets the Cell's neighbors.
     * @param {Array} neighbors
     */
    setNeighbors: GOL.abstractFn,

    /**
     * Returns the Cell's age (number of generations it has survived).
     * @return {Number}
     */
    getAge: GOL.abstractFn,

    /**
     * Returns whether or not the Cell is alive.
     * @return {Boolean}
     */
    isAlive: GOL.abstractFn,

    /**
     * Signal the Cell that it has lived on to the next generation.
     * @return {GOL.cells.Cell} this
     */
    persist: GOL.abstractFn,

    /**
     * Brings the Cell back to life.
     * @return {GOL.cells.Cell} this
     */
    revive: GOL.abstractFn,

    /**
     * Kills the Cell.
     * @return {GOL.cells.Cell} this
     */
    kill: GOL.abstractFn,
    
    /**
     * Destroy's the Cell (cleanup purposes).
     */
    destroy: GOL.abstractFn
});
/**
 * An abstract base class for Cells that provides common/shared functionality.
 */
Ext.define("GOL.model.AbstractCell", {
    extend: "GOL.model.Cell",
    
    constructor: function(row, col) {
        this.row = row;
        this.col = col;
        
        this.callParent();
    },
    
    getRow: function() {
        return this.row;
    },
    
    getCol: function() {
        return this.col;
    },

    /**
     * A partial implementation that handles the firing of the commit event.
     */
    commit: function() {
        this.onCommit();
        this.fireEvent("commit", this);
    },

    /**
     * Template method called when the Cell's state needs to be committed.
     */
    onCommit: GOL.abstractFn,
    
    getAliveNeighborsCount: function() {
        var count = 0, neighbors = this.neighbors;
        
        for (var i = 0; i < neighbors.length; i++) {
            if (neighbors[i].isAlive()) {
                count++;
            }
        }
        
        return count;
    },
    
    setNeighbors: function(neighbors) {
        this.neighbors = neighbors;
    },
    
    destroy: function() {
        this.neighbors = null;
    }
});

/**
 * @class GOL.model.CompositeCell
 * @extends GOL.model.Cell
 * @constructor
 * @param {Array} cells An array of cell models.
 *
 * Serves as a <a href="http://en.wikipedia.org/wiki/Composite_pattern">composite</a>
 * of Cell model objects.
 */
Ext.define("GOL.model.CompositeCell", {
    extend: "GOL.model.Cell",
    
    constructor: function(cells) {
        this.callParent();
        this.cells = cells;
    },
    
    /**
     * Retrieves the list of underlying Cells.
     * @return {Array}
     */
    getCells: function() {
        return this.cells;
    },
    
    /**
     * Calls the passed function for each element in this composite.
     * @param {Function} fn
     * @param {Object} scope
     * @return {GOL.model.CompositeCell} this
     */
    each: function(fn, scope) {
        Ext.Array.forEach(this.cells, fn, scope);
        return this;
    },
    
    /**
     * Calls the given method on each Cell in this composite (avoids function-based iteration).
     * @param {String} methodName
     * @return {GOL.model.CompositeCell} this
     * @private
     */
    forEachCell: function(methodName) {
        for (var i = 0; i < this.cells.length; i++) {
            (this.cells[i])[methodName]();
        }
        return this;
    },
    
    kill: function() {
        return this.forEachCell("kill");
    },
    
    revive: function() {
        return this.forEachCell("revive");
    },
    
    persist: function() {
        return this.forEachCell("persist");
    },
    
    commit: function() {
        return this.forEachCell("commit");
    },
    
    // unsupported methods
    getRow: GOL.unsupportedFn("CompositeCell.getRow"),
    getCol: GOL.unsupportedFn("CompositeCell.getCol"),
    getAliveNeighborsCount: GOL.unsupportedFn("CompositeCell.getAliveNeighborsCount"),
    setNeighbors: GOL.unsupportedFn("CompositeCell.setNeighbors"),
    getAge: GOL.unsupportedFn("CompositeCell.getAge"),
    isAlive: GOL.unsupportedFn("CompositeCell.isAlive")
});

/**
 * @class GOL.model.BinaryCell
 * @extends GOL.model.AbstractCell
 *
 * Simple Cell implementation that is either dead or alive.
 */
Ext.define("GOL.model.BinaryCell", {
    extend: "GOL.model.AbstractCell",

    alive: false,
    tempAlive: false,

    getAge: function() {
        return this.alive ? 1 : 0;
    },

    isAlive: function() {
        return this.alive;
    },

    onCommit: function() {
        this.alive = this.tempAlive;
        return this;
    },

    kill: function() {
        this.tempAlive = false;
        return this;
    },

    persist: function() {
        return this;
    },

    revive: function() {
        this.tempAlive = true;
        return this;
    }
});
/**
 * @class GOL.model.AgingCell
 * @extends GOL.model.AbstractCell
 * 
 * A Cell implementation that keeps track of its age.
 */
Ext.define("GOL.model.AgingCell", {
    extend: "GOL.model.AbstractCell",
    
    age: 0,
    tempAge: 0,
    
    isAlive: function() {
        return this.age > 0;
    },
    
    getAge: function() {
        return this.age;
    },
    
    onCommit: function() {
        this.age = this.tempAge;
        return this;
    },
    
    kill: function() {
        this.tempAge = 0;
        return this;
    },
    
    persist: function() {
        this.tempAge++;
        return this;
    },
    
    revive: function() {
        this.tempAge = 1;
        return this;
    }
});
/**
 * @class GOL.model.RainbowCell
 * @extends GOL.model.AbstractCell
 * 
 * A Cell implementation that keeps track of its age.
 */
Ext.define("GOL.model.RainbowCell", {
    extend: "GOL.model.AgingCell",
    
    MAX_AGE: 7,
    
    persist: function() {
        if (this.getAge() < this.MAX_AGE) {
            this.tempAge++;
        }
        return this;
    }
});
Ext.ns("GOL.cell");

/**
 * @class GOL.cell.Registry
 * Serves as a registry of Cell factories.
 */
GOL.cell.Registry = new GOL.registry.Registry();

/**
 * Shortcut for {GOL.cell.Registry#register}
 * @member GOL
 * @method registerCellFactory
 */
GOL.registerCellFactory = Ext.bind(GOL.cell.Registry.register, GOL.cell.Registry);
Ext.define("GOL.model.factory.CellFactory", {
    /**
     * Creates a new Cell model.
     * @param {Number} row
     * @param {Number} col
     */
    createCell: GOL.abstractFn,
});
Ext.define("GOL.model.factory.AgingCellFactory", {
    extend: "GOL.model.factory.CellFactory",
    
    createModel: function(row, col) {
        return new GOL.model.AgingCell(row, col);
    }
});

GOL.registerCellFactory("Aging", new GOL.model.factory.AgingCellFactory());
Ext.define("GOL.model.factory.BinaryCellFactory", {
    extend: "GOL.model.factory.CellFactory",
    
    createModel: function(row, col) {
        return new GOL.model.BinaryCell(row, col);
    }
});

GOL.registerCellFactory("Binary", new GOL.model.factory.BinaryCellFactory());
Ext.define("GOL.model.factory.RainbowCellFactory", {
    extend: "GOL.model.factory.CellFactory",
    
    createModel: function(row, col) {
        return new GOL.model.RainbowCell(row, col);
    }
});

GOL.registerCellFactory("Rainbow", new GOL.model.factory.RainbowCellFactory());
Ext.define("GOL.model.factory.RandomCellFactory", {
    extend: "GOL.model.factory.CellFactory",
    
    createModel: function(row, col) {
        switch (Math.ceil(Math.random() * 3)) { // TODO Mortal Cell
            case 1:
                return new GOL.model.BinaryCell(row, col);
            case 2:
                return new GOL.model.AgingCell(row, col);
            case 3:
                return new GOL.model.RainbowCell(row, col);
        }
    }
});

GOL.registerCellFactory("Random", new GOL.model.factory.RandomCellFactory());
