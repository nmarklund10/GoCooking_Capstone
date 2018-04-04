function getRecipes() {
    sendGetRequestForJSON('/getRecipes', {'track': 'eggs'},
    function(response) {
        if (response.success) {
            document.getElementById('egg1-title').innerText = response.easy['name']
            document.getElementById('egg1-time').innerText = response.easy['time']
            document.getElementById('egg1-image').src = getStaticResource('images/recipes/egg1.jpg')
            document.getElementById('egg2-title').innerText = response.medium['name']
            document.getElementById('egg2-time').innerText = response.medium['time']
            document.getElementById('egg2-image').src = getStaticResource('images/recipes/egg2.jpg')
            document.getElementById('egg3-title').innerText = response.hard['name']
            document.getElementById('egg3-time').innerText = response.hard['time']
            document.getElementById('egg3-image').src = getStaticResource('images/recipes/egg3.jpg')
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
            document.getElementById('chicken1-image').src = getStaticResource('images/recipes/chicken1.jpg')
            document.getElementById('chicken2-title').innerText = response.medium['name']
            document.getElementById('chicken2-time').innerText = response.medium['time']
            document.getElementById('chicken2-image').src = getStaticResource('images/recipes/chicken2.jpg')
            document.getElementById('chicken3-title').innerText = response.hard['name']
            document.getElementById('chicken3-time').innerText = response.hard['time']
            document.getElementById('chicken3-image').src = getStaticResource('images/recipes/chicken3.jpg')
        }
        else {
            alert(response.reason);
        }
    });

sendGetRequestForJSON('/getRecipes', {'track': 'bread'},
    function(response) {
        if (response.success) {
            document.getElementById('bread1-title').innerText = response.easy['name']
            document.getElementById('bread1-time').innerText = response.easy['time']
            document.getElementById('bread1-image').src = getStaticResource('images/recipes/bread1.jpg')
            document.getElementById('bread2-title').innerText = response.medium['name']
            document.getElementById('bread2-time').innerText = response.medium['time']
            document.getElementById('bread2-image').src = getStaticResource('images/recipes/bread2.jpg')
            document.getElementById('bread3-title').innerText = response.hard['name']
            document.getElementById('bread3-time').innerText = response.hard['time']
            document.getElementById('bread3-image').src = getStaticResource('images/recipes/bread3.jpg')
        }
        else {
            alert(response.reason);
        }
    });

    sendGetRequestForJSON('/getRecipes', {'track': 'vegetables'},
    function(response) {
        if (response.success) {
            document.getElementById('vegetable1-title').innerText = response.easy['name']
            document.getElementById('vegetable1-time').innerText = response.easy['time']
            document.getElementById('vegetable1-image').src = getStaticResource('images/recipes/vegetable1.jpg')
            document.getElementById('vegetable2-title').innerText = response.medium['name']
            document.getElementById('vegetable2-time').innerText = response.medium['time']
            document.getElementById('vegetable2-image').src = getStaticResource('images/recipes/vegetable2.jpg')
            document.getElementById('vegetable3-title').innerText = response.hard['name']
            document.getElementById('vegetable3-time').innerText = response.hard['time']
            document.getElementById('vegetable3-image').src = getStaticResource('images/recipes/vegetable3.jpg')
        }
        else {
            alert(response.reason);
        }
    });

    sendGetRequestForJSON('/getRecipes', {'track': 'pasta'},
    function(response) {
        if (response.success) {
            document.getElementById('pasta1-title').innerText = response.easy['name']
            document.getElementById('pasta1-time').innerText = response.easy['time']
            document.getElementById('pasta1-image').src = getStaticResource('images/recipes/pasta1.jpg')
            document.getElementById('pasta2-title').innerText = response.medium['name']
            document.getElementById('pasta2-time').innerText = response.medium['time']
            document.getElementById('pasta2-image').src = getStaticResource('images/recipes/pasta2.jpg')
            document.getElementById('pasta3-title').innerText = response.hard['name']
            document.getElementById('pasta3-time').innerText = response.hard['time']
            document.getElementById('pasta3-image').src = getStaticResource('images/recipes/pasta3.jpg')
        }
        else {
            alert(response.reason);
        }
    });

    sendGetRequestForJSON('/getRecipes', {'track': 'desserts'},
    function(response) {
        if (response.success) {
            document.getElementById('desserts1-title').innerText = response.easy['name']
            document.getElementById('desserts1-time').innerText = response.easy['time']
            document.getElementById('desserts1-image').src = getStaticResource('images/recipes/desserts1.jpg')
            document.getElementById('desserts2-title').innerText = response.medium['name']
            document.getElementById('desserts2-time').innerText = response.medium['time']
            document.getElementById('desserts2-image').src = getStaticResource('images/recipes/desserts2.jpg')
            document.getElementById('desserts3-title').innerText = response.hard['name']
            document.getElementById('desserts3-time').innerText = response.hard['time']
            document.getElementById('desserts3-image').src = getStaticResource('images/recipes/desserts3.jpg')
        }
        else {
            alert(response.reason);
        }
    });
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
            document.getElementById('alertDialogImage').src = getStaticResource('images/recipes/' + r + '.jpg');
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
                cellImage.src = getIngredientImage(recipe.ingredients[i]);
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
                cellImage.src = getEquipmentImage(recipe.equipment[i]);
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
                    goToUrl('/cooking/');
                });
            dialog.showModal();
        }
        else {
            alert(response.reason);
        }
    });
}