from django.shortcuts import render
from django.http import HttpResponse, HttpRequest, JsonResponse
from django.db import connection
from django.views.decorators.csrf import csrf_exempt
import json 

# Create your views here.

def search(query, parameters):
    profile = connection.cursor()
    profile.execute(query,parameters)

    r = profile.fetchone()
    return r

def getDates(request):
    cursor = connection.cursor()
    cursor.execute("SELECT MIN(timestamp) FROM app.reviews")
    bot = cursor.fetchone()

    cursorb = connection.cursor()
    cursorb.execute("SELECT MAX(timestamp) FROM app.reviews")
    top = cursorb.fetchone()

    data = {'min': bot,
            'max': top}

    return JsonResponse(data, status=200)

@csrf_exempt
def filter(request):

    data = json.loads(request.body)
    print(data)

    general_query = "SELECT * FROM app.reviews WHERE timestamp >= %s AND timestamp <= %s"

    if data["start-date"] != -1 and data["finish-date"] != -1:
        general_query += "timestamp >= %s AND timestamp <= %s"
    

    if data["profileName"] != '':
        query = "SELECT userscol FROM app.users WHERE profileName=%s"
        parameters = (data["profileName"],)

        profileId = search(query, parameters)
        print(profileId)

    if data["productId"] != -1:
        query = "SELECT productcol FROM app.products WHERE productId=%s"
        parameters = (data["profileName"],)

        productId = search(query, parameters)
        print(profileId)

    print()
    return JsonResponse({'data':20}, status=200)