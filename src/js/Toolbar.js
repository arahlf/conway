/**
 * @class GOL.Toolbar
 * @extends Ext.toolbar.Toolbar
 * @cfg {GOL.controller.Grid} gridController
 * A Toolbar used to interact with a {@link GOL.controller.Grid}.
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
        Ext.apply(this, {
            // buttons
            bombButton: this.createIconButton(this.iconClsBomb, this.onBombClick),
            rewindButton: this.createIconButton(this.iconClsRewind, this.onRewindClick),
            playButton: this.createIconButton(this.iconClsPlay, this.onPlayClick),
            nextButton: this.createIconButton(this.iconClsNext, this.onNextClick),
            // menus
            cellTypeMenu: this.createMenuButton(GOL.cell.Registry, "Cell Type", this.onCellTypeSelect, this),
            patternMenu: this.createMenuButton(GOL.pattern.Registry, "Pattern", this.onPatternSelect, this),
            // status text
            statusText: this.createStatusText()
        });
        
        this.items = this.getItems();
        this.gridController.on("generationchange", this.updateStatusText, this);
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
    
    createStatusText: function() {
        return Ext.create("Ext.Component", {
            width: 175,
            cls: "gol-status-text",
            html: "Generations: 0"
        });
    },
    
    getItems: function() {
        return [
            this.bombButton, "-",
            this.rewindButton, this.playButton, this.nextButton, "-",
            this.cellTypeMenu, "-",
            this.patternMenu, "->",
            this.statusText
        ];
    },
    
    createIconButton: function(iconCls, handler) {
        return Ext.create("Ext.button.Button", {
            iconCls: iconCls,
            handler: handler,
            scope: this
        });
    },
    
    createMenuButton: function(registry, text, selectHandler, scope) {
        return Ext.create("GOL.registry.MenuButton", {
            registry: registry,
            text: text,
            selectHandler: selectHandler,
            scope: scope
        });
    },
    
    onBombClick: function() {
        if (this.isPlaying()) {
            this.stopPlaying();
        }
        this.gridController.killAllCells();
    },
    
    onRewindClick: function() {
        if (this.isPlaying()) {
            this.stopPlaying();
        }
        this.gridController.applyPattern(this.patternMenu.getValue());
    },
    
    updateStatusText: function(count) {
        this.statusText.el.dom.innerHTML = "Generations: " + count;
    },
    
    onPlayClick: function() {
        if (this.isPlaying()) {
            this.stopPlaying();
        } else {
            this.startPlaying();
        }
    },
    
    startPlaying: function() {
        this.playButton.setIconCls(this.iconClsPause);
        this.intervalId = setInterval(Ext.bind(this.triggerNextGeneration, this), this.millisPerIteration);
    },
    
    stopPlaying: function() {
        this.playButton.setIconCls(this.iconClsPlay);
        clearInterval(this.intervalId);
        this.intervalId = null;
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
        this.gridController.reconfigure(register.getValue());
        this.gridController.applyPattern(this.patternMenu.getValue());
    }
});