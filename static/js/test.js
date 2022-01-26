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
}


document.addEventListener("DOMContentLoaded", function () {
    // 監視識別ID
    var watch_id = 0;
    // ボタンにclickイベントのリスナーをセット
    // var button = document.querySelector('button');
    var button = document.getElementById('testbutton');
    button.addEventListener("click", function () {
        if (watch_id > 0) {
            // リアルタイム監視を停止
            window.navigator.geolocation.clearWatch(watch_id);
            // 監視識別IDに0をセット
            watch_id = 0;
            // ボタン表記を変更
            button.textContent = " 位置情報の取得開始 ";
        } else {
            // リアルタイム監視を開始
            watch_id = window.navigator.geolocation.watchPosition(successCallback);
            // ボタン表記を変更
            button.textContent = " 位置情報の取得停止 ";
        };
    }, false);
}, false);

var num = 0;

// リアルタイム監視
function successCallback(position) {
    markers.forEach((marker) => {
        marker.setMap(null);
    });
    markers = [];
    // コンソールログは増え続けてしまうのでコメントアウト
    // console.log(position);
    // 緯度
    var glLatitude = position.coords.latitude;
    document.querySelector('#latitude').textContent = glLatitude;
    // 経度
    var glLongitude = position.coords.longitude;
    document.querySelector('#longitude').textContent = glLongitude;


    var geo_text = "緯度:" + position.coords.latitude + "\n";
    geo_text += "経度:" + position.coords.longitude + "\n";
    // geo_text += "高度:" + position.coords.altitude + "\n";
    geo_text += "位置精度:" + position.coords.accuracy + "\n";
    // geo_text += "高度精度:" + position.coords.altitudeAccuracy  + "\n";
    geo_text += "移動方向:" + position.coords.heading + "\n";
    geo_text += "速度:" + position.coords.speed + "\n";

    // var date = new Date(position.timestamp);

    // geo_text += "取得時刻:" + date.toLocaleString() + "\n";
    geo_text += "取得回数:" + (++num) + "\n";

    document.getElementById('position_view').innerHTML = geo_text;

    marker = new google.maps.Marker({
        map,
        // title: place.name,
        position: { lat: glLatitude, lng: glLongitude },
    });
    markers.push(marker);

};