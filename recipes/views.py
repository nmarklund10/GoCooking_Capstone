import requests
import json
import re
from django.shortcuts import render, render_to_response
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.http import JsonResponse
from .models import Recipe

# Create your views here.


def show_dashboard(request):
    if 'logged_in' not in request.session:
        return HttpResponseRedirect(reverse('login:login_url'))
    return render(request, 'templates/dashboard.html', {})


def create_new_recipe():
    recipe = "error"
    while (recipe == "error"):
        recipe = get_recipe_from_API()
        recipe = parse_recipe(recipe)
    return recipe

def get_recipe_from_API():
    response = requests.get("https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/random?number=1",
                            headers={
                                "X-Mashape-Key": "HuB8xlNOrjmshFwdHdwPXXIsaDUTp1CapSWjsnazvGBPrRvNUW",
                                "X-Mashape-Host": "spoonacular-recipe-food-nutrition-v1.p.mashape.com"
                            }
                            )
    recipe = json.loads(response.text)["recipes"][0]
    return recipe


def parse_recipe(recipe):
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
