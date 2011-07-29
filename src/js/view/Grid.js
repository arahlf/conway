/**
 * @class GOL.view.Grid
 * @extends Ext.container.Container
 * @cfg {GOL.model.Grid} model The Grid's model.
 */
Ext.define("GOL.view.Grid", {
    extend: "Ext.container.Container",
    
    cellSize: 12,
    mouseDown: false,
    
    initComponent: function() {
        var cellSize = this.cellSize, model = this.model;
        
        this.loadingView = this.createLoadingView();
        this.gridView = this.createGridView();
        this.cellControllers = [];
        
        Ext.apply(this, {
            width: cellSize * model.getCols(),
            height: cellSize * model.getRows(),
            layout: "card",
            activeItem: 0,
            items: [this.loadingView, this.gridView]
        });
        
        this.callParent();
    },
    
    createLoadingView: function() {
        return Ext.create("widget.container", {
            layout: {
                type: "hbox",
                pack: "center",
                align: "middle"
            },
            items: {
                xtype: "progressbar",
                animate: false,
                text: "Loading...",
                width: 300
            }
        });
    },
    
    createGridView: function() {
        return Ext.create("Ext.Component", {
            renderTpl: '<table class="gol-grid"><tbody></tbody></table>',
            renderSelectors: {
                tableEl: "table.gol-grid",
                tbodyEl: "table.gol-grid > tbody"
            }
        });
    },
    
    onRender: function() {
        this.callParent(arguments);
        
        this.loadedRows = 0;
        
        Ext.defer(function() {
            this.fireEvent("beforeload");
            this.gridView.tbodyEl.update(GOL.view.TableMarkupFactory.getMarkupHtml(this.id + "-cell", this.model.getRows(), this.model.getCols()));
            
            this.gridView.el.on("mousedown", this.onTableCellMouseDown, this, { delegate: "td" });
            this.gridView.el.on("mouseover", this.onTableCellMouseOver, this, { delegate: "td" });
            
            Ext.defer(this.addRow, 50, this);
        }, 100, this);
    },
    
    addRow: function() {
        var model = this.model;
        
        var tableCells = this.gridView.tbodyEl.select("tr:nth(" + (this.loadedRows + 1) + ") td");
        
        var row = [];
        
        tableCells.each(function(tableCell, composite, index) {
            var cell = new GOL.controller.Cell(model.getCell(this.loadedRows, index), Ext.get(tableCell.dom));
            row.push(cell);
        }, this);
        
        this.cellControllers.push(row);
        this.loadedRows++;
        
        this.loadingView.down("progressbar").updateProgress(this.loadedRows / model.getRows());
        
        if (this.loadedRows < model.getRows()) {
            Ext.Function.defer(this.addRow, 10, this);
        }
        else {
            this.getLayout().next();
            this.fireEvent("load"); // TODO document events
        }
    },
    
    onTableCellMouseDown: function(event, target) {
        event.preventDefault();
        this.fireEvent("cellmousedown", this.getCellFromTarget(target));
        
    },
    
    onTableCellMouseOver: function(event, target) {
        event.preventDefault();
        this.fireEvent("cellmouseover", this.getCellFromTarget(target));
    },
    
    getCellFromTarget: function(target) {
        var match = target.id.match(/cell-(\d+)-(\d+)/); // ex: id="ext-comp-1015-cell-12-4"
        
        return this.cellControllers[parseInt(match[1], 10)][parseInt(match[2], 10)];
    },
    
    destroy: function() {
        Ext.destroy(this.cellControllers);
    },
    
    reconfigure: function(cellFactory) {
        
    }
});
