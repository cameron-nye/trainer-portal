import React, { useContext } from "react"
import TrainerDashboard from "./Trainer/index"
import ClientDashboard from "./Client/index"

import GlobalContext from "../../context/GlobalContext"
import "./index.scss"

const Dashboard = () => {
	const { user } = useContext(GlobalContext)
	return (
		<div className="dashboard wrapper">
			<header>
				<h1>Dashboard</h1>
			</header>
			<main>{user.trainerUsername ? <ClientDashboard userId={user.id} /> : <TrainerDashboard />}</main>
		</div>
	)
}

export default Dashboard
