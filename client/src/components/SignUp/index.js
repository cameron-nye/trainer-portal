import React, { useState, useContext } from "react"
import { useHistory } from "react-router-dom"
import axios from "axios"

import "./index.scss"
import GlobalContext from "../../context/GlobalContext"

const SignUp = () => {
	const [firstName, setFirstName] = useState("")
	const [lastName, setLastName] = useState("")
	const [username, setUsername] = useState("")
	const [trainerUsername, setTrainerUsername] = useState("")

	const history = useHistory()

	const { setUser } = useContext(GlobalContext)

	// NEED TO FILL IN WITH ENDPOINT DATA
	const handleSubmit = () => {
		axios
			.post("http://localhost:8080/users", { firstName, lastName, username, trainerUsername })
			.then(res => {
				setUser({
					id: res.data.userId,
					firstName,
					lastName,
					username,
					trainerUsername
				})
				window.localStorage.setItem(
					"user",
					JSON.stringify({
						id: res.data.userId,
						firstName,
						lastName,
						username,
						trainerUsername
					})
				)
				history.push("/dashboard")
			})
	}

	return (
		<div className="sign-up">
			<div>
				<h1>Sign Up</h1>
				<input type="text" placeholder="First Name" onChange={e => setFirstName(e.target.value)} />
				<input type="text" placeholder="Last Name" onChange={e => setLastName(e.target.value)} />
				<input type="text" placeholder="Username" onChange={e => setUsername(e.target.value)} />
				<input type="text" placeholder="Trainer Username" onChange={e => setTrainerUsername(e.target.value)} />
				<button onClick={handleSubmit}>Sign Up</button>
			</div>
		</div>
	)
}

export default SignUp
