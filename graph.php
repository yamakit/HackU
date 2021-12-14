<?php

  function int_to_time($t){
    $h = 0;
    $m = 0;
    $s = 0;

    $h = floor($t / 3600);
    $t -= $h*3600;
    $m = floor($t / 60);
    $t -= $m*60;
    $s = $t;

    // return "hh:mm:ss"
    return str_pad((string)$h, 2, "0", STR_PAD_LEFT).':'.str_pad((string)$m, 2, "0", STR_PAD_LEFT).':'.str_pad((string)$s, 2, "0", STR_PAD_LEFT);
  }

  function time_to_int($t_str){
    $split_arr = preg_split("/[:]/",$t_str);
    return $split_arr[0]*3600+$split_arr[1]*60+$split_arr[2];
  }

  function exe_sql($sql_cmd){
    $dsn = 'mysql:dbname=CTO;host=localhost';
    $user = 'root';
    $password = '';
    $result = [];

    $dbh = new PDO($dsn, $user, $password);
    
    $stmt = $dbh->prepare($sql_cmd);
    $stmt->execute();
    $result = $stmt->fetchAll();

    return $result;
  }
  
  $movie_id = 96;
  const VOTE_KINDS = 6; //投票できるボタンの種類数(1始まり)
  const JUDGE = [
    'いいね',
    'いまいち',
    'smp_c',
    'smp_d',
    'smp_e',
    'smp_f'
  ];

  # --- jsに送るデータ ---
  $graph_data = [];
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
  # --- DBからregisterを取得 ---
  $register = exe_sql("SELECT * FROM `register` WHERE `movie_id` = $movie_id");
  # --- 先頭と末尾のregister_idを格納 ---
  $first_reg_id = $register[0]['register_id'];
  $last_reg_col = end($register);
  $last_reg_id = $last_reg_col['register_id'];
  # --- DBからjudgeを取得 ---
  $judge = exe_sql("SELECT * FROM `judge` WHERE `movie_id` = $movie_id");
  # --- 取得したデータを整形 ---
  for($reg_id = $first_reg_id,$i = 0; $reg_id <= $last_reg_id; $reg_id++, $i++){
    # --- register_idを追加 ---
    array_push($graph_data, [$reg_id]);
    # --- register_idに対応する、発表の開始・終了時間を格納 ---
    $start_time = $register[$i]['movie_start'];
    $end_time = $register[$i]['movie_end'];
    # --- 発表の開始・終了時間を追加 ---
    array_push($graph_data[$i], [$start_time, $end_time]);
    # --- 発表の開始・終了時間を整数型に変換 ---
    $start_time = time_to_int($start_time);
    $end_time = time_to_int($end_time);
    # --- register_idに対応する、先頭と末尾のvote_idを格納 ---
    $first_vot_id = $judge[0]['vote_id'];
    $last_vot_col = end($judge);
    $last_vot_id = $last_vot_col['vote_id'];
    # --- 投票に関するデータを整形 ---
    $vote_inf = [];
    $time_arr = [];
    for($vote_kind = 0; $vote_kind < VOTE_KINDS; $vote_kind++){
      array_push($vote_inf, [JUDGE[$vote_kind],[]]);
    }
    for($t = $start_time; $t <= $end_time; $t++){
      array_push($time_arr, int_to_time($t));
      for($vote_kind = 0; $vote_kind < VOTE_KINDS; $vote_kind++){
        $vote_cnt = 0;
        foreach($judge as $vote_clm){
          if($t <= time_to_int($vote_clm['hms']) && time_to_int($vote_clm['hms']) < $t+1  && $vote_clm['judge'] == $vote_kind){
            $vote_cnt++;
          }
        }
        array_push($vote_inf[$vote_kind][1], $vote_cnt);
      }
    }
    # --- 整形したデータを追加 ---
    array_push($graph_data[$i], $time_arr);
    array_push($graph_data[$i], $vote_inf);
    # --- team_nameを追加 ---
    array_push($graph_data[$i], $register[$i]['team_name']);
  }

  header('Content-type: application/json');
  $data=json_encode($graph_data , JSON_UNESCAPED_UNICODE);
  echo $data;
?>