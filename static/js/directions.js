function callback(results, status) {
    var urlw ='https://maps.googleapis.com/maps/api/directions/json?origin=東京駅&destination=スカイツリー&key='+conf.MAP_KEY;
    $.ajax({
      url: urlw,
      type: 'GET',
      dataType: 'jsonp',
      jsonpCallback: 'callback'
    }).done(function(data) {
    // console.log(data['results']['shop'][0]['address']); // 成功時 この処理はダミーなので変更してください
      console.log(data); // 成功時 この処理はダミーなので変更してください
    //   var res = data['results']['shop'];
    //   for (var k in res) {
    //     gourmetMarker(res[k]);
    //   }
    }).fail(function(data) {
      console.log("no"); // 失敗時
    });
    // // status は以下のような定数で判定（OK の場合は results が配列で返ってきます）
    // if (status === google.maps.places.PlacesServiceStatus.OK) {
    //   //results の数だけ for 文で繰り返し処理
    //   for (var i = 0; i < results.length; i++) {
    //     //createMarker() はマーカーを生成する関数（別途定義）
    //     createMarker(results[i]);
    }
    