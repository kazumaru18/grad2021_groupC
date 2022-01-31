// const { default: axios } = require("axios");

var url = new URL(window.location.href);
var params = url.searchParams;
var str = params.get("q");
const conf = {
	MAP_KEY: "AIzaSyAaKn-PcSb_pTFwH6IJ2_ANNLKsHVMHWwU",
	GOURMET_KEY: "04b892c025d4a7cf",
	KEY_5W1H: "17333CBF6A1D9B2E29B84A012D2AAF2C498735C7",
}
// var page_url = location.href;
// console.log(page_url);
// location.href = "http://ap.mextractr.net/ma9/mext5w1h?apikey=" + conf.KEY_5W1H + "&text=" + str;
// var page_url = location.href;
// console.log(page_url);
// console.log(location.pathname);
// console.log(str);
// const conf = {
// 	MAP_KEY: "AIzaSyAaKn-PcSb_pTFwH6IJ2_ANNLKsHVMHWwU",
// 	GOURMET_KEY: "04b892c025d4a7cf",
// 	KEY_5W1H: "17333CBF6A1D9B2E29B84A012D2AAF2C498735C7",
// }

// const axios = require('axios');
// const urlw = "http://ap.mextractr.net/ma9/mext5w1h?apikey=" + conf.KEY_5W1H + "&text=" + str;

// window.onload = async function () {
// 	try {
// 		const res = await axios.get(urlw);
// 		const items = res.data;
// 		for (const item of items) {
// 			console.log(`${item.user.id}: \t${item.title}`);
// 		}
// 	} catch (err) {
// 		console.log(err);
// 	}
// }

// const router = new VueRouter({
// 	routes
// })

// router.get('/', window.onload = function (req, res, next) {

// 	axios.get('http://ap.mextractr.net/ma9/mext5w1h?apikey=' + conf.KEY_5W1H + '&text=' + str)
// 	then(response => {
// 		res.send(response.data.result);
// 	}).catch(error => {
// 		res.send(error.message);
// 	})
// })

// const https = require('https');
// https.get('http://ap.mextractr.net/ma9/mext5w1h?apikey=' + conf.KEY_5W1H + '&text=' + str, (resp) => {
// 	let data = '';
// 	resp.on('data', (chunk) => {
// 		data += chunk;
// 	});
// 	resp.on('end', () => {
// 		console.log(JSON.parse(data).explanation);
// 	});
// }).on("error", (err) => {
// 	console.log("Error: " + err.message);
// })

// function callback() {
//     $.ajax({
//         url: 'http://ap.mextractr.net/ma9/mext5w1h?apikey=' + conf.KEY_5W1H + '&text=' + str,
//         type: 'GET',
//         dataType: 'xml',
//       }).done(function(data) {
//         console.log("aaa");
//       }).fail(function(data) {
//         console.log("no"); // 失敗時
//       });
// }

// (document).ready(function(){
// 	//
// var api;
// api.use(function (req, res, next) {
// 	res.header("Access-Control-Allow-Origin", "*");
// 	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
// 	next();
// })

// window.onload = function () {
// 	var element = document.getElementById('5w1h');
// 	element.value = str;
// 	console.log(str)
// 	var urlw = 'http://ap.mextractr.net/ma9/mext5w1h?out=atom&apikey=' + conf.KEY_5W1H + '&text=' + str;
// 	$.ajax({
// 		url: urlw,
// 		type: "get",
// 		dataType: "xml",
// 		timeout: 1000,
// 		cache: false,
// 		success: function (xml) {
// 			console.log(xml);
// 		},
// 		error: function () {
// 			alert("xmlファイルの読み込み失敗");
// 		},
// 	});
// }


	// fetch(urlw, {
	// 	method: "get",
	// 	dataType: "xml",
	// 	timeout: 1000,
	// 	mode: "cors",
	// }).then(function (response) {
	// 	if (response.status === 200) {
	// 		console.log(response.statusTest);
	// 	} else {
	// 		alert("xmlファイルの読み込み失敗");
	// 	}
	// }).catch(function (response) {
	// 	console.log(response);
	// })
	// const xmlUrl = "http://ap.mextractr.net/ma9/mext5w1h?apikey=' + conf.KEY_5W1H + '&text=' + str";

	// fetch(xmlUrl)
	// 	.then( res => {
	// 		if(res.status >= 200 && res.status < 300){
	// 			return res.text();
	// 		}
	// 		throw new Error('${res.statusText}($res.status}');
	// 	})
	// 	.then( xmlString => {
	// 		const xmlData = new window.DOMParser().parseFromString(xmlString, "text/xml");
	//         if( xmlData.getElementsByTagName("parsererror").length ){
	//             throw new Error( "XMLではない" );
	//         }
	//         printXML( xmlData );
	//     })
	// 	.catch( e => console.log( e.message ) );


	// const xmlUrl = "http://ap.mextractr.net/ma9/mext5w1h?apikey=' + conf.KEY_5W1H + '&text=' + str";

	// const xreq = new XMLHttpRequest();
	// xreq.open( "GET" ,  xmlUrl );

	// xreq.responseType = "document";
	// xreq.overrideMimeType("text/xml");

	// xreq.onload = ()=>{
	// 	        if( xreq.readyState === 4 ){
	//     	        if( xreq.status >= 200 && xreq.status <= 299 ){
	//         	        if( xreq.responseXML === null ) {
	//             	        console.log( "XMLではない" );
	//                 	}else{
	//                     	printXML( xreq.responseXML );
	//                 	}
	//             	}else {
	//                 	console.log( "status error:" + xreq.status );
	//             	}
	//         	}
	// };

	// xreq.onerror = (e) => {
	// 	        console.log( "error" );
	// };
	// xreq.send();	
// }

