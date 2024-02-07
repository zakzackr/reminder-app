# リマインダーアプリ
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
リマインダーアプリを使用することで、1分単位でリマインドするタスクを設定でき、指定した時間にメールにて通知を受け取ることができます。

主な操作：
* 新規ユーザー登録（Register）: ユーザー名、メールアドレス、パスワードを使用して新規ユーザー登録
* ログイン（Login）: メールアドレスまたはユーザー名、パスワードを使用してログイン
* 新規タスクの追加（New Reminder）: Title（要件）、Notes（詳細）、Date（通知時間）を指定
* 既存タスクの更新（Update）: 既存タスクのTitle, Notes, Dateを変更
* 既存タスクの削除（Delete）: 既存タスクを削除
<br>


# 📈 作成の経緯
✅ iPhoneのRemindersアプリからの通知の場合、他のアプリの通知に埋もれてしまうことがあったので、メールでリマインドを行うリマインダーアプリを作成しました。
<br>

# 💻 学んだこと
* マルチユーザー対応のwebアプリの実装
* @Scheduledを使用して特定の関数を定期的に実行する
* Spring Bootアプリからメールを送信するための実装（SimpleMailMessageクラスを使用）
<br>

# 🌈 こだわりポイント
* URLにユーザーIDなどを含めることで、マルチユーザーに対応している
* 新規ユーザー登録時に確認メールを送信する
* 1分単位でリマインダーを設定できる
<br>

# 🔜 今後の計画
- [ ]UIの向上
