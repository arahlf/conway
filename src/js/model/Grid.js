/**
 * @class GOL.model.Grid
 * The grid model.
 */
Ext.define("GOL.model.Grid", {
    /**
     * @constructor
     * @param {Number} rows
     * @param {Number} cols
     * @param {GOL.rules.Rules} rules
     */
    constructor: function(rows, cols, rules) {
        Ext.apply(this, {
            rows: rows,
            cols: cols,
            rules: rules,
            generations: 0
        });
        
        this.addEvents(
            /**
             * @event generationchange
             * @param {GOL.model.Grid} this
             * @param {Number} count The new generation count.
             */
            "generationchange"
        );
    },

    configure: function(cellFactory) {
        var me = this;
        var cells = me.cells = [];
        
        for (var r = 0; r < me.rows; r++) {
            var row = [];

            for (var c = 0; c < me.cols; c++) {
                row.push(cellFactory.createModel(r, c));
            }

            cells.push(row);
        }

        var cellList = me.cellList = Ext.Array.flatten(cells);

        // assign cell neighbors
        for (var i = 0; i < cellList.length; i++) {
            var cell = cellList[i], neighbors = [];
            var row = cell.getRow(), col = cell.getCol();

            for (var r = row - 1; r <= row + 1; r++) {
                for (var c = col - 1; c <= col + 1; c++) {
                    if (this.cells[r] && this.cells[r][c] && this.cells[r][c] != cell) {
                        neighbors.push(this.cells[r][c]);
                    }
                }
            }

            cell.setNeighbors(neighbors);
        }
        //this.fireEvent("configure");
    },

    mixins: {
        observable: "Ext.util.Observable"
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

    kill: function() {
        var composite = new GOL.model.CompositeCell(this.cellList);
        
        composite.kill().commit();
        
        this.generations = 0;
        
        this.fireEvent("generationchange", this, this.generations);
    },

    // check performance of function based iteration...
    // store a secondary copy rather than flattening each time?
    // ~73% of the time is spent adding/remove CSS classes
    eachCell: function(fn, scope) {
        for (var i = 0; i < this.cellList.length; i++) {
            fn.call(scope, this.cellList[i]);
        }
    },

    /**
     * Executes the given rules to create the next generation of Cells and fires
     * the 'generation' event.
     */
    nextGeneration: function() {
        // get rid of function based iteration
        this.eachCell(this.applyRules, this);
        
        this.eachCell(function(cell) {
            cell.commit();
        });
        
        this.fireEvent("generationchange", this, ++this.generations);
    },
    
    applyRules: function(cell) {
        this.rules.applyRules(cell);
    },
    
    reset: function() {
        // question mark?
        // fire generationchange
        // reset all cells in the process (clear their ages and what not)
    },
    
    /**
     * Applies a pattern to the Grid.
     * @param {GOL.pattern.Pattern} pattern
     */
    applyPattern: function(pattern) {
        this.kill();
        pattern.applyPattern(this);
    }
});