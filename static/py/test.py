import requests
import json

# エンドポイント
url = 'https://restcountries.eu/rest/v2/all'
# リクエスト
res = requests.get(url)
# 取得したjsonをlists変数に格納
lists = json.loads(res.text)

for list in lists:
    print(list['name'] + ': ' + list['alpha2Code'])