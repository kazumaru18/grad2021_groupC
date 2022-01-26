function gmap() {
  var sc = document.createElement('script');
  sc.src = 'https://maps.googleapis.com/maps/api/js?key=' + conf.MAP_KEY + '&libraries=places&callback=initMap&v=weekly&v=beta';
  document.body.appendChild(sc);
}

var pos;
let markers = [];
var r, p;
var info = null;
var map;
var cate;
var directionsDisplay;
var directionsService;
var mode, highways;
var timeId;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: 35.859766, lng: 139.971014 },
      zoom: 14,
      heading: 0,
      tilt: 0,
      // mapId: "90f87356969d889c",
  });
  //情報ウィンドウのインスタンスの生成（後でマーカーに紐付け）
  var infowindow = new google.maps.InfoWindow();
  //PlacesService のインスタンスの生成（引数に map を指定）
  var service = new google.maps.places.PlacesService(map);
  if (!navigator.geolocation) {
      //情報ウィンドウの位置をマップの中心位置に指定
      infowindow.setPosition(map.getCenter());
      //情報ウィンドウのコンテンツを設定
      infowindow.setContent('Geolocation に対応していません。');
      //情報ウィンドウを表示
      infowindow.open(map);
  }

  //ブラウザが対応している場合、position にユーザーの位置情報が入る
  navigator.geolocation.getCurrentPosition(function (position) {
      //position から緯度経度（ユーザーの位置）のオブジェクトを作成し変数に代入
      pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
      };
      //マップの中心位置を指定
      map.setCenter(pos);
  }, function () {  //位置情報の取得をユーザーがブロックした場合のコールバック
      //情報ウィンドウの位置をマップの中心位置に指定
      infowindow.setPosition(map.getCenter());
      //情報ウィンドウのコンテンツを設定
      infowindow.setContent('Error: Geolocation が無効です。');
      //情報ウィンドウを表示
      infowindow.open(map);
  });


  var url = new URL(window.location.href);
  // URLSearchParamsオブジェクトを取得
  var params = url.searchParams;
  const input = document.getElementById("pac-input");
  input.value = params.get('q');
  const searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  // Bias the SearchBox results towards current map's viewport.
  map.addListener("bounds_changed", () => {
      searchBox.setBounds(map.getBounds());
  });

  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();
      if (places.length == 0) {
          return;
      }
      if (info != null) {
          info.close();
      }
      // Clear out the old markers.
      markers.forEach((marker) => {
          marker.setMap(null);
      });
      markers = [];
      // For each place, get the icon, name and location.
      const bounds = new google.maps.LatLngBounds();
      places.forEach((place) => {
          // console.log(place);
          if (!place.geometry || !place.geometry.location) {
              console.log("Returned place contains no geometry");
              return;
          }
          var search;
          // Create a marker for each place.
          search = new google.maps.Marker({
              map,
              title: place.name,
              position: place.geometry.location,
          }),
              search.addListener('click', function () {
                  if (info != null) {
                      info.close();
                  }
                  // console.log(place);
                  start = pos['lat'] + ',' + pos['lng'];
                  var i = place.name + "<br>★：" + place.rating + "<br>" + place.formatted_address + "<br>"
                      //    + "<a href='" + 'https://www.google.com/maps/search/?api=1&query=' + place.name +"'><button>GoogleMapで見る</button></a>"
                      ;
                  var dom = document.createElement("div");
                  dom.innerHTML = i + "<button id='navi'>ナビ</button>";
                  dom.addEventListener("mousemove", () => {
                      $('#navi').on('click', function () {
                          Display_JS(start, place.formatted_address);
                      });
                  });
                  info = new google.maps.InfoWindow({
                      position: place.geometry.location,
                      content: dom
                  });
                  info.open(map);
              })
          markers.push(search);
          if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
          } else {
              bounds.extend(place.geometry.location);
          }
      });
      map.fitBounds(bounds);
  });


  $('#mise').on('click', function () {
      const input = document.getElementById("pac-input");
      input.value = '飲食店';
      var url = new URL(window.location.href);
      var params = url.searchParams;
      params.set('q', '飲食店');
      callback();
  });

  function callback(results, status) {
      var latlng = map.getCenter();
      var lat = latlng.lat();
      var lng = latlng.lng();
      if (info != null) {
          info.close();
      }
      markers.forEach((marker) => {
          marker.setMap(null);
      });
      markers = [];
      var urlw = 'http://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=' + conf.GOURMET_KEY + '&lat=' + lat + '&lng=' + lng + '&range=4&order=4&count=50&format=jsonp';
      $.ajax({
          url: urlw,
          type: 'GET',
          dataType: 'jsonp',
          jsonpCallback: 'callback'
      }).done(function (data) {
          var res = data['results']['shop'];
          // console.log(res);
          for (var i in res) {
              gourmetMarker(res[i], pos);
          }
      }).fail(function (data) {
          console.log("no"); // 失敗時
      });
  }

  function gourmetMarker(res, pos) {
      //var placeLoc = place.geometry.location; 
      var marker = new google.maps.Marker({
          map: map,
          position: { lat: res['lat'], lng: res['lng'] }  //results[i].geometry.location
      });

      //マーカーにイベントリスナを設定
      marker.addListener('click', function () {
          if (info != null) {
              info.close();
          }
          start = pos['lat'] + ',' + pos['lng'];
          end = res['address'];
          var positio = { lat: res['lat'], lng: res['lng'] };
          var i = "<img src='" + res['logo_image'] + "'>" + "<br>" + res['name'] + "<br>" + res['address'] + "<br>" + res['access'] + "<br>" + "<img src='" + res['photo']['mobile']['s'] + "'>" + "<br>" + '営業時間：' + res['open'] + "<br>" + '定休日：' + res['close'] + "<br>"
              //    + "<a href='" + res['urls']['pc'] + "'><button>ホットペッパーグルメで見る</button></a>" 
              ;

          var dom = document.createElement("div");
          dom.innerHTML = i + "<button id='navi'>ナビ</button>";
          dom.addEventListener("mousemove", () => {
              $('#navi').on('click', function () {
                  Display_JS(start, end);
              });
          });

          info = new google.maps.InfoWindow({
              position: positio,
              content: dom
          });
          // infowindow.setContent(i);  //results[i].name
          // infowindo.open(map, this);
          info.open(map);
      });
      markers.push(marker);
  }

  function enter() {
      var input = document.getElementById("pac-input");
      input.focus();
      let KEvent = new KeyboardEvent("keydown", { keyCode: 13 });
      input.dispatchEvent(KEvent);
  }

  window.addEventListener('load', function () {
      enter();
  });

  $('#cate1').on('click', function () {
      cate = document.querySelector('#cate1').dataset["value"];
      const input = document.getElementById("pac-input");
      input.value = cate;
      enter();
      input.blur()
  });
  $('#cate2').on('click', function () {
      cate = document.querySelector('#cate2').dataset["value"];
      const input = document.getElementById("pac-input");
      input.value = cate;
      enter();
      input.blur()
  });
  $('#cate3').on('click', function () {
      cate = document.querySelector('#cate3').dataset["value"];
      const input = document.getElementById("pac-input");
      input.value = cate;
      enter();
      input.blur()
  });
  $('#cate4').on('click', function () {
      cate = document.querySelector('#cate4').dataset["value"];
      const input = document.getElementById("pac-input");
      input.value = cate;
      enter();
      input.blur()
  });
  $('#cm').on('click', function () {
    markers.forEach((marker) => {
        marker.setMap(null);
    });
    markers = [];
  });

  $('#navi-end').on('click', function () {
      directionsDisplay.setMap(null);
      directionsDisplay.setPanel(null);
      directionsDisplay.setDirections(null);
      $('#navi-end').hide();
  });
}


function Display_JS(start, end) {
  const input = document.getElementById("pac-input");
  input.value = null;
  if (info != null) {
      info.close();
  }
  markers.forEach((marker) => {
      marker.setMap(null);
  });
  markers = [];
  initialize(start, end);
  calcRoute(start, end);
  $('#navi-end').show();
  $('#searchbox').show();
  var sp = document.getElementById('sp');
  sp.value = '現在地';
  var ep = document.getElementById('ep');
  ep.value = end;
}


function initialize(s, e) {
  // インスタンス[geocoder]作成
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({
      // 起点のキーワード
      'address': s
  }, function (result, status) {
      // if (status == google.maps.GeocoderStatus.OK) {
      directionsDisplay = new google.maps.DirectionsRenderer();
      directionsDisplay.setMap(map);
      directionsDisplay.setPanel(document.getElementById('directionsPanel'));     // 経路詳細
      // } else {
      // alert('取得できませんでした…');
      // }
  });
}

// ルート取得
function calcRoute(s, e) {
  switch ($("#mode").val()) {
      case "driving":
          mode = google.maps.DirectionsTravelMode.DRIVING;
          break;
      case "bicycling":
          mode = google.maps.DirectionsTravelMode.BICYCLING;
          break;
      case "transit":
          mode = google.maps.DirectionsTravelMode.TRANSIT;
          break;
      case "walking":
          mode = google.maps.DirectionsTravelMode.WALKING;
          break;
  }

  if ($('#highways').val() == 'yes') {
      highways = false;
  } else if ($('#highways').val() == 'no') {
      highways = true;
  }
  var request = {
      origin: s,         // 開始地点
      destination: e,      // 終了地点
      travelMode: mode,   //交通手段
      avoidHighways: highways,        // 高速道路利用フラグ
  };

  // インスタンス作成
  directionsService = new google.maps.DirectionsService();

  directionsService.route(request, function (response, status) {
      // if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
      // } else {
      // alert('ルートが見つかりませんでした…');
      // }
  });
}



function time() {
  timeId = setInterval(() => {
      getMyPlace();
  }, 1000);
}

function clearTime() {
  clearInterval(timeId);
  // c();
}

var ms = [];
function c() {
  ms.forEach((m) => {
      m.setMap(null);
  });
  ms = [];
}

var num = 0;
function getMyPlace() {
  if (!navigator.geolocation) {//Geolocation apiがサポートされていない場合
      console.log("Geolocationはあなたのブラウザーでサポートされておりません");
      return;
  }
  function success(position) {
      var latitude = position.coords.latitude;//緯度
      var longitude = position.coords.longitude;//経度
      // output.innerHTML = '<p>緯度 ' + latitude + '° <br>経度 ' + longitude + '°</p>';
      // 位置情報
      var latlng = new google.maps.LatLng(latitude, longitude);
      // Google Mapsに書き出し
      m = new google.maps.Marker({
          map: map,
          position: latlng,
      });
      ms.push(m);
      document.getElementById('position_view').innerHTML = latlng;
  };
  function error() {
      //エラーの場合
      console.log("座標位置を取得できません");
  };
  navigator.geolocation.getCurrentPosition(success, error);//成功と失敗を判断
}


function se() {
  directionsDisplay.setMap(null);
  directionsDisplay.setPanel(null);
  directionsDisplay.setDirections(null);
  var s, e;
  if ($('#sp').val() == '現在地') {
      s = pos['lat'] + ',' + pos['lng'];
  } else {
      s = $('#sp').val();
  }
  e = $('#ep').val();
  initialize(s, e);
  calcRoute(s, e);
}




var num = 0;
var watch_id;

function test() {
    watch_id = navigator.geolocation.watchPosition(test2, function(e) { alert(e.message); }, {"enableHighAccuracy": true, "timeout": 20000, "maximumAge": 2000});
}

function clear() {
    navigator.geolocation.clearWatch(watch_id);
}

// function test2(position) {

//     var geo_text = "緯度:" + position.coords.latitude + "\n";
//     geo_text += "経度:" + position.coords.longitude + "\n";
//     geo_text += "高度:" + position.coords.altitude + "\n";
//     geo_text += "位置精度:" + position.coords.accuracy + "\n";
//     geo_text += "高度精度:" + position.coords.altitudeAccuracy  + "\n";
//     geo_text += "移動方向:" + position.coords.heading + "\n";
//     geo_text += "速度:" + position.coords.speed + "\n";

//     var date = new Date(position.timestamp);

//     geo_text += "取得時刻:" + date.toLocaleString() + "\n";
//     geo_text += "取得回数:" + (++num) + "\n";

//     document.getElementById('position_view').innerHTML = geo_text;

// }

