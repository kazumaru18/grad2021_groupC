function gmap(){
    var sc = document.createElement('script');
    sc.src = 'https://maps.googleapis.com/maps/api/js?key='+conf.MAP_KEY+'&libraries=places&callback=initMap&v=weekly&v=beta';
    document.body.appendChild(sc);
  }
var pos;
let markers = [];
var r,p;
function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 35.859766, lng: 139.971014},
    zoom: 15,
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
    
    //種類（タイプ）やキーワードをもとに施設を検索（プレイス検索）するメソッド nearbySearch()
    service.nearbySearch({
      location: pos,  //検索するロケーション
      radius: 500,  //検索する半径（メートル）
      type: ['store'],  //タイプで検索。文字列またはその配列で指定
      //キーワードで検索する場合は name:'レストラン' や ['レストラン','中華'] のように指定
    }, test);  //コールバック関数（callback）は別途定義

    // console.log(pos['lat']);
    //コールバック関数には results, status が渡されるので、status により条件分岐
    // function callback(results, status) {
    //   var urlw ='http://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key='+conf.GOURMET_KEY+'&lat='+pos["lat"]+'&lng='+pos["lng"]+'&range=3&order=4&count=50&format=jsonp';
    //   $.ajax({
    //     url: urlw,
    //     type: 'GET',
    //     dataType: 'jsonp',
    //     jsonpCallback: 'callback'
    //   }).done(function(data) {
    //   // console.log(data['results']['shop'][0]['address']); // 成功時 この処理はダミーなので変更してください
    //     // console.log(data); // 成功時 この処理はダミーなので変更してください
    //   var res = data['results']['shop'];
    //   for (var k in res) {
    //     gourmetMarker(res[k],pos);
    //   }
    //   }).fail(function(data) {
    //     console.log("no"); // 失敗時
    //   });
    //   // // status は以下のような定数で判定（OK の場合は results が配列で返ってきます）
    //   // if (status === google.maps.places.PlacesServiceStatus.OK) {
    //   //   //results の数だけ for 文で繰り返し処理
    //   //   for (var i = 0; i < results.length; i++) {
    //   //     //createMarker() はマーカーを生成する関数（別途定義）
    //   //     createMarker(results[i]);
    //   //   }
    //   // }
    // }
  }, function() {  //位置情報の取得をユーザーがブロックした場合のコールバック
    //情報ウィンドウの位置をマップの中心位置に指定
    infowindow.setPosition(map.getCenter());
    //情報ウィンドウのコンテンツを設定
    infowindow.setContent('Error: Geolocation が無効です。');
    //情報ウィンドウを表示
    infowindow.open(map);
  });   

  $('#mise').on('click', callback);

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

function test(){

    const input = document.getElementById("pac-input");
    input.value='琵琶湖';
    console.log(input);
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
    //   if (places.length == 0) {
    //     return;
    //   }
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
        //   return;
        }
        var search;
      // Create a marker for each place.
        search = new google.maps.Marker({
          map,
          title: place.name,
          position: place.geometry.location,
        }),

        search.addListener('click', function() {
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
    
          infoWindow = new google.maps.InfoWindow({
            position: place.geometry.location,
            content: dom
          });
          infoWindow.open(map);
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
    })};


  };