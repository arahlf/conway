describe('model/TU_RainbowCell', function() {
    var cell;
    
    beforeEach(function() {
        cell = new GOL.model.RainbowCell(3, 5);
    });
    
    it('should not age past 7', function() {
        cell.revive().commit();
        cell.persist().persist().persist().persist().persist().persist().persist().commit();
        
        expect(cell.getAge()).toEqual(7);
    });
});