let video_path;
let data_movie;

window.onload = function movie_read() {
  console.log("moive_readが呼び出されました。");
  $.ajax({
    type: "GET",
    url: "movie.php",
    dataType: "json",
    data: {},
  })
    .done(function (data) {
      console.log("DONE", data);
      console.log("通信が成功しました!!!");
      data_movie = data;
      video_path = data[0]["URL"];
      console.log(video_path);
      let team_nameobject = document.getElementById("team_namehere");
      for (let i = 0; i < data.length; i++) {
        let link = '<option value="' + data[i]["URL"] + '">' + data[i]["movie_name"] + "</option>";
        team_nameobject.insertAdjacentHTML("beforeend", link);
      }
      YouTubeIframeAPI(video_path);
      register_read(data[0]["movie_id"]);
    })
    .fail(function (XMLHttpRequest, textStatus, errorThrown) {
      console.log("通信に失敗しました");
      console.log("XMLHttpRequest : " + XMLHttpRequest.status);
      console.log("textStatus     : " + textStatus);
      console.log("errorThrown    : " + errorThrown.message);
    });
};
let data_register_read;
let data_registe_read_team_name = [];
function register_read(movie_id) {
  console.log("register_readが呼び出されました。");

  console.log(movie_id);
  $.ajax({
    type: "GET",
    url: "register_read.php",
    dataType: "json",
    data: { movie_id: movie_id },
  })
    .done(function (data) {
      console.log("DONE", data);
      console.log("通信が成功しました!!!");
      data_register_read = data;
      for (i = 0; i < data.length; i++) {
        data_registe_read_team_name.push(data[i]["team_name"]);
      }
      // console.log(data_registe_read_movie_start);
      // console.log(data_registe_read_team_name);
      // document.getElementById("team_name").innerHTML = data[0]["team_name"];
      vote_read(movie_id);
    })
    .fail(function (XMLHttpRequest, textStatus, errorThrown) {
      console.log("通信に失敗しました");
      console.log("XMLHttpRequest : " + XMLHttpRequest.status);
      console.log("textStatus     : " + textStatus);
      console.log("errorThrown    : " + errorThrown.message);
    });
}
let data_vote_read;
let judgearray = [];

function vote_read(movie_id) {
  console.log("vote_readが呼び出されました。");

  console.log(movie_id);
  $.ajax({
    type: "GET",
    url: "judge.php",
    dataType: "json",
    data: { movie_id: movie_id },
  })
    .done(function (data) {
      console.log("DONE", data);
      console.log("通信が成功しました!!!");
      data_vote_read = data;
      judgearray.length = 0;
      for (i = 0; i < data.length; i++) {
        judgearray.push(data[i]["vote_time"]);
      }
      console.log(judgearray);
    })
    .fail(function (XMLHttpRequest, textStatus, errorThrown) {
      console.log("通信に失敗しました");
      console.log("XMLHttpRequest : " + XMLHttpRequest.status);
      console.log("textStatus     : " + textStatus);
      console.log("errorThrown    : " + errorThrown.message);
    });
}
let pngarray = ["./etc/pic/1.png", "./etc/pic/2.png", "./etc/pic/3.png", "./etc/pic/4.png", "./etc/pic/5.png", "./etc/pic/6.png"];
function judge(judge) {
  console.log("judgeが呼び出されました。", judge);
  let board = document.getElementById("canvas");
  let ctx = board.getContext("2d");
  let x = Math.random() * 860;
  let y = Math.random() * 380;
  const chara = new Image();

  chara.src = pngarray[Number(judge) - 1];

  chara.onload = () => {
    var rand = Math.floor(Math.random() * 100);
    console.log("rand", rand);
    if (rand < 100) {
      msg = ctx.drawImage(chara, x, y, 100, 100);
      setTimeout(function () {
        clearImage(x, y);
      }, 3000);
    }
  };
}
function clearImage(x, y) {
  let board = document.getElementById("canvas");
  let ctx = board.getContext("2d");
  // console.log("x座標", x);
  // console.log("y座標", y);
  ctx.clearRect(x, y, x + 100, y + 100);
}

var tag = document.createElement("script");

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function YouTubeIframeAPI() {
  console.log("YouTubeIframeAPIが呼び出されました。");

  if (!player) {
    player = new YT.Player("player", {
      height: "540",
      width: "960",
      videoId: video_path,
      playerVars: {
        playsinline: 1,
        rel: 0, // 関連動画の有無(default:1)
        // showinfo: 1, // 動画情報表示(default:1)
        // controls: 1, // コントロール有無(default:1)
      },

      events: {
        onReady: onPlayerReady,
        // onStateChange: onPlayerStateChange,
      },
    });
  } else {
    player.loadVideoById(video_path); /* 指定した動画を読み込んで再生（自動再生扱い） */
  }
}
let one = 0;
let start_time = 0;
function onPlayerReady(event) {
  // event.target.mute();
  player.loadVideoById({
    videoId: video_path,
    startSeconds: start_time,
    // endSeconds: 8,
    suggestedQuality: "small",
  });
  // event.target.setVolume(0);
  // event.target.playVideo();
  if (one == 0) {
    timer = setInterval(getStatus, 300);
    one = 1;
  }
  // setTimeout(Mute(event), 5000);
}

// let counter = 0;
let counter_register_id = 0;
let index_keep = 1000000;
let count = 0;
let getStatus = function () {
  console.log("現在の動画の時間", player.getCurrentTime());
  // console.log("評価された時間", judgearray[counter] * 1000);
  // console.log("差", player.getCurrentTime() * 1000 - judgearray[counter] * 1000);
  // if (Math.abs(player.getCurrentTime() * 1000 - judgearray[counter] * 1000) < 500) {
  // judge(data_vote_read[counter]["judge"]);
  // counter++;/
  // console.log("範囲内！！");
  // console.log(counter);
  // if (counter == judgearray.length) {
  // counter = 0;
  // counter_register_id++;
  // document.getElementById("team_name").innerHTML = data_register_read[counter_register_id]["team_name"];
  // vote_read(data_register_read[counter_register_id]["movie_id"]);
  // }
  // }
  // var value = 100; // 調べたい値
  // var array = [1, 123, 13, 84, 255, 3, 136, 96, 117, 62]; // 調べたい配列
  let diff = [];
  let index = 1;
  $(judgearray).each(function (i, val) {
    diff[i] = Math.abs(player.getCurrentTime() - val);
    index = diff[index] < diff[i] ? index : i;
  });
  console.log("次のスタンプが出る秒数", judgearray[index]);
  console.log("動画の時間との差", diff);
  if (diff[index] < 0.5) {
    console.log("範囲内！！");
    console.log("さっき表示したindex：", index_keep);
    console.log("今から表示したいindex：", index);
    console.log("今から表示したい値：", judgearray[index]);
    console.log("次の値：", judgearray[index + 1]);
    if (index_keep == index) {
      if (judgearray[index] == judgearray[index + 1]) {
        judge(data_vote_read[index + count]["judge"]);
        count++;
      }
    } else {
      judge(data_vote_read[index]["judge"]);
      index_keep = index;
      count = 0;
    }
  }
  for (z = 0; z < data_register_read.length; z++) {
    if (data_register_read[z]["movie_start"] <= player.getCurrentTime() && player.getCurrentTime() <= data_register_read[z]["movie_end"]) {
      break;
    }
  }
  if (z == data_register_read.length) {
    document.getElementById("team_name").innerHTML = "チーム名";
  } else {
    document.getElementById("team_name").innerHTML = data_register_read[z]["team_name"];
  }
  console.log(z);
};

var done = false;
// function onPlayerStateChange(event) {
//   if (event.data == YT.PlayerState.PLAYING && !done) {
//     // setTimeout(stopVideo, 6000);
//     done = true;
//   }
// }
function stopVideo() {
  player.stopVideo();
}

function nextbuttonclick() {
  console.log(document.getElementById("team_name").textContent);
  now_team_name = document.getElementById("team_name").textContent;
  if (now_team_name == "チーム名") {
    document.getElementById("team_name").innerHTML = data_register_read[0]["team_name"];
    start_time = data_register_read[0]["movie_start"];
  } else {
    for (i = 0; i < data_register_read.length; i++) {
      if (now_team_name == data_register_read[i]["team_name"]) {
        break;
      }
    }
    console.log(i);
    document.getElementById("team_name").innerHTML = data_register_read[i + 1]["team_name"];
    start_time = data_register_read[i + 1]["movie_start"];
  }
  onPlayerReady();
}

function previousbuttonclick() {
  console.log(document.getElementById("team_name").textContent);
  now_team_name = document.getElementById("team_name").textContent;
  for (i = 0; i < data_register_read.length; i++) {
    if (now_team_name == data_register_read[i]["team_name"]) {
      break;
    }
  }
  console.log(i);
  document.getElementById("team_name").innerHTML = data_register_read[i - 1]["team_name"];
  start_time = data_register_read[i - 1]["movie_start"];
  onPlayerReady();
}

let select = document.querySelector('[name="team_name"]');
select.onchange = (event) => {
  console.log(select.value);
  video_path = select.value;
  YouTubeIframeAPI();
  console.log(data_movie[1]["URL"]);
  for (i = 0; i < data_movie.length; i++) {
    if (video_path == data_movie[i]["URL"]) {
      break;
    }
  }
  console.log(i);
  register_read(data_movie[i]["movie_id"]);
};
