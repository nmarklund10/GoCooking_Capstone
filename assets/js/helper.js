function goToUrl(url) {
    window.location = url;
}

function getStaticResource(url) {
    return '/static/' + url
}

function getIngredientImage(ingredient) {
    path = 'images/recipes/ingredients/';
    ingredient = ingredient.toLowerCase();
    if(ingredient.includes("english muffin")) {
        return getStaticResource(path + 'english_muffin.jpg');
    }
    else if(ingredient.includes("egg")) {
        return getStaticResource(path + 'egg.jpg');
    }
    else if(ingredient.includes("green onion")) {
        return getStaticResource(path + 'green_onions.jpg');
    }
    else if(ingredient.includes("cheddar cheese")) {
        return getStaticResource(path + 'cheddar_cheese.jpg');
    }
    else if(ingredient.includes("green onion")) {
        return getStaticResource(path + 'green_onions.jpg');
    }
    else if(ingredient.includes("vegetable oil")) {
        return getStaticResource(path + 'vegetable_oil.jpg');
    }
    else if(ingredient.includes("breakfast sausage")) {
        return getStaticResource(path + 'breakfast_sausage.jpg');
    }
    else {
        return getStaticResource('images/members/cameron.png');
    }
}

function getEquipmentImage(equipment) {
    path = 'images/recipes/equipment/';
    equipment = equipment.toLowerCase();
    if(equipment.includes("bowl")) {
        return getStaticResource(path + 'bowl.jpg');
    }
    else if(equipment.includes("fork")) {
        return getStaticResource(path + 'fork.jpg');
    }
    else if(equipment.includes("paper towel")) {
        return getStaticResource(path + 'paper_towels.jpg');
    }
    else if(equipment.includes("skillet")) {
        return getStaticResource(path + 'skillet.jpg');
    }
    else if(equipment.includes("spatula")) {
        return getStaticResource(path + 'spatula.jpg');
    }
    else if(equipment.includes("toaster oven")) {
        return getStaticResource(path + 'toaster_oven.jpg');
    }
    else if(equipment.includes("whisk")) {
        return getStaticResource(path + 'whisk.jpg');
    }
    else {
        return getStaticResource('images/members/cameron.png');
    }
}

function catchGenericError(error) {
    console.log(error);
    window.alert("An error occured on the server.");
}

function sendPostRequest(url, data, success, error=catchGenericError)
{
    sendHTTPRequest(url, data, success, false, true, error);
}

function sendGetRequestForJSON(url,query,success,error=catchGenericError)
{
    sendHTTPRequest(url, query, success, true, true, error);
}

function sendGetRequestForHTML(url,query,success,error=catchGenericError)
{
    sendHTTPRequest(url, query, success, true, false, error);
}

function sendHTTPRequest(url, params, responseHandler, sendGet, handleAsJson, error=catchGenericError)
{
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", function() {
        if (xhr.readyState == 4) {
            var response = xhr.responseText;
            if (xhr.status == 200) {
                if (handleAsJson)
                    response = JSON.parse(response);
                responseHandler(response)
            }
            else {
                error(response);
            }
        }
    }, false);
    if (sendGet) {
        var url = url + "?params=" + encodeURIComponent(JSON.stringify(params));
        xhr.open('GET', url, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.setRequestHeader("X-CSRFToken", csrf_token);
        xhr.send();
    }
    else {
        xhr.open('POST', url, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.setRequestHeader("X-CSRFToken", csrf_token);        
        var data = JSON.stringify(params);
        xhr.send(data);      
    }
}