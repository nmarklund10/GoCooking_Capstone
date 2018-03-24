function setup() {
    sendGetRequestForJSON("/getARecipe/", {'recipe': recipe}, 
    function(response) {
        if (response.success) {
            window.recipe = response.recipe;
            window.recipe.instructions = JSON.parse(recipe.instructions);
            window.recipe.ingredients = JSON.parse(recipe.ingredients);
            window.recipe.equipment = JSON.parse(recipe.equipment);
            document.getElementById('recipeTitle').innerText = window.recipe.name;
            window.stepNumber = 0;
            updateCurrentStep();
        }
        else
            alert(response.reason);
    });
    sendGetRequestForJSON('/name', {}, 
    function(response){
        if (response.success)
            document.getElementById('appTitle').innerText = document.getElementById('appTitle').innerText + ": " + response.name;
        else
            alert(response.reason);
    })

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
    document.getElementById('stepTitle').innerText = "Step " + (window.stepNumber + 1);
    if (window.stepNumber == 0) {
        hideElementById('prevButton');
    }
    else if (window.stepNumber == (window.recipe.instructions.length - 1)) {
        document.getElementById('nextButton').innerHTML = '<span id="nextButtonIcon" class="material-icons" style="color: green; font-size:10vh;">check_circle</span>'
        document.getElementById('nextButton').onclick = finishRecipe;
    }
    else {
        document.getElementById('nextButton').innerHTML = '<span id="nextButtonIcon" class="material-icons" style="font-size:10vh;">arrow_forward</span>'
        document.getElementById('nextButton').onclick = nextStep;        
        showElementById('prevButton');        
    }
}

function finishRecipe() {
    goToUrl('/dashboard');
}

function getGif(instruction) {
    path = 'gifs/';
    instruction = instruction.toLowerCase();
    if(instruction.includes("")) {
        return getStaticResource(path + '');
    }
    else if(instruction.includes("")) {
        return getStaticResource(path + '');
    }
    else {
        return "";        
    }
}