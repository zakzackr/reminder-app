import { useState, useContext, useEffect } from "react"
import { loginAPICall, refreshToken } from "../services/AuthService"
import { useNavigate, useSearchParams } from "react-router-dom"
import { AuthContext } from "../contexts/AuthContext"

const LoginComponent = () => {
    
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    const [searchParams] = useSearchParams();
    const loggedOut = searchParams.get("logout") === "true";
    const { setAccessToken } = useContext(AuthContext)

    useEffect(() => {
        if (loggedOut) return; // ログアウト後はrefreshToken()を呼ばない
        
        refreshToken()
            .then((response) => {
                // ログイン画面表示時にrefresh-tokenを持つユーザーに対しては、自動ログイン
                setAccessToken(response.data.accessToken);
                setTimeout(() => navigate("/reminders"), 0);
            })
            .catch(() => {
                // refresh-token が無効なので、ログインフォームを表示
            });
      }, []);
    
    async function handleLoginForm(e){
        e.preventDefault()

        await loginAPICall(username, password).then(response => {
            const accessToken = response.data.accessToken;
            setAccessToken(accessToken)
            setTimeout(() => navigate("/reminders"), 0);
        }).catch(error => {
            setAccessToken(null);
            console.error(error);
            console.log('login failed');
        })
    }

    return (
        <div className="container" style={{ maxWidth: 420, margin: "48px auto" }}>
            <div className="card" style={{ margin: "0 auto", padding: 0 }}>
                <div className="card-header" style={{ textAlign: "center" }}>
                    <h2 style={{ fontWeight: 700, fontSize: "1rem", margin: 0, letterSpacing: "0.5px" }}>ログイン</h2>
                </div>
                <div className="card-body" style={{ paddingTop: 16 }}>
                    <form>
                        <div style={{ marginBottom: 10 }}>
                            <label style={{ display: "block", fontWeight: 600, marginBottom: 6, fontSize: "0.8rem" }}>
                                ユーザー名/メールアドレス
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={username}
                                placeholder="ユーザー名またはメールアドレス"
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div style={{ marginBottom: 18 }}>
                            <label style={{ display: "block", fontWeight: 600, marginBottom: 6, fontSize: "0.8rem" }}>
                                パスワード
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={password}
                                placeholder="パスワード"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <button className="btn" style={{ width: "100%" }} onClick={(e) => handleLoginForm(e)}>
                                ログイン
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default LoginComponent
