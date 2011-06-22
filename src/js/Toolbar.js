Ext.ns("GOL");

/**
 * @class GOL.Toolbar
 * @extends Ext.Toolbar
 *
 * Serves as a means of interacting with a GameOfLife.
 * 
 * @cfg {GOL.GameOfLife} gameOfLife The game to control.
 */
GOL.Toolbar = Ext.extend(Ext.Toolbar, {
  generationsLabel: "Generations: ",
  
  interval: 150,
  
  // private
  initComponent: function() {
    Ext.apply(this, {
      items: this.createMenuItems()
    });
    
    this.gameOfLife.on("tick", this.updateGenerations, this);
    this.gameOfLife.on("reset", Ext.Function.bind(this.updateGenerations, this, [0]));
    
    GOL.Toolbar.superclass.initComponent.call(this);
  },
  
  /**
   * Creates the menu items in the Toolbar.
   */
  createMenuItems: function() {
    return [{
      xtype: "button",
      icon: GOL.icons.BOMB,
      tooltip: "Kill all cells",
      handler: Ext.bind(this.reset, this, [false])
    }, " ", "-", " ", {
      xtype: "button",
      icon: GOL.icons.REWIND,
      tooltip: "Reset pattern",
      handler: Ext.bind(this.reset, this, [true])
    }, {
      xtype: "playbutton",
      itemId: "playButton",
      tooltip: "Play",
      playHandler: this.play,
      pauseHandler: this.pause,
      scope: this
    }, {
      xtype: "button",
      icon: GOL.icons.NEXT,
      tooltip: "Forward an iteration",
      handler: this.forward,
      scope: this
    }, " ", "-", " ", {
      xtype: "button",
      icon: GOL.icons.CONFIG,
      tooltip: "Config",
      menu: this.createConfigMenu()
    }, "->", {
      xtype: "tbtext",
      text: this.generationsLabel + "0",
      itemId: "generations"
    }];
  },
  
  /**
   * Creates the configuration menu items.
   * @return {Array}
   */
  createConfigMenu: function() {
    return {
      xtype: "menu",
      style: "overflow: visible;",
      items: [{
        xtype: "golcombo",
        emptyText: "Select a Pattern",
        storeData: GOL.patterns.PatternFactory.getPatterns(),
        handler: Ext.bind(function(combo) {
          this.stop();
          this.gameOfLife.reset();
          this.gameOfLife.applyPattern(GOL.patterns.PatternFactory.getPattern(combo.getValue()));
        }, this)
      }, {
        xtype: "golcombo",
        emptyText: "Select a Cell type",
        storeData: GOL.cells.CellFactory.getCells(),
        handler: Ext.bind(function(combo) {
          this.stop();
          this.gameOfLife.applyCellType(GOL.cells.CellFactory.getCell(combo.getValue()));
          this.gameOfLife.applyPattern();
        }, this)
      }]
    };
  },
  
  /**
   * Updates the generation count status text.
   * @param {Number} count
   */
  updateGenerations: function(count) {
    this.getComponent("generations").setText(this.generationsLabel + count);
  },
  
  /**
   * Starts the game of life.
   */
  play: function() {
    if (!this.timeoutId) {
      var tickFn = Ext.Function.bind(this.gameOfLife.tick, this.gameOfLife);
      
      this.timeoutId = setInterval(tickFn, this.interval);
    }
  },
  
  /**
   * Pauses the game of life.
   */
  pause: function() {
    this.timeoutId = clearInterval(this.timeoutId);
  },
  
  /**
   * Resets the game of life.
   * @param {Boolean} applyPattern True to also redraw the current pattern.
   */
  reset: function(applyPattern) {
    this.stop();
    this.gameOfLife.reset();
    
    if (applyPattern) {
      this.gameOfLife.applyPattern();
    }
  },
  
  /**
   * Goes forward 1 tick.
   */
  forward: function() {
    if (!this.timeoutId) {
      this.gameOfLife.tick();
    }
  },
  
  /**
   * Stops the game of life and resets the play button.
   */
  stop: function() {
    this.pause();
    this.getComponent("playButton").reset();
  }
});