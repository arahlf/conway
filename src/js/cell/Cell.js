Ext.ns("GOL.cells");

/**
 * @class GOL.cells.Cell
 * @extends Object
 *
 * A base class for Cells.  All subclasses should include a 'displayName' property.
 *
 * Instead of the maintaining an extra set of cells as a buffer for iteration,
 * these cells maintain their state in a transactional manner, meaning actions
 * like kill/revive/persist will not actually go into effect until the Cell's
 * commit() method has been called.
 */
GOL.cells.Cell = Ext.extend(Ext.Component, {
  /**
   * @type Number
   * @property row
   */
  /**
   * @type Number
   * @property col
   */
  /**
   * The Cell's neighbors.
   * @type Array
   * @property neighbors
   */
  
  cls: "cell",
  
  /**
   * Constructs a Cell, automatically rendering it into the GameOfLife.
   * @param {GOL.GameOfLife} gol
   * @param {Number} row
   * @param {Number} col
   */
  constructor: function(gol, row, col) {
    Ext.apply(this, {
      row: row,
      col: col,
      neighbors: [],
      renderTo: gol.el
    });
    
    this.setPosition(col * GOL.Constants.CELL_SIZE, row * GOL.Constants.CELL_SIZE);
    this.setSize(GOL.Constants.CELL_SIZE, GOL.Constants.CELL_SIZE);
    
    GOL.cells.Cell.superclass.constructor.call(this);
  },
  
  /**
   * Gets the number of alive neighbors this Cell has.
   * @return {Number}
   */
  getAliveNeighborsCount: function() {
    var count = 0;
    
    Ext.each(this.neighbors, function(neighbor) {
      if (neighbor.isAlive()) {
        count++;
      }
    });
    
    return count;
  },
  
  /**
   * Resets the Cell back to its default state by killing/committing it.
   * @return {GOL.cells.Cell} this
   */
  reset: function() {
    return this.kill().commit();
  },
  
  /**
   * Commits the temporary state of the Cell.
   */
  commit: Ext.abstractFn,
  
  /**
   * Whether or not the Cell is alive.
   */
  isAlive: Ext.abstractFn,
  
  /**
   * Kills the Cell.
   */
  kill: Ext.abstractFn,
  
  /**
   * Signals the Cell that it has to the next generation.
   */
  persist: Ext.abstractFn,
  
  /**
   * Brings the Cell back to life.
   */
  revive: Ext.abstractFn
});
