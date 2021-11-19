function gmap(){
  var sc = document.createElement('script');
  sc.src = 'https://maps.googleapis.com/maps/api/js?key='+conf.MAP_KEY+'&libraries=places&callback=initMap&v=weekly&v=beta';
  document.body.appendChild(sc);
}
// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
let map;
let service;
let infowindow;

function initMap() {
  const Googlemap = new google.maps.LatLng(35.859766, 139.971014);

  infowindow = new google.maps.InfoWindow();
  map = new google.maps.Map(document.getElementById("map"), {
    center: Googlemap,
    zoom: 15,
  });

  const request = {
    query: "柏駅",
    fields: ["name", "geometry"],
  };

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

  //ブラウザが対応している場合、position にユーザーの位置情報が入る
  navigator.geolocation.getCurrentPosition(function(position) { 
    //position から緯度経度（ユーザーの位置）のオブジェクトを作成し変数に代入
    var pos = {  
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
    
    //種類（タイプ）やキーワードをもとに施設を検索（プレイス検索）するメソッド nearbySearch()
    service.nearbySearch({
      location: pos,  //検索するロケーション
      radius: 500,  //検索する半径（メートル）
      type: ['store']  //タイプで検索。文字列またはその配列で指定
      //キーワードで検索する場合は name:'レストラン' や ['レストラン','中華'] のように指定
    }, callback);  //コールバック関数（callback）は別途定義

    // console.log(pos['lat']);
    //コールバック関数には results, status が渡されるので、status により条件分岐
    function callback(results, status) {
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
          gourmetMarker(res[k]);
        }
      }).fail(function(data) {
        console.log("no"); // 失敗時
      });
      // status は以下のような定数で判定（OK の場合は results が配列で返ってきます）
      // if (status === google.maps.places.PlacesServiceStatus.OK) {
      //   //results の数だけ for 文で繰り返し処理
      //   for (var i = 0; i < results.length; i++) {
      //     //createMarker() はマーカーを生成する関数（別途定義）
      //     createMarker(results[i]);
      //   }
      // }
    }
  }, function() {  //位置情報の取得をユーザーがブロックした場合のコールバック
    //情報ウィンドウの位置をマップの中心位置に指定
    infowindow.setPosition(map.getCenter());
    //情報ウィンドウのコンテンツを設定
    infowindow.setContent('Error: Geolocation が無効です。');
    //情報ウィンドウを表示
    infowindow.open(map);
  });
  
  service = new google.maps.places.PlacesService(map);
  // service.findPlaceFromQuery(request, (results, status) => {
  //   if (status === google.maps.places.PlacesServiceStatus.OK && results) {
  //     for (let i = 0; i < results.length; i++) {
  //       createMarker(results[i]);
  //     }

  //     map.setCenter(results[0].geometry.location);
  //   }
  // });
  // This example adds a search box to a map, using the Google Place Autocomplete
// feature. People can enter geographical searches. The search box will return a
// pick list containing a mix of places and predicted search terms.
// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

  // Create the search box and link it to the UI element.
  const input = document.getElementById("pac-input");
  const searchBox = new google.maps.places.SearchBox(input);

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  // Bias the SearchBox results towards current map's viewport.
  map.addListener("bounds_changed", () => {
    searchBox.setBounds(map.getBounds());
  });

  let markers = [];

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
      createMarker(place)
    });
    map.fitBounds(bounds);
  });
}

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

function createMarker(place) {
    deleteMarker();

    //var placeLoc = place.geometry.location; 
    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location  //results[i].geometry.location
    });
    // console.log(place);
    //マーカーにイベントリスナを設定
    marker.addListener('click', function() {
      var i = place.name + "<br>★：" + place.rating + "<br>" + place.formatted_address + "<br>";
      infowindow.setContent(i);  //results[i].name
      infowindow.open(map, this);
    });
    //マーカーを削除する
    function deleteMarker() {
      if(marker != null){
        marker.setMap(null);
      }
      marker = null;
    }
  }