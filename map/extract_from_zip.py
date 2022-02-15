import requests
from rest_framework.views import APIView
from rest_framework.response import Response
import cgi
from selenium import webdriver
import chromedriver_binary

#ChromeDriverのパスを引数に指定しChromeを起動
driver = webdriver.Chrome("C:\chromedriver")
#指定したURLに遷移
driver.get("http://127.0.0.1:8000/")
#クッキー名からクッキーを検索
cookie = driver.get_cookie("str")
#取得したクッキーを表示
print(cookie)

# # URLから、requestsのオブジェクト作成
# url = "http://127.0.0.1:8000"
# session = requests.session()
# response = session.get(url)

# # cookieを取得
# cookie = response.cookies

# # cookie内の任意項目を指定して取得
# item  = response.cookies.get('str')

# form = cgi.FieldStorage() # フォームデータを取得する
# q = form.getvalue("q")

# print(htmlText % (q))

class ExtractFromZip(APIView):

    def get(self, requeset):
        headers = {'X-API-KEY': '17333CBF6A1D9B2E29B84A012D2AAF2C498735C7'}
        q = requests.post["q"]
        resp = requests.get(
            'http://ap.mextractr.net/ma9/mext5w1h?out=atom&apikey=17333CBF6A1D9B2E29B84A012D2AAF2C498735C7&text=' + item,
            headers=headers)
        # sys.stdout.write("str(q)")
        return Response(resp, status=resp.status_code)