/**
 * @class GOL.Application
 * @extends Ext.window.Window
 */
Ext.define("GOL.Application", {
    extend: "Ext.window.Window",
    
    closable: false,
    constrain: true,
    resizable: false,
    
    iconClsBomb: "gol-icon-bomb",
    iconClsNext: "gol-icon-next",
    iconClsPause: "gol-icon-pause",
    iconClsPlay: "gol-icon-play",
    iconClsRewind: "gol-icon-rewind",
    
    millisPerIteration: 50,
    
    initComponent: function() {
        // clean up all these shorcuts...
        var model = new GOL.model.Grid(this.rows, this.cols, new GOL.rules.StandardRules());
        model.configure(new GOL.cell.BinaryCellFactory());
        model.applyPattern(GOL.pattern.Registry.getDefaultValue());

        this.gridModel = model;
        
        // slow performance
        // - component query every time
        // - triggers a layout of the toolbar... fires "afterlayout"
        // this.gridModel.on("generationchange", function(grid, count) {
            // this.down("toolbar tbtext").setText("Generations: " + count);
        // }, this);

        this.gridController = new GOL.controller.Grid(model);

        
        this.toolbar = this.createToolbar();

        var view = this.gridController.getView();
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
        
        this.playTask = {
            run: this.nextGeneration
        };

        this.callParent();
    },

    launch: function() {
        this.show();
    },

    createToolbar: function() {
        return Ext.create("Ext.toolbar.Toolbar", {
            items: [
                this.createIconButton(this.iconClsBomb, this.gridModel.kill, this.gridModel),
                "-",
                this.createIconButton(this.iconClsRewind, this.onRewind, this),
                this.createIconButton(this.iconClsPlay, this.onPlayClick, this),
                this.createIconButton(this.iconClsNext, this.gridModel.nextGeneration, this.gridModel),
                "-",{
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
            }, "->",{
                xtype: "tbtext",
                text: "Generations: 0"
            }]
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
            msg:
            "A implementation of Conway's Game of Life using JavaScript and Ext JS 4 in the " +
            "MVC paradigm.<br /><br />" +
            "<p>For details behind Conway's Game of Life, see " + wikiLink + ".<br /><br />" +
            "<p>Directions: Use the controls on the bottom toolbar to configure the grid. " +
            "Click and drag over Cells to bring them back to life.<br /><br />" +
            "By: Alan Rahlf"
        });
    },
    
    onRewind: function() {
        this.gridModel.applyPattern(this.down("#patternMenu").getValue());
    },

    onPatternSelect: function(menuButton, register) {
        this.gridModel.applyPattern(register.getValue());
    },

    onCellTypeSelect: function(menuButton, register) {
    },
    
    onPlayClick: function(button) {
        var me = this;
        var run = function() {
            me.gridModel.nextGeneration();
            queueRun();
        };
        var queueRun = function() {
            me.timeout = setTimeout(run, me.millisPerIteration);
        };
        
        if (this.playing !== true) {
            button.setIconCls(this.iconClsPause);
            this.playing = true;

            if (!this.timeout) {
                this.timeout = setTimeout(run, this.millisPerIteration);
            }
        }
        else {
            button.setIconCls(this.iconClsPlay);
            this.playing = false;
            clearTimeout(this.timeout);
            delete this.timeout;
        }
    },
    
    /**
     * An asynchronous, recursive task that spawns the next cell generation. 
     */
    playTask: function() {
        this.gridModel.nextGeneration();
        
        Ext.TaskManager.start({
            run: this.playTask 
        });
    },
    
    createIconButton: function(iconCls, handler, scope) {
        return Ext.create("Ext.button.Button", {
            iconCls: iconCls,
            handler: handler,
            scope: scope
        });
    }
});