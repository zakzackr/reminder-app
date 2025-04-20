import { useState } from "react"
import { registerAPICall } from "../services/AuthService"
import { useNavigate } from "react-router-dom"

const RegisterComponent = () => {

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const nav = useNavigate()

    function handleRegistrationForm(e){
        e.preventDefault()

        const register = {username, email, password}

        registerAPICall(register).then((response) => {
            console.log(response.data)
            nav('/login')
        }).catch(error => {
            console.error(error)
        })
    }

    return (
        <div className="container" style={{ maxWidth: 420, margin: "48px auto" }}>
            <div className="card" style={{ margin: "0 auto", padding: 0 }}>
                <div className="card-header" style={{ textAlign: "center" }}>
                    <h2 style={{ fontWeight: 700, fontSize: "1rem", margin: 0, letterSpacing: "0.5px" }}>登録</h2>
                </div>
                <div className="card-body" style={{ paddingTop: 16 }}>
                    <form>
                        <div style={{ marginBottom: 10 }}>
                            <label style={{ display: "block", fontWeight: 600, marginBottom: 6, fontSize: "0.8rem" }}>
                                ユーザー名
                            </label>
                            <input 
                                type='text'
                                name='username'
                                value={username}
                                placeholder='ユーザー名を入力'
                                onChange={ (e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div style={{ marginBottom: 10 }}>
                            <label style={{ display: "block", fontWeight: 600, marginBottom: 6, fontSize: "0.8rem" }}>
                                メールアドレス
                            </label>
                            <input 
                                type='text'
                                name='email'
                                value={email}
                                placeholder='メールアドレスを入力'
                                onChange={ (e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div style={{ marginBottom: 18 }}>
                            <label style={{ display: "block", fontWeight: 600, marginBottom: 6, fontSize: "0.8rem" }}>
                                パスワード
                            </label>
                            <input
                                type='password'
                                name='password'
                                value={password}
                                placeholder='パスワードを入力'
                                onChange={ (e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <button className="btn" style={{ width: "100%" }} onClick={ (e) => handleRegistrationForm(e)}>
                                登録
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default RegisterComponent