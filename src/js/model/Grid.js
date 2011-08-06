/**
 * @class GOL.model.Grid
 * The Grid model.
 */
Ext.define('GOL.model.Grid', {
    
    mixins: {
        observable: 'Ext.util.Observable'
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
            'generationchange',
            
            /**
             * @event reconfigure
             */
            'reconfigure'
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
        
        this.fireEvent('reconfigure');
    },
    
    assignCellNeighbors: function(cell) {
        var cells = this.cells,
            row = cell.getRow(),
            col = cell.getCol(),
            neighbors = [];
        
        for (var r = row - 1; r <= row + 1; r++) {
            for (var c = col - 1; c <= col + 1; c++) {
                if (cells[r] && cells[r][c] && cells[r][c] != cell) {
                    neighbors.push(cells[r][c]);
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
        
        this.fireEvent('generationchange', (this.generations = 0));
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
        var cells = this.compositeCell.getCells(),
            rules = this.rules;
        
        for (var i = 0, length = cells.length; i < length; i++) {
            rules.applyRules(cells[i]);
        }
        
        this.compositeCell.commit();
        
        this.fireEvent('generationchange', ++this.generations);
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