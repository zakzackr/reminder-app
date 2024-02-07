# 📩 リマインダーアプリ
# 🖊️ 概要
ユーザーが指定した時間にメールで通知を行うリマインダーアプリ
<br>    

# ✨ Demo
![reminder-app](https://github.com/zakzackr/reminder-app/assets/100734822/e9f49472-8762-4681-ac8b-657ecfd840dc)
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

# 📝 説明
リマインダーアプリを使用することで、1分単位でリマインドするタスクを設定でき、指定した時間にメールで通知を受け取ることができます。

**主な操作：**
* 新規ユーザー登録（Register）: ユーザー名、メールアドレス、パスワードを使用して新規ユーザー登録
* ログイン（Login）: メールアドレスまたはユーザー名、パスワードを使用してログイン
* 新規タスクの追加（New Reminder）: Title（要件）、Notes（詳細）、Date（通知時間）を指定
* 既存タスクの更新（Update）: 既存タスクのTitle, Notes, Dateを変更
* 既存タスクの削除（Delete）: 既存タスクを削除
    
*通常のユーザーは、User権限が付与さるため、Update機能を使用することができません。
<br>    

# 📈 作成の経緯
✅ iPhoneのRemindersアプリからの通知の場合、他のアプリの通知に埋もれてしまうことがあったので、メールでリマインドを行うリマインダーアプリを作成しました。
<br>    

# 💻 学んだこと
* マルチユーザー対応のwebアプリの実装    
  -> URLにユーザーIDや通知タスクのIDを含めることで、リソースを一意に特定できる
    
* @Scheduledを使用して特定の関数を定期的に実行する方法    
  -> 通知タスクを探索・送信する関数を定期的に実行して、現在の時刻と通知時間が一致しているタスクをデータベースから取得して、そのユーザー宛にメールを送信する    
  -> Reminderテーブル内で、外部キーとしてuserIDを保持することで、通知するタスクとその受信者を結びつける
         
* Spring Bootアプリからメールを送信するための実装（SimpleMailMessageクラスを使用）
<br>    

# 🌈 こだわりポイント
* マルチユーザーに対応している
* 新規ユーザー登録時に確認メールを送信する
* 1分単位でリマインダーを設定できる
<br>    

# 🔜 今後の計画
- [ ] タスクの繰り返し通知機能の追加（毎日、毎週、毎月など）
- [ ] UIの向上
