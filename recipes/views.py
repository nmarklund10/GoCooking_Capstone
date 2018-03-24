import requests
import json
import re
import urllib
from django.shortcuts import render, render_to_response
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.http import JsonResponse
from .models import Recipe
# Create your views here.

def recipe_to_json(recipe):
    return {'name': recipe.name, 'minutes': recipe.minutes, 'instructions': recipe.instructions.replace("'", '"') , 'ingredients': recipe.ingredients.replace("'", '"'), 'equipment': recipe.equipment.replace("'", '"'), 'image': recipe.image_url}

def show_dashboard(request):
    if 'logged_in' not in request.session:
        return HttpResponseRedirect(reverse('login:login_url'))
    request.session.pop('recipe', None) 
    return render(request, 'templates/dashboard.html', {})

def get_recipes(request):
    if request.method == 'GET':
        track = json.loads(request.GET.get('params'))['track']
        if (track == 'eggs'):
            recipe1 = Recipe.objects.get(name='Muffin Morning Makers')
            recipe2 = Recipe.objects.get(name='Ham and Cheese Omelet')
            recipe3 = Recipe.objects.get(name='Vegetable Stovetop Frittata')
            easy_recipe = {'name': recipe1.name, 'time': recipe1.minutes, 'image': recipe1.image_url}
            medium_recipe = {'name': recipe2.name, 'time': recipe2.minutes, 'image': recipe2.image_url}
            hard_recipe = {'name': recipe3.name, 'time': recipe3.minutes, 'image': recipe3.image_url}
            return JsonResponse({'success': True, 'easy': easy_recipe, 'medium': medium_recipe, 'hard': hard_recipe})
        if (track == 'chicken'):
            recipe1 = Recipe.objects.get(name='Chicken 1')
            recipe2 = Recipe.objects.get(name='Chicken 2')
            recipe3 = Recipe.objects.get(name='Chicken 3')
            easy_recipe = {'name': recipe1.name, 'time': recipe1.minutes, 'image': recipe1.image_url}
            medium_recipe = {'name': recipe2.name, 'time': recipe2.minutes, 'image': recipe2.image_url}
            hard_recipe = {'name': recipe3.name, 'time': recipe3.minutes, 'image': recipe3.image_url}
            return JsonResponse({'success': True, 'easy': easy_recipe, 'medium': medium_recipe, 'hard': hard_recipe})
        return JsonResponse({'success': False, 'reason':'Recipes not found'})
    else:
        return JsonResponse({'success': False, 'reason': 'Error has occured on the server.'})

def create_new_recipe():
    recipe = "error"
    while (recipe == "error"):
        recipe = get_recipe_from_API()
        recipe = parse_recipe(recipe)
    return recipe

def get_specific_recipe(request):
    if request.method == 'GET':
        recipe_name = json.loads(request.GET.get('params'))['recipe']
        try:
            recipe = Recipe.objects.get(name=recipe_name) 
        except Recipe.DoesNotExist:
            return JsonResponse({'success': False, 'reason': 'Recipe not found.'})
        request.session['recipe'] = recipe.name;
        recipe = recipe_to_json(recipe)
        return JsonResponse({'success': True, "recipe": recipe})
    else:
        return JsonResponse({'success': False, 'reason': 'Error has occured on the server.'})

def show_cooking_page(request):
    if 'logged_in' not in request.session:
        return HttpResponseRedirect(reverse('login:login_url'))
    else:
        return render(request, 'templates/cooking.html', {"recipe": request.session.get('recipe')})

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
