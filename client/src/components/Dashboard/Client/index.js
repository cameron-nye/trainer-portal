import React, { useState, useEffect } from "react"
import SessionCard from "./SessionCard/index"

import "./index.scss"
import Axios from "axios"

const ClientDashboard = ({ userId }) => {
	const [ sessions, setSessions ] = useState([])
	useEffect(
		() => {
			Axios.get(
				`http://localhost:8080/users/${userId}/dashboard?startDate=null&endDate=null&limit=10&showArchived=false`
			)
				.then(res => setSessions(res.data.sessions))
				.catch(err => console.log(err))
		},
		[ userId ]
	)

	return (
		<div className="client-dashboard">
			<SessionCard
				data={{
					dueDate: "11/13/2020",
					deadline: null,
					isCompleted: true,
					comments: null
				}}
			/>
			<SessionCard
				data={{
					dueDate: "11/13/2020",
					deadline: null,
					isCompleted: false,
					comments: null
				}}
			/>
		</div>
	)
}

export default ClientDashboard
