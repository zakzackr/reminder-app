# 📩 リマインダーアプリ
# 🖊️ 概要
ユーザーが指定した時間にメールで通知を行うリマインダーアプリ
<br>    

# ✨ Demo
https://github.com/zakzackr/reminder-app/assets/100734822/f9333ca8-6e3f-4b27-8e2f-926ddf7a6b37

<br>     

# 📍 URL
http://reminder-app-2.s3-website-ap-northeast-1.amazonaws.com<br>    
(↑AWS無料枠超過のためEC2、RDS停止中)
<br>    
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
### ⭐️ マルチユーザー対応    
Reminderアプリでは、マルチユーザーに対応しており、個々のユーザーが個別のリマインダーを設定することができます。以下を工夫することで、リマインダーを一意に特定できる仕組みを構築しています。
<br> 
#### データベース設計
リマインダーテーブルで外部キーとしてユーザーIDを保持することで、特定のリマインダーとユーザーを対応づけています。
<br> 

#### ログイン機能の導入
ユーザーがログインすると、システムはユーザー認証を行い、JWTトークン、ユーザーID、認可情報などを保持するJwtAuthResponseオブジェクトをHTTPレスポンスでクライアントに送信します。
クライアント側で、送られてきたユーザーIDを、ブラウザのセッションストレージに格納します。これにより、ユーザーがブラウザのタブを閉じるまで、セッションストレージに格納されたユーザーIDを使用して、リマインダーの取得・追加などの処理が行われます。
<br>
具体的には、ユーザーがリマインダーに対して操作を行う際、セッションストレージから取り出したユーザーIDを以下のようにHTTPリクエストのURLに含めます。
<br>

| 操作 |HTTPメソッド| URL |
| ---- | ---- |---|
| 取得 |GET |`api/reminder/{userId}`|
| 追加 |POST|`api/reminder/{userId}`|
| 更新 |PUT|`api/reminder/{userId}/{reminderId}`|
| 削除 |DELTE|`api/reminder/{userId}/{reminderId}`|

これにより、Controller内でuserIdやreminderIdを指定してServiceのメソッドを呼び出すことで、特定のユーザーの特定のリマインダータスクに対して操作を行うことができ、マルチユーザー対応のReminderアプリを実現しています。
<br>

### Spring Security導入による認証・認可
#### 認証

#### 認可
フロント側でis_admin情報をセッションストレージに保存します。この情報により、フロントエンドで表示・非表示を決める。
　　　　　　　　　　　
<br>

### ⏳ 1分単位でリマインダーを設定できる    
Reminderアプリでは、1分単位でリマインダーを設定することができます。
<br>  
#### @Scheduledの使用
@ScheduledをServiceのメソッドに付与し、該当メソッドを1分に1回実行します。その内部で、リマインドするタスクをデータベースから探索するRepositoryのメソッドを呼び出します。そして、現在時刻と通知時刻が一致しているタスクをデータベースから取得して、そのユーザー宛にメールを送信します。
<br>  

### 📩 新規ユーザー登録時に確認メールを送信    
  ⇨ SimpleMailMessageクラスを使用
<br>    

# 🔜 今後の計画
- [ ] タスクの繰り返し通知機能の追加（毎日、毎週、毎月など）
- [ ] UIの向上
- [ ] HTTPからHTTPSに変更
