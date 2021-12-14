<?php
ini_set('display_errors', "On");
echo "HELLO";
if(!empty($_GET)){
    $team_name = $_GET['team_name'];
    $movie_start = $_GET['movie_start'];
    $movie_end = $_GET['movie_end'];
    
    $dsn = 'mysql:dbname=cto;host=localhost';
    $user = 'root';
    $password = '';
    $result = array();
    
    try {
        $dbh = new PDO($dsn, $user, $password);
        //データベースへいいねイマイチの評価とボタンが押された時点での動画の経過時間の値をインサート
        //hmsをインサートしたいどす
        $sql = "INSERT INTO `register`( `team_name`, `movie_start`, `movie_end`) VALUES ($team_name, $movie_start, $movie_end);";
        $dbh->exec($sql);
    } catch (Exception $e) {
        echo $e->getMessage();
        exit();
    }
    header('Content-type: application/json');
    echo json_encode($result,JSON_UNESCAPED_UNICODE);
}
else{
    echo "受け取れないよ";
}
?>
