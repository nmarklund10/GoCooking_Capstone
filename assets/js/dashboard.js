function getRecipes() {
    window.cards = [];
    setupTabs();
    sendGetRequestForJSON('/getRecipes', {},
    function(response) {
        if (response.success) {
            var recipes = JSON.parse(response.recipes);
            var recipeCards = window.cards;
            for (var i = 0; i < recipeCards.length; i++) {
                var currentCard = recipeCards[i];
                currentCard.id = recipes[i].filename;
                currentCard.children[0].innerText = recipes[i].name;
                currentCard.children[1].firstElementChild.src = getStaticResource('images/recipes/' + recipes[i].filename + '.jpg');
                currentCard.children[2].innerText = recipes[i].time;
                currentCard.children[3].firstElementChild.setAttribute("value", recipes[i].filename);
            }
            sendGetRequestForJSON('/completedRecipes', {}, 
            function(response){
                if (response.success) {
                    var completedRecipes = JSON.parse(response.recipes);
                    window.userSkills = JSON.parse(response.skills);
                    var recipeCards = window.cards;
                    for (var i = 0; i < recipeCards.length; i++) {
                        var level = i % 3;
                        var recipeTitle = recipeCards[i].children[0].innerText;
                        if (completedRecipes.indexOf(recipeTitle) > -1) {
                            setBadge(recipeCards[i], "check");
                            if (level == 2) {
                                showCard(i);                                                                
                            }
                        }
                        else if (level == 0) {
                            setBadge(recipeCards[i], "unlock");
                            showCard(i);
                        }
                        else if (level == 1) {
                            if (isUnlocked(recipeCards[i - 1])) {
                                setBadge(recipeCards[i], "unlock");
                                showCard(i);                                
                            }
                            else {
                                setBadge(recipeCards[i], "lock");
                            }
                        }
                        else if (level == 2) {
                            if (isUnlocked(recipeCards[i - 1]) && isUnlocked(recipeCards[i - 2])) {
                                setBadge(recipeCards[i], "unlock");
                                showCard(i);                                
                            }
                            else {
                                setBadge(recipeCards[i], "lock");
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
    document.getElementById('alertDialogButton').addEventListener('click', 
        function() {
            goToUrl('/cooking/');
        });
    document.getElementById('scrollUpButton').addEventListener('click', 
        function() {
            $("#the_dialog_div").animate({scrollTop: '-=300vh'}, 400);
        });
    document.getElementById('scrollDownButton').addEventListener('click', 
        function() {
            $("#the_dialog_div").animate({scrollTop: '+=300vh'}, 400);
        });
    document.getElementById("alertCloseButton").addEventListener('click', function(){document.getElementById("topLink").click(); document.getElementById('alertDialog').close();});
}

function showCard(index) {
    var card = window.cards[index];
    var tab = Math.floor(index / 3);
    var level = index % 3 + 1;
    document.getElementsByClassName("card-cell")[tab].innerHTML = "";
    document.getElementsByClassName("card-cell")[tab].appendChild(card);
    document.getElementsByClassName("mdl-badge")[tab].setAttribute("data-badge", window.cards[index].getAttribute("value"));        
    document.getElementsByClassName("level-text")[tab].innerText = "Level " + level;
    var icon = "";
    if (card.getAttribute("value") == "\ue803") {
        icon = "check";
    }
    else if (card.getAttribute("value") == "\ue800") {
        icon = "lock";
    }
    else if (card.getAttribute("value") == "\ue801") {
        icon = "unlock";
    }
    if (level == 1) {
        document.getElementsByClassName("prev-button")[tab].style.visibility = "hidden";
        document.getElementsByClassName("next-button")[tab].style.visibility = "visible";        
    }
    else if (level == 2) {
        document.getElementsByClassName("prev-button")[tab].style.visibility = "visible";
        document.getElementsByClassName("next-button")[tab].style.visibility = "visible";
    }
    else if (level == 3) {
        document.getElementsByClassName("prev-button")[tab].style.visibility = "visible";
        document.getElementsByClassName("next-button")[tab].style.visibility = "hidden";
    }
    card.parentElement.classList.remove(card.parentElement.classList.item(card.parentElement.classList.length - 1));
    card.parentElement.classList.add(icon);
}

function setupTabs() {
    //TODO: Finish programatically setting up tabs
    var tabs = document.getElementById("tabBar").children;
    var numTabs = tabs.length;
    var dashboard = document.getElementById("dashboard");
    for (var i = 0; i < numTabs; i++) {
        var tabPanel = document.createElement("div");
        tabPanel.className = "mdl-tabs__panel";
        if (i == 0) {
            tabPanel.className += " is-active";
        }
        tabPanel.id = "tab" + (i+1) + "-panel";
        createLevelTitle(tabPanel);
        createLevelGrid(tabPanel);
        dashboard.appendChild(tabPanel);
    }
}

function createLevelTitle(tabPanel) {
    var grid = document.createElement("div");
    grid.className = "center-items mdl-grid";
    tabPanel.appendChild(grid);
    var cell = document.createElement("div");
    cell.className = "level-text mdl-cell mdl-cell--12-col";
    grid.appendChild(cell);
}

function createLevelGrid(tabPanel) {
    var levelGrid = document.createElement("div");
    levelGrid.className = "mdl-grid card-grid";
    tabPanel.appendChild(levelGrid);
    createNav(levelGrid, "back");
    createCards(levelGrid);
    createNav(levelGrid, "next");
}

function createCards(levelGrid) {
    var cardCell = document.createElement("div");
    cardCell.className = "mdl-cell mdl-cell--8-col mdl-badge card-cell nothing";
    levelGrid.appendChild(cardCell);
    for (var i = 0; i < 3; i++) {
        var card = document.createElement("div");
        card.className = "mdl-card";
        card.setAttribute("index", window.cards.length);
        window.cards.push(card);
        var cardTitle = document.createElement("div");
        cardTitle.className = "mdl-card__title card-title";
        card.appendChild(cardTitle);        
        var cardMedia = document.createElement("div");
        cardMedia.className = "mdl-card__media";
        card.appendChild(cardMedia); 
        var image = document.createElement("img");
        image.className = "card-image";
        cardMedia.appendChild(image); 
        var cardText = document.createElement("div");
        cardText.className = "mdl-card__supporting-text card-minutes";
        card.appendChild(cardText);
        var cardButton = document.createElement("div");
        cardButton.className = "mdl-card__actions mdl-card--border";
        card.appendChild(cardButton);
        var button = document.createElement("button");
        button.className = "mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect card-button";
        button.innerText = "Get More Info";
        button.addEventListener("click", function(){
            var recipeId = this.getAttribute("value");
            var recipeName = document.getElementById(recipeId).children[0].innerText;
            // Check if dialog box already contains correct recipe
            if (document.getElementById('alertDialogTitle').innerText == recipeName) {
                document.getElementById('alertDialog').showModal();
                return;
            }
            sendGetRequestForJSON("/getARecipe/", {'recipe': recipeName}, 
            function(response) {
                if (response.success) {
                    var dialog = document.getElementById('alertDialog');
                    var recipe = response.recipe;
                    recipe.instructions = JSON.parse(recipe.instructions);
                    recipe.ingredients = JSON.parse(recipe.ingredients);
                    recipe.equipment = JSON.parse(recipe.equipment);
                    recipe.skills = JSON.parse(recipe.skills);
                    recipe.dangers = JSON.parse(recipe.dangers);
                    document.getElementById('alertDialogTitle').innerText = recipe.name;
                    document.getElementById('alertDialogTime').innerText = "Ready In: " + recipe.minutes;
                    document.getElementById('alertDialogImage').src = getStaticResource('images/recipes/' + recipeId + '.jpg');
                    createChipsGrid('dangersGrid', recipe.dangers);
                    createChipsGrid('skillsGrid', recipe.skills);
                    createImageGridFromArray('ingredientGrid', recipe.ingredients, getIngredientImage);
                    createImageGridFromArray('equipmentGrid', recipe.equipment, getEquipmentImage);
                    createInstructionTable('instructionsTable', recipe.instructions);
                    dialog.showModal();
                }
                else {
                    alert(response.reason);
                }
            });
        });
        cardButton.appendChild(button);
    }
}

function createNav(levelGrid, direction) {
    var buttonCell = document.createElement("div");
    buttonCell.className = "mdl-cell mdl-cell--2-col button-cell";
    levelGrid.appendChild(buttonCell);
    var navButton = document.createElement("button");
    navButton.className = "mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect nav-button";
    navButton.addEventListener("click", function() {
        var cardIndex = parseInt(this.parentElement.parentElement.children[1].firstChild.getAttribute("index"));
        var buttonType = this.classList[this.classList.length - 1];
        if (buttonType == "next-button")
            cardIndex += 1;
        else if (buttonType == "prev-button")
            cardIndex -= 1;
        showCard(cardIndex);
    });
    buttonCell.appendChild(navButton);
    var span = document.createElement("span");
    span.className = "material-icons nav-icon";
    if (direction == "next") {
        navButton.className += " next-button";
        span.innerText = "arrow_forward";
    }
    else if (direction == "back") {
        navButton.className += " prev-button";
        span.innerText = "arrow_back";        
    }
    navButton.appendChild(span);
}


function isUnlocked(element) {
    return (element.getAttribute("value") == "\ue803");
}

function setBadge(card, icon) {
    if (icon == "check") {
        card.setAttribute("value", "\ue803")
        card.classList.add("mdl-shadow--2dp");
    }
    else if (icon == "lock") {
        card.setAttribute("value", "\ue800");    
        card.children[3].firstElementChild.disabled = true;     
    }
    else if (icon == "unlock") {
        card.setAttribute("value", "\ue801");                
        card.classList.add("mdl-shadow--8dp");        
    }
    else {
        return;
    }
}

function createChipsGrid(holderId, arr) {
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
        var text = document.createElement('span');
        text.className = "mdl-chip__text"
        text.innerText = arr[i];
        if (holderId == "skillsGrid") {
            skill.style.backgroundColor = "#e6c21c";
            if (window.userSkills.indexOf(arr[i]) > -1) {
                skill.style.backgroundColor = "green"
            }
        }
        else if (holderId == "dangersGrid") {
            skill.style.backgroundColor = "red";
            
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
