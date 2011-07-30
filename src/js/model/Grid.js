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
        this.compositeCell = new GOL.model.CompositeCell(cellList);

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

    killCells: function() {
        this.compositeCell.kill().commit();
        
        this.generations = 0;
        
        this.fireEvent("generationchange", this.generations);
    },
    
    /**
     * Iterates the grid's Cells, calling the supplied function for each one.
     */
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
        this.compositeCell.applyRules(this.rules);
        this.compositeCell.commit();
        
        this.fireEvent("generationchange", ++this.generations);
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
        this.killCells();
        pattern.applyPattern(this);
    }
});