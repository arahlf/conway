/**
 * @class GOL
 */
GOL = {
    /**
     * Similar to Ext.emptyFn, except will throw an error if called.
     * This is used to better simulate interfaces/abstract classes.
     */
    abstractFn: function() {
        throw new Error("Abstract function called directly.");
    },
    
    /**
     * Mimics the concept of the UnsupportedOperationException in Java.
     * @param {String} message
     * @return {Function} A function that will error with the given message.
     */
    unsupportedFn: function(message) {
        return function() {
            throw new Error("Unsupported operation: " + message);
        };
    }
};

/**
 * @class GOL.Application
 * @extends Ext.window.Window
 */
Ext.define("GOL.Application", {
    extend: "Ext.window.Window",
    
    closable: false,
    constrain: true,
    resizable: false,
    
    initComponent: function() {
        var factory = new GOL.model.factory.AgingCellFactory();
        var rules = new GOL.rules.StandardRules();

        this.gridController = new GOL.controller.Grid(this.rows, this.cols, factory, rules);
        this.gridController.applyPattern(GOL.pattern.Registry.getDefaultValue());
        
        this.toolbar = this.createToolbar();

        var view = this.gridController.getView();
        
        // disable the toolbar while loading
        view.on("beforeload", this.toolbar.disable, this.toolbar);
        view.on("load", this.toolbar.enable, this.toolbar);

        Ext.apply(this, {
            title: "Conway's Game of Life",
            items: view,
            tools: [{
                type: "help",
                handler: this.showHelp,
                scope: this
            }],
            bbar: this.toolbar
        });
        
        this.callParent();
    },
    
    /**
     * Launches the application.
     */
    launch: function() {
        this.show();
    },

    createToolbar: function() {
        return Ext.create("GOL.Toolbar", {
            gridController: this.gridController
        });
    },

    /**
     * Displays the help/about dialog.
     */
    showHelp: function() {
        var wikiLink = '<a href="http://en.wikipedia.org/wiki/Conways_Game_of_Life" target="_blank">Wikipedia</a>';

        Ext.Msg.show({
            title: "Help",
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.QUESTION,
            width: 450,
            msg: "A implementation of Conway's Game of Life using JavaScript and Ext JS 4 in the MVC paradigm.<br /><br />" +
                 "<p>For details behind Conway's Game of Life, see " + wikiLink + ".<br /><br />" +
                 "<p>Directions: Use the controls on the bottom toolbar to configure the grid. " +
                 "Click and drag over Cells to bring them back to life.<br /><br />" +
                 "By: Alan Rahlf"
        });
    }
});
/**
 * @class GOL.Toolbar
 * @extends Ext.toolbar.Toolbar
 * @cfg {GOL.controller.Grid} gridController
 * A Toolbar used to interact with a {@link GOL.controller.Grid}.
 */
Ext.define("GOL.Toolbar", {
    extend: "Ext.toolbar.Toolbar",
    
    /**
     * @cfg {Number} millisPerIteration The number of milliseconds to wait between each generation when "playing". Defaults to 50.
     */
    millisPerIteration: 50,
    
    // button iconCls configurations
    iconClsBomb: "gol-icon-bomb",
    iconClsRewind: "gol-icon-rewind",
    iconClsPlay: "gol-icon-play",
    iconClsPause: "gol-icon-pause",
    iconClsNext: "gol-icon-next",
    
    initComponent: function() {
        Ext.apply(this, {
            // buttons
            bombButton: this.createIconButton(this.iconClsBomb, this.onBombClick),
            rewindButton: this.createIconButton(this.iconClsRewind, this.onRewindClick),
            playButton: this.createIconButton(this.iconClsPlay, this.onPlayClick),
            nextButton: this.createIconButton(this.iconClsNext, this.onNextClick),
            // menus
            cellTypeMenu: this.createMenuButton(GOL.cell.Registry, "Cell Type", this.onCellTypeSelect, this),
            patternMenu: this.createMenuButton(GOL.pattern.Registry, "Pattern", this.onPatternSelect, this),
            // status text
            statusText: this.createStatusText()
        });
        
        this.items = this.getItems();
        this.gridController.on("generationchange", this.updateStatusText, this);
        this.callParent();
    },
    
    /**
     * Triggers the next generation of Cells.
     */
    triggerNextGeneration: function() {
        this.gridController.nextGeneration();
    },
    
    /**
     * Returns whether or not the Toolbar is "playing".
     * @return {Boolean}
     */
    isPlaying: function() {
        return !!this.intervalId;
    },
    
    createStatusText: function() {
        return Ext.create("Ext.Component", {
            width: 175,
            cls: "gol-status-text",
            html: "Generations: 0"
        });
    },
    
    getItems: function() {
        return [
            this.bombButton, "-",
            this.rewindButton, this.playButton, this.nextButton, "-",
            this.cellTypeMenu, "-",
            this.patternMenu, "->",
            this.statusText
        ];
    },
    
    createIconButton: function(iconCls, handler) {
        return Ext.create("Ext.button.Button", {
            iconCls: iconCls,
            handler: handler,
            scope: this
        });
    },
    
    createMenuButton: function(registry, text, selectHandler, scope) {
        return Ext.create("GOL.registry.MenuButton", {
            registry: registry,
            text: text,
            selectHandler: selectHandler,
            scope: scope
        });
    },
    
    onBombClick: function() {
        if (this.isPlaying()) {
            this.stopPlaying();
        }
        this.gridController.killAllCells();
    },
    
    onRewindClick: function() {
        if (this.isPlaying()) {
            this.stopPlaying();
        }
        this.gridController.applyPattern(this.patternMenu.getValue());
    },
    
    updateStatusText: function(count) {
        this.statusText.el.dom.innerHTML = "Generations: " + count;
    },
    
    onPlayClick: function() {
        if (this.isPlaying()) {
            this.stopPlaying();
        } else {
            this.startPlaying();
        }
    },
    
    startPlaying: function() {
        this.playButton.setIconCls(this.iconClsPause);
        this.intervalId = setInterval(Ext.bind(this.triggerNextGeneration, this), this.millisPerIteration);
    },
    
    stopPlaying: function() {
        this.playButton.setIconCls(this.iconClsPlay);
        clearInterval(this.intervalId);
        this.intervalId = null;
    },
    
    onNextClick: function() {
        if (!this.isPlaying()) {
            this.triggerNextGeneration();
        }
    },
    
    onPatternSelect: function(menuButton, register) {
        this.gridController.applyPattern(register.getValue());
    },
    
    onCellTypeSelect: function(menuButton, register) {
        this.gridController.reconfigure(register.getValue());
        this.gridController.applyPattern(this.patternMenu.getValue());
    }
});

/**
 * @class GOL.rules.Rules
 *
 * An interface for rules.
 */
Ext.define("GOL.rules.Rules", {
    /**
     * Applies the rules to a Cell.
     * @param {GOL.model.Cell} cell
     */
    applyRules: GOL.abstractFn
});
/**
 * @class GOL.rules.StandardRules
 * @extends GOL.rules.Rules
 *
 * The standard rules in Conway's Game of Life, where Cells with two or
 * three neighbors live on, any others die.  A dead cell with exactly 3
 * neighbors is reborn.
 */
Ext.define("GOL.rules.StandardRules", {
    extend: "GOL.rules.Rules",

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
/**
 * @class GOL.registry.Registry
 */
Ext.define("GOL.registry.Registry", {
    /**
     * @constructor
     */
    constructor: function() {
        this.store = new Ext.data.Store({
            model: "GOL.registry.Register"
        });
    },

    /**
     * Register a new name/value.
     * @param {Mixed} key
     * @param {Mixed} value
     */
    register: function(name, value) {
        this.store.add({
            name: name,
            value: value
        });
    },

    /**
     * Gets the Registry's store.
     */
    getStore: function() {
        return this.store;
    },
    
    getDefaultValue: function() {
        return this.store.first().getValue();
    }
});
/**
 * A specialized button that contains a menu, whose items are created
 * from the contents of the configured Registry's store.  Currently, the
 * menu items are only created upon initialization, a future possibility
 * is to listen for store events and update the menu items accordingly.
 * @cfg {GOL.registry.Registry} registry
 * @cfg {Function} selectHandler Shortcut for adding a "select" listener.
 */


// probably shouldn't enforce a default value, should be injected instead
// figure out how to add tooltips on a menu item

Ext.define("GOL.registry.MenuButton", {
    extend: "Ext.button.Button",
    
    initComponent: function() {
        var menuItems = [], store = this.registry.getStore();
        
        store.each(function(register) {
            menuItems.push({ register: register, text: register.get("name") });
        });
        
        Ext.apply(this, {
            labelText: this.text, // stored for later use when a menu item is selected
            menu: {
                items: menuItems,
                listeners: {
                    click: this.onMenuItemClick,
                    scope: this
                }
            }
        });
        
        this.addEvents(
            /**
             * Fired when a new menu item is selected.
             * @event select
             * @param {GOL.registry.MenuButton} this
             * @param {GOL.registry.Register} register
             */
            "select"
        );
        
        // attach the shortcut listener, if present
        if (Ext.isFunction(this.selectHandler)) {
            this.on("select", this.selectHandler, this.scope);
        }
        
        // assign a default value
        this.setSelectedRegister(store.first(), true);
        
        this.callParent();
    },
    
    onMenuItemClick: function(menu, item, e) {
        this.setSelectedRegister(item.register);
    },
    
    /**
     * Sets the currently selected Register.
     * @param {GOL.registry.Register} register
     * @param {Boolean} silent (optional) True to prevent the select event from
     * firing.  Defaults to false.
     */
    setSelectedRegister: function(register, silent) {
        if (this.selectedRegister != register) {
            this.selectedRegister = register;
            this.setText(this.labelText + ": " + register.getName());
            
            if (!silent) {
                this.fireEvent("select", this, register);
            }
        }
    },
    
    getValue: function() {
        return this.selectedRegister.getValue();
    }
});

/**
 * @class GOL.pattern.Pattern
 * An interface for patterns.
 */
Ext.define("GOL.pattern.Pattern", {
    /**
     * Applies the pattern to the specified Grid.
     * @param {GOL.model.Grid} grid
     */
    applyPattern: GOL.abstractFn
});
/**
 * @class GOL.pattern.AbstractCoordinatePattern
 * @extends GOL.pattern.Pattern
 */
Ext.define("GOL.pattern.AbstractCoordinatePattern", {
    extend: "GOL.pattern.Pattern",
    
    /**
     * Applies a set of coordinates to a Grid model.
     * @param {GOL.model.Grid} grid
     * @param {Array} coordinates A 2D array (rows/cols) of Cell coordinates.
     */
    applyCoordinates: function(grid, coordinates) {
        var coordinate;
        
        for (var i=0; i<coordinates.length; i++) {
            coordinate = coordinates[i];
            
            grid.getCell(coordinate[1], coordinate[0]).revive().commit();
        }
    }
});
Ext.ns("GOL.pattern");

/**
 * @class GOL.pattern.Registry
 * Serves as a registry of Patterns.
 */
GOL.pattern.Registry = new GOL.registry.Registry();

/**
 * Shortcut for {GOL.pattern.Registry#register}
 * @member GOL
 * @method registerPattern
 */
GOL.registerPattern = Ext.bind(GOL.pattern.Registry.register, GOL.pattern.Registry);
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
/**
 * @class GOL.pattern.Beacon
 * @extends GOL.pattern.Pattern
 */
Ext.define("GOL.pattern.Beacon", {
    extend: "GOL.pattern.AbstractCoordinatePattern",
    
    /**
     * {@link GOL.pattern.Pattern#applyPattern} implementation
     */
    applyPattern: function(grid) {
        var coordinates = [
            [1, 1],
            [1, 2],
            [2, 1],
            //
            [4, 3],
            [3, 4],
            [4, 4]
        ];
        
        this.applyCoordinates(grid, coordinates);
    }
});

GOL.registerPattern("Beacon", new GOL.pattern.Beacon());
/**
 * @class GOL.pattern.Glider
 * @extends GOL.pattern.Pattern
 */
Ext.define("GOL.pattern.Glider", {
    extend: "GOL.pattern.AbstractCoordinatePattern",
    
    /**
     * {@link GOL.pattern.Pattern#applyPattern} implementation
     */
    applyPattern: function(grid) {
        var coordinates = [
            [1, 1],
            [2, 2],
            [3, 2],
            [1, 3],
            [2, 3]
        ];
        
        this.applyCoordinates(grid, coordinates);
    }
});

GOL.registerPattern("Glider", new GOL.pattern.Glider());
/**
 * @class GOL.pattern.GliderGun
 * @extends GOL.pattern.Pattern
 */
Ext.define("GOL.pattern.GliderGun", {
    extend: "GOL.pattern.AbstractCoordinatePattern",
    
    /**
     * {@link GOL.pattern.Pattern#applyPattern} implementation
     */
    applyPattern: function(grid) {
        var coordinates = [
            [2, 6],
            [2, 7],
            [3, 6],
            [3, 7],
            [12, 6],
            [12, 7],
            [12, 8],
            [13, 5],
            [13, 9],
            [14, 4],
            [14, 10],
            [15, 4],
            [15, 10],
            [16, 7],
            [17, 5],
            [17, 9],
            [18, 6],
            [18, 7],
            [18, 8],
            [19, 7],
            [22, 4],
            [22, 5],
            [22, 6],
            [23, 4],
            [23, 5],
            [23, 6],
            [24, 3],
            [24, 7],
            [26, 2],
            [26, 3],
            [26, 7],
            [26, 8],
            [36, 4],
            [36, 5],
            [37, 4],
            [37, 5]
        ];
        
        this.applyCoordinates(grid, coordinates);
    }
});

GOL.registerPattern("Glider Gun", new GOL.pattern.GliderGun());
/**
 * @class GOL.pattern.LWSS
 * @extends GOL.pattern.Pattern
 */
Ext.define("GOL.pattern.LWSS", {
    extend: "GOL.pattern.AbstractCoordinatePattern",
    
    /**
     * {@link GOL.pattern.Pattern#applyPattern} implementation
     */
    applyPattern: function(grid) {
        var coordinates = [
            [1, 1],
            [4, 1],
            [5, 2],
            [1, 3],
            [5, 3],
            [2, 4],
            [3, 4],
            [4, 4],
            [5, 4]
        ];
        
        this.applyCoordinates(grid, coordinates);
    }
});

GOL.registerPattern("LWSS", new GOL.pattern.LWSS());
/**
 * @class GOL.pattern.Pulsar
 * @extends GOL.pattern.Pattern
 */
Ext.define("GOL.pattern.Pulsar", {
    extend: "GOL.pattern.AbstractCoordinatePattern",
    
    /**
     * {@link GOL.pattern.Pattern#applyPattern} implementation
     */
    applyPattern: function(grid) {
        var coordinates = [
            [4, 2],
            [5, 2],
            [6, 2],
            [10, 2],
            [11, 2],
            [12, 2],
            //
            [2, 4],
            [7, 4],
            [9, 4],
            [14, 4],
            //
            [2, 5],
            [7, 5],
            [9, 5],
            [14, 5],
            //
            [2, 6],
            [7, 6],
            [9, 6],
            [14, 6],
            //
            [4, 7],
            [5, 7],
            [6, 7],
            [10, 7],
            [11, 7],
            [12, 7],
            //
            [4, 9],
            [5, 9],
            [6, 9],
            [10, 9],
            [11, 9],
            [12, 9],
            //
            [2, 10],
            [7, 10],
            [9, 10],
            [14, 10],
            //
            [2, 11],
            [7, 11],
            [9, 11],
            [14, 11],
            //
            [2, 12],
            [7, 12],
            [9, 12],
            [14, 12],
            //
            [4, 14],
            [5, 14],
            [6, 14],
            [10, 14],
            [11, 14],
            [12, 14]
        ];
        
        this.applyCoordinates(grid, coordinates);
    }
});

GOL.registerPattern("Pulsar", new GOL.pattern.Pulsar());

/**
 * @class GOL.model.Grid
 * The Grid model.
 */
Ext.define("GOL.model.Grid", {
    
    mixins: {
        observable: "Ext.util.Observable"
    },
    
    /**
     * @constructor
     * @param {Number} rows
     * @param {Number} cols
     * @param {GOL.rules.Rules} rules
     */
    constructor: function(rows, cols, cellFactory, rules) {
        Ext.apply(this, {
            rows: rows,
            cols: cols,
            rules: rules,
            generations: 0
        });
        
        this.addEvents(
            /**
             * @event generationchange
             * @param {Number} count The new generation count.
             */
            "generationchange",
            
            /**
             * @event reconfigure
             */
            "reconfigure"
        );
        
        this.configure(cellFactory);
    },
    
    /**
     * @param cellFactory {GOL.model.factory.CellFactory}
     * @private
     */
    configure: function(cellFactory) {
        var cells = this.cells = [], row;
        
        for (var r = 0; r < this.rows; r++) {
            row = [];
            
            for (var c = 0; c < this.cols; c++) {
                row.push(cellFactory.createModel(r, c));
            }
            
            cells.push(row);
        }
        
        this.compositeCell = new GOL.model.CompositeCell(Ext.Array.flatten(cells));
        this.compositeCell.each(this.assignCellNeighbors, this);
    },
    
    reconfigure: function(cellFactory) {
        Ext.destroy(this.cells);
        
        this.configure(cellFactory);
        
        this.fireEvent("reconfigure");
    },
    
    assignCellNeighbors: function(cell) {
        var row = cell.getRow(), col = cell.getCol(), neighbors = [];
        
        for (var r = row - 1; r <= row + 1; r++) {
            for (var c = col - 1; c <= col + 1; c++) {
                if (this.cells[r] && this.cells[r][c] && this.cells[r][c] != cell) {
                    neighbors.push(this.cells[r][c]);
                }
            }
        }
        
        cell.setNeighbors(neighbors);
    },
    
    getRows: function() {
        return this.rows;
    },
    
    getCols: function() {
        return this.cols;
    },
    
    getCell: function(row, col) {
        return this.cells[row][col];
    },
    
    killAllCells: function() {
        this.compositeCell.kill().commit();
        
        this.fireEvent("generationchange", (this.generations = 0));
    },
    
    /**
     * Calls the given method on each Cell in the Grid.
     */
    eachCell: function(fn, scope) {
        this.compositeCell.each(fn, scope);
    },
    
    /**
     * Executes the given rules to create the next generation of Cells and fires
     * the 'generation' event.
     */
    nextGeneration: function() {
        var cells = this.compositeCell.getCells();
        
        for (var i=0; i<cells.length; i++) {
            this.rules.applyRules(cells[i]);
        }
        
        this.compositeCell.commit();
        
        this.fireEvent("generationchange", ++this.generations);
    },
    
    /**
     * Applies a pattern to the Grid.
     * @param {GOL.pattern.Pattern} pattern
     */
    applyPattern: function(pattern) {
        this.killAllCells();
        pattern.applyPattern(this);
    }
});
/**
 * An interface for Cells.
 */
Ext.define("GOL.model.Cell", {
    mixins: {
        observable: "Ext.util.Observable"
    },

    constructor: function() {
        this.addEvents(
            /**
             * @event commit
             * Fired when the Cell's temporary state is committed.
             * @param {GOL.cells.Cell} this
             */
            "commit"
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
     * Commits the temporary state of the Cell and fires the "commit" event.
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
/**
 * An abstract base class for Cells that provides common/shared functionality.
 */
Ext.define("GOL.model.AbstractCell", {
    extend: "GOL.model.Cell",
    
    constructor: function(row, col) {
        this.row = row;
        this.col = col;
        
        this.callParent();
    },
    
    getRow: function() {
        return this.row;
    },
    
    getCol: function() {
        return this.col;
    },

    /**
     * A partial implementation that handles the firing of the commit event.
     */
    commit: function() {
        this.onCommit();
        this.fireEvent("commit", this);
        return this;
    },

    /**
     * Template method called when the Cell's state needs to be committed.
     */
    onCommit: GOL.abstractFn,
    
    getAliveNeighborsCount: function() {
        var count = 0, neighbors = this.neighbors;
        
        for (var i = 0; i < neighbors.length; i++) {
            if (neighbors[i].isAlive()) {
                count++;
            }
        }
        
        return count;
    },
    
    getNeighbors: function() {
        return this.neighbors;
    },
    
    setNeighbors: function(neighbors) {
        this.neighbors = neighbors;
    },
    
    destroy: function() {
        this.neighbors = null;
    }
});

/**
 * @class GOL.model.CompositeCell
 * @extends GOL.model.Cell
 * @constructor
 * @param {Array} cells An array of cell models.
 *
 * Serves as a <a href="http://en.wikipedia.org/wiki/Composite_pattern">composite</a>
 * of Cell model objects.
 */
Ext.define("GOL.model.CompositeCell", {
    extend: "GOL.model.Cell",
    
    constructor: function(cells) {
        this.callParent();
        this.cells = cells;
    },
    
    /**
     * Retrieves the list of underlying Cells.
     * @return {Array}
     */
    getCells: function() {
        return this.cells;
    },
    
    /**
     * Calls the passed function for each element in this composite.
     * @param {Function} fn
     * @param {Object} scope
     * @return {GOL.model.CompositeCell} this
     */
    each: function(fn, scope) {
        Ext.Array.forEach(this.cells, fn, scope);
        return this;
    },
    
    kill: function() {
        return this.forEachCell("kill");
    },
    
    revive: function() {
        return this.forEachCell("revive");
    },
    
    persist: function() {
        return this.forEachCell("persist");
    },
    
    commit: function() {
        return this.forEachCell("commit");
    },
    
    /**
     * Calls the given method on each Cell in this composite (avoids function-based iteration).
     * @param {String} methodName
     * @return {GOL.model.CompositeCell} this
     * @private
     */
    forEachCell: function(methodName) {
        for (var i = 0; i < this.cells.length; i++) {
            (this.cells[i])[methodName]();
        }
        return this;
    },
    
    // unsupported methods
    getRow: GOL.unsupportedFn("CompositeCell.getRow"),
    getCol: GOL.unsupportedFn("CompositeCell.getCol"),
    getAliveNeighborsCount: GOL.unsupportedFn("CompositeCell.getAliveNeighborsCount"),
    setNeighbors: GOL.unsupportedFn("CompositeCell.setNeighbors"),
    getAge: GOL.unsupportedFn("CompositeCell.getAge"),
    isAlive: GOL.unsupportedFn("CompositeCell.isAlive")
});

/**
 * @class GOL.model.BinaryCell
 * @extends GOL.model.AbstractCell
 *
 * Simple Cell implementation that is either dead or alive.
 */
Ext.define("GOL.model.BinaryCell", {
    extend: "GOL.model.AbstractCell",

    alive: false,
    tempAlive: false,

    getAge: function() {
        return this.alive ? 1 : 0;
    },

    isAlive: function() {
        return this.alive;
    },

    onCommit: function() {
        this.alive = this.tempAlive;
    },

    kill: function() {
        this.tempAlive = false;
        return this;
    },

    persist: function() {
        return this;
    },

    revive: function() {
        this.tempAlive = true;
        return this;
    }
});
/**
 * @class GOL.model.AgingCell
 * @extends GOL.model.AbstractCell
 * 
 * A Cell implementation that keeps track of its age.
 */
Ext.define("GOL.model.AgingCell", {
    extend: "GOL.model.AbstractCell",
    
    age: 0,
    tempAge: 0,
    
    isAlive: function() {
        return this.age > 0;
    },
    
    getAge: function() {
        return this.age;
    },
    
    onCommit: function() {
        this.age = this.tempAge;
    },
    
    kill: function() {
        this.tempAge = 0;
        return this;
    },
    
    persist: function() {
        if (this.tempAge > 0) {
            this.tempAge++;
        }
        return this;
    },
    
    revive: function() {
        this.tempAge = 1;
        return this;
    }
});
/**
 * @class GOL.model.RainbowCell
 * @extends GOL.model.AbstractCell
 * 
 * A Cell implementation that keeps track of its age.
 */
Ext.define("GOL.model.RainbowCell", {
    extend: "GOL.model.AgingCell",
    
    MAX_AGE: 7,
    
    persist: function() {
        if (this.age < this.MAX_AGE && this.tempAge < this.MAX_AGE) {
            this.tempAge++;
        }
        return this;
    }
});
Ext.ns("GOL.cell");

/**
 * @class GOL.cell.Registry
 * Serves as a registry of Cell factories.
 */
GOL.cell.Registry = new GOL.registry.Registry();

/**
 * Shortcut for {GOL.cell.Registry#register}
 * @member GOL
 * @method registerCellFactory
 */
GOL.registerCellFactory = Ext.bind(GOL.cell.Registry.register, GOL.cell.Registry);
Ext.define("GOL.model.factory.CellFactory", {
    /**
     * Creates a new Cell model.
     * @param {Number} row
     * @param {Number} col
     */
    createCell: GOL.abstractFn,
});
Ext.define("GOL.model.factory.AgingCellFactory", {
    extend: "GOL.model.factory.CellFactory",
    
    createModel: function(row, col) {
        return new GOL.model.AgingCell(row, col);
    }
});

GOL.registerCellFactory("Aging", new GOL.model.factory.AgingCellFactory());
Ext.define("GOL.model.factory.BinaryCellFactory", {
    extend: "GOL.model.factory.CellFactory",
    
    createModel: function(row, col) {
        return new GOL.model.BinaryCell(row, col);
    }
});

GOL.registerCellFactory("Binary", new GOL.model.factory.BinaryCellFactory());
Ext.define("GOL.model.factory.RainbowCellFactory", {
    extend: "GOL.model.factory.CellFactory",
    
    createModel: function(row, col) {
        return new GOL.model.RainbowCell(row, col);
    }
});

GOL.registerCellFactory("Rainbow", new GOL.model.factory.RainbowCellFactory());
Ext.define("GOL.model.factory.RandomCellFactory", {
    extend: "GOL.model.factory.CellFactory",
    
    createModel: function(row, col) {
        switch (Math.ceil(Math.random() * 3)) {
            case 1:
                return new GOL.model.BinaryCell(row, col);
            case 2:
                return new GOL.model.AgingCell(row, col);
            case 3:
                return new GOL.model.RainbowCell(row, col);
        }
    }
});

GOL.registerCellFactory("Random", new GOL.model.factory.RandomCellFactory());

Ext.define("GOL.view.TableMarkupFactory", {
    singleton: true,
    
    getMarkupHtml: function(cellPrefix, rows, cols) {
        var rowsArray = this.createList(0, rows);
        var colsArray = this.createList(0, cols);
        
        var colTpl = new Ext.XTemplate('<tpl for="cols"><td id="{[parent.prefix]}-{[parent.row]}-{.}"></td></tpl>');
        var rowTpl = new Ext.XTemplate('<tpl for="rows"><tr>{[this.getCellMarkup()]}</tr></tpl>', {
            rowCount: 0,
            
            getCellMarkup: function() {
                return colTpl.apply({cols: colsArray, prefix: cellPrefix, row: this.rowCount++});
            }
        });
        
        return rowTpl.apply({rows: rowsArray});
    },
    
    createList: function(start, stop) {
        for (var list=[], i=start; i<stop; i++) {
            list.push(i);
        }
        return list;
    }
});
/**
 * @class GOL.view.Grid
 * @extends Ext.container.Container
 * @cfg {GOL.model.Grid} model The Grid's model.
 */
Ext.define("GOL.view.Grid", {
    extend: "Ext.container.Container",
    
    cellSize: 12,
    mouseDown: false,
    
    initComponent: function() {
        this.loadingView = this.createLoadingView();
        this.gridView = this.createGridView();
        
        Ext.apply(this, {
            cellControllers: [],
            width: this.cellSize * this.model.getCols(),
            height: this.cellSize * this.model.getRows(),
            layout: "card",
            activeItem: 0,
            items: [this.loadingView, this.gridView]
        });
        
        this.model.on("reconfigure", this.onReconfigure, this);
        
        this.callParent();
    },
    
    createLoadingView: function() {
        return Ext.create("widget.container", {
            layout: {
                type: "hbox",
                pack: "center",
                align: "middle"
            },
            items: {
                xtype: "progressbar",
                animate: false,
                text: "Loading...",
                width: 300
            }
        });
    },
    
    createGridView: function() {
        return Ext.create("Ext.Component", {
            renderTpl: '<table class="gol-grid"><tbody></tbody></table>',
            renderSelectors: {
                tableEl: "table.gol-grid",
                tbodyEl: "table.gol-grid > tbody"
            }
        });
    },
    
    onRender: function() {
        this.callParent(arguments);
        
        this.loadedRows = 0;
        
        Ext.defer(function() {
            this.fireEvent("beforeload");
            this.gridView.tbodyEl.update(GOL.view.TableMarkupFactory.getMarkupHtml(this.id + "-cell", this.model.getRows(), this.model.getCols()));
            
            this.gridView.el.on("mousedown", this.onTableCellMouseDown, this, { delegate: "td" });
            this.gridView.el.on("mouseover", this.onTableCellMouseOver, this, { delegate: "td" });
            
            Ext.defer(this.addRow, 50, this);
        }, 100, this);
    },
    
    onReconfigure: function() {
        this.fireEvent("beforeload");
        this.getLayout().setActiveItem(this.loadingView);
        
        this.loadedRows = 0;
        
        Ext.destroy(this.cellControllers);
        this.cellControllers = [];
        
        this.addRow();
    },
    
    addRow: function() {
        var model = this.model;
        var tableCells = this.gridView.tbodyEl.select("tr:nth(" + (this.loadedRows + 1) + ") td");
        var row = [];
        
        tableCells.each(function(tableCell, composite, index) {
            var cell = new GOL.controller.Cell(model.getCell(this.loadedRows, index), Ext.get(tableCell.dom));
            row.push(cell);
        }, this);
        
        this.cellControllers.push(row);
        this.loadedRows++;
        
        this.loadingView.down("progressbar").updateProgress(this.loadedRows / model.getRows());
        
        if (this.loadedRows < model.getRows()) {
            Ext.Function.defer(this.addRow, 10, this);
        }
        else {
            this.getLayout().setActiveItem(this.gridView);
            this.fireEvent("load"); // TODO document events
        }
    },
    
    onTableCellMouseDown: function(event, target) {
        event.preventDefault();
        this.fireEvent("cellmousedown", this.getCellFromTarget(target));
        
    },
    
    onTableCellMouseOver: function(event, target) {
        event.preventDefault();
        this.fireEvent("cellmouseover", this.getCellFromTarget(target));
    },
    
    getCellFromTarget: function(target) {
        var match = target.id.match(/cell-(\d+)-(\d+)/); // ex: id="ext-comp-1015-cell-12-4"
        
        return this.cellControllers[parseInt(match[1], 10)][parseInt(match[2], 10)];
    },
    
    destroy: function() {
        Ext.destroy(this.cellControllers);
    }
});

/**
 * @class GOL.view.Cell
 */
Ext.define("GOL.view.Cell", {
    
    mixins: {
        observable: "Ext.util.Observable"
    },
    
    constructor: function(model, el) {
        this.callParent();
        
        this.el = el;
        this.model = model;
        this.model.on("commit", this.updateView, this);
        this.updateView();
    },
    
    /**
     * Gets the view's Element.
     * @return {Ext.core.Element}
     */
    getEl: function() {
        return this.el;
    },
    
    /**
     * Gets the view's model.
     * @return {GOL.model.Cell}
     */
    getModel: function() { // needed?
        return this.model;
    },
    
    destroy: function() {
        var me = this;
        me.clearListeners();
        me.el.dom.className = "";
        me.el = null;
        me.model = null;
    },
    
    /**
     * Method called whenever the view needs to be updated, typically
     * needed after the internal model's state has been committed.
     */
    updateView: GOL.abstractFn
});
/**
 * @class GOL.view.BinaryCell
 * @extends GOL.view.Cell
 * @constructor
 * @param {GOL.model.Cell} model A cell model.
 */
Ext.define("GOL.view.BinaryCell", {
    extend: "GOL.view.Cell",
    
    aliveCls: "gol-cell-alive",
    deadCls: "gol-cell-dead",
    
    updateView: function() {
        // profiler shows directly setting the DOM className is at
        // least twice as fast as using Element's addCls + removeCls
        var dom = this.getEl().dom;
        
        if (this.model.isAlive()) {
            dom.className = this.aliveCls;
        }
        else {
            dom.className = this.deadCls;
        }
    }
});

/**
 * @class GOL.view.AgingCell
 * @extends GOL.view.Cell
 * @constructor
 * @param {GOL.model.Cell} model A cell model.
 */
Ext.define("GOL.view.AgingCell", {
    extend: "GOL.view.Cell",
    
    updateView: function() {
        var dom = this.getEl().dom;
        
        if (this.model.isAlive()) {
            dom.className = "gol-cell-alive gol-cell-aging";
            dom.style.backgroundColor = this.getAgeAsColor();
        }
        else {
            dom.className = "gol-cell-dead";
            dom.style.backgroundColor = "transparent";
        }
    },

    /**
     * Creates an RGB color string to represent the Cell based on its age.
     */
    getAgeAsColor: function() {
        var code = Math.max(255 - (this.getModel().getAge() * 15), 75);
        
        return Ext.String.format("rgb({0}, {1}, {2})", code, code, code);
    },
    
    destroy: function() {
        this.getEl().dom.style.backgroundColor = "transparent";
        this.callParent();
    }
});
/**
 * @class GOL.view.AgingCell
 * @extends GOL.view.Cell
 * @constructor
 * @param {GOL.model.Cell} model A cell model.
 */
Ext.define("GOL.view.RainbowCell", {
    extend: "GOL.view.AgingCell",
    
    colors: ["#dd0000", "#fe6230", "#fef600", "#00bc00", "#009bfe", "#000083", "#30009b"],
    
    getAgeAsColor: function() {
        return this.colors[this.model.getAge() - 1];
    }
});
Ext.ns("GOL.view");

GOL.view.CellFactory = {
    /**
     * Determines and creates the appropriate view for the given model.
     */
    create: function(model, renderTo) {
        var name = model.$className.replace(/^GOL\.model/, "GOL.view");
        var constructor = Ext.ClassManager.get(name);
        
        if (constructor !== null) {
            return new constructor(model, renderTo);
        }
        
        throw new Error("Could not determine view for model of type: " + model.$className);
    }
};

Ext.define("GOL.controller.Cell", {

    constructor: function(model, renderTo) {
        this.model = model;
        this.view = GOL.view.CellFactory.create(model, renderTo);
    },

    kill: function() {
        if (this.model.isAlive()) {
            this.model.revive().commit();
        }
    },

    revive: function() {
        if (!this.model.isAlive()) {
            this.model.revive().commit();
        }
    },
    
    getView: function() {
        return this.view;
    },
    
    destroy: function() {
        this.model.destroy();
        this.view.destroy();
        
        this.model = null;
        this.view = null;
    }
});
/**
 * @class GOL.controller.Grid
 */
Ext.define("GOL.controller.Grid", {
    mixins: {
        observable: "Ext.util.Observable"
    },
    
    mouseDown: false,
    
    constructor: function(rows, cols, cellFactory, rules) {
        this.model = new GOL.model.Grid(rows, cols, cellFactory, rules);
        
        this.view = Ext.create("GOL.view.Grid", {
            model: this.model
        });
        
        this.addEvents("generationchange");
        this.relayEvents(this.model, ["generationchange"]);
        
        this.setupMouseListeners();
    },
    
    applyPattern: function(pattern) {
        this.model.applyPattern(pattern);
    },
    
    nextGeneration: function() {
        this.model.nextGeneration();
    },
    
    setupMouseListeners: function() {
        Ext.getDoc().on("mouseup", this.onDocumentMouseUp, this);

        this.view.on("cellmousedown", this.onCellMouseDown, this);
        this.view.on("cellmouseover", this.onCellMouseOver, this);
    },

    getView: function() {
        return this.view;
    },

    onDocumentMouseUp: function() {
        this.mouseDown = false;
    },

    onCellMouseDown: function(cell) {
        this.mouseDown = true;
        cell.revive();
    },

    onCellMouseOver: function(cell) {
        if (this.mouseDown) {
            cell.revive();
        }
    },
    
    killAllCells: function() {
        this.model.killAllCells();
    },
    
    reconfigure: function(cellFactory) {
        this.model.reconfigure(cellFactory);
    },
    
    destroy: function() {
        Ext.getDoc().un("mouseup", this.onDocumentMouseUp, this);
        
        this.view.un("cellmousedown", this.onCellMouseDown, this);
        this.view.un("cellmouseover", this.onCellMouseOver, this);
    }
});


