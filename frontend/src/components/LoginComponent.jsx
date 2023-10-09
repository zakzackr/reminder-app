import { useState } from "react"
import { LoginAPICall, saveLoggedInUser, storeToken } from "../services/AuthService"
import { useNavigate } from "react-router-dom"

const LoginComponent = () => {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const nav = useNavigate()
    
    async function handleLoginForm(e){

        e.preventDefault()

        await LoginAPICall(username, password).then((response) => {
            console.log(response.data)


            // const token = 'Basic ' + window.btoa(username + ":" + password)
            const token = 'Bearer ' + response.data.accessToken
            const role = response.data.role
            const userId = response.data.userId


            storeToken(token)
            saveLoggedInUser(username, role, userId)
            nav(`/reminder/${userId}`)

            window.location.reload(false)
        }).catch(error => {
            console.error(error)
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