/**
 * @class GOL
 */
GOL = {
    /**
     * Similar to Ext.emptyFn, except will throw an error if called.
     * This is used to better simulate interfaces/abstract classes.
     */
    abstractFn: function() {
        throw new Error("Abstract function called directly.");
    },
    
    /**
     * Mimics the concept of the UnsupportedOperationException in Java.
     * @param {String} message
     * @return {Function} A function that will error with the given message.
     */
    unsupportedFn: function(message) {
        return function() {
            throw new Error("Unsupported operation: " + message);
        };
    }
};

/**
 * @class GOL.Application
 * @extends Ext.window.Window
 */
Ext.define("GOL.Application", {
    extend: "Ext.window.Window",
    
    closable: false,
    constrain: true,
    resizable: false,
    
    initComponent: function() {
        var factory = new GOL.model.factory.AgingCellFactory();
        var rules = new GOL.rules.StandardRules();

        this.gridController = new GOL.controller.Grid(this.rows, this.cols, factory, rules);
        this.gridController.applyPattern(GOL.pattern.Registry.getDefaultValue());
        
        this.toolbar = this.createToolbar();

        var view = this.gridController.getView();
        
        // disable the toolbar while loading
        view.on("beforeload", this.toolbar.disable, this.toolbar);
        view.on("load", this.toolbar.enable, this.toolbar);

        Ext.apply(this, {
            title: "Conway's Game of Life",
            items: view,
            tools: [{
                type: "help",
                handler: this.showHelp,
                scope: this
            }],
            bbar: this.toolbar
        });
        
        this.callParent();
    },
    
    /**
     * Launches the application.
     */
    launch: function() {
        this.show();
    },

    createToolbar: function() {
        return Ext.create("GOL.Toolbar", {
            gridController: this.gridController
        });
    },

    /**
     * Displays the help/about dialog.
     */
    showHelp: function() {
        var wikiLink = '<a href="http://en.wikipedia.org/wiki/Conways_Game_of_Life" target="_blank">Wikipedia</a>';

        Ext.Msg.show({
            title: "Help",
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.QUESTION,
            width: 450,
            msg: "A implementation of Conway's Game of Life using JavaScript and Ext JS 4 in the MVC paradigm.<br /><br />" +
                 "<p>For details behind Conway's Game of Life, see " + wikiLink + ".<br /><br />" +
                 "<p>Directions: Use the controls on the bottom toolbar to configure the grid. " +
                 "Click and drag over Cells to bring them back to life.<br /><br />" +
                 "By: Alan Rahlf"
        });
    }
});
/**
 * @class GOL.Toolbar
 * @extends Ext.toolbar.Toolbar
 * @cfg {GOL.controller.Grid} gridController
 * A Toolbar used to interact with a {@link GOL.model.Grid}.
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
        var tbarText = Ext.create("Ext.toolbar.TextItem", {
            text: "Generations: 0"
        });
        
        /* TODO slow performance
        this.gridController.on("generationchange", function(count) {
            tbarText.setText("Generations: " + count);
        });
        */
        
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
        }, "->", tbarText];
    },
    
    createIconButton: function(iconCls, handler) {
        return Ext.create("Ext.button.Button", {
            iconCls: iconCls,
            handler: handler,
            scope: this
        });
    },
    
    onBombClick: function() {
        this.gridController.killAllCells();
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
        this.gridController.reconfigure(register.getValue());
        this.gridController.applyPattern(this.down("#patternMenu").getValue()); // duplicate
    }
});
