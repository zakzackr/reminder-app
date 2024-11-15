# 📩 リマインダーアプリ
# 🖊️ 概要
ユーザーが指定した時間にメールで通知を行うリマインダーアプリ
<br>    

# ✨ Demo
https://github.com/zakzackr/reminder-app/assets/100734822/f9333ca8-6e3f-4b27-8e2f-926ddf7a6b37

<br>     

# 📍 URL
http://reminder-app-2.s3-website-ap-northeast-1.amazonaws.com
<br>      

# 💾 技術スタック
| Category | Tech Stack |
| ---- | ---- |
| Frontend | JavaScript, React.js |
| Backend | Java, Spring Boot |
| Database | MySQL |
| Infrastructure | AWS (Elastic Beanstalk, S3, RDS) |
| Others | Git, GitHub |
<br>      

# 📊 ER図
![reminder-erd](https://github.com/zakzackr/reminder-app/assets/100734822/2d707186-e578-4a50-a687-9b251fc52ed7)


<br>      

# 📝 説明
リマインダーアプリを使用することで、1分単位でリマインドするタスクを設定でき、指定した時間にメールで通知を受け取ることができます。

**主な操作：**
* 新規ユーザー登録（Register）: ユーザー名、メールアドレス、パスワードを使用して新規ユーザー登録
* ログイン（Login）: メールアドレスまたはユーザー名、パスワードを使用してログイン
* 新規タスクの追加（New Reminder）: Title（要件）、Notes（詳細）、Date（通知時間）を指定して新規タスクの追加
* 既存タスクの更新（Update）: Title、 Notes、Dateを変更して、既存タスクの更新
* 既存タスクの削除（Delete）: 既存タスクを削除
    
*通常のユーザーは、User権限が付与さるため、Update機能を使用することができません。
<br>    

# 📈 作成の経緯
✅ iPhoneのRemindersアプリからの通知の場合、他のアプリの通知に埋もれてしまうことがあったので、メールでリマインドを行うリマインダーアプリを作成しました。
<br>    

# 🌈 こだわりポイント
* マルチユーザー対応    
  ⇨ ユーザーがログインした時に、データベースに保存されているユーザーIDをHTTPレスポンスのボディの中で返す   
  ⇨ そのユーザーIDをブラウザのセッションストレージに格納して、リマインドするタスクのIDとともに以降のHTTPリクエストのURLに含める    
  ⇨ それによりリソースを一意に特定することができ、ユーザーが自身のリマインダーを設定することが可能となる  　　　　　　　　　　　　
　　　　　　　　　　    
* 1分単位でリマインダーを設定できる    
  ⇨ @Scheduledを使用して、リマインドするタスクを探索・送信する関数を定期的に実行する   
  ⇨ 現在の時刻と通知時間が一致しているタスクをデータベースから取得して、そのユーザー宛にメールを送信する    
  ⇨ Reminderテーブル内で、外部キーとしてユーザーIDを保持することで、リマインドするタスクとその受信者を結びつける
         
* 新規ユーザー登録時に確認メールを送信    
  ⇨ SimpleMailMessageクラスを使用
<br>    

# 🔜 今後の計画
- [ ] タスクの繰り返し通知機能の追加（毎日、毎週、毎月など）
- [ ] UIの向上
- [ ] HTTPからHTTPSに変更
