import React, { useContext } from "react"
import TrainerDashboard from "./Trainer/index"
import ClientDashboard from "./Client/index"

import GlobalContext from "../../context/GlobalContext"
import "./index.scss"

const Dashboard = () => {
	const { user } = useContext(GlobalContext)
	console.log("dashboard", user)

	return (
		<div className="dashboard wrapper">
			<h2>Dashboard</h2>
			{user.trainerId ? <ClientDashboard /> : <TrainerDashboard />}
		</div>
	)
}

export default Dashboard
