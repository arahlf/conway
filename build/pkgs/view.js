Ext.define("GOL.view.TableMarkupFactory", {
    singleton: true,
    
    getMarkupHtml: function(cellPrefix, rows, cols) {
        var rowsArray = this.createList(0, rows);
        var colsArray = this.createList(0, cols);
        
        var colTpl = new Ext.XTemplate('<tpl for="cols"><td id="{[parent.prefix]}-{[parent.row]}-{.}"></td></tpl>');
        var rowTpl = new Ext.XTemplate('<tpl for="rows"><tr>{[this.getCellMarkup()]}</tr></tpl>', {
            rowCount: 0,
            
            getCellMarkup: function() {
                return colTpl.apply({cols: colsArray, prefix: cellPrefix, row: this.rowCount++});
            }
        });
        
        return rowTpl.apply({rows: rowsArray});
    },
    
    createList: function(start, stop) {
        for (var list=[], i=start; i<stop; i++) {
            list.push(i);
        }
        return list;
    }
});
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
        this.loadingView = this.createLoadingView();
        this.gridView = this.createGridView();
        
        Ext.apply(this, {
            cellControllers: [],
            width: this.cellSize * this.model.getCols(),
            height: this.cellSize * this.model.getRows(),
            layout: "card",
            activeItem: 0,
            items: [this.loadingView, this.gridView]
        });
        
        this.model.on("reconfigure", this.onReconfigure, this);
        
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
    
    onReconfigure: function() {
        this.fireEvent("beforeload");
        this.getLayout().setActiveItem(this.loadingView);
        
        this.loadedRows = 0;
        
        Ext.destroy(this.cellControllers);
        this.cellControllers = [];
        
        this.addRow();
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
            this.getLayout().setActiveItem(this.gridView);
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
    }
});

/**
 * @class GOL.view.Cell
 */
Ext.define("GOL.view.Cell", {
    
    mixins: {
        observable: "Ext.util.Observable"
    },
    
    constructor: function(model, el) {
        this.callParent();
        
        this.el = el;
        this.model = model;
        this.model.on("commit", this.updateView, this);
        this.updateView();
    },
    
    /**
     * Gets the view's Element.
     * @return {Ext.core.Element}
     */
    getEl: function() {
        return this.el;
    },
    
    /**
     * Gets the view's model.
     * @return {GOL.model.Cell}
     */
    getModel: function() { // needed?
        return this.model;
    },
    
    destroy: function() {
        var me = this;
        me.clearListeners();
        me.el.dom.className = "";
        me.el = null;
        me.model = null;
    },
    
    /**
     * Method called whenever the view needs to be updated, typically
     * needed after the internal model's state has been committed.
     */
    updateView: GOL.abstractFn
});
/**
 * @class GOL.view.BinaryCell
 * @extends GOL.view.Cell
 * @constructor
 * @param {GOL.model.Cell} model A cell model.
 */
Ext.define("GOL.view.BinaryCell", {
    extend: "GOL.view.Cell",
    
    aliveCls: "gol-cell-alive",
    deadCls: "gol-cell-dead",
    
    updateView: function() {
        // profiler shows directly setting the DOM className is at
        // least twice as fast as using Element's addCls + removeCls
        var dom = this.getEl().dom;
        
        if (this.model.isAlive()) {
            dom.className = this.aliveCls;
        }
        else {
            dom.className = this.deadCls;
        }
    }
});

/**
 * @class GOL.view.AgingCell
 * @extends GOL.view.Cell
 * @constructor
 * @param {GOL.model.Cell} model A cell model.
 */
Ext.define("GOL.view.AgingCell", {
    extend: "GOL.view.Cell",
    
    updateView: function() {
        var dom = this.getEl().dom;
        
        if (this.model.isAlive()) {
            dom.className = "gol-cell-alive gol-cell-aging";
            dom.style.backgroundColor = this.getAgeAsColor();
        }
        else {
            dom.className = "gol-cell-dead";
            dom.style.backgroundColor = "transparent";
        }
    },

    /**
     * Creates an RGB color string to represent the Cell based on its age.
     */
    getAgeAsColor: function() {
        var code = Math.max(255 - (this.getModel().getAge() * 15), 75);
        
        return Ext.String.format("rgb({0}, {1}, {2})", code, code, code);
    },
    
    destroy: function() {
        this.getEl().dom.style.backgroundColor = "transparent";
        this.callParent();
    }
});
/**
 * @class GOL.view.AgingCell
 * @extends GOL.view.Cell
 * @constructor
 * @param {GOL.model.Cell} model A cell model.
 */
Ext.define("GOL.view.RainbowCell", {
    extend: "GOL.view.AgingCell",
    
    colors: ["#dd0000", "#fe6230", "#fef600", "#00bc00", "#009bfe", "#000083", "#30009b"],
    
    getAgeAsColor: function() {
        return this.colors[this.model.getAge() - 1];
    }
});
Ext.ns("GOL.view");

GOL.view.CellFactory = {
    /**
     * Determines and creates the appropriate view for the given model.
     */
    create: function(model, renderTo) {
        var name = model.$className.replace(/^GOL\.model/, "GOL.view");
        var constructor = Ext.ClassManager.get(name);
        
        if (constructor !== null) {
            return new constructor(model, renderTo);
        }
        
        throw new Error("Could not determine view for model of type: " + model.$className);
    }
};
