// - function to insert row to table - 
function insertRow(tableID)
{
    var x=document.getElementById(tableID);
    var new_row = x.rows[1].cloneNode(true);
    var len = x.rows.length;
    new_row.cells[0].innerHTML = len;
    
    var inp1 = new_row.cells[1].getElementsByTagName('input')[0];
    inp1.id += len;
    inp1.value = '';
    var inp2 = new_row.cells[2].getElementsByTagName('input')[0];
    inp2.id += len;
    inp2.value = '';
    x.appendChild( new_row );
}

// function to delete row table
function deleteRow(tableID) 
{
    var table = document.getElementById(tableID);
    var rowCount = table.rows.length;
    if(rowCount!==5){
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
    	// generatePie();
      createPieChart();
    }
    else if (type==="histogram"){
      drawChart();
    }
    // alert(type);
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
        canvasId: "can"
    });
    
    myBarChart.drawBarChart(getData('xarr'), getData('yarr'));
};






//  - Line Chart Function - 
function LineChart(con) {
            // user defined properties
    this.canvas = document.getElementById(con.canvasId);
    this.minX = con.minX;
    this.minY = con.minY;
    this.maxX = con.maxX;
    this.maxY = con.maxY;
    this.unitsPerTickX = con.unitsPerTickX;
    this.unitsPerTickY = con.unitsPerTickY;
 
    // constants
    this.padding = 10;
    this.tickSize = 10;
    this.axisColor = "#555";
    this.pointRadius = 5;
    this.font = "12pt Calibri";
 
    this.fontHeight = 12;
 
    // relationships     
    this.context = this.canvas.getContext("2d");
    this.rangeX = this.maxX - this.minY;
    this.rangeY = this.maxY - this.minY;
    this.numXTicks = Math.round(this.rangeX / this.unitsPerTickX);
    this.numYTicks = Math.round(this.rangeY / this.unitsPerTickY);
    this.x = this.getLongestValueWidth() + this.padding * 2;
    this.y = this.padding * 2;
    this.width = this.canvas.width - this.x - this.padding * 2;
    this.height = this.canvas.height - this.y - this.padding - this.fontHeight;
    this.scaleX = this.width / this.rangeX;
    this.scaleY = this.height / this.rangeY;
  
    // draw x y axis and tick marks
    this.drawXAxis();
    this.drawYAxis();
    }
LineChart.prototype.getLongestValueWidth = function () {
      this.context.font = this.font;
       var longestValueWidth = 0;
       for (var n = 0; n <= this.numYTicks; n++) {
            var value = this.maxY - (n * this.unitsPerTickY);
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
            // alert(data.length);
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
function BarChart(con){
  this.graphCanvas = document.getElementById(con.canvasId);
  this.context = this.graphCanvas.getContext("2d");
  this.startY=480; // startY is the point on the canvas at the y-axis
  this.startX=100;
  this.barWidth=50;
  this.markDataIncrementsIn=50;
  this.chartHeight=this.graphCanvas.height-20;
}

//  to draw bar chart
BarChart.prototype.drawBarChart=function(xArr,yArr) {
  // Draw the x and y axes
  var context=this.context;
  context.lineWidth = "1.0";
  this.drawLine(context, this.startX, this.startY, this.startX, 30); 
  this.drawLine(this.context, this.startX, this.startY, 570, this.startY);           
  context.lineWidth = "0.0";
  var maxValue = 0;
  alert(xArr);
  alert(yArr);

  for (var i=0; i < xArr.length; i++) {
    // Extract the data
    var name = xArr[i];
    var height = parseInt(yArr[i]);

    if (parseInt(height) > parseInt(maxValue)) {
      maxValue = height;
    }
    // Write the data to the chart
    context.fillStyle = "#b95400";
    this.drawRectangle(context,this.startX + (i * this.barWidth) + i,(this.chartHeight - height),this.barWidth,height,true);
    // Add the column title to the x-axis
    context.textAlign = "left";
    context.fillStyle = "#000";
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
  contextO.rect(x, y, w, h);
  contextO.closePath();
  contextO.stroke();
  if (fill) contextO.fill();
};



/*
// function to draw pie chart
function generatePie(){
  var canvas = document.getElementById("can");
  var ctx = canvas.getContext("2d");
  var myColor;
  var lastend = 0;
  // var data = [200, 60, 15]; // If you add more data values make sure you add more colors
  var data = getData("piedata");
  // alert(data);
  var myTotal = 0; // Automatically calculated so don't touch
   // myColor = ['red', 'green', 'blue']; // Colors of each slice
  myColor = getRandomColor(data.length);
  alert(data.length);
  for (var e = 0; e < data.length; e++) {
    myTotal += data[e];
  }
  alert(myTotal);

  for (var i = 0; i < data.length; i++) {
    ctx.fillStyle = myColor[i];
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, canvas.height / 2);
    // Arc Parameters: x, y, radius, startingAngle (radians), endingAngle (radians), antiClockwise (boolean)
    ctx.arc(canvas.width / 2, canvas.height / 2, canvas.height / 2, lastend, lastend + (Math.PI * 2 * (data[i] / myTotal)), false);
    ctx.lineTo(canvas.width / 2, canvas.height / 2);
    ctx.fill();
    lastend += Math.PI * 2 * (data[i] / myTotal);
  }
}
*/

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
    alert(colors);
    return colors;
}

//  function to get data input from the
function getData(key){
   var table = document.getElementById( "dataTable" );
   var xArr = [];
   var yArr = [];
   var dict = {};
   var da=[];
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
            da.push(dict);
    xA1=parseFloat(table.rows[i].cells[1].getElementsByTagName('input')[0].value);
    xArr1.push(xA1);
  }

  if(key==='linedata'){
      return da;
  }
  else if(key==='xarr'){
    return xArr;
  }
  else if(key==='yarr'){
    return yArr;
  }
  else if(key==='piedata'){
    return xArr1;
}
  
}  

function createPieChart() {
  var pieChart = new PieChart( "can", 
    {
      includeLabels: true, 
      // data: [40, 250, 70],
      // labels: ["11%", "69.6%", "17.4%"],
      // colors: ["#FFDAB9","#E6E6FA","#E0FFFF"]
      data: getData('piedata'),
      labels: getData('yarr'),
      colors: getRandomColor(getData('piedata').length)
    }
  );
  pieChart.draw();
}


function PieChart(id, o) {
    this.includeLabels = false;
    if (o.includeLabels == undefined) {
        this.includeLabels = false;
    }
    else {
        this.includeLabels = o.includeLabels;
    }
    this.data = o.data;
    this.labels = o.labels;
    this.colors = o.colors;
    this.canvas = document.getElementById(id);
}

PieChart.prototype.select = function(segment) {
        var context = this.canvas.getContext("2d");
        this.drawSegment(this.canvas, context, segment, this.data[segment], true, this.includeLabels);
    };
PieChart.prototype.draw=function() {
        var context = this.canvas.getContext("2d");
        for (var i = 0; i < this.data.length; i++) {
            this.drawSegment(this.canvas, context, i, this.data[i], false, this.includeLabels);
        }
    };
PieChart.prototype.drawSegment= function(canvas, context, i, size, isSelected, includeLabels) {
        context.save();
        var centerX = Math.floor(canvas.width / 2);
        var centerY = Math.floor(canvas.height / 2);
        radius = Math.floor(canvas.width / 2);
        
        var startingAngle = this.degreesToRadians(this.sumTo(this.data, i));
        var arcSize = this.degreesToRadians(size);
        var endingAngle = startingAngle + arcSize;

        context.beginPath();
        context.moveTo(centerX, centerY);
        context.arc(centerX, centerY, radius, startingAngle, endingAngle, false);
        context.closePath();
        context.fillStyle = this.colors[i];
        context.fill();
        context.restore();

        if (includeLabels && (this.labels.length > i)) {
            this.drawSegmentLabel(canvas, context, i, isSelected);
        }
    };

PieChart.prototype.drawSegmentLabel= function(canvas, context, i, isSelected) {
        context.save();
        var x = Math.floor(canvas.width / 2);
        var y = Math.floor(canvas.height / 2);
        var angle;
        var angleD = this.sumTo(this.data, i);
        var flip = (angleD < 90 || angleD > 270) ? false : true;

        context.translate(x, y);
        if (flip) {
            angleD = angleD-180;
            context.textAlign = "left";
            angle = this.degreesToRadians(angleD);
            context.rotate(angle);
            context.translate(-(x + (canvas.width * 0.5))+15, -(canvas.height * 0.05)-10);
        }
        else {
            context.textAlign = "right";
            angle = this.degreesToRadians(angleD);
            context.rotate(angle);
        }
        //context.textAlign = "right";
        var fontSize = Math.floor(canvas.height / 25);
        context.font = fontSize + "pt Helvetica";

        var dx = Math.floor(canvas.width * 0.5) - 10;
        var dy = Math.floor(canvas.height * 0.05);
        context.fillText(this.labels[i], dx, dy);

        context.restore();
};
PieChart.prototype.drawLabel= function(i) {
        var context = this.canvas.getContext("2d");
        var size = this.data[i];

        this.drawSegmentLabel(this.canvas, context, i, size, false);
    },
PieChart.prototype.degreesToRadians=function(degrees) {
        return (degrees * Math.PI)/180;
    };
PieChart.prototype.sumTo= function(data, i) {
        var sum = 0;
        for (var j = 0; j < i; j++) {
            sum += data[j];
        }
        return sum;
};


function drawChart() {


}
