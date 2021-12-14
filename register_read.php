<?php
    
$dsn = 'mysql:dbname=CTO;host=localhost';
$user = 'root';
$password = '';
$result = array();
$movie_id = $_GET["movie_id"];

try {
    $dbh = new PDO($dsn, $user, $password);  

// echo "<p>DB接続に成功しました。</p>";

    $sql = "SELECT * FROM `register` WHERE `movie_id` = $movie_id";

    $stmt = $dbh->prepare($sql);
    $stmt->execute();
    $result = $stmt->fetchAll();

} catch (Exception $e) {
//   echo "<p>DB接続エラー</p>";
    echo $e->getMessage();
    exit();
}

header('Content-type: application/json');
echo json_encode($result,JSON_UNESCAPED_UNICODE);
?>