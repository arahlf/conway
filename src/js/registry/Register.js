/**
 * @class GOL.registry.Register
 * @extends Ext.data.Model
 * An entry in a Registry, representing a simple name/value pair.
 */
Ext.define("GOL.registry.Register", {
    extend: "Ext.data.Model",
    fields: ["name", "value"],
    
    getName: function() {
        return this.get("name");
    },
    
    getValue: function() {
        return this.get("value");
    }
});