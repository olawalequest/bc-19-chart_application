// - function to insert row to table - 
function insertRow(tableID)
{
    var table=document.getElementById(tableID);
    var new_row = table.rows[1].cloneNode(true);
    var len = table.rows.length;
    new_row.cells[0].innerHTML = len;
    
    var inp1 = new_row.cells[1].getElementsByTagName('input')[0];
    inp1.id += len;
    inp1.value = '';
    var inp2 = new_row.cells[2].getElementsByTagName('input')[0];
    inp2.id += len;
    inp2.value = '';
    table.appendChild( new_row );
}

// function to delete row table
function deleteRow(tableID) 
{
    var table = document.getElementById(tableID);
    var rowCount = table.rows.length;
    if(rowCount!==7){
        table.deleteRow(rowCount-1);
    }
}



function populateTable(data){
  for(var p = 0;p<=data.length;p++){
    document.getElementById('dataTable').rows[p+1].cells[1].children[0].value=data[p][0];
    if(typeof(data[p][1])!=="undefined"){
      document.getElementById('dataTable').rows[p+1].cells[2].children[0].value=data[p][1];
    }
  }
}

// function to pick user selected chart type
function pickChartType(){
    var typeId = document.getElementById("type");
    var type = typeId.options[typeId.selectedIndex].value;
    document.getElementById("chart_title").innerHTML = document.getElementById('title').value;
    if(type==="line"){
        lineChartCall();
    }
    else if (type==="bar"){
    	barChartCall();
    }
    else if (type==="pie"){
    	generatePie();
      // createPieChart();
    }
    else if (type==="histogram"){
      histCall();
    }
 }


//  - function to draw line chart
function lineChartCall(){
   var myLineChart = new LineChart({
        canvasId: "can",
        minX: 0,
        minY: 0,
        maxX: 140,
        maxY: 100,
        unitsPerTickX: 10,
        unitsPerTickY: 10
    });
    var dataB = getData('linedata');
    myLineChart.drawLine(dataB, "blue", 3);
};

//  function to draw bar chart
function barChartCall(){
   var myBarChart = new BarChart({
        canvasId: "can",
        type:"bar"
    });
    
    myBarChart.drawBarChart(getData('xarr'), getData('yarr'),getRandomColor(getData('xarr').length));
};

function histCall(){
   var myhistChart = new BarChart({
        canvasId: "can",
        type:"histogram"
    });
    
    myhistChart.drawBarChart(getData('xarr'), getData('yarr'),getRandomColor(getData('xarr').length));
};




//  - Line Chart Function - 
class LineChart{
  constructor(options){
 // user defined properties
    this.canvas = document.getElementById(options.canvasId);
    this.minX = options.minX;
    this.minY = options.minY;
    this.maxX = options.maxX;
    this.maxY = options.maxY;
    this.unitsPerTickX = options.unitsPerTickX;
    this.unitsPerTickY = options.unitsPerTickY;
 
    // constants
    this.padding = 10;
    this.tickSize = 10;
    this.axisColor = "#555";
    this.pointRadius = 5;
    this.font = "12pt Calibri";
 
    this.fontHeight = 12;
 
    // relationships     
    this.context = this.canvas.getContext("2d");
    this.rangeX = this.maxX - this.minX;
    this.rangeY = this.maxY - this.minY;
    this.numXTicks = Math.round(this.rangeX / this.unitsPerTickX);
    this.numYTicks = Math.round(this.rangeY / this.unitsPerTickY);
    this.x = this.getLongestValueWidth() + this.padding * 2;
    this.y = this.padding * 2;
    this.width = this.canvas.width - this.x - this.padding * 2;
    this.height = this.canvas.height - this.y - this.padding - this.fontHeight;
    this.scaleX = this.width / this.rangeX;
    this.scaleY = this.height / this.rangeY;

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height); // to clear context, to clear save workspace 
 
    // draw line for x y axis and tick marks
    this.drawXAxis();
    this.drawYAxis();
  }
}
LineChart.prototype.getLongestValueWidth = function () {
      this.context.font = this.font;
       var longestValueWidth = 0;
       for (var n = 0; n <= this.numYTicks; n++) {
            var value = this.maxY - (n * this.unitsPerTickY);
            // The measureText() method returns an object that contains the width of the specified text, in pixels.
            longestValueWidth = Math.max(longestValueWidth, this.context.measureText(value).width);
        }
       return longestValueWidth;
  };
LineChart.prototype.drawXAxis = function () {
        var context = this.context;
        context.save();
        context.beginPath();
        context.moveTo(this.x, this.y + this.height);
        context.lineTo(this.x + this.width, this.y + this.height);
        context.strokeStyle = this.axisColor;
        context.lineWidth = 2;
        context.stroke();
 
       // draw tick marks
        for (var n = 0; n < this.numXTicks; n++) {
             context.beginPath();
             context.moveTo((n + 1) * this.width / this.numXTicks + this.x, this.y + this.height);
             context.lineTo((n + 1) * this.width / this.numXTicks + this.x, this.y + this.height - this.tickSize);
             context.stroke();
        }
 
        // draw labels
        context.font = this.font;
        context.fillStyle = "black";
        context.textAlign = "center";
        context.textBaseline = "middle";
 
       for (var n = 0; n < this.numXTicks; n++) {
            var label = Math.round((n + 1) * this.maxX / this.numXTicks);
             context.save();
             // The translate() method remaps the (0,0) position on the canvas.
             context.translate((n + 1) * this.width / this.numXTicks + this.x, this.y + this.height + this.padding);
             context.fillText(label, 0, 0);
             context.restore();
        }
        context.restore();
    };
 LineChart.prototype.drawYAxis = function () {
        var context = this.context;
        context.save();
        context.save();
        context.beginPath();
        context.moveTo(this.x, this.y);
        context.lineTo(this.x, this.y + this.height);
        context.strokeStyle = this.axisColor;
        context.lineWidth = 2;
        context.stroke();
        context.restore();
 
    // draw tick marks
        for (var n = 0; n < this.numYTicks; n++) {
            context.beginPath();
            context.moveTo(this.x, n * this.height / this.numYTicks + this.y);
            context.lineTo(this.x + this.tickSize, n * this.height / this.numYTicks + this.y);
            context.stroke();
        }
 
    // draw values
        context.font = this.font;
        context.fillStyle = "black";
        context.textAlign = "right";
        context.textBaseline = "middle";
 
        for (var n = 0; n < this.numYTicks; n++) {
            var value = Math.round(this.maxY - n * this.maxY / this.numYTicks);
            context.save();
            context.translate(this.x - this.padding, n * this.height / this.numYTicks + this.y);
            context.fillText(value, 0, 0);
            context.restore();
        }
        context.restore();
    };
 LineChart.prototype.drawLine = function (data, color, width) {
       var context = this.context;
       // alert(width);
        context.save();
        this.transformContext();
        context.lineWidth = width;
        context.strokeStyle = color;
        context.fillStyle = color;
        context.beginPath();
        context.moveTo(data[0].x * this.scaleX, data[0].y * this.scaleY);
          for (var n = 0; n < data.length; n++) {
            var point = data[n];
    // draw segment
            context.lineTo(point.x * this.scaleX, point.y * this.scaleY);
            context.stroke();
            context.closePath();
            context.beginPath();
            context.arc(point.x * this.scaleX, point.y * this.scaleY, this.pointRadius, 0, 2 * Math.PI, false);
            context.fill();
            context.closePath();
 
        // position for next segment
            context.beginPath();
            context.moveTo(point.x * this.scaleX, point.y * this.scaleY);
        }
            context.restore();
    };
 LineChart.prototype.transformContext = function () {
        var context = this.context;
     // move context to center of canvas
        this.context.translate(this.x, this.y + this.height);
     // invert the y scale so that that increments
    // as you move upwards
        context.scale(1, -1);
    };



//  main function for bar chart
class BarChart{
  constructor(options){
    this.graphCanvas = document.getElementById(options.canvasId);
    this.context = this.graphCanvas.getContext("2d");
    this.type=options.type;
    this.startY=480; // startY is the point on the canvas at the y-axis
    this.startX=100; //the
    this.barWidth=20;
    this.markDataIncrementsIn=20;
    this.chartHeight=this.graphCanvas.height-20;
    this.context.clearRect(0, 0, this.graphCanvas.width, this.graphCanvas.height); // to clear context, to clear save workspace 

  }
}

//  to draw bar chart
BarChart.prototype.drawBarChart=function(xArr,yArr,colors) {
  // Draw the x and y axes
  var context=this.context;
  context.lineWidth = "1.0";
  this.drawLine(context, this.startX, this.startY, this.startX, 30); 
  this.drawLine(context, this.startX, this.startY, 1000, this.startY);           
  context.lineWidth = "0.0";
  var maxValue = 0;
  for (var i=0; i < xArr.length; i++) {
    // Extract the data
    var name = xArr[i];
    var height = parseInt(yArr[i]);

    if (parseInt(height) > parseInt(maxValue)) {
      maxValue = height;
    }
    // Write the data to the chart
    context.fillStyle = colors[i];
    this.drawRectangle(context,this.startX + (i * this.barWidth) + i,(this.chartHeight - height),this.barWidth,height,true);
    // Add the column title to the x-axis
    if(this.type==='bar'){
      context.textAlign = "middle"; 
      context.fillStyle = "#000";
    }
    else {
      context.textAlign = "left";
      context.fillStyle = "#333333";
    }
    
    // fillText(name, x,y) it takes on three parameters 
    // context.fillText(text,x,y,maxWidth);
    context.fillText(name, this.startX + (i * this.barWidth) + i, this.chartHeight + 10, 200);     
  }
  // Add some data markers to the y-axis
  var numMarkers = Math.ceil(maxValue / this.markDataIncrementsIn);
  context.textAlign = "right";
  context.fillStyle = "#000";
  var markerValue = 0;
  for (var i=0; i < numMarkers; i++) {      
    context.fillText(markerValue, (this.startX - 5), (this.chartHeight - markerValue), 50);
    markerValue += this.markDataIncrementsIn;
  }
};

// drawLine - draws a line on a canvas context from the start point to the end point 
BarChart.prototype.drawLine=function(contextO, startx, starty, endx, endy) {
  contextO.beginPath();
  contextO.moveTo(startx, starty);
  contextO.lineTo(endx, endy);
  contextO.closePath();
  contextO.stroke();
};

// drawRectangle - draws a rectangle on a canvas context using the dimensions specified
BarChart.prototype.drawRectangle=function(contextO, x, y, w, h, fill) {            
  contextO.beginPath();
  // rect(x,y,width,height);
  contextO.rect(x, y, w, h);
  contextO.closePath();
// The stroke() method actually draws the path you have defined with all those moveTo() and lineTo() methods.
  contextO.stroke();
  if (fill) contextO.fill();
};

// function to get random
function getRandomColor(coCount) {
    var colors = [];
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var k =1;k<=coCount;k++){
        color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
        }
            colors.push(color)
    }
    return colors;
}

//  function to get data input from the
function getData(key){
   var table = document.getElementById( "dataTable" );
   var xArr = [];
   var yArr = [];
   var dict = {};
   var data=[];
   var xA1,xArr1=[];

   for (var i = 1; i < table.rows.length; i++ ) {
    xArr.push(
        table.rows[i].cells[1].getElementsByTagName('input')[0].value
    );
    yArr.push(
        table.rows[i].cells[2].getElementsByTagName('input')[0].value
    );
    dict = {x: parseFloat(table.rows[i].cells[1].getElementsByTagName('input')[0].value),
            y: parseFloat(table.rows[i].cells[2].getElementsByTagName('input')[0].value)};
            data.push(dict);
    xA1=parseFloat(table.rows[i].cells[1].getElementsByTagName('input')[0].value);
    xArr1.push(xA1);
  }

  switch(key){
    case 'linedata':{
      return data;
      break;
    }

    case 'xarr':{
      return xArr;
      break;
    }

    case 'yarr':{
      return yArr;
      break;
    }

    case 'piedata':{
      return xArr1;
      break;
    }

    default:{
      alert("error");
    }
  }
  
}  


// function to draw pie chart
function generatePie(){
  var canvas = document.getElementById("can");
  var ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height); // to clear context, to clear save workspace 
 
  var myColor;
  var startingAngle = 0;
  var endingAngle;
  var data = getData("piedata");
  var myTotal = 0; 
  myColor = getRandomColor(data.length);
  for (var j = 0; j< data.length; j++) {
    myTotal += data[j];
  }
  for (var i = 0; i < data.length; i++) {
    endingAngle=startingAngle+(Math.PI * 2 * (data[i] / myTotal));
    ctx.fillStyle = myColor[i];
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, canvas.height / 2);
    // Arc Parameters: x, y, radius, startingAngle (radians), endingAngle (radians), antiClockwise (boolean)
    ctx.arc(canvas.width / 2, canvas.height / 2, canvas.height / 2, startingAngle, endingAngle, false);
    ctx.lineTo(canvas.width / 2, canvas.height / 2);
    ctx.fill();
    startingAngle += Math.PI * 2 * (data[i] / myTotal);
  }
}
