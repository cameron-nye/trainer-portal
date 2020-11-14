import React from "react"
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
import "./App.scss"

const App = () => {
	return (
		<div className="app">
			{window.location.pathname !== "/" &&
			window.location.pathname !== "/sign-up" &&
			window.location.pathname !== "/login" && <Nav />}
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
	)
}

export default App
