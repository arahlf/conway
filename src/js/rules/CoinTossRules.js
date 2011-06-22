/**
 * @class GOL.rules.CoinTossRules
 * @extends GOL.rules.Rules
 *
 * A rules implementation based on chance.  If the cell is alive, it
 * has a 50/50 chance to persist or be killed, otherwise it has a 50/50
 * chance to be revived.
 */
Ext.define("GOL.rules.CoinTossRules", {
    extend: "GOL.rules.Rules",

    /**
     * {@link GOL.rules.Rules#applyRules} implementation
     */
    applyRules: function(cell) {
        var lucky = Math.random() > .5;

        if (cell.isAlive()) {
            if (lucky) {
                cell.persist();
            }
            else {
                cell.kill();
            }
        }
        else {
            if (lucky) {
                cell.revive();
            }
        }
    }
});

GOL.registerRules("Coin Toss", new GOL.rules.CoinTossRules());