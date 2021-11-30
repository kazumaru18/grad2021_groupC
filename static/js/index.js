function gmap(){
  var sc = document.createElement('script');
  sc.src = 'https://maps.googleapis.com/maps/api/js?key='+conf.MAP_KEY+'&libraries=places&callback=initMap&v=weekly&v=beta';
  document.body.appendChild(sc);
}
// [START maps_places_searchbox]
// This example adds a search box to a map, using the Google Place Autocomplete
// feature. People can enter geographical searches. The search box will return a
// pick list containing a mix of places and predicted search terms.
// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
var pos;
let markers = [];
var r,p;
function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 35.859766, lng: 139.971014},
    zoom: 14,
    heading: 0,
    tilt: 0,
    // mapId: "90f87356969d889c",
  });

  //情報ウィンドウのインスタンスの生成（後でマーカーに紐付け）
  var infowindow = new google.maps.InfoWindow();
      
  //PlacesService のインスタンスの生成（引数に map を指定）
  var service = new google.maps.places.PlacesService(map);
  
  if(!navigator.geolocation){ 
    //情報ウィンドウの位置をマップの中心位置に指定
    infowindow.setPosition(map.getCenter());
    //情報ウィンドウのコンテンツを設定
    infowindow.setContent('Geolocation に対応していません。');
    //情報ウィンドウを表示
    infowindow.open(map);
  }

  //ブラウザが対応している場合、position にユーザーの位置情報が入る
  navigator.geolocation.getCurrentPosition(function(position) { 
    //position から緯度経度（ユーザーの位置）のオブジェクトを作成し変数に代入
    pos = {  
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
    //情報ウィンドウに現在位置を指定
    // infowindow.setPosition(pos);
    //情報ウィンドウのコンテンツを設定
    // infowindow.setContent('現在位置を取得しました。');
    //情報ウィンドウを表示
    // infowindow.open(map);
    //マップの中心位置を指定
    map.setCenter(pos);

    // URLを取得
    var url = new URL(window.location.href);
    // URLSearchParamsオブジェクトを取得
    var params = url.searchParams;
    // getメソッド
    var category = params.get('c');
    // if(category==null){
    //   console.log("sss");
    // }
    
    //種類（タイプ）やキーワードをもとに施設を検索（プレイス検索）するメソッド nearbySearch()
    service.nearbySearch({
      location: pos,  //検索するロケーション
      radius: 2500,  //検索する半径（メートル）
      // type: ['store'],  //タイプで検索。文字列またはその配列で指定
      name: category,
      //キーワードで検索する場合は name:'レストラン' や ['レストラン','中華'] のように指定
    }, cate);  //コールバック関数（callback）は別途定義

    // console.log(pos['lat']);
    //コールバック関数には results, status が渡されるので、status により条件分岐
    function cate(results, status) {
      if(category==null){
        // console.log("sss");
        return;
      }
      // status は以下のような定数で判定（OK の場合は results が配列で返ってきます）
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        //results の数だけ for 文で繰り返し処理
        for (var i = 0; i < results.length; i++) {
          //createMarker() はマーカーを生成する関数（別途定義）
          createMarker(results[i]);
        }
      }
    }
  }, function() {  //位置情報の取得をユーザーがブロックした場合のコールバック
    //情報ウィンドウの位置をマップの中心位置に指定
    infowindow.setPosition(map.getCenter());
    //情報ウィンドウのコンテンツを設定
    infowindow.setContent('Error: Geolocation が無効です。');
    //情報ウィンドウを表示
    infowindow.open(map);
  });   

  $('#mise').on('click', function(){
    const input = document.getElementById("pac-input");
    input.value = '飲食店';
    var url = new URL(window.location.href);
    var params = url.searchParams;
    params.set('q','飲食店');
    callback();
  });

  function callback(results, status) {
    markers.forEach((marker) => {
      marker.setMap(null);
    });
    // markers.length = 0;
    markers = [];
    var urlw ='http://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key='+conf.GOURMET_KEY+'&lat='+pos["lat"]+'&lng='+pos["lng"]+'&range=3&order=4&count=50&format=jsonp';
    $.ajax({
      url: urlw,
      type: 'GET',
      dataType: 'jsonp',
      jsonpCallback: 'callback'
    }).done(function(data) {
    // console.log(data['results']['shop'][0]['address']); // 成功時 この処理はダミーなので変更してください
      // console.log(data); // 成功時 この処理はダミーなので変更してください
    var res = data['results']['shop'];
    for (var k in res) {
      gourmetMarker(res[k],pos);
    }
    }).fail(function(data) {
      console.log("no"); // 失敗時
    });
    // // status は以下のような定数で判定（OK の場合は results が配列で返ってきます）
    // if (status === google.maps.places.PlacesServiceStatus.OK) {
    //   //results の数だけ for 文で繰り返し処理
    //   for (var i = 0; i < results.length; i++) {
    //     //createMarker() はマーカーを生成する関数（別途定義）
    //     createMarker(results[i]);
    //   }
    // }
  }
  
  
  function createMarker(place) {
    //var placeLoc = place.geometry.location; 
    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location  //results[i].geometry.location
    });
 
    //マーカーにイベントリスナを設定
    marker.addListener('click', function() {
      infowindow.setContent(place.name);  //results[i].name
      infowindow.open(map, this);
    });
  }

  // //マーカーを生成する関数（引数には検索結果の配列 results[i] が入ってきます）
  // function createMarker(place) {
  //   //var placeLoc = place.geometry.location; 
  //   var marker = new google.maps.Marker({
  //     map: map,
  //     position: place.geometry.location  //results[i].geometry.location
  //   });
  //   // console.log(place);
  //   //マーカーにイベントリスナを設定
  //   marker.addListener('click', function() {
  //     var i = place.name + "<br>★：" + place.rating + "<br>" + place.vicinity;
  //     infowindow.setContent(i);  //results[i].name
  //     infowindow.open(map, this);
  //   });
  // }

  
  
  // let list = [];
  var info = null;
  function gourmetMarker(res,pos) {
    //var placeLoc = place.geometry.location; 
    var marker = new google.maps.Marker({
      map: map,
      position: {lat: res['lat'], lng: res['lng']}  //results[i].geometry.location
    });
 
    //マーカーにイベントリスナを設定
    marker.addListener('click', function() {
      if(info != null){
        info.close();
      }
      start = pos['lat']+','+pos['lng'];
      // end = res['lat']+','+res['lng'];
      end = res['address'];
      var positio ={lat:res['lat'],lng:res['lng']};
      // console.log(pos);
      // console.log(end);
      var i = "<img src='" + res['logo_image'] + "'>" + "<br>" + res['name'] + "<br>" + res['address'] + "<br>" + res['access'] + "<br>" + "<img src='" + res['photo']['mobile']['s'] + "'>"　+ "<br>" 
      // +
      // "<a href='javascript:;' id='navi'>ナビ</a>"+"<br>"
      // "<a href='https://www.google.com/maps/search/?api=1'>ナビ</a>"
      ;
      // let button = document.getElementById('navi');
      // $('navi').on('click', Display_JS(start,end));

      var dom = document.createElement("div");
      // dom.innerHTML = "<h1>クリックイベント発生テスト</h1>";
      dom.innerHTML = i+"<button id='navi'>navi</button>";
      // dom.addEventListener("click", function() {
      //   console.log("clicked");
      //   Display_JS('東京駅','柏駅');
      // });
      dom.addEventListener("mousemove", () => {
        $('#navi').on('click',function(){
          // console.log("clicked");
          Display_JS(start,end);
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
    // addMarker(marker);
    // console.log(pos['lat']);
    markers.push(marker);
  }
  // $('a').on('click', function() {        
  //   Display_JS();
  // })
  // $('a').on('click', {res:r,pos:p},Display_JS);

  function enter(){
    var input = document.getElementById("pac-input");
    input.focus();
    let KEvent = new KeyboardEvent( "keydown", { keyCode: 13 });
    input.dispatchEvent( KEvent );
  }
  // window.onload=aaaaaaa();
  window.addEventListener('load',function(){
    enter();
    // var o = this.document.getElementById('pac-input');
    // o.sandkeys({ENTER});
  });
// MapLoadedEvent Loaded = new MapLoadedEvent();


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
      // Clear out the old markers.
      markers.forEach((marker) => {
        marker.setMap(null);
      });
      markers = [];
      // For each place, get the icon, name and location.
      const bounds = new google.maps.LatLngBounds();
  
      var ginfo = null;
      
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

        search.addListener('click', function() {
          if(ginfo != null){
            ginfo.close();
          }
          start = pos['lat']+','+pos['lng'];
          var i = place.name + "<br>★：" + place.rating + "<br>" + place.formatted_address + "<br>" ;
          // "<a href='javascript:;' id='navi'>ナビ</a>"+"<br>" ;
          // let button = document.getElementById('navi');
          // $('navi').on('click', Display_JS(start,place.name));

          var dom = document.createElement("div");
          dom.innerHTML = i+"<button id='navi'>navi</button>";
          dom.addEventListener("mousemove", () => {
            $('#navi').on('click',function(){
              Display_JS(start,place.formatted_address);
            });
          });
    
          ginfo = new google.maps.InfoWindow({
            position: place.geometry.location,
            content: dom
          });
          ginfo.open(map);
        })
        markers.push(search)
      
        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
    });
}


function Display_JS(start,end){
      // document.getElementById("map").innerHTML = "<p>「元に戻す」をクリックすると元に戻ります。</p>";
      // document.getElementById("map").style.display ="none";
      // getMyPlace();
      // var start = p['lat']+','+p['lng'];
      // var end = r['lat']+','+r['lng'];
      // console.log(start);
      // console.log(end);
      initialize(start,end);
      calcRoute(start,end);
      // callback();
      // initialize();
      // calcRoute();
    // var geocoder = new google.maps.Geocoder();
    // geocoder.geocode({
    //     // 起点のキーワード
    //     'address': '柏駅'

    // }, function(result, status) {
    //     if (status == google.maps.GeocoderStatus.OK) {
    //         // 中心点を指定
    //         var latlng = result[0].geometry.location;

    //         // オプション
    //         var myOptions = {
    //             zoom: 14,
    //             center: latlng,
    //             scrollwheel: false,     // ホイールでの拡大・縮小
    //             mapTypeId: google.maps.MapTypeId.ROADMAP,
    //         };

    //         // #map_canvasを取得し、[mapOptions]の内容の、地図のインスタンス([map])を作成する
    //         map = new google.maps.Map(document.getElementById('map'), myOptions);
    //         // 経路を取得
    //         directionsDisplay = new google.maps.DirectionsRenderer();
    //         directionsDisplay.setMap(map);
    //         directionsDisplay.setPanel(document.getElementById('directionsPanel'));
    //       }
    //     });
      // document.getElementById("directionsPanel").style.display ="none";
      // document.getElementById("map").innerHTML = "<p>上記「切り替え」をクリックすると、ここの内容が切り替わります。</p>";
      // document.getElementById("map").style.display ="block";
      // document.getElementById("directionsPanel").style.display ="block";
}


function getMyPlace() {
  var output = document.getElementById("result");
  if (!navigator.geolocation){//Geolocation apiがサポートされていない場合
    output.innerHTML = "<p>Geolocationはあなたのブラウザーでサポートされておりません</p>";
    return;
  }
  function success(position) {
    var latitude  = position.coords.latitude;//緯度
    var longitude = position.coords.longitude;//経度
    // output.innerHTML = '<p>緯度 ' + latitude + '° <br>経度 ' + longitude + '°</p>';
    // 位置情報
    var latlng = new google.maps.LatLng( latitude , longitude ) ;
    // Google Mapsに書き出し
    var map = new google.maps.Map( document.getElementById( 'map' ) , {
        zoom: 15 ,// ズーム値
        center: latlng ,// 中心座標
    } ) ;
    // マーカーの新規出力
    new google.maps.Marker( {
        map: map ,
        position: latlng ,
    } ) ;
  };
  function error() {
    //エラーの場合
    output.innerHTML = "座標位置を取得できません";
  };
  navigator.geolocation.getCurrentPosition(success, error);//成功と失敗を判断
}
// [END maps_places_searchbox]

var map, begin, end;
var directionsDisplay;
var directionsService;

// begin = '東京駅';
// end = '東京スカイツリー';

// $(function() {
//     $('#searchButton').click(function(e) {
//         e.preventDefault();         // hrefが無効になり、画面遷移が行わない

//         begin = $('#inputBegin').val();
//         end   = $('#inputEnd').val();

//         // ルート説明をクリア
//         $('#directionsPanel').text(' ');

//         google.maps.event.addDomListener(window, 'load', initialize(begin, end));
//         google.maps.event.addDomListener(window, 'load', calcRoute(begin, end));
//     });
// });


function initialize(s,e) {
    // インスタンス[geocoder]作成
    var geocoder = new google.maps.Geocoder();

    geocoder.geocode({
        // 起点のキーワード
        'address': s

    }, function(result, status) {
        // if (status == google.maps.GeocoderStatus.OK) {
            // 中心点を指定
            var latlng = result[0].geometry.location;

            // オプション
            var myOptions = {
                zoom: 14,
                center: latlng,
                scrollwheel: false,     // ホイールでの拡大・縮小
                mapTypeId: google.maps.MapTypeId.ROADMAP,
            };

            // #map_canvasを取得し、[mapOptions]の内容の、地図のインスタンス([map])を作成する
            var map = new google.maps.Map(document.getElementById('map'), myOptions);
            // 経路を取得
            directionsDisplay = new google.maps.DirectionsRenderer();
            directionsDisplay.setMap(map);
            directionsDisplay.setPanel(document.getElementById('directionsPanel'));     // 経路詳細

            // 場所
            $('#begin').text(s);
            $('#end').text(e);

        // } else {
        //     alert('取得できませんでした…');
        // }
    });
}

// ルート取得
function calcRoute(s,e) {
    var request = {
        origin: s,         // 開始地点
        destination: e,      // 終了地点
        travelMode: google.maps.TravelMode.DRIVING,     // [自動車]でのルート
        avoidHighways: false,        // 高速道路利用フラグ
    };

    // インスタンス作成
    var directionsService = new google.maps.DirectionsService();

    directionsService.route(request, function(response, status) {
        // if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        // } else {
        //     alert('ルートが見つかりませんでした…');
        // }
    });
}

// キック
  // google.maps.event.addDomListener(window, 'load', function() {  
  //   initialize(begin, end);
  //   calcRoute(begin, end);
  // });
  function intMap(){
    var map = new google.maps.Map( document.getElementById( 'map' ) , {
      zoom: 15 ,// ズーム値
      center:  {lat: 35.859766, lng: 139.971014},// 中心座標
  } ) ;
  // マーカーの新規出力
  new google.maps.Marker( {
      map: map ,
      position: latlng ,
  } ) ;
  }
  function initAutocomplete(map) {
    // Create the search box and link it to the UI element.
    const input = document.getElementById("pac-input");
    const searchBox = new google.maps.places.SearchBox(input);
  
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    // Bias the SearchBox results towards current map's viewport.
    map.addListener("bounds_changed", () => {
      searchBox.setBounds(map.getBounds());
    });
  
    // let markers = [];
  
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();
  
      if (places.length == 0) {
        return;
      }
  
      // Clear out the old markers.
      markers.forEach((marker) => {
        marker.setMap(null);
      });
      markers = [];
  
      // For each place, get the icon, name and location.
      const bounds = new google.maps.LatLngBounds();
  
      places.forEach((place) => {
        if (!place.geometry || !place.geometry.location) {
          console.log("Returned place contains no geometry");
          return;
        }
  
        const icon = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25),
        };
  
        // Create a marker for each place.
        markers.push(
          new google.maps.Marker({
            map,
            // icon,
            title: place.name,
            position: place.geometry.location,
          })
        );
        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
    });
  }

  function addMarker(marker) {
    // for (let i = 0; i < stations.length; i++) {
    //     console.log(stations[i]);
    //     const markerLatLng = new google.maps.LatLng(stations[i]['latitude'], stations[i]['longitude']);
    //     this.marker[i] = new google.maps.Marker({
    //         position: markerLatLng,
    //         map: this.map
    //     });
    //     infowindows[i] = new google.maps.InfoWindow({ // 吹き出しの追加
    //         content: '<div style="width: 220px;"><p>' +
    //             '<p>駅名：' + stations[i]['stationname'] + '</p>' +
    //             '<button id="go-station">この駅の詳細</button>'
    //     });

    //     // ※※※ここからがボタンイベント追加部分です※※※
    //     infowindows[i].addListener('domready', () => {
    //         document.getElementById('go-station').addEventListener('click', () => {
    //             this.goStation();
    //         });
    //     });
    //     this.markerEvent(i);
    // }
    console.log(marker);
}

function goStation() {
    // ※※※ここにボタンクリック時のイベント※※※
    console.log('go station');
}


// var num = 0;
// var watch_id;

// function test() {
//     watch_id = navigator.geolocation.watchPosition(test2, function(e) { alert(e.message); }, {"enableHighAccuracy": true, "timeout": 200000, "maximumAge": 2000});
// }

// function clear() {
//     navigator.geolocation.clearWatch(watch_id);
// }

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


//     var latlng = {lat:position.coords.latitude,lng:position.coords.longitude};
//     new google.maps.Marker( {
//       map: map ,
//       position: latlng ,
//   } ) ;
// }

