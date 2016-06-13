// //------------------------------------------------------------------------------------------------------GPSinfo
// var deflat = 34.830156;
// var deflng = 138.173407;
//
//
// function start_func() {
//     get_location();
// }
//
// //位置情報を取得
// function get_location() {
//     if (navigator.geolocation) {
//         // 現在の位置情報取得を実施 正常に位置情報が取得できると、successCallbackがコールバックされます。
//         navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
//     } else {
//         initMap(deflat, deflng);
//     }
// }
//
// // ( 2 )位置情報が正常に取得されたら
// function successCallback(pos) {
//     var Potition_latitude = pos.coords.latitude;
//     var Potition_longitude = pos.coords.longitude;
//
//     // 位置情報が取得出来たらGoogle Mapを表示する
//     initMap(Potition_latitude, Potition_longitude);
// }
//
// function errorCallback(error) {
//     initMap(deflat, deflng);
// }
//
// // ( 3 )Google Map API を使い、地図を読み込み
// function initMap(x, y) {
//     // Geolocationで取得した座標を代入
//     var myLatLng = {
//         lat: Number(x),
//         lng: Number(y)
//     };
//
//     map = new google.maps.Map(document.getElementById('map'), {
//         zoom: 18,
//         center: myLatLng
//     });
// }
// $(start_func);

//------------------------------------------------------------現在時刻の表示

var nowDate = new Date();
// var nowHour = 15;
var nowHour = nowDate.getHours();
// var nowMinutes = 30;
var nowMinutes = nowDate.getMinutes();
var nowSeconds = nowDate.getSeconds();
var nowTime = nowHour * 60 + nowMinutes;

//------------------------------------------------------------アイコンを動かす

var icon = document.getElementById('icon');
var y = 0;
// var y = document.getElementById('mapArea').clientHeight;
var fla = 0;




function moveicon() {

    var csvList;
    $.ajax({
        url: './data/time.csv',
        success: function(data) {

            // csvを配列に格納
            csvList = $.csv()(data);
            nowSta = 1;
            csvStartTime = Number(csvList[1][2]) * 60 + Number(csvList[1][3]);
            csvEndTime = Number(csvList[csvList.length - 3][2]) * 60 + Number(csvList[csvList.length - 3][3]);

            for (var i = 1; i < csvList.length - 2; i++) {
                var csvTime = Number(csvList[i][2]) * 60 + Number(csvList[i][3]);
                if (nowTime >= csvEndTime || nowTime <= csvStartTime) {
                    nowSta = 1;
                    y = csvList[nowSta][5]
                } else if(nowTime > csvTime){
                    nowSta = i + 1;
                    //現在時刻に近い駅 - 次の駅 = 距離
                    var dis = csvList[i][5] - csvList[i + 1][5]
                    //現在時刻に近い駅 - 次の駅 = 時間（分）
                    var disTime = csvTime - (Number(csvList[i + 1][2]) * 60 + Number(csvList[i + 1][3]));
                    //近い駅の到着時刻からなん分経ったか？
                    var diffTime = nowTime - (Number(csvList[i][2]) * 60 + Number(csvList[i][3]))
                        //現在時刻に近い駅 + 予想移動距離
                    y = Number(csvList[i][5]) + ((dis / disTime) * diffTime);
                }
            }
            var stationName = document.getElementById('header');
            stationName.innerText = csvList[nowSta][1] + "駅  " + csvList[nowSta][6] + "時刻：" + csvList[nowSta][2] + "時" + csvList[nowSta][3] + "分";
        }
    })

    icon.style.top = y + 'px';

}

//==================================================================== onClickEvent
var flaOpenHeader = 0;
$(function() {
    $('#icon').click(function() {
        if (flaOpenHeader == 0) {
            $('#header').css('top', '-10vh');
            flaOpenHeader = 1;
        } else {
            $('#header').css('top', '0vh');
            flaOpenHeader = 0;
        }
    });
});
$(function() {
    $('#header').click(function() {
        $('#header').css('top', '-10vh');
        flaOpenHeader = 1;
    });
});
