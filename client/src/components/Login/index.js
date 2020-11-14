import React, { useState } from "react"
import {useHistory} from 'react-router-dom'

import "./index.scss"

const Login = () => {
  const [ userName, setUserName ] = useState("")
  const history = useHistory()
  
  const handleClick = () => {
    history.push('/dashboard')
  }

	return (
		<div className="login">
			<div>
				<h1>Login</h1>
				<input type="text" placeholder="Username" onChange={e => setUserName(e.target.value)} />
        <button onClick={handleClick}>Login</button>
			</div>
		</div>
	)
}

export default Login
