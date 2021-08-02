from django.urls import path
from .views import *

urlpatterns = [
    path('getDates/', getDates, name='getDates'),
    path('filter/', filter, name='filter')
]