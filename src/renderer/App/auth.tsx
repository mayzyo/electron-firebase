import React, { useState } from 'react'
import { ipcRenderer } from 'electron';

const Auth = () => {
    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')
    const [msg, setMsg] = useState('')
    // const [todo, setTodo] = useState<any | undefined>(undefined)

    const handleLogin = () => {
        setMsg(ipcRenderer.sendSync('loginAuth', {email:email, pass:pass}))
        setEmail('')
        setPass('')
    }

    const handleLogout = () => {
        setMsg(ipcRenderer.sendSync('logout'))
        setEmail('')
        setPass('')
        
        setTimeout(() => {
            setMsg('')
        }, 2000);
    }

    return (
        <>
            <div className="container-fluid">
                <div className="row justify-content-center">
                    <div className="col-auto">

                        <h3>Authentication</h3>
                        <p style={{color:'green'}}>{msg}</p>
                        <input className="d-block my-3 mx-auto"
                            placeholder="your email address..."
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            type="email"
                        />

                        <input className="d-block my-3 mx-auto"
                            placeholder="enter password..."
                            onChange={(e) => setPass(e.target.value)}
                            value={pass}
                            type="password"
                        />

                        <div className="row">
                            <a className="col-auto App-link" onClick={(e) => handleLogin()}>Log In</a>
                            <a className="col-auto" onClick={(e) => handleLogout()}>Sign Out</a>
                        </div>

                    </div>
                </div>
            </div>

            {/* {todo &&
                <ul className="m-auto" style={{position:'absolute', listStyle:'none'}}>
                    {Object.keys(todo).map(key =>
                        <li className="pt-5" style={{opacity:0.3}} key={key}>{`${key}:   ${todo![key]}`}</li>
                    )}
                </ul>
            } */}
        </>
    )
}

export default Auth