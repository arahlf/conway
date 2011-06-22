/**
 * @class GOL.PlayButton
 * @extends Ext.Button
 *
 * A simple button class toggles its visual state between
 * a play and pause icon.
 *
 * @cfg {Function} playHandler
 * @cfg {Function} pauseHandler
 */
Ext.define("GOL.PlayButton", {
    extend: "Ext.Button",
    alias: "widget.playbutton",
    
    // private
    initComponent: function() {
        this.icon = GOL.icons.PLAY;
        
        this.on("click", function() {
            if (this.icon == GOL.icons.PLAY) {
                this.playHandler.call(this.scope || this);
                this.setIcon(GOL.icons.PAUSE);
            }
            else {
                this.pauseHandler.call(this.scope || this);
                this.setIcon(GOL.icons.PLAY);
            }
        });
        
        GOL.PlayButton.superclass.initComponent.call(this);
    },
    
    /**
     * Resets the button back to the 'play' state.
     */
    reset: function() {
        this.setIcon(GOL.icons.PLAY);
    }
});
