import requests
from rest_framework.views import APIView
from rest_framework.response import Response
import cgi

# htmlText = '''Content-type: text/html; charset=UTF-8
 
# <html>
# <head>
#   <title>CGIパラメータの取得</title>
#   <link rel="stylesheet" href="../style.css">
# </head>
# <body>
# <header class="header">
#    <p>取得したパラメータ</p>
# </header>
# <div class="content">
# <p>%s</p>
# </div>
# </body>
# </html>
# '''

form = cgi.FieldStorage() # フォームデータを取得する
q = form.getvalue("q")
# print(htmlText % (q))

class ExtractFromZip(APIView):

    def get(self, requeset):
        headers = {'X-API-KEY': '17333CBF6A1D9B2E29B84A012D2AAF2C498735C7'}
        resp = requests.get(
            'http://ap.mextractr.net/ma9/mext5w1h?out=atom&apikey=17333CBF6A1D9B2E29B84A012D2AAF2C498735C7&text=' + str(q),
            headers=headers)
        return Response(resp, status=resp.status_code)