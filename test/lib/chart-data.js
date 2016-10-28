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
  startingAng: function(data,total){
    var startingArr=[];
    var startingAngle=0;
    for (var i = 0;i<data.length;i++){      
      startingArr.push(startingAngle);
      startingAngle += Math.ceil(Math.PI * 2 * (data[i] / total));
    }
    return startingArr;
  }
}