/**
 * @class GOL.cells.CellRegistry
 */
Ext.define("GOL.cells.CellRegistryImpl", {
    
    constructor: function() {
        this.cells = {};
    },
    
    /**
     * Registers a Cell type.
     * @param {Constructor} cls
     */
    register: function(cls) {
        
    }
});

GOL.cells.CellRegistry = new GOL.cells.CellRegistryImpl();