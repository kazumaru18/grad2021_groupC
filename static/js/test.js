// window.addEventListener('load', function () {
//     $.ajax({
//         url: 'http://ap.mextractr.net/ma9/mext5w1h?out=atom&apikey=17333CBF6A1D9B2E29B84A012D2AAF2C498735C7&text=kfc',
//         type: 'GET',
//         dataType: 'XML',
//         cache: false,
//         // 成功時の処理
//         success: function (data) {
//             // dataにxmlのデータが入っている
//             console.log(data);
//         },
//         // 失敗時の処理
//         error: function (err) {
//             console.log(err);
//         }
//     });
// });

var url = new URL(window.location.href);
var params = url.searchParams;
var str = params.get("q");

// // console.log(str);

window.onload = function() {
	var element = document.getElementById('5w1h');
    element.value = str;
	console.log(str)
	var urlw = "http://127.0.0.1:8000/ma9/zip/get"
	$.ajax({
		url: urlw,
		type:"get",
		dataType:"json",
		timeout:1000,
		cache:false,
        success: function (data) {
            // dataにxmlのデータが入っている
            console.log(data);
        },
        // 失敗時の処理
        error: function (err) {
            console.log(err)
            console.log(err["responseText"]);
        }
// 		error:function(err){
//             console.log(err["responseText"])
// 			alert("xmlファイルの読み込み失敗");
// 		},
// 		success:function(xml){
// 			console.log(xml);
	    // }
	});
}

// import Vue from 'vue'
// import axios from 'axios'

// Vue.prototype.$getExtractFromZip = () =>{
//     let url = `http://127.0.0.1:8000/ma9/zip/get`
//     return axios.get(url)
//     .then((res) => {
//         console.log(res.data)
//         return res.data
//   })
// }