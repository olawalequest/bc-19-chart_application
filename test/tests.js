'use strict'

var chai = require('chai');
var assert = chai.assert;
var sum;

var lib = require('./lib/chart-data.js');

describe("test that the sum of all numbers in data array are computed correctly", function(){
  it("should give 5 for when data is [3,2]", function(){
    assert(
        lib.sumOfData([3,2])===5);
  });

  it("should return 26 for when data is [5,6,7,2,6]", function(){
    assert(
        lib.sumOfData([3,4,7,8,10])===32);
  }); 

});

describe("test that the startingPoints are computed correctly", function(){
  it("should give [ 0, 1, 2, 4, 6 ] for when data is [3,4,7,8,10]", function(){
    assert.deepEqual(
        lib.startingAng([3,4,7,8,10],lib.sumOfData([3,4,7,8,10])),[0,1,2,4,6]);
  });

  it("should give [ 0, 2, 4, 5, 7 ] for when data is [30,25,10,20,10]", function(){
    assert.deepEqual(
        lib.startingAng([30,25,10,20,10],lib.sumOfData([30,25,10,20,10])),[ 0, 2, 4, 5, 7 ]);
  });


});
