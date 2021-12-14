<?php
ini_set('display_errors', "On");
if(!empty($_GET)){
    $URL = $_GET['URL'];
    $movie_name = $_GET['movie_name'];
    
    $dsn = 'mysql:dbname=cto;host=localhost';
    $user = 'root';
    $password = '';
    $result = array();
    
    try {
        $dbh = new PDO($dsn, $user, $password);
        //データベースへいいねイマイチの評価とボタンが押された時点での動画の経過時間の値をインサート
        //hmsをインサートしたいどす
        $sql = "INSERT INTO `movie`( `URL`, `movie_name`) VALUES ($URL,$movie_name);";
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
