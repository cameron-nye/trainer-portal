import React, { useState, useEffect } from "react"
import SessionCard from "./SessionCard/index"

import "./index.scss"
import Axios from "axios"

const ClientDashboard = ({ userId }) => {
	const [completedSessions, setCompletedSessions] = useState([])
	const [pendingSessions, setPendingSessions] = useState([])

	// ONLY USED FOR TEST DATA
	useEffect(() => {
		const sessions = [
			{
				id: 1,
				dueDate: "11/13/2020",
				deadline: null,
				isCompleted: true,
				comments: null
			},
			{
				id: 2,
				dueDate: "11/13/2020",
				deadline: null,
				isCompleted: false,
				comments: null
			}
		]
		setCompletedSessions(sessions.filter(s => s.isCompleted === true))
		setPendingSessions(sessions.filter(s => s.isCompleted === false))
	}, [])


	// READY FOR REAL DATA  
	// useEffect(
	// 	() => {
	// 		Axios.get(
	// 			`http://localhost:8080/users/${userId}/dashboard?startDate=null&endDate=null&limit=10&showArchived=false`
	// 		)
	// 			.then(res => {
	// 				const { sessions } = res.data
	// 				console.log(sessions)
	// 				setCompletedSessions(sessions.filter(s => s.isCompleted === true))
	// 				setPendingSessions(sessions.filter(s => s.isCompleted === false))
	// 			})
	// 			.catch(err => console.log(err))
	// 	},
	// 	[ userId ]
	// )

	return (
		<div className="client-dashboard">
			{
				pendingSessions?.map((ps, i) => {
					return (
						<SessionCard
							data={ps}
							key={ps + i}
						/>

					)
				})
			}
			<hr />
			{
				completedSessions?.map((cs, i) => {
					return (
						<SessionCard
							data={cs}
							key={cs + i}
						/>

					)
				})
			}
		</div>
	)
}

export default ClientDashboard
