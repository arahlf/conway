describe('model/TU_BinaryCell', function() {
    var cell;
    
    beforeEach(function() {
        cell = new GOL.model.BinaryCell(3, 5);
    });
    
    it('should start out dead', function() {
        expect(cell.isAlive()).toEqual(false);
    });
    
    it('should maintain temporary state until committed', function() {
        cell.revive();
        
        expect(cell.isAlive()).toEqual(false);
        
        cell.commit();
        
        expect(cell.isAlive()).toEqual(true);
        
        cell.kill();
        
        expect(cell.isAlive()).toEqual(true);
        
        cell.commit();
        
        expect(cell.isAlive()).toEqual(false);
    });
    
    it('should not age past 1', function() {
        expect(cell.getAge()).toEqual(0);
        
        cell.revive().commit();
        
        expect(cell.getAge()).toEqual(1);
        
        cell.persist().commit();
        
        expect(cell.getAge()).toEqual(1);
    });
    
    it('should commit the last action', function() {
        cell.revive().kill().commit();
        
        expect(cell.isAlive()).toEqual(false);
    });
    
    it('should support method chaining', function() {
        expect(cell.commit()).toEqual(cell);
        expect(cell.persist()).toEqual(cell);
        expect(cell.revive()).toEqual(cell);
        expect(cell.kill()).toEqual(cell);
    });
});