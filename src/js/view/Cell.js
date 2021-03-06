/**
 * @class GOL.view.Cell
 */
Ext.define('GOL.view.Cell', {
    
    mixins: {
        observable: 'Ext.util.Observable'
    },
    
    constructor: function(model, el) {
        this.callParent();
        
        this.el = el;
        this.model = model;
        this.model.on('commit', this.updateView, this);
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
        me.el.dom.className = '';
        me.el = null;
        me.model = null;
    },
    
    /**
     * Method called whenever the view needs to be updated, typically
     * needed after the internal model's state has been committed.
     */
    updateView: GOL.abstractFn
});