/**
 * A specialized button that contains a menu, whose items are created
 * from the contents of the configured Registry's store.  Currently, the
 * menu items are only created upon initialization, a future possibility
 * is to listen for store events and update the menu items accordingly.
 * @cfg {GOL.registry.Registry} registry
 * @cfg {Function} selectHandler Shortcut for adding a "select" listener.
 */


// probably shouldn't enforce a default value, should be injected instead
// figure out how to add tooltips on a menu item

Ext.define("GOL.registry.MenuButton", {
    extend: "Ext.button.Button",
    
    initComponent: function() {
        var menuItems = [], store = this.registry.getStore();
        
        store.each(function(register) {
            menuItems.push({ register: register, text: register.get("name") });
        });
        
        Ext.apply(this, {
            labelText: this.text, // stored for later use when a menu item is selected
            menu: {
                items: menuItems,
                listeners: {
                    click: this.onMenuItemClick,
                    scope: this
                }
            }
        });
        
        this.addEvents(
            /**
             * Fired when a new menu item is selected.
             * @event select
             * @param {GOL.registry.MenuButton} this
             * @param {GOL.registry.Register} register
             */
            "select"
        );
        
        // attach the shortcut listener, if present
        if (Ext.isFunction(this.selectHandler)) {
            this.on("select", this.selectHandler, this.scope);
        }
        
        // assign a default value
        this.setSelectedRegister(store.first(), true);
        
        this.callParent();
    },
    
    onMenuItemClick: function(menu, item, e) {
        this.setSelectedRegister(item.register);
    },
    
    /**
     * Sets the currently selected Register.
     * @param {GOL.registry.Register} register
     * @param {Boolean} silent (optional) True to prevent the select event from
     * firing.  Defaults to false.
     */
    setSelectedRegister: function(register, silent) {
        if (this.selectedRegister != register) {
            this.selectedRegister = register;
            this.setText(this.labelText + ": " + register.getName());
            
            if (!silent) {
                this.fireEvent("select", this, register);
            }
        }
    },
    
    getValue: function() {
        return this.selectedRegister.getValue();
    }
});