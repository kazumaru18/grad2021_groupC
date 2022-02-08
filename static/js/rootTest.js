$.ajax({
    url: '/route_transit?start=00008247&goal=00005172&via=[{"node":"00006668"}]&start_time=2019-10-01T08:00:00&options=railway_calling_at',
    type: 'GET',
    dataType: 'jsonp',
    jsonpCallback: 'callback'
}).done(function (data) {
    console.log(data);
}).fail(function (data) {
    console.log("no"); // 失敗時
});