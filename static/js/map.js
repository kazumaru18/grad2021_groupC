function gmap() {
    var sc = document.createElement('script');
    sc.src = 'https://maps.googleapis.com/maps/api/js?key=' + xxxxxx + '&libraries=places&callback=initMap&v=weekly&v=beta';
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
var input;
var searchBox;
var word = '';
var week;
var hours;
var dayFlag;
var timeFlag;
var enterFlag;
var nullFlag = 1;
var dayNum;
var timeNum;
var year;
var month;
var nowDay;
var result = 0;
var eigyoutime;
var et = '';
var weeks = { '月曜日': 0, '火曜日': 1, '水曜日': 2, '木曜日': 3, '金曜日': 4, '土曜日': 5, '日曜日': 6 };
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        // center: { lat: 35.859766, lng: 139.971014 },
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
        map.setCenter({ lat: 35.6809591, lng: 139.7673068 });
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
    input = document.getElementById("pac-input");
    input.value = params.get('q');
    searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    // Bias the SearchBox results towards current map's viewport.
    map.addListener("bounds_changed", () => {
        searchBox.setBounds(map.getBounds());
    });

    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    // var week, hours;
    const bounds = new google.maps.LatLngBounds();
    searchBox.addListener("places_changed", () => {
        markers.forEach((marker) => {
            marker.setMap(null);
        });
        gpsMarkers.forEach((marker) => {
            marker.setMap(null);
        });
        gpsMarkers = [];
        markers = [];
        var str = input.value;

        setTime(str);

        var timeSearchFlag = document.getElementById('timeSearch');
        var GetThere = document.getElementById('GetThere');
        const places = searchBox.getPlaces();
        places.forEach((place) => {
            // service.getDetails({
            // placeId: place['place_id'],
            //         // fields: ['name', 'formatted_address', 'geometry', 'url']
            // }, function (place, status) {
            // if (hours == null && week == null) {
            if (GetThere.checked == true) {
                var strat = pos['lat'] + ',' + pos['lng']
                var end = place['formatted_address'];
                calc(strat, end, place, word, week, hours);
            } else {

                if (timeSearchFlag.checked == false) {
                    nullFlag = 0;
                }
                if (nullFlag == 0) {
                    marker(place);
                    //     // return;
                } else if (nullFlag == 1) {
                    searchHours(place, week, hours);
                    //     // return;
                }
            }
            // searchHours(place,week,hours);
            // });
            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);

        dayNum = null;
        timeNum = null;
        dayFlag = null;
        timeFlag = null;
        word = '';
        week = null;
        hours = null;
        nullFlag = 1;
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
        gpsMarkers.forEach((marker) => {
            marker.setMap(null);
        });
        gpsMarkers = [];
        markers = [];
        var urlw = '//webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=' + xxxxxx + '&lat=' + lat + '&lng=' + lng + '&range=4&order=4&count=50&format=jsonp';
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
                    document.getElementById("testroot").click();
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

    window.addEventListener('load', function () {
        var url = new URL(window.location.href);
        // URLSearchParamsオブジェクトを取得
        var params = url.searchParams;
        input = document.getElementById("pac-input");
        var str = params.get('q');
        if (str != null) {
            var timeSearchFlag = document.getElementById('timeSearch');
            var GetThere = document.getElementById('GetThere');
            timeSearchFlag.checked = true;
            GetThere.checked = true;
            str = str.trim();
            if (str.match(/[　\ ]/) == null) {
                str = split(str);
                setTime(str);
                input.value = str;
            }
        }

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
    $('#cate5').on('click', function () {

        cate = document.querySelector('#cate5').dataset["value"];
        const input = document.getElementById("pac-input");
        input.value = cate;
        enter();
        input.blur()
    });
    $('#cate6').on('click', function () {

        cate = document.querySelector('#cate6').dataset["value"];
        const input = document.getElementById("pac-input");
        input.value = cate;
        enter();
        input.blur()
    });
    $('#cm').on('click', function () {
        markers.forEach((marker) => {
            marker.setMap(null);
        });
        gpsMarkers.forEach((marker) => {
            marker.setMap(null);
        });
        gpsMarkers = [];
        markers = [];
        if (directionsDisplay) {
            directionsDisplay.setMap(null);
            directionsDisplay.setPanel(null);
            directionsDisplay.setDirections(null);
        }
        $('#navi-end').hide();
    });

    $('#navi-end').on('click', function () {
        if (directionsDisplay) {
            directionsDisplay.setMap(null);
            directionsDisplay.setPanel(null);
            directionsDisplay.setDirections(null);
        }
        gpsEmd();
        $('#navi-end').hide();
    });
}

var endPoint;
function Display_JS(start, end) {
    const input = document.getElementById("pac-input");
    input.value = null;
    if (info != null) {
        info.close();
    }
    markers.forEach((marker) => {
        marker.setMap(null);
    });
    gpsMarkers.forEach((marker) => {
        marker.setMap(null);
    });
    gpsMarkers = [];
    markers = [];
    initialize(start, end);
    calcRoute(start, end);
    $('#navi-end').show();
    $('#searchbox').show();
    var sp = document.getElementById('sp');
    sp.value = '現在地';
    var ep = document.getElementById('ep');
    ep.value = end;
    endPoint = end;
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

        //所要時間
        // console.log(response['routes'][0]['legs'][0]['duration']['text']);

        //zoom削除
        delete response['routes'][0]['bounds'];
        directionsDisplay.setDirections(response);
        // } else {
        // alert('ルートが見つかりませんでした…');
        // }
    });
}


var watch_id = 0;
var num = 0;

function syousai() {
    var latlng = map.getCenter();
    var lat = latlng.lat();
    var lng = latlng.lng();
    var r = document.getElementById('range');
    var range = r.value;
    var g = document.getElementById('genre');
    // var genre = g.value;
    var url = '//webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=' + xxxxxx + '&lat=' + lat + '&lng=' + lng + '&range=' + range;
    var arr = ['&card=1', '&lunch=1', '&wifi=1', '&private_room=1', '&midnight_meal=1', '&pet=1', '&cocktail=1', '&shochu=1', '&sake=1', '&wine=1', '&parking=1', '&barrier_free=1', '&free_food=1', '&free_drink=1', '&child=1', '&non_smoking=1', '&tatami=1', '&course=1'];

    const syousai = document.ca.syousai;

    for (let i = 0; i < syousai.length; i++) {
        if (syousai[i].checked) {
            url += arr[i];
        }
    }
    url += '&order=4&count=50&format=jsonp';

    // console.log(url);
    if (info != null) {
        info.close();
    }
    markers.forEach((marker) => {
        marker.setMap(null);
    });
    markers = [];
    gpsMarkers.forEach((marker) => {
        marker.setMap(null);
    });
    gpsMarkers = [];

    // &genre=
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'jsonp',
        jsonpCallback: 'callback'
    }).done(function (data) {
        var res = data['results']['shop'];
        for (var k in res) {
            syousaiMarker(res[k], pos);
        }
    }).fail(function (data) {
        console.log("no"); // 失敗時
    });
}

function syousaiMarker(res, pos) {
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
        var i = "<img src='" + res['logo_image'] + "'>" + "<br>" + res['name'] + "<br>" + "<br>" + res['address'] + "<br>" + res['access'] + "<br>" + "<img src='" + res['photo']['mobile']['s'] + "'>" + "<br>"
            + '営業時間：' + res['open'] + "<br>"
            + '定休日：' + res['close'] + "<br>"
            //    + "<a href='" + res['urls']['pc'] + "'><button>ホットペッパーグルメで見る</button></a>" 
            ;

        var dom = document.createElement("div");
        dom.innerHTML = i + "<button id='navi'>ナビ</button>";
        dom.addEventListener("mousemove", () => {
            $('#navi').on('click', function () {
                Display_JS(start, end);
                document.getElementById("testroot").click();
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

function se() {
    if (directionsDisplay) {
        directionsDisplay.setMap(null);
        directionsDisplay.setPanel(null);
        directionsDisplay.setDirections(null);
    }
    var s, e;
    if ($('#sp').val() == '現在地') {
        s = pos['lat'] + ',' + pos['lng'];
    } else {
        s = $('#sp').val();
    }
    e = $('#ep').val();
    initialize(s, e);
    calcRoute(s, e);
    gpsStart();
    $('#navi-end').show();
}

var gpsMarkers = [];
function gpsRoot(position) {
    markers.forEach((marker) => {
        marker.setMap(null);
    });
    markers = [];
    gpsMarkers.forEach((marker) => {
        marker.setMap(null);
    });
    gpsMarkers = [];
    // var geo_text = "緯度:" + position.coords.latitude + "\n";
    // geo_text += "経度:" + position.coords.longitude + "\n";
    // geo_text += "高度:" + position.coords.altitude + "\n";
    // geo_text += "位置精度:" + position.coords.accuracy + "\n";
    // geo_text += "高度精度:" + position.coords.altitudeAccuracy  + "\n";
    // geo_text += "移動方向:" + position.coords.heading + "\n";
    // geo_text += "速度:" + position.coords.speed + "\n";
    // geo_text += "取得回数:" + (++num) + "\n";
    // document.getElementById('position_view').innerHTML = geo_text;

    var start = position.coords.latitude + ',' + position.coords.longitude;
    var pclat = position.coords.latitude;
    var pclng = position.coords.longitude;
    // Display_JS(start,'柏駅');
    // initialize(start, '柏駅');
    var gpsFlag = document.getElementById('gpsRoot');
    if (gpsFlag.checked == true) {
        calcRoute(start, endPoint);
    } else {
        var m = new google.maps.Marker({
            map: map,
            position: { lat: pclat, lng: pclng },
        })
        gpsMarkers.push(m);
    }
}

function gpsStart() {
    if (watch_id <= 0) {
        watch_id = window.navigator.geolocation.watchPosition(gpsRoot);
    }
}

function gpsEmd() {
    if (watch_id > 0) {
        window.navigator.geolocation.clearWatch(watch_id);
        watch_id = 0;
    }
    gpsMarkers.forEach((marker) => {
        marker.setMap(null);
    });
    gpsMarkers = [];
}

function marker(place) {
    // console.log(place);
    var search;
    search = new google.maps.Marker({
        map,
        // title: place.name,
        position: place.geometry.location,
    }),
        search.addListener('click', function () {
            if (info != null) {
                info.close();
            }
            start = pos['lat'] + ',' + pos['lng'];
            var i = place.name + "<br>★：" + place.rating + "<br>" + place.formatted_address + "<br>"
                //    + "<a href='" + 'https://www.google.com/maps/search/?api=1&query=' + place.name +"'><button>GoogleMapで見る</button></a>"
                ;
            if (place['opening_hours']) {
                if (place['opening_hours']['weekday_text']) {
                    i = i + place['opening_hours']['weekday_text'][0] + '<br>' + place['opening_hours']['weekday_text'][1] + '<br>' + place['opening_hours']['weekday_text'][2] + '<br>' + place['opening_hours']['weekday_text'][3] + '<br>' + place['opening_hours']['weekday_text'][4] + '<br>' + place['opening_hours']['weekday_text'][5] + '<br>' + place['opening_hours']['weekday_text'][6] + '<br>'
                    // console.log(place['opening_hours']['weekday_text']);
                }
            }
            var dom = document.createElement("div");
            dom.innerHTML = i + "<button id='navi'>ナビ</button>";
            dom.addEventListener("mousemove", () => {
                $('#navi').on('click', function () {
                    Display_JS(start, place.formatted_address);
                    document.getElementById("testroot").click();
                });
            });
            info = new google.maps.InfoWindow({
                position: place.geometry.location,
                content: dom
            });
            info.open(map);
        })
    markers.push(search);
}

// 全角→半角(英数字)
function replaceFullToHalf(str) {
    return str.replace(/[！-～]/g, function (s) {
        return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
}

function enter() {
    var input = document.getElementById("pac-input");
    input.focus();
    let KEvent = new KeyboardEvent("keydown", { keyCode: 13 });
    input.dispatchEvent(KEvent);
    enterFlag = true;
}

var monthFlag = 0;
// var reSearchFlag = true;
function setTime(data) {
    dayNum;
    timeNum;
    dayFlag = null;
    timeFlag = null;
    word = '';
    var year = null;
    var month = null;
    week;
    hours;
    nullFlag = 1;
    monthFlag = 0;
    data = data.split(/[,、\　\ ]/);
    var strDayFlag = 0;
    for (let i = 0; i < data.length; i++) {
        const day = data[i].match(/.曜日/);

        var strDay = replaceFullToHalf(data[i]);
        if (strDay.match(/[0-9]+日/) != null) {
            strDayFlag = 1;
            strDay = strDay.replace(/['日']/, '');
            var dey = new Date();
            dey = dey.getDate();
            if (dey > strDay) {
                monthFlag = 1;
            }
            strDay = Number(strDay);
            data[i] = '';
        }

        var time = replaceFullToHalf(data[i]);
        // var time = data[i].match(/([0-9]+時[0-9]+分$|[0-9]+時半$|[0-9]+時$)/);
        time = time.match(/([0-9]+[0-9時]+分$|[0-9]+時半$|[0-9]+時$)/);

        if (day != null) {
            dayNum = i;
        }
        if (time != null) {
            timeNum = i;
        }
    }

    if (dayNum == null && timeNum == null) {
        nullFlag = 0;
    }
    for (let i = 0; i < data.length; i++) {
        if (i != dayNum && i != timeNum) {
            word += ' ' + data[i];
        }
    }
    // if (typeof dayNum === "undefined") {
    if (strDayFlag == 1) {
        dayWeek(year, month, strDay);
    } else {
        // if (dayNum == null) {
        if (week == null) {
            dayFlag = 1;
            var now = new Date();
            var nowWeek = now.getDay();
            var nowWeeks = ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'];
            week = weeks[nowWeeks[nowWeek]];
        } else {
            // } else {
            week = weeks[data[dayNum]];
            // }
        }
    }

    // if (typeof timeNum === "undefined") {
    if (timeNum) {
        hours = replaceFullToHalf(data[timeNum]);
        hours = hours.replace(/[半]/, '30分');
        hours = hours.replace(/['時']/, '');
        if (hours.indexOf('分') === -1 && hours.indexOf('半') === -1) {
            hours = Number(hours);
            hours = hours * 100;
        } else {
            hours = hours.replace(/['分']/, '');
        }
        hours = Number(hours);
    } else {
        if (time == null) {
            timeFlag = 1;
            var now = new Date();
            var Hour = now.getHours();
            var Min = now.getMinutes();
            var nowTime = Hour * 100 + Min;
            hours = nowTime;
        }
    }
    // if (week != null || hours != null) {
    //     if (timeFlag !== 1 && dayFlag !== 1) {
    //         // reSearchFlag = 1;
    //         // reSearch(word);
    //     }
    // }
}

function searchHours(place, week, time) {
    var service = new google.maps.places.PlacesService(map);
    service.getDetails({
        placeId: place['place_id'],
        // fields: ['name', 'formatted_address', 'geometry', 'url']
    }, function (place, status) {
        if (week == null) {
            var now = new Date();
            var nowWeek = now.getDay();
            var nowWeeks = ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'];
            week = weeks[nowWeeks[nowWeek]];
        }
        if (time == null) {
            var now = new Date();
            var Hour = now.getHours();
            var Min = now.getMinutes();
            var nowTime = Hour * 100 + Min;
            time = nowTime;
        }
        // if (status == google.maps.places.PlacesServiceStatus.OK) {
        if (place['opening_hours']) {
            if (place['opening_hours']['weekday_text']) {
                var day = place['opening_hours']['weekday_text'][week]
                // console.log(place['opening_hours']['weekday_text']);
                day = day.split(/[:～,]/);

                if (day[1] === ' 24 時間営業') {
                    // console.log('yes');
                    return true;
                } else if (day[1] === ' 定休日') {
                    // console.log('no');
                    return false;
                }
                var element;
                for (let i = 1; i < day.length; i++) {//8時30分→830へ変換
                    element = day[i];
                    element = element.replace(/['時']/, '');
                    element = element.replace(/['分']/, '');
                    element = Number(element);
                    // console.log(element);
                    day[i] = element;
                }

                switch (day.length) {
                    case 3:
                        if (day[2] <= day[1]) {
                            day[2] += 2400;
                        }
                        if (day[1] <= time && day[2] >= time) {
                            marker(place);
                            // return true;
                            break;
                        } else {
                            // return false;
                            break;
                        }
                    case 5:
                        if (day[2] <= day[1]) {
                            day[2] += 2400;
                        }
                        if (day[4] <= day[3]) {
                            day[4] += 2400;
                        }
                        if (day[1] <= time && day[2] >= time || day[3] <= time && day[4] >= time) {
                            marker(place);
                            // return true;
                            break;
                        } else {
                            // console.log('no');
                            // return false;
                            break;
                        }
                }
            }
        }
    });
}





function dayWeek(year, month, nowDay) {
    if (year == null) {
        var date = new Date();
        year = date.getFullYear();
    }
    if (month == null) {
        var date = new Date();
        month = date.getMonth() + 1;
        if (monthFlag == 1) {
            month = month + 1;
        }
    }
    if (nowDay == null) {
        var date = new Date();
        nowDay = date.getDate();
    }

    var dayOfWeekStrJP = [6, 0, 1, 2, 3, 4, 5];
    var date = new Date(year, month, nowDay);
    week = dayOfWeekStrJP[date.getDay()];
}


// var GetThere = document.getElementById('GetThere');
// if (GetThere.checked == true) {
//     eigyou();
// }

function eigyou(eigyoutime, p, word, week, h) {
    // eigyoutime = calc('柏駅', '那覇市');
    eigyoutime = replaceFullToHalf(eigyoutime);

    eigyoutime = eigyoutime.split(/[　\ ]/);
    result = 0;

    eigyoutime.forEach(element => {
        // console.log(element);
        if (element.match(/[0-9]+日/) != null) {
            var dayTime = element.replace(/['日']/, '');
            dayTime = dayTime * 24;
            dayTime = dayTime * 100;
            dayTime = Number(dayTime);
            result = result + dayTime;
        }
        if (element.match(/[0-9]+時間/) != null) {
            var hoursTime = element.replace(/['時']/, '');
            hoursTime = hoursTime.replace(/['間']/, '');
            hoursTime = hoursTime * 100;
            hoursTime = Number(hoursTime);
            result = result + hoursTime;
        }
        if (element.match(/[0-9]+分/) != null) {
            var minutes = element.replace(/['分']/, '');
            minutes = Number(minutes);
            result = result + minutes;
        }
    });
    result = Number(result);
    searchHours2(result, p, week, h)
}


function calc(s, e, p, word, week, h) {
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

        //所要時間
        et = response['routes'][0]['legs'][0]['duration']['text'];
        // console.log(response['routes'][0]['legs'][0]['duration']['text']);

        //zoom削除

        // } else {
        // alert('ルートが見つかりませんでした…');
        // }
        eigyou(et, p, word, week, h);
    });
}




function searchHours2(r, place, week, time) {
    var service = new google.maps.places.PlacesService(map);
    service.getDetails({
        placeId: place['place_id'],
        // fields: ['name', 'formatted_address', 'geometry', 'url']
    }, function (place, status) {
        if (week == null) {
            var now = new Date();
            var nowWeek = now.getDay();
            var nowWeeks = ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'];
            week = weeks[nowWeeks[nowWeek]];
        }
        if (time == null) {
            var now = new Date();
            var Hour = now.getHours();
            var Min = now.getMinutes();
            var nowTime = Hour * 100 + Min;
            time = nowTime;
        }
        // if (status == google.maps.places.PlacesServiceStatus.OK) {
        if (place['opening_hours']) {
            if (place['opening_hours']['weekday_text']) {
                var day = place['opening_hours']['weekday_text'][week]
                // console.log(place['opening_hours']['weekday_text']);
                day = day.split(/[:～,]/);

                if (day[1] === ' 24 時間営業') {
                    // console.log('yes');
                    return true;
                } else if (day[1] === ' 定休日') {
                    // console.log('no');
                    return false;
                }
                var element;
                for (let i = 1; i < day.length; i++) {//8時30分→830へ変換
                    element = day[i];
                    element = element.replace(/['時']/, '');
                    element = element.replace(/['分']/, '');
                    element = Number(element);
                    day[i] = element;
                }


                if (r != 0) {
                    time = time + r;
                }

                switch (day.length) {
                    case 3:
                        if (day[2] <= day[1]) {
                            day[2] += 2400;
                        }
                        if (day[1] <= time && day[2] >= time) {
                            marker(place);
                            // return true;
                            break;
                        } else {
                            // console.log('no');
                            // return false;
                            break;
                        }
                    case 5:
                        if (day[2] <= day[1]) {
                            day[2] += 2400;
                        }
                        if (day[4] <= day[3]) {
                            day[4] += 2400;
                        }
                        if (day[1] <= time && day[2] >= time || day[3] <= time && day[4] >= time) {
                            // console.log('yes');
                            marker(place);
                            // return true;
                            break;
                        } else {
                            // console.log('no');
                            // return false;
                            break;
                        }
                }
            }
        }
    });
}

function split(str) {
    str = replaceFullToHalf(str);
    var timeStr;
    var dayStr;
    var weekStr;
    if (str.match(/[0-9][0-9]時[0-9][0-9]分/) != null) {
        var index = str.match(/[0-9][0-9]時[0-9][0-9]分/);
        index = index['index'];
        timeStr = str.slice(index, index + 6);
        str = str.replace(timeStr, '');
    } else if (str.match(/[0-9][0-9]時[0-9]分/) != null) {
        var index = str.match(/[0-9][0-9]時[0-9]分/);
        index = index['index'];
        timeStr = str.slice(index, index + 5);
        str = str.replace(timeStr, '');
    } else if (str.match(/[0-9]時[0-9][0-9]分/) != null) {
        var index = str.match(/[0-9]時[0-9][0-9]分/);
        index = index['index'];
        timeStr = str.slice(index, index + 5);
        str = str.replace(timeStr, '');
    } else if (str.match(/[0-9]時[0-9]分/) != null) {
        var index = str.match(/[0-9]時[0-9]分/);
        index = index['index'];
        timeStr = str.slice(index, index + 4);
        str = str.replace(timeStr, '');
    } else if (str.match(/[0-9][0-9]時半/) != null) {
        var index = str.match(/[0-9][0-9]時半/);
        index = index['index'];
        timeStr = str.slice(index, index + 4);
        str = str.replace(timeStr, '');
    } else if (str.match(/[0-9]時半/) != null) {
        var index = str.match(/[0-9]時半/);
        index = index['index'];
        timeStr = str.slice(index, index + 3);
        str = str.replace(timeStr, '');
    } else if (str.match(/[0-9][0-9]時/) != null) {
        var index = str.match(/[0-9][0-9]時/);
        index = index['index'];
        timeStr = str.slice(index, index + 3);
        str = str.replace(timeStr, '');
    } else if (str.match(/[0-9]+時/) != null) {
        var index = str.match(/[0-9]時/);
        index = index['index'];
        timeStr = str.slice(index, index + 2);
        str = str.replace(timeStr, '');
    }
    if (str.match(/.曜日/) != null) {
        var index = str.match(/.曜日/);
        index = index['index'];
        weekStr = str.slice(index, index + 3);
        str = str.replace(weekStr, '');
    }
    if (str.match(/[0-9][0-9]日/) != null) {
        var index = str.match(/[0-9][0-9]日/);
        index = index['index'];
        dayStr = str.slice(index, index + 3);
        str = str.replace(dayStr, '');
    } else if (str.match(/[0-9]日/) != null) {
        var index = str.match(/[0-9]日/);
        index = index['index'];
        dayStr = str.slice(index, index + 3);
        str = str.replace(dayStr, '');
    }
    var resultStr = '';
    if (str != null) {
        resultStr = resultStr + ' ' + str;
    }
    if (timeStr != null) {
        resultStr = resultStr + ' ' + timeStr;
    }
    if (dayStr != null) {
        resultStr = resultStr + ' ' + dayStr;
    }
    if (weekStr != null) {
        resultStr = resultStr + ' ' + weekStr;
    }
    resultStr = resultStr.trim();
    return resultStr;
}