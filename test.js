var presen_num = 0;
var graph_data = 0;
const COLORS = [
  "rgba(219,39,91,0.5)",
  "rgba(149,80,91,0.5)",
  "rgba(29,39,191,0.5)",
  "rgba(219,39,291,0.5)",
  "rgba(22,139,91,0.5)",
  "rgba(211,3,191,0.5)",
];

function increase() {
  presen_num += 1;
  console.log(presen_num);
  draw_graph();
  return presen_num;
}

function decrease() {
  presen_num -= 1;
  console.log(presen_num);
  draw_graph();
  return presen_num - 1;
}

// グラフで描画するデータを整形する
function make_datas() {
  // $graph_data =
  // [
  //   [
  //     register_id,
  //     [movie_start,movie_end],
  //     [vote_time, vote_time...],
  //     [
  //       [vote_kind, [vote_cnt, vote_cnt...]],
  //       [vote_kind, [vote_cnt, vote_cnt...]]...
  //     ],
  //     team_name
  //   ],
  //   [
  //     register_id...
  //   ]
  // ]
  let lab = graph_data[presen_num][2];
  let dts = [];
  let i = 0;
  graph_data[presen_num][3].forEach(function (element) {
    // console.log(element);
    dts.push({
      label: element[0],
      data: element[1],
      backgroundColor: COLORS[i],
    });
    i += 1;
  });
  let datas = {
    labels: lab,
    datasets: dts,
  };

  return datas;
}

function find_max_vote() {
  let max = 0;
  let tmp = 0;
  for (let t = 0; t < graph_data[presen_num][3][0][1].length; t++) {
    tmp = 0;
    graph_data[presen_num][3].forEach(function (vote_datas) {
      tmp += vote_datas[1][t];
    });
    // console.log(t + ":" + tmp);
    if (max < tmp) {
      max = tmp;
    }
  }
  // console.log(max);
  return max;
}

function get_data_from_db() {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "./graph.php");
  xhr.addEventListener("loadend", function () {
    // status==200:通信成功
    if (xhr.status === 200) {
      console.log("ok");
      console.log(xhr.response); //graph.phpでechoされたデータを受け取って表示
      console.log(presen_num);
      graph_data = JSON.parse(xhr.response);
    } else {
      console.log("error");
    }
  });
  xhr.send();
}

function draw_graph() {
  var datas = make_datas();
  var option = {
    title: {
      display: true,
      text: graph_data[presen_num][4],
    },
    scales: {
      yAxes: [
        {
          stacked: true,
          ticks: {
            suggestedMax: find_max_vote() + Math.ceil(find_max_vote() / 10),
            suggestedMin: 0,
            stepSize: Math.ceil(find_max_vote() / 10),
            callback: function (value, index, values) {
              return value + "票";
            },
          },
        },
      ],
      xAxes: [{ stacked: true }],
    },
  };
  //datasとoptionを基にグラフを表示
  var ctx = document.getElementById("myChart");
  var myBarChart = new Chart(ctx, {
    type: "bar",
    data: datas,
    options: option,
  });
}
