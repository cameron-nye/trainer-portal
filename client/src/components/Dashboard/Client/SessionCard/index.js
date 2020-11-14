import React from "react"
import { useHistory } from "react-router-dom"

import "./index.scss"

const SessionCard = ({ data: { id, dueDate, deadline, isCompleted } }) => {
	const history = useHistory()
	return (
		<div className={`session-card ${isCompleted && "complete"}`} onClick={() => history.push(`/session/${id}`)}>
			<p>{dueDate}</p>
		</div>
	)
}

export default SessionCard
