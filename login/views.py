import requests
import json
from django.shortcuts import render, render_to_response
from django.http import HttpResponseRedirect
from django.template import RequestContext
from django.urls import reverse
from django.http import JsonResponse
from .models import User

# Create your views here.
def root(request):
    return HttpResponseRedirect(reverse('login:login_url'))

def login(request):
    if 'logged_in' in request.session:
        return HttpResponseRedirect(reverse('recipes:dashboard_url'))
    return render(request, 'templates/login.html', {})

def verify_token(request):
    if request.method == 'POST':
        token = json.loads(request.body)['id_token']
        google_response = requests.get('https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' + token)
        google_user = json.loads(google_response.text)
        name = google_user["name"]
        email = google_user["email"]
        try:
            User.objects.get(email=email)
            request.session['logged_in'] = True
            request.session['name'] = name
            request.session['email'] = email
            return JsonResponse({'success': True})
        except User.DoesNotExist:
            return JsonResponse({'create': True, 'email': email, 'name': name})
    else:
        return JsonResponse({'success': False, 'reason': 'Error has occured on the server.'})

def create_user(request):
    if request.method == 'POST':
        user = json.loads(request.body)
        u = User(name=user['name'], email=user['email'], recipes_completed="[]", skills_learned="[]")
        u.save()
        request.session['logged_in'] = True
        request.session['name'] = u.name
        request.session['email'] = u.email
        return JsonResponse({'success': True})
    else:
        return JsonResponse({'sucess': False, 'reason': 'Error has occured on the server.'})

def about_page(request):
    return render(request, 'templates/about.html', {})

def log_out(request):
    request.session.pop('logged_in', None)
    request.session.pop('name', None)
    request.session.pop('recipe', None)
    request.session.pop('name', None)      
    return HttpResponseRedirect(reverse('login:login_url'))

def get_name(request):
    if request.method == 'GET':
        return JsonResponse({'success': True, 'name': request.session.get('name')})
    else:
        return JsonResponse({'success': False, 'reason': 'Error has occured on the server.'})

def get_recipes_and_skills(request):
    if request.method == 'GET':
        try:
            user = User.objects.get(email=request.session.get('email'))
        except User.DoesNotExist:
            return JsonResponse({'success': False, 'reason': 'User not found'})
        return JsonResponse({'success': True, 'recipes': user.recipes_completed, 'skills': user.skills_learned})
    else:
        return JsonResponse({'success': False, 'reason': 'Error has occured on the server.'})
