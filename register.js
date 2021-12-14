// IFrame Player API の読み込みタグを挿入
var vote_time = 0;
var start = 0;
var end = 0;
var judge = 0;
let text = "未入力";
let team_name = "未入力";
const tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 関数YouTubeIframeAPIReadyでiframeとYoutubeプレイヤーを作成
let player;
function YouTubeIframeAPIReady(movie_name) {
  console.log(movie_name);
  if (!player) {
    player = new YT.Player("player", {
      width: 1152,
      height: 648,
      //   videoId: "L2poZwNyGpY",
      videoId: movie_name,

      playerVars: {
        autoplay: 1,
        // 'mute': 1,
        // 'controls': 0,
        // loop: 1,
        //'playlist': 'tcRvI1rSokk',
        //   playlist: video_id,
        playlist: movie_name,

        //'rel': 0
      },
    });
  } else {
    player.loadVideoById(movie_name); /* 指定した動画を読み込んで再生（自動再生扱い） */
  }
}

const showMessage = () => {
  const textbox = document.getElementById("input-message");
  text = textbox.value;
  team_name = "'" + text + "'";

  //テキストボックスの値を使って、出力するメッセージを生成する
  const output = text;
  //出力用のp要素にメッセージを表示
  document.getElementById("output-message").innerHTML = output;
};

//スタートボタンの秒をHH:MM:SSの形式に変更
function Starthms(seconds) {
  const hour = Math.floor(seconds / 3600);
  const minute = Math.floor((seconds - 3600 * hour) / 60);
  const second = Math.floor(seconds % 60);
  const hh = ("00" + hour).slice(-2);
  const mm = ("00" + minute).slice(-2);
  const ss = ("00" + second).slice(-2);
  start = "" + hh + mm + ss;
}
//ストップボタンの秒をHH:MM:SSの形式に変更
function Endhms(seconds) {
  const hour = Math.floor(seconds / 3600);
  const minute = Math.floor((seconds - 3600 * hour) / 60);
  const second = Math.floor(seconds % 60);
  const hh = ("00" + hour).slice(-2);
  const mm = ("00" + minute).slice(-2);
  const ss = ("00" + second).slice(-2);
  end = "" + hh + mm + ss;
}

//ボタン要素を取得
let startbtn = document.getElementById("start");
//表示・非表示を切り替える要素を取得
document.getElementById("end").style.display = "none"; // hide
let endbtn = document.getElementById("end");
//styleのdisplayを変更する関数
let changeElement = (el) => {
  vote_time = player.getCurrentTime();
  Starthms(vote_time);
  if (el.style.display == "none") {
    el.style.display = "";
  } else {
    el.style.display = "none";
  }
};
//上記関数をスタートボタンクリック時に実行
startbtn.addEventListener(
  "click",
  () => {
    changeElement(endbtn);
  },
  false
);

//styleのdisplayを変更する関数
let changeElement2 = (el) => {
  vote_time = player.getCurrentTime();
  Endhms(vote_time);
  alert(team_name + ":" + start + " " + end);
  // $.ajax({
  //   url: hosturl,
  //   type: "GET",
  //   data: { team_name: team_name, movie_start: start, movie_end: end },
  //   timeout: 10000,
  // });
  if (el.style.display == "") {
    el.style.display = "none";
  } else {
    el.style.display = "";
  }
};
//上記関数をストップボタンクリック時に実行
endbtn.addEventListener(
  "click",
  () => {
    changeElement2(endbtn);
  },
  false
);

let hosturl = "register.php"; // データ送信先
//スタートボタンを押したらチーム名と動画経過時間を送信
function StartClick() {
  vote_time = player.getCurrentTime();
  start=hhmmss(vote_time);
  // alert(hms);
  // $.ajax({
  //   url: hosturl,
  //   type: "GET",
  //   data: { team_name: team_name, movie_start: hms, movie_end: 0 },
  //   timeout: 10000,
  // });
}
//ストップボタンを押したらチーム名と動画経過時間を送信
function EndClick() {
  vote_time = player.getCurrentTime();
  end=hhmmss(vote_time);
  alert(hms);
  $.ajax({
    url: hosturl,
    type: "GET",
    data: { team_name: team_name, movie_start: start, movie_end: end },
    timeout: 10000,
  });
}

let datakeep;
window.onload = function pulldown() {
  $.ajax({
    type: "GET",
    url: "movie.php",
    dataType: "json",
    // data: { movie_id: "L2poZwNyGpY" },
  })
    .done(function (data) {
      console.log("DONE", data);
      console.log("通信が成功しました!!!");
      datakeep = data;
      let team_nameobject = document.getElementById("team_namehere");
      for (let i = 0; i < data.length; i++) {
        let link = '<option value="' + data[i]["URL"] + '">' + data[i]["movie_name"] + "</option>";
        team_nameobject.insertAdjacentHTML("beforeend", link);
      }
      select.onchange();
    })
    .fail(function (XMLHttpRequest, textStatus, errorThrown) {
      console.log("通信に失敗しました");
      console.log("XMLHttpRequest : " + XMLHttpRequest.status);
      console.log("textStatus     : " + textStatus);
      console.log("errorThrown    : " + errorThrown.message);
    });
};

let select = document.querySelector('[name="team_name"]');
select.onchange = (event) => {
  console.log(select.value);
  movie_name = select.value;
  console.log(typeof movie_name);
  YouTubeIframeAPIReady(movie_name);
  register(movie_name);
};

function hhmmss(seconds) {
  const hour = Math.floor(seconds / 3600);
  const minute = Math.floor((seconds - 3600 * hour) / 60);
  const second = Math.floor(seconds % 60);
  const hh = ("00" + hour).slice(-2);
  const mm = ("00" + minute).slice(-2);
  const ss = ("00" + second).slice(-2);
  hms = "" + hh + mm + ss;
  return hms;
}

function register(movie_name) {
  for (i = 0; i < datakeep.length; i++) {
    console.log(datakeep[i]["URL"]);
    if (movie_name == datakeep[i]["URL"]) {
      break;
    }
  }
  console.log(datakeep[i]["movie_id"]);

  $.ajax({
    type: "GET",
    url: "register_read.php",
    dataType: "json",
    data: { movie_id: datakeep[i]["movie_id"] },
  })
    .done(function (data) {
      console.log("DONE", data);
      console.log("通信が成功しました!!!");
      create_team_table(data);
    })
    .fail(function (XMLHttpRequest, textStatus, errorThrown) {
      console.log("通信に失敗しました");
      console.log("XMLHttpRequest : " + XMLHttpRequest.status);
      console.log("textStatus     : " + textStatus);
      console.log("errorThrown    : " + errorThrown.message);
    });
}

function create_team_table(data) {
  let team_table = document.getElementById("team_table");
  while (team_table.firstChild) {
    team_table.removeChild(team_table.firstChild);
  }

  let table = document.createElement("table");
  table.id = "team_table_id";
  let tr = document.createElement("tr");

  tharray = ["チーム名", "開始時間", "終了時間"];
  for (j = 0; j < tharray.length; j++) {
    let th = document.createElement("th");
    th.textContent = tharray[j];
    tr.appendChild(th);
  }
  table.appendChild(tr);

  for (y = 0; y < data.length; y++) {
    let tr = document.createElement("tr");
    let td_name = document.createElement("td");
    let td_start = document.createElement("td");
    let td_finish = document.createElement("td");
    td_name.innerHTML = data[y]["team_name"];
    td_start.innerHTML = data[y]["movie_start"];
    td_finish.innerHTML = data[y]["movie_end"];

    tr.appendChild(td_name);
    tr.appendChild(td_start);
    tr.appendChild(td_finish);
    table.appendChild(tr);

    document.getElementById("team_table").appendChild(table);
  }
}

function makeTime(num) {
  // var timeD = Math.floor(num / (24 * 60 * 60));
  // var timeH = Math.floor((num % (24 * 60 * 60)) / (60 * 60));
  var timeM = Math.floor(((num % (24 * 60 * 60)) % (60 * 60)) / 60);
  var timeS = ((num % (24 * 60 * 60)) % (60 * 60)) % 60;
  // var timeDMS = timeD + "日" + timeH + "時間" + timeM + "分" + timeS + "秒";
  var timeDMS = timeM + "分" + timeS + "秒";

  return timeDMS;
}
console.log(makeTime(100000));
