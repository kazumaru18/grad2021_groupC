var url = new URL(window.location.href);
var params =url.searchParams;
var str= params.get("q");

console.log(str);

window.onload = function(){
    var element = document.getElementById('5w1h');
    element.value = str;
    callback();
}

function callback() {
    $.ajax({
        url: 'http://ap.mextractr.net/ma9/mext5w1h?apikey=' + conf.KEY_5W1H + '&text=' + str + '',
        type: 'GET',
        dataType: 'xml',
      }).done(function(data) {
        console.log("aaa");
      }).fail(function(data) {
        console.log("no"); // 失敗時
      });
}
