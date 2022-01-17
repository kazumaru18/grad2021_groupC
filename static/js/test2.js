var url = new URL(window.location.href);

var params = url.searchParams;

var str = params.get('q');
console.log(str);

window.onload = function(){
    var element = document.getElementById('test');
    element.value = str;
}