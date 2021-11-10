import googlemaps
import pprint

key = 'AIzaSyAaKn-PcSb_pTFwH6IJ2_ANNLKsHVMHWwU' 
client = googlemaps.Client(key) 

# 基準になる位置情報を検索 
geocode_result = client.geocode('埼玉駅　メッキ工場') 

# 軽度・緯度の情報のみ取り出す 
loc = geocode_result[0]['geometry']['location'] 

#半径100㎞以内の工場情報を取得 
place_results = client.places_nearby(location=loc, radius=1000000, keyword='埼玉 メッキ',language='ja')
pprint.pprint(place_results)