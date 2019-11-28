/************************************************************
 * File: script.js (JavaScript for index.html)
 * Author: Michael Seehafer
 * Date: 2/9/2019
 ***********************************************************/

//This adds the table with its content as a child
//of the parent passed to the function
function addTable(parent) {
    //Form the table
    let table = document.createElement("table");
    table.style.border = "solid black 1px";
    parent.appendChild(table);
    
    //Add the headings to the newly added table
    let headerRow = document.createElement("tr");
    headerRow.className = "headerRow";
    table.appendChild(headerRow);
    for (let x = 1; x <= 4; x++) {
        let header = document.createElement("th");
        header.textContent = "Header " + x;
        header.style.border = "solid black 1px";
        header.style.paddingLeft = "10px";
        header.style.paddingRight = "10px";
        headerRow.appendChild(header);
    }
    
    //Add the data to the newly added table
    for (let x = 1; x <= 3; x++) {
        let row = document.createElement("tr");
        row.className = "dataRow";
        table.appendChild(row);
        for (let y = 1; y <= 4; y++) {
            let data = document.createElement("td");
            if (x != 1 || y != 1) {
                data.className = "unselected";
            }
            else {
                data.className = "selected";
            }
            data.textContent = x + ", " + y;
            data.style.border = "solid black 1px";
            data.style.textAlign = "center";
            row.appendChild(data);
        }
    }
}

//This ensures that cell 1,1 is selected when the page is loaded
function initializeSelection() {
    let selected = document.body.getElementsByClassName("selected");
    selected[0].style.border = "solid black 2px";
}

//This creates the five buttons for the webpage and adds them
//to the parent passed to this function
function addButtons(parent) {
    // Create and style the five buttons for this webpage
    let upButton = document.createElement("button");
    upButton.textContent = "Up";
    upButton.style.marginTop = "10px";
    let downButton = document.createElement("button");
    downButton.textContent = "Down";
    downButton.style.marginTop = "10px";
    downButton.style.marginLeft = "5px";
    let leftButton = document.createElement("button");
    leftButton.textContent = "Left";
    leftButton.style.marginTop = "10px";
    leftButton.style.marginLeft = "5px";
    let rightButton = document.createElement("button");
    rightButton.textContent = "Right";
    rightButton.style.marginTop = "10px";
    rightButton.style.marginLeft = "5px";
    let markButton = document.createElement("button");
    markButton.textContent = "Mark Cell";
    markButton.style.marginLeft = "20px";
    markButton.style.marginTop = "10px";
    
    // Add an appropriate event listener to each button
    upButton.addEventListener("click", moveSelectionUp);
    downButton.addEventListener("click", moveSelectionDown);
    leftButton.addEventListener("click", moveSelectionLeft);
    rightButton.addEventListener("click", moveSelectionRight);
    markButton.addEventListener("click", turnYellow);
    
    // Add the five buttons to the parent
    parent.appendChild(upButton);
    parent.appendChild(downButton);
    parent.appendChild(leftButton);
    parent.appendChild(rightButton);
	parent.appendChild(markButton);
}

//This moves the selected cell up unless the row above is a header row
function moveSelectionUp() {	
	//Gets the selected cell
    let oldSelection = document.body.getElementsByClassName("selected");

    //Calculates the current column index of the selected cell
    let columnChecker = oldSelection[0].previousElementSibling;
    let columnIndex = 0;
    while (columnChecker != null) {
        columnIndex++;
        columnChecker = columnChecker.previousElementSibling;
    }
	
    //Checks if the row above is a header row
    //If not, selects new cell and updates style, deselects old cell and updates style
    let newRow = oldSelection[0].parentNode.previousElementSibling;
    if (newRow.className != "headerRow") {
        let newSelection = newRow.children[columnIndex];
        oldSelection[0].style.border = "solid black 1px";
        oldSelection[0].className = "unselected";
        newSelection.style.border = "solid black 2px";
        newSelection.className = "selected";
    }
}

//This moves the selected cell down unless it is the bottom row
function moveSelectionDown() {
    //Gets the selected cell
    let oldSelection = document.body.getElementsByClassName("selected");

    //Calculates the current column index of the selected cell
    let columnChecker = oldSelection[0].previousElementSibling;
    let columnIndex = 0;
    while (columnChecker != null) {
        columnIndex++;
        columnChecker = columnChecker.previousElementSibling;
    }

    //Checks if the row below exists
    //If it does, selects new cell and updates style, deselects old cell and updates style
    let newRow = oldSelection[0].parentNode.nextElementSibling.children;
    if (newRow != null) {
        let newSelection = newRow[columnIndex];
        oldSelection[0].style.border = "solid black 1px";
        oldSelection[0].className = "unselected";
        newSelection.style.border = "solid black 2px";
        newSelection.className = "selected";
    }
}

//This moves the selected cell left unless it is the leftmost column
function moveSelectionLeft() {
    //Gets the selected cell and the cell to its left
    let oldSelection = document.body.getElementsByClassName("selected");
    let newSelection = oldSelection[0].previousElementSibling;

    //Ensures the cell to the left exists
    //If it does, selects new cell and updates style, deselects old cell and updates style
    if (newSelection != null) {
        oldSelection[0].style.border = "solid black 1px";
        oldSelection[0].className = "unselected";
        newSelection.style.border = "solid black 2px";
        newSelection.className = "selected";
    }
}

//This moves the selected cell right unless it is the rightmost column
function moveSelectionRight() {
	//Gets the selected cell and the cell to its right
    let oldSelection = document.body.getElementsByClassName("selected");
    let newSelection = oldSelection[0].nextElementSibling;

    //Ensures the cell to the right exists
    //If it does, selects new cell and updates style, deselects old cell and updates style
    if (newSelection != null) {
        oldSelection[0].style.border = "solid black 1px";
        oldSelection[0].className = "unselected";
        newSelection.style.border = "solid black 2px";
        newSelection.className = "selected";
    }
}

//This changes the background color of the selected cell to yellow
function turnYellow() {
    let selection = document.body.getElementsByClassName("selected");
    selection[0].style.backgroundColor = "yellow";
}

addTable(document.body);
initializeSelection();
addButtons(document.body);