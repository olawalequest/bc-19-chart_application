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
        lib.sumOfData([5,6,7,2,6])===26);
  }); 

});

describe("test that the float array is return with float numbers", function(){


});
