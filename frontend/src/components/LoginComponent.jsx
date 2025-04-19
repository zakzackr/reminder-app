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
        <div className='container'>
            <br /> <br />
            <div className='row'>
                <div className='col-md-6 offset-md-3'>
                    <div className='card'>
                        <div className='card-header'>
                            <h2 className='text-center'>Login</h2>
                        </div>
                        <div className='card-body'>
                            <form>
                                <div className='row mb-3'>
                                    <label className='col-md-3 control-label'>Username or Email Address</label>
                                    <div className='col-md-9'>
                                        <input
                                            type='text'
                                            name='username'
                                            value={username}
                                            className='form-control'
                                            placeholder='Enter username or email address'
                                            onChange={ (e) => setUsername(e.target.value)}
                                        >
                                        </input>
                                    </div>
                                </div>
                                <div className='row mb-3'>
                                    <label className='col-md-3 control-label'>Password</label>
                                    <div className='col-md-9'>
                                        <input
                                            type='password'
                                            name='password'
                                            value={password}
                                            className='form-control'
                                            placeholder='Enter password'
                                            onChange={ (e) => setPassword(e.target.value)}>
                                        </input>
                                    </div>
                                </div>
                                <div className='mb-3'>
                                    <button className='btn btn-primary' onClick={ (e) => handleLoginForm(e) }>Submit</button>
                                </div>
                            </form>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginComponent
