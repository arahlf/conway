/**
 * @class GOL.Toolbar
 * @extends Ext.toolbar.Toolbar
 * @cfg {GOL.model.Grid} grid
 * 
 * A Toolbar used to interact with a {@link GOL.model.Grid}.
 */
Ext.define("GOL.Toolbar", {
    extend: "Ext.toolbar.Toolbar",
    
    // button iconCls configurations
    iconClsBomb: "gol-icon-bomb",
    iconClsRewind: "gol-icon-rewind",
    iconClsPlay: "gol-icon-play",
    iconClsPause: "gol-icon-pause",
    iconClsNext: "gol-icon-next",
    
    millisPerIteration: 50,
    
    initComponent: function() {
        this.items = this.createItems();
        this.callParent();
    },
    
    createItems: function() {
        return [this.createIconButton(this.iconClsBomb, this.onBombClick), "-", this.createIconButton(this.iconClsRewind, this.onRewind), this.createIconButton(this.iconClsPlay, this.onPlayClick), this.createIconButton(this.iconClsNext, this.grid.nextGeneration), "-", {
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
        this.grid.kill();
    },
    
    onRewindClick: function() {
        this.grid.applyPattern(this.down("#patternMenu").getValue());
    },
    
    onPlayClick: function(button) {
        if (!this.intervalId) {
            button.setIconCls(this.iconClsPause);
            var fn = Ext.bind(this.triggerNextGeneration, this);
            this.intervalId = setInterval(fn, this.millisPerIteration);
        } else {
            button.setIconCls(this.iconClsPlay);
            clearInterval(this.intervalId);
            delete this.intervalId;
        }
    },
    
    onNextClick: function() {
        if (!this.intervalId) {
            this.triggerNextGeneration();
        }
    },
    
    onPatternSelect: function(menuButton, register) {
        this.grid.applyPattern(register.getValue());
    },
    
    onCellTypeSelect: function(menuButton, register) {
    },
    
    triggerNextGeneration: function() {
        this.grid.nextGeneration();
    }
});