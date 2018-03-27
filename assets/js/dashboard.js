function getRecipes() {
    sendGetRequestForJSON('/getRecipes', {},
    function(response) {
        if (response.success) {
            recipes = JSON.parse(response.recipes);
            document.getElementById('egg1-title').innerText = recipes[0]['name']
            document.getElementById('egg1-time').innerText = recipes[0]['time']
            document.getElementById('egg1-image').src = getStaticResource('images/recipes/egg1.jpg')
            document.getElementById('egg2-title').innerText = recipes[1]['name']
            document.getElementById('egg2-time').innerText = recipes[1]['time']
            document.getElementById('egg2-image').src = getStaticResource('images/recipes/egg2.jpg')
            document.getElementById('egg3-title').innerText = recipes[2]['name']
            document.getElementById('egg3-time').innerText = recipes[2]['time']
            document.getElementById('egg3-image').src = getStaticResource('images/recipes/egg3.jpg')
            document.getElementById('chicken1-title').innerText = recipes[3]['name']
            document.getElementById('chicken1-time').innerText = recipes[3]['time']
            document.getElementById('chicken1-image').src = getStaticResource('images/recipes/chicken1.jpg')
            document.getElementById('chicken2-title').innerText = recipes[4]['name']
            document.getElementById('chicken2-time').innerText = recipes[4]['time']
            document.getElementById('chicken2-image').src = getStaticResource('images/recipes/chicken2.jpg')
            document.getElementById('chicken3-title').innerText = recipes[5]['name']
            document.getElementById('chicken3-time').innerText = recipes[5]['time']
            document.getElementById('chicken3-image').src = getStaticResource('images/recipes/chicken3.jpg')
            sendGetRequestForJSON('/completedRecipes', {}, 
            function(response){
                if (response.success) {
                    completedRecipes = response.recipes
                    recipeBadges = document.getElementsByClassName('mdl-badge');
                    recipeCards = document.getElementsByClassName('mdl-card');
                    for (var i = 0; i < recipeCards.length; i++) {
                        level = i % 3;
                        recipeTitle = recipeCards[i].children[0].innerText;
                        if (completedRecipes.indexOf(recipeTitle) > -1) {
                            setBadge(recipeBadges[i], recipeCards[i], "check");
                        }
                        else if (level == 0) {
                            setBadge(recipeBadges[i], recipeCards[i], "unlock");
                        }
                        else if (level == 1) {
                            if (isUnlocked(recipeBadges[i - 1])) {
                                setBadge(recipeBadges[i], recipeCards[i], "unlock");
                            }
                            else {
                                setBadge(recipeBadges[i], recipeCards[i], "lock");
                            }
                        }
                        else if (level == 2) {
                            if (isUnlocked(recipeBadges[i - 1]) && isUnlocked(recipeBadges[i - 2])) {
                                setBadge(recipeBadges[i], recipeCards[i], "unlock");
                            }
                            else {
                                setBadge(recipeBadges[i], recipeCards[i], "lock");
                            }
                        }
                    }
                }
                else
                    alert(response.reason);
            });
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
    });
}

function isUnlocked(element) {
    return (element.getAttribute("data-badge") == "\ue803");
}

function setBadge(badge, card, icon) {
    if (icon == "check") {
        badge.setAttribute("data-badge", "\ue803");
        card.classList.add("mdl-shadow--2dp");
    }
    else if (icon == "lock") {
        badge.setAttribute("data-badge", "\ue800");
        card.classList.add("mdl-shadow--2dp");   
        card.children[3].firstElementChild.disabled = true;     
    }
    else if (icon == "unlock") {
        badge.setAttribute("data-badge", "\ue801");
        card.classList.add("mdl-shadow--8dp");        
    }
    else {
        return;
    }
    badge.classList.add(icon);
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