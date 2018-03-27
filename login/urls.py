from django.urls import path
from . import views

app_name = 'login'
urlpatterns = [
    path('', views.root, name='root_url'),
    path('login/', views.login, name='login_url'),
    path('verifyToken/', views.verify_token),
    path('login/create', views.create_user),
    path('about/', views.about_page),
    path('logout/', views.log_out),
    path('name/', views.get_name),
    path('completedRecipes/', views.get_completed_recipes),
]
