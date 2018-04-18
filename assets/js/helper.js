function goToUrl(url) {
    window.location = url;
}

function getStaticResource(url) {
    return '/static/' + url
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function remove(array, element) {
    var index = array.indexOf(element);
    if (index > -1) {
        array.splice(index, 1);
    }
}

function hideElementById(id) {
    document.getElementById(id).style.visibility="hidden";
}

function showElementById(id) {
    document.getElementById(id).style.visibility="visible";
}

function getIngredientImage(ingredient) {
    path = 'images/recipes/ingredients/';
    ingredient = ingredient.toLowerCase();
    if(ingredient.includes("english muffin")) {
        return getStaticResource(path + 'english_muffin.jpg');
    }
    else if(ingredient.includes("egg white")) {
        return getStaticResource(path + 'egg_whites.jpg');
    }
    else if(ingredient.includes("egg")) {
        return getStaticResource(path + 'egg.jpg');
    }
    else if(ingredient.includes("cooking spray")) {
        return getStaticResource(path + 'cooking_spray.jpg');
    }
    else if(ingredient.includes("heavy whipping cream")) {
        return getStaticResource(path + 'heavy_whipping_cream.jpg');
    }
    else if(ingredient.includes("salt") && ingredient.includes("pepper")) {
        return getStaticResource(path + 'salt_and_pepper.jpg');
    }
    else if(ingredient.includes("salt")) {
        return getStaticResource(path + 'salt.jpg');
    }
    else if(ingredient.includes("pepper")) {
        return getStaticResource(path + 'pepper.jpg');
    }
    else if(ingredient.includes("swiss cheese")) {
        return getStaticResource(path + 'swiss_cheese.jpg');
    }
    else if(ingredient.includes("ham")) {
        return getStaticResource(path + 'ham.jpg');
    }
    else if(ingredient.includes("olive oil")) {
        return getStaticResource(path + 'olive_oil.jpg');
    }
    else if(ingredient.includes("broccoli")) {
        return getStaticResource(path + 'broccoli.jpg');
    }
    else if(ingredient.includes("red bell pepper")) {
        return getStaticResource(path + 'red_bell_pepper.jpg');
    }
    else if(ingredient.includes("sweet onion")) {
        return getStaticResource(path + 'sweet_onion.jpg');
    }
    else if(ingredient.includes("olive")) {
        return getStaticResource(path + 'olive.jpg');
    }
    else if(ingredient.includes("whole milk")) {
        return getStaticResource(path + 'whole_milk.jpg');
    }
    else if(ingredient.includes("feta cheese")) {
        return getStaticResource(path + 'feta_cheese.jpg');
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
    else if(ingredient.includes("bread flour")) {
        return getStaticResource(path + 'bread_flour.jpg');
    }
    else if(ingredient.includes("water")) {
        return getStaticResource(path + 'water.jpg');
    }
    else if(ingredient.includes("milk powder")) {
        return getStaticResource(path + 'milk_powder.jpg');
    }
    else if(ingredient.includes("yeast")) {
        return getStaticResource(path + 'yeast.jpg');
    }
    else if(ingredient.includes("brown sugar")) {
        return getStaticResource(path + 'brown_sugar.jpg');
    }
    else if(ingredient.includes("sugar")) {
        return getStaticResource(path + 'sugar.jpg');
    }
    else if(ingredient.includes("butter")) {
        return getStaticResource(path + 'butter.jpg');
    }
    else {
        return "";
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
    else if(equipment.includes("skillet with cover")) {
        return getStaticResource(path + 'skillet_with_cover.jpg');
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
    else if(equipment.includes("toaster")) {
        return getStaticResource(path + 'toaster.jpg');
    }
    else if(equipment.includes("whisk")) {
        return getStaticResource(path + 'whisk.jpg');
    }
    else if(equipment.includes("sheet pan")) {
        return getStaticResource(path + 'sheet_pan.jpg');
    }
    else if(equipment.includes("parchment paper")) {
        return getStaticResource(path + 'parchment_paper.jpg');
    }
    else if(equipment.includes("pastry brush")) {
        return getStaticResource(path + 'pastry_brush.jpg');
    }
    else if(equipment.includes("roller") || equipment.includes("rolling pin")) {
        return getStaticResource(path + 'rolling_pin.jpg');
    }
    else if(equipment.includes("mixer")) {
        return getStaticResource(path + 'mixer.jpg');
    }
    else if(equipment.includes("board")) {
        return getStaticResource(path + 'cooking_board.jpg');
    }
    else if(equipment.includes("measuring cup")) {
        return getStaticResource(path + 'measuring_cup.jpg');
    }
    else if(equipment.includes("plastic wrap")) {
        return getStaticResource(path + 'plastic_wrap.jpg');
    }
    else {
        return "";
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