Ext.ns("GOL.cells");

/**
 * @class GOL.cells.AgingCell
 * @extends GOL.cells.Cell
 * 
 * A Cell that keeps track of its age over time.
 */
GOL.cells.AgingCell = Ext.extend(GOL.cells.Cell, {
  /**
   * @type String
   * @property displayName
   */
  displayName: "Aging Cell",
  
  constructor: function() {
    GOL.cells.AgingCell.superclass.constructor.apply(this, arguments);
    
    this.age = 0;
    this.tempAge = 0;
    
    this.el.addCls("aging-cell");
    this.el.addCls("dead");
  },
  
  /**
   * Creates an RGB color string to represent the Cell based on its age.
   */
  getAgeAsColor: function() {
    var code = Math.max(255 - (this.age * 15), 75);
    
    return Ext.String.format("rgb({0}, {1}, {2})", code, code, code);
  },
  
  /**
   * {@link GOL.cells.Cell#commit} implementation
   */
  commit: function() {
    this.age = this.tempAge;
    
    if (this.isAlive()) {
      this.el.removeCls("dead");
      this.el.setStyle("background-color", this.getAgeAsColor());
    }
    else {
      this.el.addCls("dead");
      this.el.setStyle("background-color", "transparent");
    }
    return this;
  },
  
  /**
   * {@link GOL.cells.Cell#isAlive} implementation
   */
  isAlive: function() {
    return this.age > 0;
  },
  
  /**
   * {@link GOL.cells.Cell#kill} implementation
   */
  kill: function() {
    this.tempAge = 0;
    return this;
  },
  
  /**
   * {@link GOL.cells.Cell#persist} implementation
   */
  persist: function() {
    this.tempAge++;
    return this;
  },
  
  /**
   * {@link GOL.cells.Cell#revive} implementation
   */
  revive: function() {
    this.tempAge = 1;
    return this;
  }
});