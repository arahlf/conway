describe('model/TU_AbstractCell', function() {
    var cell;
    
    beforeEach(function() {
        cell = new GOL.model.AbstractCell(3, 5);
    });
    
    it('should return the correct row/col', function() {
        expect(cell.getRow()).toEqual(3);
        expect(cell.getCol()).toEqual(5);
    });
    
    it('should call the template method onCommit', function() {
        spyOn(cell, 'onCommit');
        
        cell.commit();
        
        expect(cell.onCommit).toHaveBeenCalled();
    });
    
    it('should throw an error if onCommit is not implemented', function() {
        expect(function() { cell.commit(); }).toThrow('Abstract function called directly.');
    });
    
    it('should fire the commit event', function() {
        spyOn(cell, 'onCommit'); // used to ignore it
        
        var fired = false;
        var listener = function() { fired = true; };
        
        cell.on('commit', listener);
        
        cell.commit();
        
        expect(fired).toEqual(true);
        
        cell.un('commit', listener);
    });
    
    it('should null out its neighbors when destroyed', function() {
        cell.setNeighbors([]);
        cell.destroy();
        expect(cell.getNeighbors()).toBeNull();
    });
});
