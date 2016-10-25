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