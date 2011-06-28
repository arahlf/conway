Ext.define("Model", {
    extend: "Ext.data.Model",
    fields: ["name", "value"]
});

var store = Ext.create("Ext.data.Store", {
    model: "Model",
    data: [{name: "Foo", value: "foo"}, {name: "Bar", value: "bar"}]
});

Ext.onReady( function() {
    
    wnd = Ext.create("Ext.window.Window", {
        title: "Foo",
        width: 400,
        height: 200,
        bbar: {
            items: [{
                xtype: "combo",
                id: "c",
                store: store,
                displayField: "name",
                valueField: "value",
                queryMode: "local"
            }]
        }
    });
    
    wnd.show();

});

            me.mon(store, {
                scope: me,
                datachanged: me.onDataChanged,
                add: me.onAdd,
                remove: me.onRemove,
                update: me.onUpdate,
                clear: me.refresh
            });