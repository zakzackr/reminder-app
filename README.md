# Reminderアプリ
ユーザーが設定した時間に、メールでリマインダーをお知らせするアプリです。

# Demo
https://github.com/user-attachments/assets/f47d2509-8b31-401c-a63d-392b25523308

# Link
https://shibainuu.com 
 
username: user　　　　
pasword: user　　　　　　
で実際の操作を体験いただけます。

# 機能
* リマインダーの一覧表示
* リマインダーの追加
* リマインダーの編集
* リマインダーの更新 

# 技術スタック
| カテゴリ       | 技術内容                                           |
|----------------|--------------------------------------------------|
| バックエンド   | Java, Spring Boot                                |
| フロントエンド | JavaScript, React                                |
| データベース   | MySQL                                            |
| インフラ       | AWS (S3, CloudFront, Elastic Beanstalk, RDS など) |
| Others         | Git, GitHub                                     |

# DB設計
![reminder-db-schema drawio (1)](https://github.com/user-attachments/assets/7735e656-e37b-42d8-b5a2-1a5c951a0958)
 
# API設計
### 認証・認可
| 操作                   | メソッド | URI             |
|------------------------|----------|------------------|
| 新規登録               | POST     | /auth/register   |
| ログイン               | POST     | /auth/login      |
| ログアウト             | POST     | /auth/logout     |
| アクセストークンの再発行 | POST     | /auth/token      |

### リマインダーのCRUD操作
| 操作                     | メソッド | URI                          | 認可                                  |
|--------------------------|----------|-------------------------------|---------------------------------------|
| リマインダーの一覧表示   | GET      | /reminders                    | 全てのユーザー（ROLE_ADMIN, ROLE_USER） |
| リマインダーの追加       | POST     | /reminders                    | 全てのユーザー                        |
| リマインダーの編集       | PUT      | /reminders/{reminder_id}      | 全てのユーザー                        |
| リマインダーの削除       | DELETE   | /reminders/{reminder_id}      | 全てのユーザー                        |


# トークンベース認証
### 概要
**トークンの設定**
| トークン             | 有効期限 | 保管場所             |
|----------------------|----------|----------------------|
| アクセストークン     | 15分     | in-memory            |
| リフレッシュトークン | 30日     | Cookie (Http-only)   |

 
**ユーザーフロー**
1. ユーザーがログイン情報を入力し、```POST /auth/login```というエンドポイントにリクエストを送信
2. サーバーは、アクセストークンをレスポンスボディに含め、リフレッシュトークンを保存するCookieを```Set-Cookie```ヘッダーにセットしてクライアントに返却
3. クライアント側では、メモリ内にアクセストークンを保管
4. アクセストークンを使ってサーバーにリクエストを送信
5. ここでアクセストークンの検証に失敗し、```401 Unauthorized```が返された場合は、```/auth/token (Cookie: refresh-token=xyz...)```というエンドポイントにリフレッシュトークン付きのリクエストを送信することで、新しいアクセストークンを取得
6. 取得したアクセストークンを使って失敗したリクエストを再送
 
### シーケンス図
![jwt-authentication-flow drawio](https://github.com/user-attachments/assets/267b3d99-13aa-4950-911b-826d2f3b1615)

# インフラ
![reminder-app-aws drawio (4)](https://github.com/user-attachments/assets/2b30b09b-4c19-4c19-863c-658657332e5b)

