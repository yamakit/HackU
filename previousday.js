let url;
let url_name;
let title;
let title_name;
//動画のURLを変数に登録
function InputURL(){
    const url_textbox = document.getElementById("input-url");
    url = url_textbox.value;
    let newurl = url.replace("https://www.youtube.com/watch?v=", "");
    url_name = "'"+newurl+"'";
}
//動画タイトルを変数に登録
function InputTitle(){
    const title_textbox = document.getElementById("input-title");
    title = title_textbox.value;
    title_name = "'"+title+"'";
}
//動画URLとタイトルをmovieテーブルに登録する
let hosturl= 'previousday.php'; // データ送信先
function regist(){
    $.ajax({
        url: hosturl,
        type:'GET',
        data : {URL :url_name,
                movie_name :title_name
        },
        timeout:10000,
    });
}