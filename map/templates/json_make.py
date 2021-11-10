from django.conf import settings

# import json
# import requests

# url = "http://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=04b892c025d4a7cf&lat=33.590543&lng=130.420096&range=2&order=1&format=json"
# res = requests.get(url)
# with open("sample.json", "w") as f:json.dump(res.text, f)

# data = json.loads(res.text)
# print(data['name'])


import json
import requests
import pandas as pd
# config.py

i_start = 1
restaurant_datas=[]

while True:
	query = {
		'key': '04b892c025d4a7cf',
		'large_area': 'Z011', # 東京
		'order': 1, #名前の順
		'start': i_start, #検索結果の何番目から出力するか
		'count': 100, #最大取得件数
		'format': 'json'
	}
	url_base = 'http://webservice.recruit.co.jp/hotpepper/gourmet/v1/'
	responce = requests.get(url_base, query)
	result = json.loads(responce.text)['results']['shop']
	if len(result) == 0:
		break
	for restaurant in result:
		restaurant_datas.append([restaurant['name'], restaurant['address'], restaurant['budget']['code'], restaurant['genre']['code']])
	i_start += 100
	print(i_start)

columns = ['name', 'address', 'budget', 'genre']
df_restaurants = pd.DataFrame(restaurant_datas, columns=columns)
df_restaurants.to_csv('restaurants_tokyo.csv')