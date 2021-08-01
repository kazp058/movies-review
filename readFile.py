import re
import mysql.connector

config = {
  'host': 'localhost',
  'user': 'root',
  'password': '12345',
  'database': 'app',
  'raise_on_warnings': True,
  }

def searchRegex(expression, chunk):
    ex = re.compile(expression)
    result = ex.search(chunk)[1]
    return result

def insert_uniqueid_element(connection,cursor,query,values):
    cursor.execute(query, values)
    connection.commit()

def add_uniqueid_element(connection, addquery, searchquery, searchvalues, addvalues = None):
    new = 0
    if addvalues == None:
        addvalues = searchvalues

    searchcursor = connection.cursor(buffered=True)
    searchcursor.execute(searchquery, searchvalues)
    
    if searchcursor.rowcount ==0:
        new = 1
        insert_uniqueid_element(connection, connection.cursor(buffered=True), addquery, addvalues)
        connection.commit()
        searchcursor.execute(searchquery, searchvalues)
    
    return searchcursor.fetchone()[0], new

def process_helpfulness(expression):
    n1, n2 = expression.strip().split("/")
    if n2 == '0' or n1 == '0':
        return 0
    return round(int(n1)/int(n2), 2)

with open('movies.txt','r', encoding="Latin-1") as f:
    dic = {}
    
    i = 0
    chunk = ""
    keys = ["productId","userId","profileName","helpfulness",
    "score","time","summary","text"]
    regexCodes = [r'product\/productId: (.{10})',r'review\/userId: (.{14})',r'review\/profileName: (.+) review\/h',r'review\/helpfulness: (.+) review\/sc',r'review\/score: (.+) review\/ti',r'review\/time: (.+) review\/su',r'review\/summary: (.+) review\/t',r'review\/text: (.+)']

    current_product = ""
    last_product = ""
    new_entries = [0,0,0]

    cnx = mysql.connector.connect(**config, auth_plugin = 'mysql_native_password')

    for line in iter(f.readline,""):
        if i < 8:
            chunk += line.strip() + " "
            i += 1
        elif i == 8:

            values = []

            for j in range(len(keys)):
                values.append(searchRegex(regexCodes[j], chunk))
            
            check_product = ("SELECT productcol FROM products WHERE productId = %s")
            check_user = ("SELECT userscol FROM users WHERE usersId = %s")
            #check_text = ("SELECT textid FROM texts WHERE summary = %s AND text = %s")

            check_review = ("SELECT reviewId FROM reviews WHERE productcol = %s AND "
                            "usercol = %s AND timestamp = %s")

            add_user = ("INSERT INTO users (usersId, profileName) VALUES (%s, %s)")
            add_product = ("INSERT INTO products (productId) VALUES (%s)")
            #add_text = ("INSERT INTO texts (summary, text) VALUES (%s,%s)")

            add_review = ("INSERT INTO reviews (productcol,usercol,helpfulness,score,timestamp) VALUES (%s,%s,%s,%s,%s)")

            usercol,newuser = add_uniqueid_element(cnx,add_user,check_user,(values[1],),(values[1], values[2],))
            productcol, newproduct = add_uniqueid_element(cnx,add_product,check_product,(values[0],))
            #textid, newtext = add_uniqueid_element(cnx,add_text,check_text,(values[6],values[7],))

            helpfulness = process_helpfulness(values[3])

            reviewid, newreview = add_uniqueid_element(cnx,add_review,check_review,(str(productcol), str(usercol), values[5]), (str(productcol), str(usercol), str(helpfulness), values[4],values[5]))

            if current_product != values[0]:
                last_product = current_product
                current_product = values[0]

                if last_product != "":
                    print("\tNew Reviews:",str(new_entries[2]))
                    print("\tNew Products:",str(new_entries[1]))
                    print("\tNew Users:",str(new_entries[0]))
                    new_entries = [0,0,0]

                print("\nINSERTING REVIEWS FOR PRODUCT %s\n" %current_product)
                
            new_entries[0] += newuser 
            new_entries[1] += newproduct 
            new_entries[2] += newreview


            i = 0
            chunk = ""

cnx.close()
print("All reviews have been inserted in the database.")