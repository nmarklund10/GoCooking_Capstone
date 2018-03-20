function getRecipes() {
    sendGetRequestForJSON('/getRecipes', {'track': 'eggs'},
    function(response) {
        if (response.success) {
            document.getElementById('egg1-title').innerText = response.easy['name']
            document.getElementById('egg1-time').innerText = response.easy['time']
            document.getElementById('egg1-image').src = getStaticResource(response.easy['image'])
            document.getElementById('egg2-title').innerText = response.medium['name']
            document.getElementById('egg2-time').innerText = response.medium['time']
            document.getElementById('egg2-image').src = getStaticResource(response.medium['image'])
            document.getElementById('egg3-title').innerText = response.hard['name']
            document.getElementById('egg3-time').innerText = response.hard['time']
            document.getElementById('egg3-image').src = getStaticResource(response.hard['image'])
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
            document.getElementById('chicken1-image').src = getStaticResource(response.easy['image'])
            document.getElementById('chicken2-title').innerText = response.medium['name']
            document.getElementById('chicken2-time').innerText = response.medium['time']
            document.getElementById('chicken2-image').src = getStaticResource(response.medium['image'])
            document.getElementById('chicken3-title').innerText = response.hard['name']
            document.getElementById('chicken3-time').innerText = response.hard['time']
            document.getElementById('chicken3-image').src = getStaticResource(response.hard['image'])
        }
        else {
            alert(response.reason);
        }
    });
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
            window.dialogButton.addEventListener('click', 
                function() {
                    console.log("hello")
                });
            window.dialog.showModal();
        }
        else {
            alert(response.reason);
        }
    });
}