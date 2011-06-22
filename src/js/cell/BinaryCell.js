Ext.ns("GOL.cells");

/**
 * @class 
 * @extends
 * 
 * A standard Cell implementation, it maintains a simple
 * dead or alive state.
 */
GOL.cells.BinaryCell = Ext.extend(GOL.cells.Cell, {
  displayName: "Binary Cell",
  
  constructor: function() {
    GOL.cells.BinaryCell.superclass.constructor.apply(this, arguments);
    
    this.alive = false;
    this.tempAlive = false;
    
    this.el.addCls("binary-cell");
    this.el.addCls("dead");
  },
  
  /**
   * {@link GOL.cells.Cell#commit} implementation
   */
  commit: function() {
    this.alive = this.tempAlive;
    
    if (this.alive) {
      this.el.addClass("alive");
      this.el.removeCls("dead");
    }
    else {
      this.el.addClass("dead");
      this.el.removeCls("alive");
    }
    return this;
  },
  
  /**
   * {@link GOL.cells.Cell#isAlive} implementation
   */
  isAlive: function() {
    return this.alive;
  },
  
  /**
   * {@link GOL.cells.Cell#kill} implementation
   */
  kill: function() {
    this.tempAlive = false;
    return this;
  },
  
  /**
   * {@link GOL.cells.Cell#persist} implementation
   */
  persist: function() {
    // noop
  },
  
  /**
   * {@link GOL.cells.Cell#revive} implementation
   */
  revive: function() {
    this.tempAlive = true;
    return this;
  }
});