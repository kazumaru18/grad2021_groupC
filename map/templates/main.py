import requests
import json

#とりあえず例として、どこかのWeb APIを叩くことにする
url = 'http://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=04b892c025d4a7cf&lat=35.862423&lng=139.971296&range=3&order=4&format=json'

#requests.getを使うと、レスポンス内容を取得できるのでとりあえず変数へ保存
response = requests.get(url)

#response.json()でJSONデータに変換して変数へ保存
jsonData = response.json()

#このJSONオブジェクトは、連想配列（Dict）っぽい感じのようなので
#JSONでの名前を指定することで情報がとってこれる
# print(jsonData["JSONのキー"])

#responseから取得したJSONデータが単一のJSONオブジェクトではなく
#配列みたいになっているときはfor文と組み合わせてやるとよし。
# for jsonObj in jsonData:
#     print(jsonObj["name"])

result = jsonData['results']['shop']
for restaurant in result:
	print([restaurant['logo_image'], restaurant['name'], restaurant['address'], restaurant['access'], restaurant['urls'], restaurant['photo']['mobile']['s']])