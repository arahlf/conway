/**
 * @class GOL.view.Grid
 * @extends Ext.Component
 * @cfg {GOL.model.Grid} model The Grid's model.
 */
Ext.define("GOL.view.Grid", {
    extend: "Ext.container.Container",
    
    cellSize: 12,
    mouseDown: false,
    
    initComponent: function() {
        var cellSize = this.cellSize, model = this.model;
        
        // normalize initialization here...
        this.progressBar = this.createProgressBar();
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
    
    createProgressBar: function() {
        return new Ext.ProgressBar({
            animate: false,
            text: "Loading...",
            width: 300
        });
    },
    
    createLoadingView: function() {
        return Ext.create("widget.container", {
            layout: {
                type: "hbox",
                pack: "center",
                align: "middle"
            },
            items: this.progressBar
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
            this.gridView.tbodyEl.update(GOL.view.TableMarkupFactory.getMarkupHtml(this.id + "cell", this.model.getRows(), this.model.getCols()));
            
            Ext.defer(this.addRow, 50, this);
        }, 100, this);
    },
    
    addRow: function() {
        var model = this.model;
        
        var cells = this.gridView.tbodyEl.select("tr:nth(" + this.loadedRows + ") td");
        
        cells.each(function(cell, composite, index) {
            console.log(index);
            var cell = new GOL.controller.Cell(model.getCell(this.loadedRows, index), Ext.get(cell));
            this.cellControllers.push(cell);
            this.attachListeners(cell);
        }, this);
        
        this.loadedRows++;
        
        this.progressBar.updateProgress(this.loadedRows / model.getRows());
        
        if (this.loadedRows < model.getRows()) {
            Ext.Function.defer(this.addRow, 15, this);
        }
        else {
            this.getLayout().next();
            this.fireEvent("load"); // TODO document events
        }
    },
    
    attachListeners: function(cell) {
        // TODO use delegates instead
        cell.getView().on("mousedown", function() {
            this.fireEvent("cellmousedown", cell);
        }, this);
        cell.getView().on("mouseover", function() {
            this.fireEvent("cellmouseover", cell);
        }, this);
    },
    
    destroy: function() {
        Ext.destroy(this.cellControllers);
    },
    
    reconfigure: function(cellFactory) {
        
    }
});
