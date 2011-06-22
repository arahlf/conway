Ext.define("GOL.Application", {
    extend: "Ext.window.Window",
    
    closable: false,
    constrain: true,
    resizable: false,
    
    playSpeed: 1,
    
    initComponent: function() {
        // clean up all these shorcuts...
        var model = new GOL.model.Grid(this.rows, this.cols, GOL.rules.Registry.getDefaultValue());
        model.configure(new GOL.cell.BinaryCellFactory());
        model.applyPattern(GOL.pattern.Registry.getDefaultValue());

        this.gridModel = model;
        
        // slow performance
        // - component query every time
        // - triggers a layout of the toolbar... fires "afterlayout"
        this.gridModel.on("generationchange", function(grid, count) {
            this.down("toolbar tbtext").setText("Generations: " + count);
        }, this);

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
                this.createIconButton(GOL.icons.BOMB, this.gridModel.kill, this.gridModel),
                "-",
                this.createIconButton(GOL.icons.REWIND, this.onRewind, this),
                this.createIconButton(GOL.icons.PLAY, this.onPlayClick, this),
                this.createIconButton(GOL.icons.NEXT, this.gridModel.nextGeneration, this.gridModel),
                "-",{
                xtype: "golmenubutton",
                registry: GOL.cell.Registry,
                text: "Cell Type",
                selectHandler: this.onCellTypeSelect,
                scope: this
            }, "-", {
                xtype: "golmenubutton",
                registry: GOL.pattern.Registry,
                text: "Pattern",
                selectHandler: this.onPatternSelect,
                scope: this
            }, "-", {
                xtype: "golmenubutton",
                registry: GOL.rules.Registry,
                text: "Rules",
                selectHandler: this.onRulesSelect,
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
        throw new Error("TODO - store pattern or let it be extracted somehow.");
        this.gridModel.applyPattern();
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
            me.timeout = setTimeout(run, me.playSpeed * 25);
        };
        
        if (!this.playing === true) {
            button.setIcon(GOL.icons.PAUSE);
            this.playing = true;
            
            if (!this.timeout) {
                this.timeout = setTimeout(run, this.playSpeed * 25);
            }
        }
        else {
            button.setIcon(GOL.icons.PLAY);
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
    
    createIconButton: function(icon, handler, scope) {
        return Ext.create("Ext.button.Button", {
            icon: icon,
            handler: handler,
            scope: scope
        });
    }
});