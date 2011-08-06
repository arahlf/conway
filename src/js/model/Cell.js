/**
 * An interface for Cells.
 */
Ext.define('GOL.model.Cell', {
    mixins: {
        observable: 'Ext.util.Observable'
    },

    constructor: function() {
        this.addEvents(
            /**
             * @event commit
             * Fired when the Cell's temporary state is committed.
             * @param {GOL.cells.Cell} this
             */
            'commit'
        );
    },

    /**
     * Gets the Cell's row.
     * @return {Number}
     */
    getRow: GOL.abstractFn,

    /**
     * Gets the Cell's column.
     * @return {Number}
     */
    getCol: GOL.abstractFn,

    /**
     * Commits the temporary state of the Cell and fires the 'commit' event.
     * @return {GOL.cells.Cell} this
     */
    commit: GOL.abstractFn,

    /**
     * Returns the count of the Cell's alive neighbors.
     * @return {Number}
     */
    getAliveNeighborsCount: GOL.abstractFn,

    /**
     * Sets the Cell's neighbors.
     * @param {Array} neighbors
     */
    setNeighbors: GOL.abstractFn,

    /**
     * Returns the Cell's age (number of generations it has survived).
     * @return {Number}
     */
    getAge: GOL.abstractFn,

    /**
     * Returns whether or not the Cell is alive.
     * @return {Boolean}
     */
    isAlive: GOL.abstractFn,

    /**
     * Signal the Cell that it has lived on to the next generation.
     * @return {GOL.cells.Cell} this
     */
    persist: GOL.abstractFn,

    /**
     * Brings the Cell back to life.
     * @return {GOL.cells.Cell} this
     */
    revive: GOL.abstractFn,

    /**
     * Kills the Cell.
     * @return {GOL.cells.Cell} this
     */
    kill: GOL.abstractFn,
    
    /**
     * Destroy's the Cell (cleanup purposes).
     */
    destroy: GOL.abstractFn
});