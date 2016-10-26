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
    if(rowCount!==2){
        table.deleteRow(rowCount-1);
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
    }
    // alert(type);
}



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

function barChartCall(){
   var myBarChart = new BarChart({
        canvasId: "can"
    });
    
    myBarChart.drawBarChart(getData('xarr'), getData('yarr'));
};


//  function to get data input from the
function getData(key){
   var table = document.getElementById( "dataTable" );
   var xArr = [];
   var yArr = [];
   var dict = {};
   var da=[];

   for (var i = 1; i < table.rows.length; i++ ) {
    xArr.push(
        table.rows[i].cells[1].getElementsByTagName('input')[0].value
    );
    yArr.push(
        table.rows[i].cells[2].getElementsByTagName('input')[0].value
    );
  }

  if(key==='linedata'){
    for (var i = 1; i < table.rows.length; i++ ) {
          dict = {x: parseFloat(table.rows[i].cells[1].getElementsByTagName('input')[0].value),
                  y: parseFloat(table.rows[i].cells[2].getElementsByTagName('input')[0].value)};
            da.push(dict);
       }
     return da;
  }
  else if(key==='xarr'){
    return xArr;
  }
  else if(key==='yarr'){
    return yArr;
  }
  
}

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
    context.fillStyle = "#b90000";
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





