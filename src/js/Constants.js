Ext.ns("GOL");

/**
 * @class GOL.Constants
 */
GOL.Constants = function() {
  function getPng(icon) {
    return "src/images/" + icon + ".png";
  }
  
  return {
    /**
     * The size in pixels of a Cell.
     * @type Number
     * @property CELL_SIZE
     */
    CELL_SIZE: 12,
    
    /**
     * @type Object
     * @property Icons
     */
    icons: {
      BOMB: getPng("bomb"),
      CONFIG: getPng("config"),
      HELP: getPng("help"),
      HOVER: getPng("hover"),
      NEXT: getPng("next"),
      PAUSE: getPng("pause"),
      PLAY: getPng("play"),
      REWIND: getPng("rewind")
    }
  };
}();

// shortcut
GOL.icons = GOL.Constants.icons;