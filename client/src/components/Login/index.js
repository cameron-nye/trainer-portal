import React, { useState, useContext } from "react"
import { useHistory } from "react-router-dom"
import axios from "axios"

import GlobalContext from "../../context/GlobalContext"
import "./index.scss"

const Login = () => {
	const [ username, setUsername ] = useState("")
	const { setUser } = useContext(GlobalContext)
	const history = useHistory()

	const handleClick = () => {
		axios.get(`http://localhost:8080/users?username=${username}`).then(res => {
				setUser(res.data)
			history.push("/dashboard")
		})
	}

	return (
		<div className="login">
			<div>
				<h1>Login</h1>
				<input type="text" placeholder="Username" onChange={e => setUsername(e.target.value)} />
				<button onClick={handleClick}>Login</button>
			</div>
		</div>
	)
}

export default Login
