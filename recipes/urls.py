from django.urls import path
from . import views

app_name = "recipes"
urlpatterns = [
    path('dashboard/', views.show_dashboard, name='dashboard_url'),
    path('getRecipes/', views.test_recipe),
]
