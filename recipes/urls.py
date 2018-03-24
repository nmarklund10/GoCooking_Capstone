from django.urls import path
from . import views

app_name = "recipes"
urlpatterns = [
    path('dashboard/', views.show_dashboard, name='dashboard_url'),
    path('getRecipes/', views.get_recipes),
    path('getARecipe/', views.get_specific_recipe),
    path('cooking/', views.show_cooking_page),
]
