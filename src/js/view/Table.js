/**
 * @class GOL.view.Table
 * @extends Ext.Component
 * 
 * A utility class for creating an empty HTML table.  Each table cell will
 * have an auto-generated id in the format of: '{id}-{row}-{col}'.
 * 
 * @cfg {Number} rows (required)
 * @cfg {Number} cols (required)
 */
Ext.define('GOL.view.Table', {
    extend: 'Ext.Component',
    
    autoEl: 'table',
    
    renderTpl: new Ext.XTemplate('<tbody><tpl for="rows">{[this.getRowMarkup(parent, xindex -1)]}</tpl></tbody>', {
        
        rowTpl: new Ext.XTemplate('<tr><tpl for="cols"><td id="{parent.prefix}-{parent.row}-{.}"></td></tpl></tr>'),
        
        getRowMarkup: function(values, row) {
            return this.rowTpl.apply({prefix: values.id, cols: values.cols, row: row});
        }
    }),
    
    initComponent: function() {
        this.renderData.rows = this.createList(0, this.rows);
        this.renderData.cols = this.createList(0, this.cols);
        
        this.callParent();
    },
    
    // simple utility to create a list
    createList: function(start, stop) {
        for (var list=[], i=start; i<stop; i++) {
            list.push(i);
        }
        return list;
    }
});