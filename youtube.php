<?php
/// 取得するYoutube動画ＩＤ
$video_id = 'L2poZwNyGpY';
/// Youtube動画のURL
$video_url = 'https://www.youtube.com/watch?v='.$video_id;
 
/// oEmebdからメタ情報取得して表示
$oembed_url = "https://www.youtube.com/oembed?url={$video_url}&format=json";
$ch = curl_init( $oembed_url );
curl_setopt_array( $ch, [
  CURLOPT_RETURNTRANSFER => 1
] );
$resp = curl_exec( $ch );
 
$metas = json_decode( $resp, true );
 
// echo 'タイトル : '.$metas['title'].'<br>';
// echo 'サムネURL : '.$metas['thumbnail_url'].'<br>';
// echo '作者名 : '.$metas['author_name'].'<br>';
// echo 'チャンネルURL : '.$metas['author_url'].'<br>';
// echo '幅 : '.$metas['width'].'ピクセル, ';
// echo '高さ : '.$metas['height'].'ピクセル';
$param =$metas['title'];//PHPで配列を生成

$param_json = json_encode($param);
echo $param_json;
?>
