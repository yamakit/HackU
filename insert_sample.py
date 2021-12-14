import mysql.connector as mydb
import random as r

JUDGE_KIND = 6

#ランダムな文字を出力
def rand_char():
    rnd_n = r.randrange(0,2)
    if(rnd_n):
        return chr(r.randrange(65, 91))
    else:
        return chr(r.randrange(97, 123))

#ランダムな文字列を指定された文字数(1以上)で出力
def rand_str(n):
    s = ''
    for i in range(n):
        s = s + rand_char()
    return s

#数値から時刻に変換
def int_to_date(s):
    h = int(s/3600)
    s = s - (h*3600)
    m = int(s/60)
    s = s - (m*60)

    return f"{str(h).zfill(2)}:{str(m).zfill(2)}:{str(s).zfill(2)}"

#時刻から数値に変換
def date_to_int(date):
    date = date.split(':')
    return int(date[0])*3600 + int(date[1])*60 + int(date[2])

# ---コネクションの作成---
conn = mydb.connect(host='localhost',port='3306',user='root',password='',database='CTO')
# ---DB操作用にカーソルを作成---
cur = conn.cursor(buffered=True)
# ----sql文を作成、実行--

movie = r.randrange(3,5)

#--- movie ---
for movie_id in range(movie):
    stmt = f"INSERT INTO `movie`(`movie_id`, `URL`) VALUES ({0}, 'empty');"
    cur.execute(stmt)
conn.commit()

#--- register ---
stmt = "SELECT movie_id FROM movie"
cur.execute(stmt)
movie_ids = cur.fetchall()
min_movie_id = min(movie_ids)
max_movie_id = max(movie_ids)
print(min_movie_id,type(min_movie_id))
print(max_movie_id,type(max_movie_id))

for movie_id in range(min_movie_id[0], max_movie_id[0]+1):
    team_num = r.randrange(3,7)
    rnd_time_start = 0
    rnd_time_end = 0
    for presen_num in range(team_num):
        movie_start_end = presen_num
        team_name = rand_str(r.randrange(5, 15))
        rnd_time_start = rnd_time_end + r.randrange(10, 30)
        rnd_time_end = rnd_time_start + r.randrange(30, 90)
        print(team_name)
        print(rnd_time_start, int_to_date(rnd_time_start))
        print(rnd_time_end, int_to_date(rnd_time_end))
        stmt = f"INSERT INTO `register`(`register_id`, `movie_id`, `presen_num`, `team_name`, `movie_start`, `movie_end`) VALUES ({0}, {movie_id}, {presen_num+1}, '{team_name}', '{int_to_date(rnd_time_start)}', '{int_to_date(rnd_time_end)}');"
        cur.execute(stmt)
conn.commit()

#--- judge ---
stmt = "SELECT register_id FROM register"
cur.execute(stmt)
register_ids = cur.fetchall()
min_register_id = min(register_ids)
max_register_id = max(register_ids)
teams = len(register_ids)

for register_id in range(min_register_id[0], max_register_id[0]+1):
    stmt = f"SELECT movie_start FROM register WHERE register_id = {register_id}"
    print(stmt)
    cur.execute(stmt)
    start_time = cur.fetchall()
    print(start_time[0][0].total_seconds(),type(start_time[0][0].total_seconds()))
    start_time = start_time[0][0].total_seconds()
    print(start_time,type(start_time))
    stmt = f"SELECT movie_end FROM register WHERE register_id = {register_id}"
    cur.execute(stmt)
    end_time = cur.fetchall()
    end_time = end_time[0][0].total_seconds()
    stmt = f"SELECT movie_id FROM register WHERE register_id = {register_id}" 
    cur.execute(stmt)
    mov_id = cur.fetchall()
    mov_id = mov_id[0][0]
    for judge in range(JUDGE_KIND):
        vote_time = start_time + r.randrange(0, 10)
        vote_end = end_time
        while(vote_time <= vote_end):
            stmt = f"INSERT INTO `judge`(`vote_id`, `movie_id`, `vote_time`, `judge` ,`hms`) VALUES ({0}, {mov_id}, {vote_time}, {judge}, '{int_to_date(vote_time)}');"
            cur.execute(stmt)
            vote_time = vote_time + r.randrange(0, 10)
conn.commit()

# ---通信終了---
conn.close()