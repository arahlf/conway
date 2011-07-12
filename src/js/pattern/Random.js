/**
 * @class GOL.pattern.Random
 * @extends GOL.pattern.Pattern A pattern that randomly (50/50) either kills or revives a Cell.
 */
Ext.define("GOL.pattern.Random", {
    extend: "GOL.pattern.Pattern",
    
    /**
     * {@link GOL.pattern.Pattern#applyPattern} implementation
     */
    applyPattern: function(grid) {
        grid.eachCell(function(cell) {
            if (Math.random() > 0.5) {
                cell.kill();
            }
            else {
                cell.revive();
            }
            cell.commit();
        });
    }
});

GOL.registerPattern("Random", new GOL.pattern.Random());