describe('model/TU_CompositeCell', function() {
    var cell1, cell2, cell3, composite;
    
    beforeEach(function() {
        cell1 = new GOL.model.BinaryCell(0, 1);
        cell2 = new GOL.model.BinaryCell(1, 0);
        cell3 = new GOL.model.BinaryCell(1, 1);
        composite = new GOL.model.CompositeCell([cell1, cell2, cell3]);
    });
    
    it('should call methods on each cell', function() {
        spyOn(cell1, 'revive');
        spyOn(cell2, 'revive');
        spyOn(cell3, 'revive');
        
        composite.revive();
        
        expect(cell1.revive).toHaveBeenCalled();
        expect(cell2.revive).toHaveBeenCalled();
        expect(cell3.revive).toHaveBeenCalled();
        
        spyOn(cell1, 'commit');
        spyOn(cell2, 'commit');
        spyOn(cell3, 'commit');
        
        composite.commit();
        
        expect(cell1.commit).toHaveBeenCalled();
        expect(cell2.commit).toHaveBeenCalled();
        expect(cell3.commit).toHaveBeenCalled();
        
        spyOn(cell1, 'persist');
        spyOn(cell2, 'persist');
        spyOn(cell3, 'persist');
        
        composite.persist();
        
        expect(cell1.persist).toHaveBeenCalled();
        expect(cell2.persist).toHaveBeenCalled();
        expect(cell3.persist).toHaveBeenCalled();
        
        spyOn(cell1, 'kill');
        spyOn(cell2, 'kill');
        spyOn(cell3, 'kill');
        
        composite.kill();
        
        expect(cell1.kill).toHaveBeenCalled();
        expect(cell2.kill).toHaveBeenCalled();
        expect(cell3.kill).toHaveBeenCalled();
    });
    
    it('should support method chaining', function() {
        expect(composite.commit()).toEqual(composite);
        expect(composite.persist()).toEqual(composite);
        expect(composite.revive()).toEqual(composite);
        expect(composite.kill()).toEqual(composite);
    });
    
    it('should not implement certain methods', function() {
        expect(composite.getRow).toThrow('Unsupported operation: CompositeCell.getRow');
        expect(composite.getCol).toThrow('Unsupported operation: CompositeCell.getCol');
        expect(composite.getAliveNeighborsCount).toThrow('Unsupported operation: CompositeCell.getAliveNeighborsCount');
        expect(composite.setNeighbors).toThrow('Unsupported operation: CompositeCell.setNeighbors');
        expect(composite.getAge).toThrow('Unsupported operation: CompositeCell.getAge');
        expect(composite.isAlive).toThrow('Unsupported operation: CompositeCell.isAlive');
    });
});