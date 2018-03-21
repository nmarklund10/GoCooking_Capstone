function getRecipes() {
    sendGetRequestForJSON('/getRecipes', {'track': 'eggs'},
    function(response) {
        if (response.success) {
            document.getElementById('egg1-title').innerText = response.easy['name']
            document.getElementById('egg1-time').innerText = response.easy['time']
            document.getElementById('egg1-image').src = getStaticResource('images/recipes/egg1/egg1.jpg')
            document.getElementById('egg2-title').innerText = response.medium['name']
            document.getElementById('egg2-time').innerText = response.medium['time']
            document.getElementById('egg2-image').src = getStaticResource('images/recipes/egg2/egg2.jpg')
            document.getElementById('egg3-title').innerText = response.hard['name']
            document.getElementById('egg3-time').innerText = response.hard['time']
            document.getElementById('egg3-image').src = getStaticResource('images/recipes/egg3/egg3.jpg')
        }
        else {
            alert(response.reason);
        }
    });
    sendGetRequestForJSON('/getRecipes', {'track': 'chicken'},
    function(response) {
        if (response.success) {
            document.getElementById('chicken1-title').innerText = response.easy['name']
            document.getElementById('chicken1-time').innerText = response.easy['time']
            document.getElementById('chicken1-image').src = getStaticResource('images/recipes/chicken1/chicken1.jpg')
            document.getElementById('chicken2-title').innerText = response.medium['name']
            document.getElementById('chicken2-time').innerText = response.medium['time']
            document.getElementById('chicken2-image').src = getStaticResource('images/recipes/chicken2/chicken2.jpg')
            document.getElementById('chicken3-title').innerText = response.hard['name']
            document.getElementById('chicken3-time').innerText = response.hard['time']
            document.getElementById('chicken3-image').src = getStaticResource('images/recipes/chicken3/chicken3.jpg')
        }
        else {
            alert(response.reason);
        }
    });
<<<<<<< HEAD
    window.dialog = document.getElementById('alertDialog');
    window.dialogTitle = document.getElementById('alertDialogTitle')
    window.dialogContent = document.getElementById('alertDialogContent');
    window.dialogButton = document.getElementById('alertDialogButton');
    window.dialogImage = document.getElementById('alertDialogImage');
}

function moreInfo(recipe) {
    sendGetRequestForJSON("/getARecipe/", {'recipe': document.getElementById(recipe + '-title').innerText}, 
    function(response) {
        if (response.success) {
            recipe = response.recipe;
            window.dialogTitle.innerText = recipe.name;
            window.dialogImage.src = getStaticResource(recipe.image)
            var list = document.getElementById("recipe-overview");
            list.innerHTML = "";
            console.log(recipe.instructions.replace(/'/g, '"'));
            recipe.instructions = JSON.parse(recipe.instructions);
            recipe.instructions = JSON.parse(recipe.instructions.replace(/'/g, '"'));
            
            for(var i = 0; i < recipe.instructions.length; i++ ) {
                var item = document.createElement("li");
                item.appendChild(document.createTextNode(recipe.instructions[i]));
                list.appendChild(item);
            }
            window.dialogButton.addEventListener('click', 
                function() {
                    console.log("hello")
                });
            window.dialog.showModal();
=======
    sendGetRequestForJSON('/name', {}, 
    function(response){
        if (response.success)
            document.getElementById('appTitle').innerText = document.getElementById('appTitle').innerText + ": " + response.name;
        else
            alert(response.reason);
    })
}

function moreInfo(r) {
    // Check if dialog box already contains correct recipe
    if (document.getElementById('alertDialogTitle').innerText == document.getElementById(r + '-title').innerText) {
        document.getElementById('alertDialog').showModal();
        return;
    }
    sendGetRequestForJSON("/getARecipe/", {'recipe': document.getElementById(r + '-title').innerText}, 
    function(response) {
        if (response.success) {
            var dialog = document.getElementById('alertDialog');
            document.getElementById("alertCloseButton").addEventListener('click', function(){dialog.close();});
            var recipe = response.recipe;
            recipe.instructions = JSON.parse(recipe.instructions);
            recipe.ingredients = JSON.parse(recipe.ingredients);
            recipe.equipment = JSON.parse(recipe.equipment);
            document.getElementById('alertDialogTitle').innerText = recipe.name;
            document.getElementById('alertDialogTime').innerText = "Ready In: " + recipe.minutes;
            document.getElementById('alertDialogImage').src = getStaticResource('images/recipes/' + r + '/' + r + '.jpg');
            var ingredientGrid = document.getElementById('ingredientGrid');
            // Clear Ingredient Grid
            ingredientGrid.innerHTML = "";
            var rowNumber = -1;
            for (var i = 0; i < recipe.ingredients.length; i++) {
                if (i % 4 == 0) {
                    rowNumber++;
                    //Create New Row
                    var row = document.createElement('div');
                    row.className = "mdl-grid"
                    //Create four columns
                    for (var j = 0; j < 4; j++) {
                        var cell = document.createElement('div')
                        cell.className = "center-text mdl-cell mdl-cell--3-col ingredients" + rowNumber;
                        cell.style.marginBottom = "0";
                        cell.style.marginTop = "0";
                        row.appendChild(cell);
                    }
                    document.getElementById('ingredientGrid').appendChild(row);
                }
                var currentCell = document.getElementsByClassName('ingredients' + rowNumber)[i%4]
                var cellImage = document.createElement('img');
                cellImage.src = getStaticResource('images/recipes/' + r + '/ingredients/' + i + '.jpg');
                cellImage.style.height = '8vh';
                var cellText = document.createElement('p');
                cellText.style.wordWrap = "break-word";
                cellText.style.margin = "0 0 0 0";
                cellText.innerText = recipe.ingredients[i];
                currentCell.appendChild(cellImage);
                currentCell.appendChild(cellText);
            }
            // Create Equipment Grid
            var equipmentGrid = document.getElementById('equipmentGrid');
            // Clear Equipment Grid
            equipmentGrid.innerHTML = ""
            rowNumber = -1;
            for (var i = 0; i < recipe.equipment.length; i++) {
                if (i % 4 == 0) {
                    rowNumber++;
                    //Create New Row
                    var row = document.createElement('div');
                    row.className = "mdl-grid"
                    //Create four columns
                    for (var j = 0; j < 4; j++) {
                        var cell = document.createElement('div')
                        cell.className = "center-text mdl-cell mdl-cell--3-col equipment" + rowNumber;
                        cell.style.marginBottom = "0";
                        cell.style.marginTop = "0";
                        row.appendChild(cell);
                    }
                    document.getElementById('equipmentGrid').appendChild(row);
                }
                var currentCell = document.getElementsByClassName('equipment' + rowNumber)[i%4]
                var cellImage = document.createElement('img');
                cellImage.src = getStaticResource('images/recipes/' + r + '/equipment/' + i + '.jpg');
                cellImage.style.height = '8vh';
                var cellText = document.createElement('p');
                cellText.style.wordWrap = "break-word";
                cellText.innerText = recipe.equipment[i];
                currentCell.appendChild(cellImage);
                currentCell.appendChild(cellText);
            }
            var table = document.getElementById("dialogInstructions");
            table.innerHTML = "";
            // Create Instruction Table
            for(var i = 0; i < recipe.instructions.length; i++ ) {
                var tableRow = document.createElement("tr");
                if (i%2 == 1)
                    tableRow.style.backgroundColor = "lightblue";
                else 
                    tableRow.style.backgroundColor = "lightgray";
                var stepNumber = document.createElement("td");
                stepNumber.innerText = i + 1;
                var step = document.createElement("td");
                step.className = "mdl-data-table__cell--non-numeric";
                step.innerText = recipe.instructions[i];
                tableRow.appendChild(stepNumber);
                tableRow.appendChild(step);
                table.appendChild(tableRow);
            }
            document.getElementById('alertDialogButton').addEventListener('click', 
                function() {
                    console.log("hello")
                });
            dialog.showModal();
>>>>>>> 4905fda1ff3c0a1be440450d69f7bcc0a57790b3
        }
        else {
            alert(response.reason);
        }
    });
}