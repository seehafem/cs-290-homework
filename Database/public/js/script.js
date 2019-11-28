/****************************************************************
 * Name: Michael Seehafer
 * Date: 3/11/19
 * Project: Database Interactions
 ***************************************************************/

//Builds table and sets up submit button upon loading page
document.addEventListener('DOMContentLoaded', function(event) {
    buildTable();
    bindSubmitButton();
});

//Takes out the time that is added to the end of the date
function stripTime(date) {
    let i = 0;
    let updatedDate = "";
    while (date.charAt(i) != 'T' && i < date.length) {
        updatedDate += date.charAt(i);
        i++;
    }
    return updatedDate;
}

//Changes year-month-day to month-day-year format
function formatDate(date) {
    let year = date.charAt(0) + date.charAt(1) + date.charAt(2) + date.charAt(3);
    let month = date.charAt(5) + date.charAt(6);
    let day = date.charAt(8) + date.charAt(9);
    return month + '-' + day + '-' + year;
}

//Changes month-day-year to year-month-day format
function resetDate(date) {
    let month = date.charAt(0) + date.charAt(1);
    let day = date.charAt(3) + date.charAt(4);
    let year = date.charAt(6) + date.charAt(7) + date.charAt(8) + date.charAt(9);
    return year + '-' + month + '-' + day;
}

//Deletes rows from the table until it is empty
function clearTable() {
    let numRows = 0;
    let tableCleared = false;

    while (!tableCleared) {
        try {
            document.getElementById('table').deleteRow(1);
        }
        catch(err) {
            tableCleared = true;
        }
    }
}

//Gets information from database and builds table using DOM with this information
function buildTable() {
    let req = new XMLHttpRequest();
    req.open("GET", "http://flip3.engr.oregonstate.edu:4987?mode=table", true);
    req.addEventListener('load', function(){
        if(req.status < 400) {
            let response = JSON.parse(req.responseText);
            let table = document.getElementById('table');
            let row, data, form, edit, del, id;

            //Adds each row with values, an edit button, and a delete button
            for (let p in response) {
                row = document.createElement("tr");
                table.appendChild(row);

                data = document.createElement("td");
                row.appendChild(data);
                data.textContent = response[p].name;

                data = document.createElement("td");
                row.appendChild(data);
                data.textContent = response[p].reps;

                data = document.createElement("td");
                row.appendChild(data);
                data.textContent = response[p].weight;

                data = document.createElement("td");
                row.appendChild(data);
                data.textContent = formatDate(stripTime(response[p].date));

                data = document.createElement("td");
                row.appendChild(data);
                if (response[p].lbs == 1) {
                    data.textContent = "lbs";
                }
                else {
                    data.textContent = "kg";
                }

                data = document.createElement("td");
                row.appendChild(data);

                form = document.createElement("form");
                edit = document.createElement("input");
                edit.type = "submit";
                edit.class = "edit";
                edit.value = "Edit";
                
                del = document.createElement("input");
                del.type = "submit";
                del.class = "del";
                del.value = "Delete";

                id = document.createElement("input");
                id.type = "hidden";
                id.class = "id";
                id.value = response[p].id;

                data.appendChild(form);
                form.appendChild(edit);
                form.appendChild(del);
                form.appendChild(id);

                bindEditButton(edit, id);
                bindDeleteButton(del, id);
            }
        }
    });
    req.send(null);
}

//Sets up the submit button in the entry form to insert a new entry into the database
function bindSubmitButton(){
    document.getElementById('submitEntry').addEventListener('click', function(event) {
        if (document.getElementById('name').value != null && document.getElementById('name').value != "") {
            let req = new XMLHttpRequest();
            let info = {"name":null, "reps":null, "weight":null, "date":null, "lbs":null};
            info.name = document.getElementById('name').value;
            info.reps = document.getElementById('reps').value;
            info.weight = document.getElementById('weight').value;
            info.date = document.getElementById('date').value;
            if(document.getElementById('lbs').checked) {
                info.lbs = document.getElementById('lbs').value;
            }
            else {
                info.lbs = document.getElementById('kg').value;
            }

            req.open("POST", "http://flip3.engr.oregonstate.edu:4987?mode=insert", true);
            req.setRequestHeader('Content-Type', 'application/json');
            req.addEventListener('load', function(){
                if(req.status < 400) {
                    //Rebuilds the table with the updated information
                    clearTable();
                    buildTable();
                }
            });
            req.send(JSON.stringify(info));
        }
        event.preventDefault();
    });
}

//Sets up the delete button for each row to delete the entry from the database
function bindDeleteButton(del, id) {
    del.addEventListener('click', function(event) {
        let req = new XMLHttpRequest();
        let info = {"id":null};
        info.id = id.value;
        req.open("POST", "http://flip3.engr.oregonstate.edu:4987?mode=delete", true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.addEventListener('load', function(){
            if(req.status < 400) {
                //Rebuilds the table with the updated information
                clearTable();
                buildTable();
            }
        });
        req.send(JSON.stringify(info));
        event.preventDefault();
    });
}

//Sets up the edit button for each row to allow the user to update the entry
function bindEditButton(edit, id) {
    edit.addEventListener('click', function(event) {
        createForm("temp", id);
        clearTable();
        document.getElementById('tableDiv').style.display = "none";
        document.getElementById('submitEntry').type = "hidden";
        event.preventDefault();
    });
}

//Adds a new form to the dom, allowing the user to edit an entry in the database
function createForm(name, id) {
    //The form will be prepopulated with the data from this entry in the database
    let req = new XMLHttpRequest();
    req.open("GET", "http://flip3.engr.oregonstate.edu:4987?mode=row&id=" + id.value, true);
    req.addEventListener('load', function(){
        if(req.status < 400) {
            let response = JSON.parse(req.responseText);

            document.body.appendChild(document.createElement("br"));
        
            let form = document.createElement("form");
            form.id = name;
            document.body.appendChild(form);

            let fieldset = document.createElement("fieldset");
            form.appendChild(fieldset);
    
            let legend = document.createElement("legend");
            legend.textContent = "Edit Row";
            fieldset.appendChild(legend);

            let label = document.createElement("label");
            label.for = "newName";
            label.textContent = "Name: ";
            fieldset.appendChild(label);

            let input = document.createElement("input");
            input.type = "text";
            input.name = "newName";
            input.id = "newName";
            input.value = response[0].name;
            fieldset.appendChild(input);
    
            fieldset.appendChild(document.createElement("br"));

            label = document.createElement("label");
            label.for = "newReps";
            label.textContent = "Reps: ";
            fieldset.appendChild(label);

            input = document.createElement("input");
            input.type = "number";
            input.name = "newReps";
            input.id = "newReps";
            input.value = response[0].reps;
            fieldset.appendChild(input);

            fieldset.appendChild(document.createElement("br"));

            label = document.createElement("label");
            label.for = "newWeight";
            label.textContent = "Weight: ";
            fieldset.appendChild(label);

            input = document.createElement("input");
            input.type = "number";
            input.name = "newWeight";
            input.id = "newWeight"
            input.value = response[0].weight;
            fieldset.appendChild(input);

            fieldset.appendChild(document.createElement("br"));

            label = document.createElement("label");
            label.for = "newDate";
            label.textContent = "Date: ";
            fieldset.appendChild(label);

            input = document.createElement("input");
            input.type = "date";
            input.name = "newDate";
            input.id = "newDate";
            input.value = stripTime(response[0].date);
            fieldset.appendChild(input);

            fieldset.appendChild(document.createElement("br"));

            label = document.createElement("label");
            label.for = "newUnits";
            label.textContent = "Units: ";
            fieldset.appendChild(label);

            input = document.createElement("input");
            input.type = "radio";
            input.name = "newUnits";
            input.id = "newLbs";
            input.value = 1;
            if (response[0].lbs == true) {
                input.checked = "checked";
            }
            fieldset.appendChild(input);

            let text = document.createElement("text");
            text.textContent = " LBS "
            fieldset.appendChild(text);

            input = document.createElement("input");
            input.type = "radio";
            input.name = "newUnits";
            input.id = "newKg";
            input.value = 0;
            if (response[0].lbs == false) {
                input.checked = "checked";
            }
            fieldset.appendChild(input);

            text = document.createElement("text");
            text.textContent = " KG"
            fieldset.appendChild(text);

            fieldset.appendChild(document.createElement("br"));

            let updateButton = document.createElement("input");
            updateButton.type = "submit";
            updateButton.value = "Submit Changes";
            fieldset.appendChild(updateButton);
            bindUpdateButton(updateButton, name, id);
        }
    });
    req.send(null);
}

//Deletes the form for editing an entry
function deleteForm(name) {
    let form = document.getElementById(name);
    document.body.removeChild(form);
}

//Sets up the update button in the editing form to update the entry in the database
function bindUpdateButton(update, name, id) {
    update.addEventListener('click', function(event) {
        let req = new XMLHttpRequest();
        let info = {"name":null, "reps":null, "weight":null, "date":null, "lbs":null};
        info.name = document.getElementById('newName').value;
        info.reps = document.getElementById('newReps').value;
        info.weight = document.getElementById('newWeight').value;
        info.date = document.getElementById('newDate').value;
        if(document.getElementById('newLbs').checked) {
            info.lbs = document.getElementById('newLbs').value;
        }
        else {
            info.lbs = document.getElementById('newKg').value;
        }
        info.id = id.value;

        req.open("POST", "http://flip3.engr.oregonstate.edu:4987?mode=update", true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.addEventListener('load', function(){
            if(req.status < 400) {
                //Deletes the form
                deleteForm(name);
                //Rebuilds the table
                document.getElementById('tableDiv').style.display = "initial";
                buildTable();
                //Brings back the button to submit new entries
                document.getElementById('submitEntry').type = "submit";
            }
        });
        req.send(JSON.stringify(info));
        event.preventDefault();
    });
}
