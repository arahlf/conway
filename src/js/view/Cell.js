/**
 * @class GOL.view.Cell
 */
Ext.define("GOL.view.Cell", {
    
    cls: "gol-cell",
    
    mixins: {
        observable: "Ext.util.Observable"
    },
    
    constructor: function(model, el) {
        this.addEvents("click");
        
        this.el = el;
        this.el.addCls(this.cls); // might break subclasses...
        this.el.on("mousedown", this.onMouseDown, this);
        this.el.on("mouseover", this.onMouseOver, this);
        
        this.model = model;
        this.model.on("commit", this.updateView, this);
        
        this.callParent();
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
    getModel: function() {
        return this.model;
    },
    
    destroy: function() {
        var me = this;
        me.clearListeners();
        me.el.dom.className = "";
        me.el = null;
        me.model = null;
    },
    
    onMouseOver: function(e) {
        e.preventDefault();
        this.fireEvent("mouseover", this);
    },
    
    onMouseDown: function(e) {
        e.preventDefault();
        this.fireEvent("mousedown", this);
    },
    
    /**
     * Method called whenever the view needs to be updated, typically
     * after the internal model has been committed.
     */
    updateView: GOL.abstractFn
});