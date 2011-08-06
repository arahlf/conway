/**
 * @class GOL.rules.StandardRules
 * @extends GOL.rules.Rules
 *
 * The standard rules in Conway's Game of Life, where Cells with two or
 * three neighbors live on, any others die.  A dead cell with exactly 3
 * neighbors is reborn.
 */
Ext.define('GOL.rules.StandardRules', {
    extend: 'GOL.rules.Rules',

    /**
     * {@link GOL.rules.Rules#applyRules} implementation
     */
    applyRules: function(cell) {
        var aliveNeighbors = cell.getAliveNeighborsCount();

        if (cell.isAlive()) {
            if (aliveNeighbors > 3 || aliveNeighbors < 2) {
                cell.kill();
            }
            else {
                cell.persist();
            }
        }
        else if (aliveNeighbors == 3) {
            cell.revive();
        }
    }
});
