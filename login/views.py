from django.shortcuts import render, render_to_response
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse

# Create your views here.
def root(request):
    return HttpResponseRedirect(reverse('login:login_url'))

def login(request):
    return render_to_response('templates/login.html')