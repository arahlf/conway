/**
 * @class GOL.Application
 * @extends Ext.window.Window
 */
Ext.define('GOL.Application', {
    extend: 'Ext.window.Window',
    
    closable: false,
    constrain: true,
    resizable: false,
    
    initComponent: function() {
        var factory = GOL.model.factory.Registry.firstValue();
        
        this.gridController = new GOL.controller.Grid(this.rows, this.cols, factory, this.rules);
        this.gridController.applyPattern(GOL.pattern.Registry.firstValue());
        
        this.toolbar = this.createToolbar();
        
        var view = this.gridController.getView();
        
        // disable the toolbar while loading
        view.on('beforeload', this.toolbar.disable, this.toolbar);
        view.on('load', this.toolbar.enable, this.toolbar);

        Ext.apply(this, {
            title: 'Conway\'s Game of Life',
            items: view,
            tools: [{
                type: 'help',
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
        return Ext.create('GOL.Toolbar', {
            gridController: this.gridController
        });
    },

    /**
     * Displays the help/about dialog.
     */
    showHelp: function() {
        var wikiLink = '<a href="http://en.wikipedia.org/wiki/Conways_Game_of_Life" target="_blank">Wikipedia</a>';

        Ext.Msg.show({
            title: 'Help',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.QUESTION,
            width: 450,
            msg: 'A implementation of Conway\'s Game of Life using JavaScript and Ext JS 4 in the MVC paradigm.<br /><br />' +
                 '<p>For details behind Conway\'s Game of Life, see ' + wikiLink + '.<br /><br />' +
                 '<p>Directions: Use the controls on the bottom toolbar to configure the grid. ' +
                 'Click and drag over Cells to bring them back to life.<br /><br />' +
                 'By: Alan Rahlf'
        });
    }
});