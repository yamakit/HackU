<?php

if(!empty($_GET)){

    $judge = $_GET['judge'];
    $vote_time = $_GET['vote_time'];
    $hms = $_GET['hms'];
    
    $dsn = 'mysql:dbname=cto_node_test;host=localhost';
    $user = 'root';
    $password = '';
    $result = array();
    
    try {
        $dbh = new PDO($dsn, $user, $password);
        //データベースへいいねイマイチの評価とボタンが押された時点での動画の経過時間の値をインサート
        //hmsをインサートしたいどす
        $sql = "INSERT INTO `judge`( `judge`, `vote_time`, `hms`) VALUES ($judge, $vote_time,$hms)";
        $dbh->exec($sql);
    } catch (Exception $e) {
        echo $e->getMessage();
        exit();
    }
    header('Content-type: application/json');
    echo json_encode($result,JSON_UNESCAPED_UNICODE);
}
?>
