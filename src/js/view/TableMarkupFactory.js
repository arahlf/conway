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