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
        <div className='container'>
            <br /> <br />
            <div className='row'>
                <div className='card col-md-6 offset-md-3'>
                    <div className='card-header'>
                        <h2 className='text-center'>Registration</h2>
                    </div>
                    <div className='card-body'>
                        <form>
                            <div className='row mb-3'>
                                <label className='col-md-3 control-label'>Username</label>
                                <div className='col-md-9'>
                                    <input 
                                        type='text'
                                        name='username'
                                        value={username}
                                        className='form-control'
                                        placeholder='Enter username'
                                        onChange={ (e) => setUsername(e.target.value)}
                                    >
                                    </input>
                                </div>
                            </div>
                            <div className='row mb-3'>
                                <label className='col-md-3 control-label'>Email</label>
                                <div className='col-md-9'>
                                    <input 
                                        type='text'
                                        name='email'
                                        value={email}
                                        className='form-control'
                                        placeholder='Enter email address'
                                        onChange={ (e) => setEmail(e.target.value)}
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
                            <div className='form-group mb-3'>
                                <button className='btn btn-primary' onClick={ (e) => handleRegistrationForm(e)}>Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RegisterComponent