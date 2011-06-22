Ext.ns("GOL");

/**
 * @class GOL.GameOfLife
 * @extends Ext.Window
 *
 * An implementation of Conway's Game of Life.
 */
GOL.GameOfLife = Ext.extend(Ext.Component, {
  /**
   * The number of Cell rows.
   * @type Number
   * @property rows
   */
  rows: 30,
  
  /**
   * The number of Cell columns.
   * @type Number
   * @property cols
   */
  cols: 50,
  
  /**
   * The game's Cells.
   * @type Array
   * @property cells
   */
  
  /**
   * The number of generations in the current game of life.
   * @type Number
   * @property generations
   */
  generations: 0,
  
  // if the mouse is currently 
  mouseDown: false,
  
  // private
  initComponent: function() {
    this.cells = [];
    
    // apply optional default configs
    Ext.applyIf(this, {
      cellType: GOL.cells.AgingCell,
      pattern: GOL.patterns.Random,
      rules: GOL.rules.StandardRules
    });
    
    this.addCls("game-of-life");
    this.addEvents("tick", "reset");
    
    var size = GOL.Constants.CELL_SIZE;
    this.setSize(this.cols*size, this.rows*size);
    this.on("render", this.attachMouseEvents, this);
    
    GOL.GameOfLife.superclass.initComponent.call(this);
  },
  
  /**
   * Attaches mouse events to allow the user to manually revive cells.
   * @private
   */
  attachMouseEvents: function() {
    this.el.on("mousedown", function(e, t) {
      this.mouseDown = true;
      this.handleCellEvent(t);
      e.preventDefault();
    }, this, { delegate: ".cell" });
    
    Ext.getDoc().on("mouseup", function() {
      this.mouseDown = false;
    }, this);
    
    this.el.on("mousemove", function(e, t, o) {
      if (this.mouseDown) {
        this.handleCellEvent(t);
      }
      e.preventDefault();
    }, this, { delegate: ".cell" });
  },
  
  /**
   * Checks if the Cell should be revived as a result user interaction.
   * @param {HTMLElement} dom A dom reference to a Cell object.
   * @private
   */
  handleCellEvent: function(dom) {
    var cell = Ext.getCmp(dom.id);
    
    if (!cell.isAlive()) {
      cell.revive().commit();
    }
  },
  
  /**
   * Invokes the next generation of Cells.
   */
  tick: function() {
    // apply the rules
    this.eachCell(function(cell) {
      this.rules.apply(cell);
    });
    
    // commit the changes
    this.eachCell(function(cell) {
      cell.commit();
    });
    
    this.fireEvent("tick", ++this.generations);
  },
  
  /**
   * Iterates the Cells, calling the passed function for each Cell.
   * @param {Function} fn
   * @param {Object} scope
   */
  eachCell: function(fn, scope) {
    for (var row = 0; row < this.rows; row++) {
      for (var col = 0; col < this.cols; col++) {
        fn.call(scope || this, this.cells[row][col], row, col);
      }
    }
  },
  
  /**
   * Applies the given pattern, otherwise re-applies the current one.
   * @param {GOL.patterns.Pattern} pattern
   */
  applyPattern: function(pattern) {
    if (pattern) {
      this.pattern = pattern;
    }
    this.pattern.apply(this);
  },
  
  /**
   * Applies the given cellType.
   * @param {GOL.cells.Cell} cellType
   */
  applyCellType: function(cellType) {
    this.cellType = cellType;
    this.buildCells();
  },
  
  /**
   * Initializes the Game of Life.
   */
  init: function() {
    this.buildCells();
    this.applyPattern();
  },
  
  /**
   * Builds up the Cells array, destroying any old ones in the process.
   * @private
   */
  buildCells: function() {
    // cleanup old cells
    Ext.each(Ext.flatten(this.cells), function(cell) {
      cell.destroy();
    });
    
    delete this.cells;
    this.cells = [];
    
    // create the 2D cells array
    for (var row = 0; row < this.rows; row++) {
      this.cells[row] = [];
      for (var col = 0; col < this.cols; col++) {
        this.cells[row][col] = new this.cellType(this, row, col);
      }
    }
    
    this.assignCellNeighbors();
  },
  
  /**
   * Sets the neighbors for each Cell.
   * @private
   */
  assignCellNeighbors: function() {
    this.eachCell(function(cell) {
      var neighbors = [];
      for (var row = cell.row - 1; row <= cell.row + 1; row++) {
        for (var col = cell.col - 1; col <= cell.col + 1; col++) {
          if (this.cells[row] && this.cells[row][col] && this.cells[row][col] != cell) {
            neighbors.push(this.cells[row][col]);
          }
        }
      }
      cell.neighbors = neighbors;
    });
  },
  
  /**
   * Kills all Cells and resets the generation count.
   */
  reset: function() {
    this.generations = 0;
    this.eachCell(function(cell) {
      cell.reset();
    });
    
    this.fireEvent("reset");
  }
});