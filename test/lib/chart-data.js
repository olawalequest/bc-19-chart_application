/*
Aladeusi Olawale
aladeusi.olawale@gmail.com
Javascript Application to compute the sum of all prime numbers in N number

*/
'use strict'

module.exports = {
  sumOfData: function(data) {
    var myTotal=0;
    for (var j = 0; j< data.length; j++) {
      myTotal += data[j];
    }
    return myTotal;
  }, // end of function
  floatValue: function(data){
    var floatArr=[];
    for (var i = 0;i<data.length;i++){
    floatArr.push(parseFloat(data[i]));
    }
    return floatArr;
  }
}