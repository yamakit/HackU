var server = require("ws").Server;
var s = new server({ port: 5001 });
var judge_cnts = {};
// judge_cnts =
// {
//     'movie_id_1':{vote:["funny", "love", "sad", "angry", "surprise", "shock"],team_name:'teamname'},
//     'movie_id_2':{["funny", ..., "shock"], 'team_name:'teamname'}...
// }

const judge_kind = ["funny", "love", "sad", "angry", "surprise", "shock"];

s.on("connection", function (ws) {
  ws.on("message", function (message) {
    console.log(String(message));
    vote = String(message).split(",");
    let movie_id = vote[0];
    let kind = vote[1];
    let value = vote[2];

    if (movie_id in judge_cnts == false) {
      judge_cnts[movie_id] = {
        vote: [0, 0, 0, 0, 0, 0],
        team_name: "no presen",
      };
    }

    switch (kind) {
      case "new_connection":
        console.log("new_connection");
        ws.send("hello new person!");
        //区切り記号...「:」
        ws.send(
          `${movie_id}:${judge_cnts[movie_id]["vote"]}:${judge_cnts[movie_id]["team_name"]}`
        );
        break;
      case "vote":
        judge_cnts[movie_id]["vote"][Number(value) - 1] += 1;
        s.clients.forEach(function (client) {
          client.send(
            `${movie_id}:${judge_cnts[movie_id]["vote"]}:${judge_cnts[movie_id]["team_name"]}`
          );
        });
        break;
      case "team_name":
        console.log("teamname");
        judge_cnts[movie_id]["vote"] = [0, 0, 0, 0, 0, 0];
        judge_cnts[movie_id]["team_name"] = value;
        s.clients.forEach(function (client) {
          client.send(
            `${movie_id}:${judge_cnts[movie_id]["vote"]}:${judge_cnts[movie_id]["team_name"]}`
          );
        });
        break;
      case "presen_end":
        judge_cnts[movie_id]["vote"] = [0, 0, 0, 0, 0, 0];
        judge_cnts[movie_id]["team_name"] = "no presen";
        s.clients.forEach(function (client) {
          client.send(
            `${movie_id}:${judge_cnts[movie_id]["vote"]}:${judge_cnts[movie_id]["team_name"]}`
          );
        });
        break;
      case "finished":
        delete judge_cnts[movie_id];
        break;
    }
  });

  ws.on("close", function () {
    console.log("I lost a client");
  });
});
