Ext.ns("GOL");

/**
 * @class GOL.Window
 * @extends Ext.Window
 *
 * A window that contains a GameOfLife and a Toolbar to interact with it.
 *
 * @cfg {Object} golConfig (optional) Configurations used to create the GameOfLife.
 */
GOL.Window = Ext.extend(Ext.window.Window, {
    title: "Conway's Game of Life",
    
    // private
    initComponent: function() {
        this.gameOfLife = new GOL.GameOfLife(this.golConfig || {});
        this.toolbar = new GOL.Toolbar({
            gameOfLife: this.gameOfLife
        });
        
        Ext.apply(this, {
            constrain: true,
            closable: false,
            resizable: false,
            items: [this.gameOfLife],
            bbar: this.toolbar,
            tools: [{
                type: "help",
                handler: this.toolbar.showHelp,
                scope: this.toolbar
            }]
        });
        
        GOL.Window.superclass.initComponent.call(this);
    },
    
    // private
    afterRender: function() {
        GOL.Window.superclass.afterRender.apply(this, arguments);
        
        var size = GOL.Constants.CELL_SIZE;
        var width = this.gameOfLife.cols * size, height = this.gameOfLife.rows * size;
        var offsetWidth = this.el.getBorderWidth("lr") + this.el.getFrameWidth("lr");
        var offsetHeight = this.el.getBorderWidth("tb") + this.el.getFrameWidth("tb") + this.toolbar.getHeight() + this.header.getHeight();
        
        this.setSize(width + offsetWidth, height + offsetHeight);
    },
    
    // private
    show: function() {
        GOL.Window.superclass.show.apply(this, arguments);
        
        this.gameOfLife.init();
    }
});
