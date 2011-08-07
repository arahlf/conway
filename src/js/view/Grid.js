/**
 * @class GOL.view.Grid
 * @extends Ext.container.Container
 * @cfg {GOL.model.Grid} model The Grid's model.
 */
Ext.define('GOL.view.Grid', {
    extend: 'Ext.container.Container',
    
    cellSize: 12,
    mouseDown: false,
    
    initComponent: function() {
        this.loadingView = this.createLoadingView();
        this.gridView = this.createGridView();
        
        Ext.apply(this, {
            cellControllers: [],
            width: this.cellSize * this.model.getCols(),
            height: this.cellSize * this.model.getRows(),
            layout: 'card',
            activeItem: 0,
            items: [this.loadingView, this.gridView]
        });
        
        this.addEvents(
            /**
             * @event beforeload
             */
            'beforeload',
            
            /**
             * @event load
             */
            'load',
            
            /**
             * @event cellmousedown
             * @param {GOL.controller.Cell}
             */
            'cellmousedown',
            
            /**
             * @event cellmouseover
             * @param {GOL.controller.Cell}
             */
            'cellmouseover'
        );
        
        this.mon(this.model, 'reconfigure', this.onReconfigure, this);
        
        this.callParent();
    },
    
    createLoadingView: function() {
        return Ext.create('widget.container', {
            layout: {
                type: 'hbox',
                pack: 'center',
                align: 'middle'
            },
            items: {
                xtype: 'progressbar',
                animate: false,
                text: 'Loading...',
                width: 300
            }
        });
    },
    
    createGridView: function() {
        return Ext.create('GOL.view.Table', {
            cls: 'gol-grid',
            rows: this.model.getRows(),
            cols: this.model.getCols()
        });
    },
    
    onRender: function() {
        this.callParent(arguments);
        
        this.loadedRows = 0;
        
        Ext.defer(function() {
            this.fireEvent('beforeload');
            
            this.mon(this.gridView.el, 'mousedown', this.onTableCellMouseDown, this, { delegate: 'td' });
            this.mon(this.gridView.el, 'mouseover', this.onTableCellMouseOver, this, { delegate: 'td' });
            
            Ext.defer(this.addRow, 50, this);
        }, 100, this);
    },
    
    onReconfigure: function() {
        this.fireEvent('beforeload');
        this.getLayout().setActiveItem(this.loadingView);
        
        this.loadedRows = 0;
        
        Ext.destroy(this.cellControllers);
        this.cellControllers = [];
        
        this.addRow();
    },
    
    addRow: function() {
        var model = this.model;
        var tableCells = this.gridView.el.select('tr:nth(' + (this.loadedRows + 1) + ') td');
        var row = [];
        
        tableCells.each(function(tableCell, composite, index) {
            var cell = new GOL.controller.Cell(model.getCell(this.loadedRows, index), Ext.get(tableCell.dom));
            row.push(cell);
        }, this);
        
        this.cellControllers.push(row);
        this.loadedRows++;
        
        this.loadingView.down('progressbar').updateProgress(this.loadedRows / model.getRows());
        
        if (this.loadedRows < model.getRows()) {
            Ext.Function.defer(this.addRow, 10, this);
        }
        else {
            this.getLayout().setActiveItem(this.gridView);
            this.fireEvent('load');
        }
    },
    
    onTableCellMouseDown: function(event, target) {
        event.preventDefault();
        this.fireEvent('cellmousedown', this.getCellFromTarget(target));
        
    },
    
    onTableCellMouseOver: function(event, target) {
        event.preventDefault();
        this.fireEvent('cellmouseover', this.getCellFromTarget(target));
    },
    
    getCellFromTarget: function(target) {
        var match = target.id.match(/-(\d+)-(\d+)$/); // ex: id='ext-comp-1015-cell-12-4'
        
        return this.cellControllers[parseInt(match[1], 10)][parseInt(match[2], 10)];
    },
    
    destroy: function() {
        Ext.destroy(this.cellControllers);
    }
});
