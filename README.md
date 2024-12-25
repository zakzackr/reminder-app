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
| Frontend | JavaScript, React |
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
| 操作| 詳細|
| :----:| ---- |
| 新規ユーザー登録 | ユーザー名、メールアドレス、パスワードを使用して新規ユーザー登録|
| ログイン| メールアドレスまたはユーザー名、パスワードを使用してログイン |
|リマインダーの追加| Title、Notes、Dateを指定して新規リマインダーの追加 |
|リマインダーの更新 | Title、 Notes、Dateを変更して、既存リマインダーの更新 |
|リマインダーの削除| 既存リマインダーを削除 |

> [!NOTE]
> 通常のユーザーはUser権限が付与されるため、Update機能を使用することができません。
<br>    

# 📈 作成の経緯
✅ iPhoneのRemindersアプリからの通知の場合、他のアプリの通知に埋もれてしまうことがあったので、メールでリマインドを行うリマインダーアプリを作成しました。
<br>    
<br>

# 🌈 こだわりポイント
### ⭐️ マルチユーザー対応    
Reminderアプリでは、マルチユーザーに対応しており、個々のユーザーが個別のリマインダーを設定することができます。以下を工夫することで、ユーザーとユーザーに対応するリマインダーを一意に特定できる仕組みを構築しています。
<br>
#### 1. データベース設計
リマインダーテーブルで外部キーとしてユーザーIDを保持することで、特定のリマインダーとユーザーを対応づけています。

<img width="551" alt="スクリーンショット 2024-11-25 15 09 47" src="https://github.com/user-attachments/assets/4ebf24d4-bb41-4e00-b9c6-d70237481f57">

#### 2. ログイン機能の導入とURLの設計
ユーザーがログインすると、システムはユーザー認証を行い、JWTトークン、ユーザーID、ロール情報などを保持する`JwtAuthResponse`オブジェクトをHTTPレスポンスで送信します。
クライアント側では、送られてきたユーザーIDをブラウザのセッションストレージに格納します。これによりブラウザは、ユーザーがブラウザのタブを閉じるまで、セッションストレージに格納されたユーザーIDを使用して、サーバとやりとりを行います。
<br>
具体的には、ユーザーがReminderアプリに対して各操作を行う際、セッションストレージから取り出したユーザーIDを以下のようにHTTPリクエストのURLにパスパラメータとして含めます。
<br>

| 操作 |HTTPメソッド| URL |
| ---- | ---- |---|
| 取得 |GET |`api/reminder/{userId}`|
| 追加 |POST|`api/reminder/{userId}`|
| 更新 |PUT|`api/reminder/{userId}/{reminderId}`|
| 削除 |DELETE|`api/reminder/{userId}/{reminderId}`|

これにより、Controller内でuserIdやreminderIdを指定してServiceメソッドを呼び出すことができ、特定のユーザーの特定のリマインダータスクに対して操作を行うことができます。このようにして、マルチユーザー対応のReminderアプリを実現しています。
<br>

___
### 🔑 Spring Securityによる認証・認可機能の導入
#### 1. 認証
**JWT**(JSON Web Token)を使用したトークンベース認証を行っています。具体的な流れは以下になります。

1. ユーザーがユーザーネームとパスワードを入力しログインを試みると、アプリケーションはデータベースに格納されているユーザーの情報と一致するかを調べます。
2. 問題なければ、アプリケーションはユーザーネーム、トークン失効時刻などの情報からJWTを作成し、秘密鍵で署名を行います。そして、JWTをクライアントに送信します。
3. クライアント側では、JWTをブラウザのローカルストレージに保存します。
5. ログイン後は、JWTの有効期限が切れるまで、同じJWTを使用してリクエストを送信します。具体的には、リクエストのAuthenticationヘッダにJWTを含めます。
6. アプリケーションはリクエストを受け取ると、秘密鍵を使用してJWTが有効か検証します。有効であれば、その後の処理が行われます。
<br><br> 

#### 2. 認可
Spring Securityの`@PreAuthorize`を使用して認可機能を実現しています。リクエストが@PreAuthorizeの付与されたコントローラに到達すると、ユーザーのロール情報と@PreAuthorize内で指定されたアクセスポリシーが一致するかが確認されます。<br>

具体的には、現在アクセスしているユーザーの認証情報である`Authentication`オブジェクト内のロール情報と、アクセスポリシーを比較して認可を行います。以下が本アプリで使用しているアクセスポリシーです。

* `@PreAuthorize("hasRole('ADMIN')")`：ユーザーがADMINロールを持っている場合にのみアクセスを許可
* `@PreAuthorize("hasAnyRole('ADMIN', 'USER')")`：ユーザーが「ADMIN」または「USER」ロールを持っている場合にアクセスを許可
<br>

**本アプリでの各操作とユーザーロール：**
| 操作 | Adminロール |Userロール|
| :----: | :----: | :----:|
| 新規ユーザー登録| ⚪︎　|⚪︎　|
| ログイン | ⚪︎　| ⚪︎ |
| リマインダーの追加 |  ⚪︎　| ⚪︎ |
| リマインダーの更新 |  ⚪︎　| × |
| リマインダーの削除 |  ⚪︎　| ⚪︎ |
<br>

また、ユーザーテーブル内でロールIDを外部キーとして保持することで、ユーザーとロールを対応づけています。
<img width="519" alt="スクリーンショット 2024-11-25 15 28 42" src="https://github.com/user-attachments/assets/9ed8674e-e781-4547-87fb-a87ebe2524ba">

___

### ⏳ 1分単位でリマインダーを設定できる    
Reminderアプリでは、1分単位でリマインダーを設定することができます。
<br>  
#### @Scheduledの使用
`@Scheduled(cron = "0 * * * * ?")`を`EmailScheduler.checkAndSendScheduledEmails()`に付与することで、このServiceメソッドを1分に1回実行します。その内部で、現在時刻と通知時刻が一致しているタスクをデータベースからクエリする`ReminderRepository.findByDate()`を呼び出します。そして、取得したリマインダーリストからユーザーとリマインダーの情報を取得し、そのユーザー宛に`SenderService.sendScheduledEmail()`でメールを送信します。
<br>  
___

### 📩 新規ユーザー登録時に確認メールを送信    
`SimpleMailMessage`クラスを使用して、メールの送信機能を実装しています。<br>
新規ユーザー登録が成功すると、`SenderService.sendRegistrationEmail()`によりユーザーが入力したメールアドレス宛に確認メールを送信します。

<br>    

# 🔜 今後の計画
- [ ] タスクの繰り返し通知機能の追加（毎日、毎週、毎月など）
- [ ] UIの向上
- [ ] HTTPからHTTPSに変更
