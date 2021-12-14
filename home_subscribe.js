// IFrame Player API の読み込みタグを挿入
var judge = 0;
var vote_time = 0;
var hms = 0;
var sample;
const tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

const movie_id = 1;

//----------------------------------------------------------
var sock = new WebSocket("ws://192.168.10.196:5001");

// 接続
sock.addEventListener("open", function (e) {
  console.log("Socket 接続成功");
  sock.send(`${movie_id},new_connection,empty`);
});

// サーバーからデータを受け取る
sock.addEventListener("message", function (e) {
  console.log(e.data);
});

function send_data(i) {
  sock.send(`${movie_id},vote,${i}`);
}
//------------------------------------------------------------

// 関数onYouTubeIframeAPIReadyでiframeとYoutubeプレイヤーを作成
let player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player("player", {
    width: 1152,
    height: 648,
    videoId: "L2poZwNyGpY",
    playerVars: {
      // 'autoplay': 1,
      // 'mute': 1,
      // 'controls': 0,
      loop: 1,
      //'playlist': 'tcRvI1rSokk',
      playlist: "L2poZwNyGpY",
      //'rel': 0
    },
  });
}

function clicked(j) {
  send_data(j);
  insert_judge(j);
}

function hhmmss(seconds) {
  const hour = Math.floor(seconds / 3600);
  const minute = Math.floor((seconds - 3600 * hour) / 60);
  const second = Math.floor(seconds % 60);
  const hh = ("00" + hour).slice(-2);
  const mm = ("00" + minute).slice(-2);
  const ss = ("00" + second).slice(-2);
  hms = "" + hh + mm + ss;
}

let hosturl = "insert_node.php"; // データ送信先
function insert_judge(j) {
  vote_time = player.getCurrentTime();
  hhmmss(vote_time);
  $.ajax({
    url: hosturl,
    type: "GET",
    data: { judge: j, vote_time: vote_time, hms: hms },
    timeout: 10000,
  });
}

//わらいボタンを押したらDBに1と動画経過時間を送信
function FunnyClick() {
  judge = 1;
  clicked(judge);
}

//いいねボタンを押したらDBに2と動画経過時間を送信
function LoveClick() {
  judge = 2;
  clicked(judge);
}

//かなしいボタンを押したらDBに3と動画経過時間を送信
function SadClick() {
  judge = 3;
  clicked(judge);
}

//いかりボタンを押したらDBに4と動画経過時間を送信
function AngryClick() {
  judge = 4;
  clicked(judge);
}

//びっくりボタンを押したらDBに5と動画経過時間を送信
function SurpriseClick() {
  judge = 5;
  clicked(judge);
}

//がっかりボタンを押したらDBに6と動画経過時間を送信
function ShockClick() {
  judge = 6;
  clicked(judge);
}

//埋め込まれている動画タイトルを取得 表示
get();
function get() {
  let formData = new FormData();
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "./youtube.php");
  xhr.addEventListener("loadend", function () {
    if (xhr.status === 200) {
      let data = JSON.parse(xhr.response);
      var myh1 = document.getElementById("myh1");
      myh1.innerHTML = data;
    }
  });
  xhr.send(formData);
}
