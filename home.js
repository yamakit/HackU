// IFrame Player API の読み込みタグを挿入
var judge = 0;
var vote_time = 0;
var hms = 0;
var sample;
const tag = document.createElement('script')
tag.src = "https://www.youtube.com/iframe_api"
const firstScriptTag = document.getElementsByTagName('script')[0]
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)

// 関数onYouTubeIframeAPIReadyでiframeとYoutubeプレイヤーを作成
let player
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    width: 1152,
    height: 648,
    videoId: 'L2poZwNyGpY',
    playerVars: {
      // 'autoplay': 1,
      // 'mute': 1,
      // 'controls': 0,
      'loop': 1,
      //'playlist': 'tcRvI1rSokk',
      'playlist': 'L2poZwNyGpY',
      //'rel': 0
    },
  })
}

function hhmmss(seconds){
  const hour = Math.floor(seconds / 3600);
  const minute = Math.floor((seconds - 3600 * hour) / 60);
  const second = Math.floor(seconds%60);
  const hh = ('00' + hour).slice(-2);
  const mm = ('00' + minute).slice(-2);
  const ss = ('00' + second).slice(-2);
  hms = ""+hh+mm+ss;
}

let hosturl= 'insert.php'; // データ送信先
//わらいボタンを押したらDBに1と動画経過時間を送信
function FunnyClick(){
  judge = 1;
  vote_time = player.getCurrentTime();
  hhmmss(vote_time);
  $.ajax({
    url: hosturl,
    type:'GET',
    data : {judge :judge,
            vote_time :vote_time,
            hms :hms
          },
    timeout:10000,
  });
}
//いいねボタンを押したらDBに2と動画経過時間を送信
function LoveClick(){
  judge = 2;
  vote_time = player.getCurrentTime();
  hhmmss(vote_time);
  $.ajax({
    url: hosturl,
    type:'GET',
    data : {judge :judge,
            vote_time :vote_time,
            hms :hms
          },
    timeout:10000,
  });
}
//かなしいボタンを押したらDBに3と動画経過時間を送信
function SadClick(){
  judge = 3;
  vote_time = player.getCurrentTime();
  hhmmss(vote_time);
  $.ajax({
    url: hosturl,
    type:'GET',
    data : {judge :judge,
            vote_time :vote_time,
            hms :hms
          },
    timeout:10000,
  });
}
//いかりボタンを押したらDBに4と動画経過時間を送信
function AngryClick(){
  judge = 4;
  vote_time = player.getCurrentTime();
  hhmmss(vote_time);
  $.ajax({
    url: hosturl,
    type:'GET',
    data : {judge :judge,
            vote_time :vote_time,
            hms :hms
          },
    timeout:10000,
  });
}
//びっくりボタンを押したらDBに5と動画経過時間を送信
function SurpriseClick(){
  judge = 5;
  vote_time = player.getCurrentTime();
  hhmmss(vote_time);
  $.ajax({
    url: hosturl,
    type:'GET',
    data : {judge :judge,
            vote_time :vote_time,
            hms :hms
          },
    timeout:10000,
  });
}
//がっかりボタンを押したらDBに6と動画経過時間を送信
function ShockClick(){
  judge = 6;
  vote_time = player.getCurrentTime();
  hhmmss(vote_time);
  $.ajax({
    url: hosturl,
    type:'GET',
    data : {judge :judge,
            vote_time :vote_time,
            hms :hms
          },
    timeout:10000,
  });
}

//埋め込まれている動画タイトルを取得 表示
get()
function get(){
  let formData = new FormData();
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "./youtube.php");
  xhr.addEventListener("loadend", function(){
    if (xhr.status === 200){
      let data = JSON.parse(xhr.response);
      var myh1 = document.getElementById("myh1");
      myh1.innerHTML = data;
    }
  });
  xhr.send(formData);
}