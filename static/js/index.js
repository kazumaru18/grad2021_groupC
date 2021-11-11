// [START maps_places_searchbox]
// This example adds a search box to a map, using the Google Place Autocomplete
// feature. People can enter geographical searches. The search box will return a
// pick list containing a mix of places and predicted search terms.
// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 35.859766, lng: 139.971014},
    zoom: 12,
    heading: 320,
    tilt: 47.5,
    mapId: "90f87356969d889c",
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
    var pos = {  
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
    //情報ウィンドウに現在位置を指定
    infowindow.setPosition(pos);
    //情報ウィンドウのコンテンツを設定
    infowindow.setContent('現在位置を取得しました。');
    //情報ウィンドウを表示
    infowindow.open(map);
    //マップの中心位置を指定
    map.setCenter(pos);
    
    //種類（タイプ）やキーワードをもとに施設を検索（プレイス検索）するメソッド nearbySearch()
    service.nearbySearch({
      location: pos,  //検索するロケーション
      radius: 500,  //検索する半径（メートル）
      type: ['store']  //タイプで検索。文字列またはその配列で指定
      //キーワードで検索する場合は name:'レストラン' や ['レストラン','中華'] のように指定
    }, callback);  //コールバック関数（callback）は別途定義

    //コールバック関数には results, status が渡されるので、status により条件分岐
    function callback(results, status) {
      $.ajax({
        url: 'http://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=04b892c025d4a7cf&lat=35.862423&lng=139.971296&range=3&order=4&count=50&format=jsonp',
        type: 'GET',
        dataType: 'jsonp',
        jsonpCallback: 'callback'
      }).done(function(data) {
      // console.log(data['results']['shop'][0]['address']); // 成功時 この処理はダミーなので変更してください
        // console.log(data); // 成功時 この処理はダミーなので変更してください
        var res = data['results']['shop'];
        for (var k in res) {
          gourmetMarker(res[k]);
        }
      }).fail(function(data) {
        console.log("no"); // 失敗時
      });
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
  
  //マーカーを生成する関数（引数には検索結果の配列 results[i] が入ってきます）
  function createMarker(place) {
    //var placeLoc = place.geometry.location; 
    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location  //results[i].geometry.location
    });
 
    //マーカーにイベントリスナを設定
    marker.addListener('click', function() {
      var i = place.name + "<br>" + place.rating;
      infowindow.setContent(i);  //results[i].name
      infowindow.open(map, this);
    });
  }

  

  function gourmetMarker(res) {
    //var placeLoc = place.geometry.location; 
    var marker = new google.maps.Marker({
      map: map,
      position: {lat: res['lat'], lng: res['lng']}  //results[i].geometry.location
    });
 
    //マーカーにイベントリスナを設定
    marker.addListener('click', function() {
      var i = "<img src=res['logo_image']>" + res['name'] + "<br>" + res['address'] + "<br>" + res['access'] + "<br>" + "<img src=res['photo']['mobile']['s']>";
      infowindow.setContent(i);  //results[i].name
      infowindow.open(map, this);
    });
  }

  const buttons = [
    ["Rotate Left", "rotate", 20, google.maps.ControlPosition.LEFT_CENTER],
    ["Rotate Right", "rotate", -20, google.maps.ControlPosition.RIGHT_CENTER],
    ["Tilt Down", "tilt", 20, google.maps.ControlPosition.TOP_CENTER],
    ["Tilt Up", "tilt", -20, google.maps.ControlPosition.BOTTOM_CENTER],
  ];

  buttons.forEach(([text, mode, amount, position]) => {
    const controlDiv = document.createElement("div");
    const controlUI = document.createElement("button");

    controlUI.classList.add("ui-button");
    controlUI.innerText = `${text}`;
    controlUI.addEventListener("click", () => {
      adjustMap(mode, amount);
    });
    controlDiv.appendChild(controlUI);
    map.controls[position].push(controlDiv);
  });

  const adjustMap = function (mode, amount) {
    switch (mode) {
      case "tilt":
        map.setTilt(map.getTilt() + amount);
        break;
      case "rotate":
        map.setHeading(map.getHeading() + amount);
        break;
      default:
        break;
    }
  };
  
  // Create the search box and link it to the UI element.
  const input = document.getElementById("pac-input");
  const searchBox = new google.maps.places.SearchBox(input);

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  // Bias the SearchBox results towards current map's viewport.
  map.addListener("bounds_changed", () => {
    searchBox.setBounds(map.getBounds());
  });

  let markers = [];

  // [START maps_places_searchbox_getplaces]
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
          icon,
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
// [END maps_places_searchbox_getplaces]
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
    output.innerHTML = '<p>緯度 ' + latitude + '° <br>経度 ' + longitude + '°</p>';
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

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
// let map;
// let service;
// let infowindow;

// function initMap() {
//   const sydney = new google.maps.LatLng(-33.867, 151.195);

//   infowindow = new google.maps.InfoWindow();
//   map = new google.maps.Map(document.getElementById("map"), {
//     center: sydney,
//     zoom: 15,
//   });

//   const request = {
//     query: "Museum of Contemporary Art Australia",
//     fields: ["name", "geometry"],
//   };

//   service = new google.maps.places.PlacesService(map);
//   service.findPlaceFromQuery(request, (results, status) => {
//     if (status === google.maps.places.PlacesServiceStatus.OK && results) {
//       for (let i = 0; i < results.length; i++) {
//         createMarker(results[i]);
//       }

//       map.setCenter(results[0].geometry.location);
//     }
//   });
// }

// function createMarker(place) {
//   if (!place.geometry || !place.geometry.location) return;

//   const marker = new google.maps.Marker({
//     map,
//     position: place.geometry.location,
//   });

//   google.maps.event.addListener(marker, "click", () => {
//     infowindow.setContent(place.name || "");
//     infowindow.open(map);
//   });
// }

// This example displays a marker at the center of Australia.
// When the user clicks the marker, an info window opens.
// function initMap() {
//   const uluru = { lat: -25.363, lng: 131.044 };
//   const map = new google.maps.Map(document.getElementById("map"), {
//     zoom: 4,
//     center: uluru,
//   });
//   const contentString =
//     '<div id="content">' +
//     '<div id="siteNotice">' +
//     "</div>" +
//     '<h1 id="firstHeading" class="firstHeading">Uluru</h1>' +
//     '<div id="bodyContent">' +
//     "<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large " +
//     "sandstone rock formation in the southern part of the " +
//     "Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) " +
//     "south west of the nearest large town, Alice Springs; 450&#160;km " +
//     "(280&#160;mi) by road. Kata Tjuta and Uluru are the two major " +
//     "features of the Uluru - Kata Tjuta National Park. Uluru is " +
//     "sacred to the Pitjantjatjara and Yankunytjatjara, the " +
//     "Aboriginal people of the area. It has many springs, waterholes, " +
//     "rock caves and ancient paintings. Uluru is listed as a World " +
//     "Heritage Site.</p>" +
//     '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">' +
//     "https://en.wikipedia.org/w/index.php?title=Uluru</a> " +
//     "(last visited June 22, 2009).</p>" +
//     "</div>" +
//     "</div>";
//   const infowindow = new google.maps.InfoWindow({
//     content: contentString,
//   });
//   const marker = new google.maps.Marker({
//     position: uluru,
//     map,
//     title: "Uluru (Ayers Rock)",
//   });

//   marker.addListener("click", () => {
//     infowindow.open({
//       anchor: marker,
//       map,
//       shouldFocus: false,
//     });
//   });
// }