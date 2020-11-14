import React, { useState } from "react"
import { Route, Switch } from "react-router-dom"
import LandingPage from "./components/LandingPage"
import SignUp from "./components/SignUp/index"
import Login from "./components/Login/index"
import Nav from "./components/Nav/index"
import Session from "./components/Session/index"
import ClientManager from "./components/ClientManager/index"
import WorkoutManager from "./components/WorkoutManager/index"
import ExerciseManager from "./components/ExerciseManager/index"
import Dashboard from "./components/Dashboard/index"
import GlobalContext from "./context/GlobalContext"
import "./App.scss"

const App = () => {
	const [ user, setUser ] = useState(JSON.parse(localStorage.getItem('user')) || {})

	return (
		<GlobalContext.Provider
			value={{
				user,
				setUser
			}}
		>
			<div className="app">
				{Object.keys(user).length > 0 && <Nav />}
				<Switch>
					<Route exact path="/" component={LandingPage} />
					<Route exact path="/login" component={Login} />
					<Route exact path="/sign-up" component={SignUp} />
					<Route exact path="/schedule-workout" component={Session} />
					<Route exact path="/clients" component={ClientManager} />
					<Route exact path="/workout-manager" component={WorkoutManager} />
					<Route exact path="/exercise-manager" component={ExerciseManager} />
					<Route exact path="/dashboard" component={Dashboard} />
				</Switch>
			</div>
		</GlobalContext.Provider>
	)
}

export default App
