from django.shortcuts import render
from django.http import HttpResponse
from django.db import connection

# Create your views here.

def main(request):
    cursor = connection.cursor()
    cursor.execute("SELECT count(*) FROM app.texts")
    r = cursor.fetchone()
    return HttpResponse(r)

def product_list(request):
    query = "SELECT * FROM products"