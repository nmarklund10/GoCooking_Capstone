function getRecipes() {
    //setupTabs();
    sendGetRequestForJSON('/getRecipes', {},
    function(response) {
        if (response.success) {
            var recipes = JSON.parse(response.recipes);
            var recipeCards = document.getElementsByClassName('mdl-card');
            for (var i = 0; i < recipeCards.length; i++) {
                var currentCard = recipeCards[i];
                currentCard.children[0].innerText = recipes[i].name;
                currentCard.children[1].firstElementChild.src = getStaticResource('images/recipes/' + recipes[i].filename + '.jpg');
                currentCard.children[2].innerText = recipes[i].time;
            }
            sendGetRequestForJSON('/completedRecipes', {}, 
            function(response){
                if (response.success) {
                    var completedRecipes = JSON.parse(response.recipes);
                    window.userSkills = JSON.parse(response.skills);
                    var recipeBadges = document.getElementsByClassName('mdl-badge');
                    var recipeCards = document.getElementsByClassName('mdl-card');
                    for (var i = 0; i < recipeCards.length; i++) {
                        var level = i % 3;
                        var recipeTitle = recipeCards[i].children[0].innerText;
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
        if (response.success) {
            document.getElementById('appTitle').innerText = document.getElementById('appTitle').innerText + ": " + response.name;
        }
        else
            alert(response.reason);
    });
}

function setupTabs() {
    //TODO: Finish programatically setting up tabs
    var tabs = document.getElementById("tabBar").children;
    var numTabs = tabs.length;
    var dashboard = document.getElementById("dashboard");
    for (var i = 0; i < numTabs; i++) {
        var tabPanel = document.createElement("div");
        tabPanel.className = "mdl-tabs__panel is-active";
        tabPanel.id = "tab" + (i+1) + "-panel";
    }
    // This will make tabs work
    // componentHandler.upgradeElements(content);
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
    var recipeName = document.getElementById(r).children[0].innerText;
    // Check if dialog box already contains correct recipe
    if (document.getElementById('alertDialogTitle').innerText == recipeName) {
        document.getElementById('alertDialog').showModal();
        return;
    }
    sendGetRequestForJSON("/getARecipe/", {'recipe': recipeName}, 
    function(response) {
        if (response.success) {
            var dialog = document.getElementById('alertDialog');
            document.getElementById("alertCloseButton").addEventListener('click', function(){dialog.close();});
            var recipe = response.recipe;
            recipe.instructions = JSON.parse(recipe.instructions);
            recipe.ingredients = JSON.parse(recipe.ingredients);
            recipe.equipment = JSON.parse(recipe.equipment);
            recipe.skills = JSON.parse(recipe.skills);
            document.getElementById('alertDialogTitle').innerText = recipe.name;
            document.getElementById('alertDialogTime').innerText = "Ready In: " + recipe.minutes;
            document.getElementById('alertDialogImage').src = getStaticResource('images/recipes/' + r + '.jpg');
            createSkillsGrid('skillsGrid', recipe.skills);
            createImageGridFromArray('ingredientGrid', recipe.ingredients, getIngredientImage);
            createImageGridFromArray('equipmentGrid', recipe.equipment, getEquipmentImage);
            createInstructionTable('instructionsTable', recipe.instructions);
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

function createSkillsGrid(holderId, arr) {
    var grid = document.getElementById(holderId);
    grid.innerHTML = "";
    var rowNumber = -1;
    for (var i = 0; i < arr.length; i++) {
        if (i % 4 == 0) {
            rowNumber++;
            //Create New Row
            var row = document.createElement('div');
            row.className = "mdl-grid";
            row.style.paddingTop = "1.2vh";
            row.style.paddingBottom = "0";            
            //Create four columns
            for (var j = 0; j < 4; j++) {
                var cell = document.createElement('div')
                cell.className = "center-text mdl-cell mdl-cell--3-col " + holderId + rowNumber;
                cell.style.marginBottom = "0";
                cell.style.marginTop = "0";
                row.appendChild(cell);
            }
            grid.appendChild(row);
        }
        var currentCell = document.getElementsByClassName(holderId + rowNumber)[i%4]
        var skill = document.createElement('span');
        skill.className = "mdl-chip skill";
        skill.style.backgroundColor = "red";
        var text = document.createElement('span');
        text.className = "mdl-chip__text"
        text.innerText = arr[i];
        if (window.userSkills.indexOf(arr[i]) > -1) {
            skill.style.backgroundColor = "green"
        }
        skill.appendChild(text);
        currentCell.appendChild(skill);
    }
}

function createInstructionTable(holderId, arr) {
    // Get Table holder
    var table = document.getElementById(holderId);
    // Clear holder
    table.innerHTML = "";
    for(var i = 0; i < arr.length; i++ ) {
        // Create new row
        var tableRow = document.createElement("tr");
        if (i%2 == 1)
            tableRow.style.backgroundColor = "lightblue";
        else 
            tableRow.style.backgroundColor = "lightgray";
        var stepNumber = document.createElement("td");
        stepNumber.innerText = i + 1;
        var step = document.createElement("td");
        step.className = "mdl-data-table__cell--non-numeric";
        step.innerText = arr[i];
        tableRow.appendChild(stepNumber);
        tableRow.appendChild(step);
        table.appendChild(tableRow);
    }
}

function createImageGridFromArray(holderId, arr, imageFunc) {
    // Get Grid holder
    var grid = document.getElementById(holderId);
    // Clear holder
    grid.innerHTML = ""
    var rowNumber = -1;
    for (var i = 0; i < arr.length; i++) {
        if (i % 4 == 0) {
            rowNumber++;
            //Create New Row
            var row = document.createElement('div');
            row.className = "mdl-grid"
            //Create four columns
            for (var j = 0; j < 4; j++) {
                var cell = document.createElement('div')
                cell.className = "center-text mdl-cell mdl-cell--3-col " + holderId + rowNumber;
                cell.style.marginBottom = "0";
                cell.style.marginTop = "0";
                row.appendChild(cell);
            }
            grid.appendChild(row);
        }
        var currentCell = document.getElementsByClassName(holderId + rowNumber)[i%4]
        var cellImage = document.createElement('img');
        cellImage.src = imageFunc(arr[i]);
        cellImage.style.height = '8vh';
        currentCell.appendChild(cellImage);
        var cellText = document.createElement('p');
        cellText.style.wordWrap = "break-word";
        cellText.style.margin = "0 0 0 0";
        cellText.innerText = arr[i];
        currentCell.appendChild(cellText);
    }
}


