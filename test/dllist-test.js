var chai = require('chai');
var expect = chai.expect;
var DLList = require('../dllist');

describe('if DLLink methods are working well then it', function () {
    
    var dlList;

    beforeEach(function() {
        dlList = new DLList();
        dlList.append(1);
        dlList.append(2);
        dlList.append(3);
    });

    it('should have a length of 3', function () {
        expect(dlList.length()).to.equal(3);
    });

    it('first item should be 1', function() {
        expect(dlList.get(0)).to.equal(1);
    });

    it('the list should contain 2', function() {
        expect(dlList.contains(2)).to.be.true;
    });

    it('should have a length of 4 when a new item is added', function() {
        dlList.append(4);
        expect(dlList.length()).to.equal(4);
    });

    it('should have a length of 2 when an item is removed', function() {
        dlList.remove(1);
        expect(dlList.length()).to.equal(2);
    });

    it('should retain the same length when a non-existing item is removed', function() {
        dlList.remove(6);
        expect(dlList.length()).to.equal(3);
    });

    it('get(i) should yield the same value as removeAt(i)', function() {
        expect(dlList.get(0)).to.equal(dlList.removeAt(0));
    });

});