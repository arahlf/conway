/**
 * @class GOL.Toolbar
 * @extends Ext.toolbar.Toolbar
 * @cfg {GOL.model.Grid} grid A Toolbar used to interact with a {@link GOL.model.Grid}.
 */
Ext.define("GOL.Toolbar", {
    extend: "Ext.toolbar.Toolbar",
    
    /**
     * @cfg {Number} millisPerIteration The number of milliseconds to wait between each generation when "playing". Defaults to 50.
     */
    millisPerIteration: 50,
    
    // button iconCls configurations
    iconClsBomb: "gol-icon-bomb",
    iconClsRewind: "gol-icon-rewind",
    iconClsPlay: "gol-icon-play",
    iconClsPause: "gol-icon-pause",
    iconClsNext: "gol-icon-next",
    
    initComponent: function() {
        this.items = this.createItems();
        this.callParent();
    },
    
    /**
     * Triggers the next generation of Cells.
     */
    triggerNextGeneration: function() {
        this.gridController.nextGeneration();
    },
    
    /**
     * Returns whether or not the Toolbar is "playing".
     * @return {Boolean}
     */
    isPlaying: function() {
        return !!this.intervalId;
    },
    
    createItems: function() {
        return [
            this.createIconButton(this.iconClsBomb, this.onBombClick),
            "-",
            this.createIconButton(this.iconClsRewind, this.onRewindClick),
            this.createIconButton(this.iconClsPlay, this.onPlayClick),
            this.createIconButton(this.iconClsNext, this.onNextClick),
            "-",
        {
            xtype: "golmenubutton",
            registry: GOL.cell.Registry,
            text: "Cell Type",
            selectHandler: this.onCellTypeSelect,
            scope: this
        }, "-", {
            xtype: "golmenubutton",
            itemId: "patternMenu",
            registry: GOL.pattern.Registry,
            text: "Pattern",
            selectHandler: this.onPatternSelect,
            scope: this
        }, "->", {
            xtype: "tbtext",
            text: "Generations: 0"
        }];
    },
    
    createIconButton: function(iconCls, handler) {
        return Ext.create("Ext.button.Button", {
            iconCls: iconCls,
            handler: handler,
            scope: this
        });
    },
    
    onBombClick: function() {
        this.gridController.killCells();
    },
    
    onRewindClick: function() {
        this.gridController.applyPattern(this.down("#patternMenu").getValue());
    },
    
    onPlayClick: function(button) {
        if (!this.isPlaying()) {
            button.setIconCls(this.iconClsPause);
            this.intervalId = setInterval(Ext.bind(this.triggerNextGeneration, this), this.millisPerIteration);
        } else {
            button.setIconCls(this.iconClsPlay);
            clearInterval(this.intervalId);
            delete this.intervalId;
        }
    },
    
    onNextClick: function() {
        if (!this.isPlaying()) {
            this.triggerNextGeneration();
        }
    },
    
    onPatternSelect: function(menuButton, register) {
        this.gridController.applyPattern(register.getValue());
    },
    
    onCellTypeSelect: function(menuButton, register) {
    }
});