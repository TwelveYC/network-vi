from django.urls import path
from . import views

app_name='generate'
urlpatterns = [
    path("main/",views.NetworkGenerate.as_view(),name="main")
]