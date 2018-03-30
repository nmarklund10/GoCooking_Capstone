function getPicName(name) {
    if (name == "Muffin Morning Makers") {
        return "egg1";
    }
    else if (name == "Ham and Cheese Omelet") {
        return "egg2";
    }
    else if (name == "Vegetable Stovetop Frittata") {
        return "egg3";
    }
    else if (name == "Bacon Chicken Sandwiches") {
        return "chicken1";
    }
    else if (name == "Chicken Parmesan") {
        return "chicken2";
    }
    else if (name == "Crispy Fried Chicken") {
        return "chicken3";
    }
}

function setup() {
    sendGetRequestForJSON("/getARecipe/", {'recipe': recipe}, 
    function(response) {
        if (response.success) {
            window.recipe = response.recipe;
            window.recipe.instructions = JSON.parse(recipe.instructions);
            window.recipe.ingredients = JSON.parse(recipe.ingredients);
            window.recipe.equipment = JSON.parse(recipe.equipment);
            window.recipe.skills = JSON.parse(recipe.skills);
            document.getElementById('recipeTitle').innerText = window.recipe.name;
            window.stepNumber = 0;
            updateCurrentStep();
        }
        else
            alert(response.reason);
    });
    document.getElementById('closeDialogButton').onclick = function() { document.getElementById('alertDialog').close(); };
    document.getElementById('cancelDialogButton').onclick = function() { document.getElementById('exitDialog').close(); };
    window.timerSound = new Audio(getStaticResource("audio/timerEnd.mp3"));
    window.selectedImage = null;
}

function nextStep() {
    window.stepNumber++;
    updateCurrentStep();
}

function prevStep() {
    window.stepNumber--;
    updateCurrentStep();
}

function updateCurrentStep() {
    document.getElementById('currentStep').innerText = window.recipe.instructions[stepNumber];
    document.getElementById('stepTitle').innerText = "Step " + (window.stepNumber + 1) + "/" + window.recipe.instructions.length;
    document.getElementById('currentGif').src = getGif(window.recipe.instructions[stepNumber]);
    setTimer(window.recipe.instructions[stepNumber]);    
    if (window.stepNumber == 0) {
        hideElementById('prevButton');
    }
    else if (window.stepNumber == (window.recipe.instructions.length - 1)) {
        document.getElementById('nextButton').innerHTML = '<span id="nextButtonIcon" class="material-icons" style="color: green; font-size:10vh;">check_circle</span>'
        document.getElementById('nextButton').onclick = function() { document.getElementById('alertDialog').showModal(); };
    }
    else {
        document.getElementById('nextButton').innerHTML = '<span id="nextButtonIcon" class="material-icons" style="font-size:10vh;">arrow_forward</span>'
        document.getElementById('nextButton').onclick = nextStep;        
        showElementById('prevButton');        
    }
}


function exitWindow() {
    document.getElementById('exitDialog').showModal();
}


function setTimer(step) {
    step = step.toLowerCase();
    step = step.split(' ');
    var index = -1;
    var minuteIndex = -1;
    for (var i = 0; i < step.length; i++) {
        index = step[i].indexOf("minute");
        if (index > -1) {
            minuteIndex = i - 1;
            break;
        }
    }
    if (index > -1) {
        document.getElementById('timerButton').style.visibility = "visible";
        var length = step[minuteIndex] * 60;
        document.getElementById('timerButton').addEventListener('click', function(){
            document.getElementById('timerButton').style.color = "rgb(33,150,243)"            
            document.getElementById('timerButton').innerText = length + " sec";
            if (window.interval != undefined) {
                clearInterval(window.interval);
            }
            window.interval = setInterval(function(){
                sec = parseInt(document.getElementById('timerButton').innerText.split(" ")[0]) - 1;
                if (sec <= 10) {
                    document.getElementById('timerButton').style.color = "red";
                }
                document.getElementById('timerButton').innerText = sec + " sec";
                if (sec == 0) {
                    clearInterval(window.interval);
                    document.getElementById('timerDialog').showModal();
                    window.timerSound.play();
                }
            }, 1000)
        });
    }
    else {
        document.getElementById('timerButton').style.visibility = "hidden";
    }
    if (window.interval != undefined) {
        clearInterval(window.interval);
        window.interval = undefined;
    }
    document.getElementById('timerButton').style.color = "rgb(33,150,243)"
    document.getElementById('timerButton').innerText = "Start Timer";
}

function closeTimer() {
    document.getElementById('timerButton').style.color = "rgb(33,150,243)"
    document.getElementById('timerButton').innerText = "Start Timer";
    window.timerSound.pause();
    window.timerSound.currentTime = 0;
    document.getElementById('timerDialog').close();
}

function selectImage(i) {
    var allImages = document.getElementsByClassName('assessPics');
    for (var j = 0; j < allImages.length; j++) {
        allImages[j].style.borderColor = "white";
    }
    allImages[i].style.borderColor = "#2196F3";
    window.selectedImage = allImages[i];
}

function getRadioButtonValue(className) {
    radioButtons = document.getElementsByClassName(className);
    checkedValue = -1;
    for (var i = 0; i < radioButtons.length; i++) {
        if (radioButtons[i].checked) {
            checkedValue = parseInt(radioButtons[i].value);
            break;
        }
    }
    return checkedValue;
}

function getImageValue(src) {
    src = src.substr(src.length - 5);
    if (src == "0.jpg")
        return 1;
    if (src == "1.jpg")
        return 3;
    if (src == "2.jpg")
        return 5;
}

function submitAssessment() {
    var score = 0;
    if (window.selectedImage == null) {
        document.getElementById('assessError').showModal();
        return;
    }
    score += getImageValue(window.selectedImage.src);
    var curValue = getRadioButtonValue('satisfy');
    if (curValue == -1) {
        document.getElementById('assessError').showModal();
        return;
    }
    score += curValue;
    for (var i = 0; i < window.recipe.skills.length; i++) {
        curValue = getRadioButtonValue('skill' + i);        
        if (curValue == -1) {
            document.getElementById('assessError').showModal();   
            return;
        }
        score += curValue;
    }
    score /= (window.recipe.skills.length + 2).toFixed(2);
    if (score >= 3.5) {
        sendPostRequest("/passed/", {"recipe": window.recipe.name}, 
        function(response) {
            if (response.success) {
                goToUrl("/dashboard");
            }
            else {
                alert(response.reason);
            }
        });
    }
    else {
        document.getElementById('failScreen').showModal();
    }
}

function finishRecipe() {
    var images = document.getElementsByClassName('assessPics');
    var name = getPicName(window.recipe.name);
    var sources = [name + 0, name + 1, name + 2];
    var selectedSource = sources[getRandomInt(0, 2)];
    images[0].src = getStaticResource("images/recipes/evaluation/" + selectedSource + ".jpg");
    remove(sources, selectedSource);
    selectedSource = sources[getRandomInt(0, 1)];
    images[1].src = getStaticResource("images/recipes/evaluation/" + selectedSource + ".jpg");
    remove(sources, selectedSource);
    images[2].src = getStaticResource("images/recipes/evaluation/" + sources[0] + ".jpg");
    var content = document.getElementById('assessContent');
    var dishGrid = document.createElement('div');
    dishGrid.className = "mdl-grid assess";
    content.appendChild(dishGrid);
    var dishCell = document.createElement('div');
    dishCell.className = "mdl-cell assess";
    dishGrid.appendChild(dishCell);
    var spacer = document.createElement('div');
    spacer.className = "assessSpacer";
    dishCell.appendChild(spacer);
    for (var i = 0; i < 5; i++) {
        var label = document.createElement('label');
        label.className = "mdl-radio mdl-js-radio";
        label.htmlFor = "option" + parseInt(i);
        var input = document.createElement('input');
        input.type = "radio";
        input.id = label.htmlFor;
        input.name = "satisfy";
        input.value = i+1;
        input.className = "mdl-radio__button " + input.name;
        var span = document.createElement('span');
        span.className = "mdl-radio__label";
        span.innerHTML = i+1;
        if (i == 0)
            span.innerHTML += "<br>Not at All";
        else if (i == 4)
            span.innerHTML += "<br>Loved It";            
        dishCell.appendChild(label);
        label.appendChild(input);
        label.appendChild(span);
    }
    for (var i = 0; i < window.recipe.skills.length; i++) {
        var header = document.createElement('div');
        header.innerText = "How confident do you now feel with " + window.recipe.skills[i] + "?";
        header.className = "assessmentQuestion";
        content.appendChild(header);
        var grid = document.createElement('div');
        grid.className = "mdl-grid assess";
        content.appendChild(grid);
        var cell = document.createElement('div');
        cell.className = "mdl-cell assess";
        grid.appendChild(cell);
        var spacer = document.createElement('div');
        spacer.className = "assessSpacer";
        cell.appendChild(spacer);
        for (var j = 0; j < 5; j++) {
            var label = document.createElement('label');
            label.className = "mdl-radio mdl-js-radio";
            label.htmlFor = "option" + parseInt(i) + parseInt(j);
            var input = document.createElement('input');
            input.type = "radio";
            input.id = label.htmlFor;
            input.name = "skill" + i;
            input.value = j+1;
            input.className = "mdl-radio__button " + input.name;
            var span = document.createElement('span');
            span.className = "mdl-radio__label";
            span.innerHTML = j+1;
            if (j == 0)
                span.innerHTML += "<br>Not at All";
            else if (j == 4)
                span.innerHTML += "<br>Very Confident";            
            cell.appendChild(label);
            label.appendChild(input);
            label.appendChild(span);
        }
    }
    componentHandler.upgradeElements(content);
    document.getElementById('assessmentDialog').showModal();
}

function getGif(instruction) {
    path = 'gifs/';
    instruction = instruction.toLowerCase();
    if(instruction.includes("")) {
        return getStaticResource(path + 'cooking.gif');
    }
    else if(instruction.includes("")) {
        return getStaticResource(path + '');
    }
    else {
        return "";        
    }
}