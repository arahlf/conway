/**
 * @class GOL
 */
GOL = function() {
    
    function logStackTrace() {
        if (console && console.trace) {
            console.trace();
        }
    }
    
    return {
        /**
         * Similar to Ext.emptyFn, except will throw an error if called.
         * This is used to better simulate interfaces/abstract classes.
         */
        abstractFn: function() {
            logStackTrace();
            throw new Error("Abstract function called directly.");
        },
        
        /**
         * Mimics the concept of the UnsupportedOperationException in Java.
         * @param {String} message
         */
        unsupportedFn: function(message) {
            return function() {
                logStackTrace();
                throw new Error("Unsupported operation: " + message);
            };
        }
    };
}();
