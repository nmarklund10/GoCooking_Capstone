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
}

function moreInfo(recipe) {
    if (recipe == "egg1") {

    }
}