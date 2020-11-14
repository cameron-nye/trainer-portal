import React, { useState } from "react"
import {useHistory} from 'react-router-dom'
import axios from 'axios'

import "./index.scss"

const SignUp = () => {
	const [ firstName, setFirstName ] = useState("")
	const [ lastName, setLastName ] = useState("")
	const [ userName, setUserName ] = useState("")
  const [ trainerName, setTrainerName ] = useState("")

  const history = useHistory()
  
  // NEED TO FILL IN WITH ENDPOINT DATA
  const handleSubmit = () => {
    // axios.post('')
    history.push('/dashboard')
  }

	return (
		<div className="sign-up">
			<div>
				<h1>Sign Up</h1>
				<input type="text" placeholder="First Name" onChange={e => setFirstName(e.target.value)} />
				<input type="text" placeholder="Last Name" onChange={e => setLastName(e.target.value)} />
				<input type="text" placeholder="Username" onChange={e => setUserName(e.target.value)} />
				<input type="text" placeholder="Trainer Name" onChange={e => setTrainerName(e.target.value)} />
				<button onClick={handleSubmit}>Sign Up</button>
			</div>
		</div>
	)
}

export default SignUp
