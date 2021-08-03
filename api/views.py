from django.shortcuts import render
from django.http import HttpResponse, HttpRequest, JsonResponse
from django.db import connection
from django.views.decorators.csrf import csrf_exempt
import json 
from datetime import datetime
import time
# Create your views here.

def formatDate(timestamp):
    date = datetime.fromtimestamp( int(timestamp))
    return date.strftime('%Y-%m-%d')

def getTimestamp(date):
    return time.mktime(datetime.strptime(date, "%Y-%m-%d").timetuple())

def formatYear(timestamp):
    date = datetime.fromtimestamp( int(timestamp))
    year = date.strftime('%Y')
    month = date.strftime('%m')
    day = date.strftime('%d')

    top = year + "-12-31"
    bot = year + "-" + month + "-" + day

    return getTimestamp(top), getTimestamp(bot)

def create_chartdata(filter):
    scores = []
    help = []
    years = []

    for i in filter:
        years.append(i[0])
        scores.append(i[1])
        help.append(i[2])
    return [years,scores, help]

def search(query, parameters):
    profile = connection.cursor()
    profile.execute(query,parameters)
    r = profile.fetchone()
    return r

def getDates(request):
    cursor = connection.cursor()
    cursor.execute("SELECT MIN(CAST(timestamp AS DATE)) FROM app.reviews")
    bot = cursor.fetchone()[0]

    cursorb = connection.cursor()
    cursorb.execute("SELECT MAX(CAST(timestamp AS DATE)) FROM app.reviews")
    top = cursorb.fetchone()[0]

    data = {'min': bot,
            'max': top}

    return JsonResponse(data, status=200)

cache = None

@csrf_exempt
def filter(request):
    global cache

    data = json.loads(request.body)

    general_query = "SELECT COUNT(DISTINCT usercol), AVG(score), MIN(score), MAX(score) FROM app.reviews " 
    table_query = "SELECT p.productId, u.usersId, r.score, r.helpfulness, t.summary FROM app.reviews r, app.products p, app.users u, app.texts t "
    table_filter = " WHERE CAST(timestamp AS DATE) >= %s AND CAST(timestamp AS DATE) <= %s "
    table_values = [data["start-date"],data["finish-date"]]


    graph_query = "SELECT YEAR(timestamp), ROUND(SUM(score) / COUNT(score), 2) AS sum_of_year, ROUND(sum(helpfulness) / COUNT(score), 2) as help_of_year FROM app.reviews "

    general_filter = "WHERE CAST(timestamp AS DATE) >= %s AND CAST(timestamp AS DATE) <= %s"
    general_values = [data["start-date"],data["finish-date"]]

    if "profileName" in data and data["profileName"] != '':
        query = "SELECT userscol FROM app.users WHERE profileName=%s"
        parameters = (data["profileName"],)

        profileId = search(query, parameters)

        _toadd = " AND usercol = %s "
        general_values.append(profileId)
        general_filter += _toadd

        _toadd =  " AND u.profileName = %s  "
        table_filter += _toadd
        table_values.append(data["profileName"])

    if data["productId"] != '':
        query = "SELECT productcol FROM app.products WHERE productId=%s"
        parameters = (data["productId"],)

        productId = search(query, parameters)

        _toadd = " AND productcol = %s "

        general_values.append(productId)
        general_filter += _toadd

        _toadd = " AND p.productId = %s "
        table_filter += _toadd
        table_values.append( data["productId"])

    cursor = connection.cursor()
    cursora = connection.cursor()
    cursorb = connection.cursor()
    cursorc = connection.cursor()
    # GROUP BY YEAR(timestamp) ORDER BY SUM(score) DESC
    cursor.execute(general_query + general_filter, general_values)

    _cache = table_query + table_filter + " AND r.productcol = p.productcol AND r.usercol = u.userscol AND r.textId = t.textId ORDER BY score DESC LIMIT 10"
    cursora.execute( _cache, table_values)

    _cache = table_query + table_filter + " AND r.productcol = p.productcol AND r.usercol = u.userscol AND r.textId = t.textId ORDER BY score ASC LIMIT 10"
    cursorb.execute(_cache, table_values)
    
    cursorc.execute(graph_query + general_filter + "GROUP BY YEAR(timestamp) ORDER BY YEAR(timestamp) ASC", general_values)
    d = cursorc.fetchall()

    r = cursor.fetchone()

    if None in r:
        r = [0,0,0,0]

    cache = {'cantidad': r[0],
             'promedio': round(r[1],2),
             'min': r[2],
             'max': r[3],
             'top': list(cursora.fetchall()),
             'bot': list(cursorb.fetchall()),
             'chart': create_chartdata(d)
            }



    return JsonResponse(cache, status=200)