import requests
import json
import re
from django.shortcuts import render, render_to_response
from django.http import HttpResponse
from .models import Recipe

# Create your views here.


def index(request):
    recipe_list = Recipe.objects.all()
    return render_to_response('templates/login.html')


def getRecipes(request):
    recipe = "error"
    while (recipe == "error"):
        recipe = getRecipeFromAPI()
        recipe = parseRecipe(recipe)
    return index("")


def getRecipeFromAPI():
    response = requests.get("https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/random?number=1",
                            headers={
                                "X-Mashape-Key": "HuB8xlNOrjmshFwdHdwPXXIsaDUTp1CapSWjsnazvGBPrRvNUW",
                                "X-Mashape-Host": "spoonacular-recipe-food-nutrition-v1.p.mashape.com"
                            }
                            )
    recipe = json.loads(response.text)["recipes"][0]
    return recipe


def parseRecipe(recipe):
    try:
        name = recipe["title"]
        if(len(name) > 256):
            return "error"
        try:
            Recipe.objects.get(name=name)
            return "error"
        except Recipe.DoesNotExist:
            pass
        minutes = recipe["readyInMinutes"]
        image = recipe["image"]
        instructions = []
        equipment = set()
        for s in recipe["analyzedInstructions"][0]["steps"]:
            # remove more than one space in a row
            step = re.sub(' +', ' ', s["step"])
            # add space after punctuation
            step = re.sub('(\.|\?|\!|\))(?!( |\.|\)))', '\\1 ', step).rstrip()
            instructions.append(step)
            # get equipment
            for e in s["equipment"]:
                equip = e["name"]
                equipment.add(equip)
        instructions = json.dumps(instructions)
        equipment = json.dumps(list(equipment))
        ingredients = []
        for i in recipe["extendedIngredients"]:
            ingredients.append(i["originalString"])
        ingredients = json.dumps(
            ingredients, ensure_ascii=False).encode('utf8')
    except Exception as e:
        print(str(e))
        return "error"
    else:
        r = Recipe(name=name, minutes=minutes, instructions=instructions,
                   ingredients=ingredients, equipment=equipment, image_url=image)
        r.save()
        return r
