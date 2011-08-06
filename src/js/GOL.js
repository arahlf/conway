/**
 * @class GOL
 */
GOL = {
    /**
     * Similar to Ext.emptyFn, except will throw an error if called.
     * This is used to better simulate interfaces/abstract classes.
     */
    abstractFn: function() {
        throw new Error('Abstract function called directly.');
    },
    
    /**
     * Mimics the concept of the UnsupportedOperationException in Java.
     * @param {String} message
     * @return {Function} A function that will error with the given message.
     */
    unsupportedFn: function(message) {
        return function() {
            throw new Error('Unsupported operation: ' + message);
        };
    }
};
