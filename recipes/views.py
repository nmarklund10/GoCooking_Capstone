import requests
import json
import re
import urllib
from django.shortcuts import render, render_to_response
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.http import JsonResponse
from django.apps import apps
from .models import Recipe
# Create your views here.

User = apps.get_model('login', 'User')

def recipe_to_json(recipe):
    return {'filename': recipe.filename, 'name': recipe.name, 'minutes': recipe.minutes, 'instructions': recipe.instructions.replace("'", '"') , 'ingredients': recipe.ingredients.replace("'", '"'), 'equipment': recipe.equipment.replace("'", '"'), 'skills': recipe.skills.replace("'", '"')}

def show_dashboard(request):
    if 'logged_in' not in request.session:
        return HttpResponseRedirect(reverse('login:login_url'))
    request.session.pop('recipe', None) 
    return render(request, 'templates/dashboard.html', {})

def get_recipes(request):
    if request.method == 'GET':
        result = []
        all_recipes = Recipe.objects.all()
        for r in all_recipes:
            r = {'filename': r.filename, 'name': r.name, 'time': r.minutes}
            result.append(r)   
        return JsonResponse({'success': True, 'recipes': json.dumps(result)})
    else:
        return JsonResponse({'success': False, 'reason': 'Error has occured on the server.'})

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

def add_completed_recipe_and_skills(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        for k in data:
            print(k);
        try:
            user = User.objects.get(email=request.session.get('email'))
        except User.DoesNotExist:
            return JsonResponse({'success': False, 'reason': 'User not found.'})
        recipes_completed = json.loads(user.recipes_completed)
        if data["recipe"] not in recipes_completed:
            recipes_completed.append(data["recipe"])
            user.recipes_completed = json.dumps(recipes_completed)
            user.save()
        skills_learned = json.loads(user.skills_learned)
        try:
            recipe = Recipe.objects.get(name=data["recipe"])
        except Recipe.DoesNotExist:
            return JsonResponse({'success': False, 'reason': 'Recipe not found.'})
        skills = json.loads(recipe.skills.replace("'", '"'))
        for s in skills:
            if s not in skills_learned:
                skills_learned.append(s)
        user.skills_learned = json.dumps(skills_learned)
        user.save()
        return JsonResponse({'success': True})
    else:
        return JsonResponse({'success': False, 'reason': 'Error has occured on the server.'})

# def create_new_recipe():
#     recipe = "error"
#     while (recipe == "error"):
#         recipe = get_recipe_from_API()
#         recipe = parse_recipe(recipe)
#     return recipe

# def get_recipe_from_API():
#     response = requests.get("https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/random?number=1",
#                             headers={
#                                 "X-Mashape-Key": "HuB8xlNOrjmshFwdHdwPXXIsaDUTp1CapSWjsnazvGBPrRvNUW",
#                                 "X-Mashape-Host": "spoonacular-recipe-food-nutrition-v1.p.mashape.com"
#                             }
#                             )
#     recipe = json.loads(response.text)["recipes"][0]
#     return recipe


# def parse_recipe(recipe):
#     try:
#         name = recipe["title"]
#         if(len(name) > 256):
#             return "error"
#         try:
#             Recipe.objects.get(name=name)
#             return "error"
#         except Recipe.DoesNotExist:
#             pass
#         minutes = recipe["readyInMinutes"]
#         image = recipe["image"]
#         instructions = []
#         equipment = set()
#         for s in recipe["analyzedInstructions"][0]["steps"]:
#             # remove more than one space in a row
#             step = re.sub(' +', ' ', s["step"])
#             # add space after punctuation
#             step = re.sub('(\.|\?|\!|\))(?!( |\.|\)))', '\\1 ', step).rstrip()
#             instructions.append(step)
#             # get equipment
#             for e in s["equipment"]:
#                 equip = e["name"]
#                 equipment.add(equip)
#         instructions = json.dumps(instructions)
#         equipment = json.dumps(list(equipment))
#         ingredients = []
#         for i in recipe["extendedIngredients"]:
#             ingredients.append(i["originalString"])
#         ingredients = json.dumps(
#             ingredients, ensure_ascii=False).encode('utf8')
#     except Exception as e:
#         print(str(e))
#         return "error"
#     else:
#         r = Recipe(name=name, minutes=minutes, instructions=instructions,
#                    ingredients=ingredients, equipment=equipment, image_url=image)
#         r.save()
#         return r
