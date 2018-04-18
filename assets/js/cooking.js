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
    window.currentQuestion = 0;
    window.score = 0;
    document.getElementById("skillClose").addEventListener("click", function() {
        document.getElementById("skillDialog").close();
    });
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
    window.speechSynthesis.cancel();
    document.getElementById('currentStep').innerText = window.recipe.instructions[stepNumber];
    document.getElementById('stepTitle').innerText = "Step " + (window.stepNumber + 1) + "/" + window.recipe.instructions.length;
    document.getElementById('currentGif').src = "";
    document.getElementById('currentGif').src = getGif(window.recipe.instructions[stepNumber]);
    setTimer(window.recipe.instructions[stepNumber]);    
    if (window.stepNumber == 0) {
        hideElementById('prevButton');
    }
    else if (window.stepNumber == (window.recipe.instructions.length - 1)) {
        document.getElementById('nextButton').innerHTML = '<span id="nextButtonIcon" class="material-icons" style="color: green; font-size:10vh;">check_circle</span>'
        document.getElementById('nextButton').onclick = function() { window.speechSynthesis.cancel(); document.getElementById('alertDialog').showModal(); };
    }
    else {
        document.getElementById('nextButton').innerHTML = '<span id="nextButtonIcon" class="material-icons" style="font-size:10vh;">arrow_forward</span>'
        document.getElementById('nextButton').onclick = nextStep;        
        showElementById('prevButton');        
    }
}


function exitWindow() {
    window.speechSynthesis.cancel();
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

function getImageValue(src) {
    src = src.substr(src.length - 5);
    if (src == "1.jpg")
        return 1;
    if (src == "3.jpg")
        return 3;
    if (src == "5.jpg")
        return 5;
}

function sayStep() {
    if (speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        if (window.startSpeaking !== null) {
            clearTimeout(window.startSpeaking)
        }
        window.startSpeaking = setTimeout(function() { sayStep(); }, 250);
    }
    else {
        var msg = new SpeechSynthesisUtterance(document.getElementById("currentStep").innerText);
        window.speechSynthesis.speak(msg);
    }
}

function nextAssessment() {
    var div = document.getElementById("assessment");
    window.currentQuestion++;    
    if (window.currentQuestion == 1) {
        window.score += getImageValue(window.selectedImage.src);
        window.selectedImage = null;
        document.getElementById("assessmentQuestion").innerText = "How satisfied are you with the dish you made?";
    }
    else if (window.currentQuestion == recipe.skills.length + 2) {
        window.score += window.selectedValue;        
        window.score /= (window.recipe.skills.length + 2).toFixed(2);
        if (window.score >= 3.5) {
            sendPostRequest("/passed/", {"recipe": window.recipe.name}, 
            function(response) {
                if (response.success) {
                    document.getElementById('failMessage').innerText = "Score: " + window.score + "\nCongratulations, you got a high enough score to pass this recipe.";
                    document.getElementById('failScreen').showModal();
                }
                else {
                    alert(response.reason);
                }
            });
        }
        else {
            document.getElementById('failMessage').innerText = "Score: " + window.score + "\nUnfortunately, you did not get a high enough score to pass this recipe.";
            document.getElementById('failScreen').showModal();
        }
        return;
    }
    else {
        document.getElementById("assessmentQuestion").innerText = "How confident are you now in " + recipe.skills[window.currentQuestion - 2] + "?";
        window.score += window.selectedValue;
        console.log(window.selectedValue);
    }
    document.getElementById("questionCounter").innerText = "Question " + (window.currentQuestion + 1) + "/" + (recipe.skills.length + 2) + ":";
    div.innerHTML = "";
    var grid = document.createElement("div");
    grid.className = "mdl-grid assess";
    div.appendChild(grid);
    var cell = document.createElement("div");
    cell.className = "mdl-cell mdl-cell--1-col choicePad";
    grid.appendChild(cell);
    for (var i = 0; i < 5; i++) {
        cell = document.createElement("div");
        cell.className = "mdl-cell mdl-cell--2-col choice";
        cell.setAttribute("value", i+1);
        cell.addEventListener("click", function() {
            document.getElementById("")
            window.selectedValue = parseInt(this.getAttribute("value"));
            var choices = document.getElementsByClassName("choice");
            for (var j = 0; j < 5; j++) {
                choices[j].className = "mdl-cell mdl-cell--2-col choice";
            }
            this.className = "mdl-cell mdl-cell--2-col choice selectedChoice";
            nextAssessment();
        });
        grid.appendChild(cell);
        if (i == 0) {
            if (window.currentQuestion == 1) {
                cell.innerText = "1\nHated it";
            }
            else {
                cell.innerText = "1\nNot at All";
            }
        }
        else if (i == 4) {
            if (window.currentQuestion == 1) {
                cell.innerText = "5\nLoved it";
            }
            else {
                cell.innerText = "5\nVery Confident";
            }
        }
        else {
            cell.innerText = i+1;
        }
    }
    cell = document.createElement("div");
    cell.className = "mdl-cell mdl-cell--1-col choicePad";
    grid.appendChild(cell);
}

function finishRecipe() {
    if (window.interval != undefined) {
        clearInterval(window.interval);
    }
    var images = document.getElementsByClassName('assessPics');
    var name = window.recipe.filename;
    var sources = [name + "_" + 1, name + "_" + 3, name + "_" + 5];
    var selectedSource = sources[getRandomInt(0, 2)];
    images[0].src = getStaticResource("images/recipes/evaluation/" + selectedSource + ".jpg");
    remove(sources, selectedSource);
    selectedSource = sources[getRandomInt(0, 1)];
    images[1].src = getStaticResource("images/recipes/evaluation/" + selectedSource + ".jpg");
    remove(sources, selectedSource);
    images[2].src = getStaticResource("images/recipes/evaluation/" + sources[0] + ".jpg");
    for (var i = 0; i < 3; i++) {
        images[i].addEventListener("click", nextAssessment);
    }
    document.getElementById('assessmentDialog').showModal();
}

function getGif(instruction) {
    path = 'gifs/';
    highlightSkill(instruction);
    instruction = instruction.toLowerCase();
    if(window.recipe.filename == "bread1" || window.recipe.filename == "egg1") {
        return getStaticResource(path + window.recipe.filename + '_step' + (window.stepNumber + 1) +'.gif');
    }
    else if(instruction.includes("")) {
        return getStaticResource(path + 'cooking.gif');
    }
    else {
        return "";        
    }
}

function highlightSkill(instruction) {
    var original = instruction
    instruction = instruction.toLowerCase();
    var i = -1;
    var skill = "";
    var skillDesc = ""
    if ((i = instruction.indexOf("knead")) > -1) {
        skill = "Knead";
        length = getLength(instruction.substr(i));
        original = original.slice(0, i) + '<span id="skill">' + original.substr(i, length) + '</span>' + original.slice(i+length);
        skillDesc = "When kneading dough, the dough is placed on a floured surface, pressed and stretched with the heel of the hand and folded over repeatedly. This is done to warm and stretch the gluten strands in the bread, creating a springy and elastic dough. If the dough is not kneaded enough, it will end up heavy and dense.";        
    }
    else if ((i = instruction.indexOf("proof")) > -1) {
        skill = "Proof";
        length = getLength(instruction.substr(i));
        original = original.slice(0, i) + '<span id="skill">' + original.substr(i, length) + '</span>' + original.slice(i+length);
        skillDesc = "Proofing refers to the rest period before baking in which dough rises. This is done to leaven the bread.";
    }
    else if ((i = instruction.indexOf("egg wash")) > -1) {
        skill = "Egg Wash";
        length = getLength(instruction.substr(i + 4)) + 4;
        original = original.slice(0, i) + '<span id="skill">' + original.substr(i, length) + '</span>' + original.slice(i+length);
        skillDesc = "An egg wash is beaten eggs, sometimes mixed with another liquid such as water or milk, which is sometimes brushed onto the surface of a pastry before baking. This is done to make pastries shiny and golden or brown in color, and it also is used to help toppings or coatings stick to the surface of the pastry, or to bind pastry parts together.";
    }
    else {
        return;
    }
    document.getElementById("currentStep").innerHTML = original;
    document.getElementById("skill").addEventListener("click", function() {
        document.getElementById("skillName").innerText = skill;
        document.getElementById("skillDescription").innerText = skillDesc;
        document.getElementById("skillDialog").showModal();        
    });
}

function getLength(substring) {
    var nextWord = [" ", ".", ",", ":", "!", "?"];    
    var length;
    for (var i = 0; i < nextWord.length; i++) {
        if ((length = substring.indexOf(nextWord[i])) > -1) {
            return length;
        }
    }
    return -1;
}