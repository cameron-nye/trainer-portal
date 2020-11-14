import React, { useState, useEffect } from "react"
import { Route, Switch, useHistory, useParams } from "react-router-dom"
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
	const [user, setUser] = useState()
	const history = useHistory();
  const {sessionId} = useParams()
	useEffect(() => {
		const cachedUser = JSON.parse(localStorage.getItem("user"));
		setUser(cachedUser);
		if (['/login', '/sign-in', '/'].includes(history.location.pathname) && cachedUser) {
			history.push("/dashboard")
		}
		return () => {
			setUser(null);
		}
	}, [history])

	return (
		<GlobalContext.Provider value={{ user, setUser }} >
			<div className="app">
				{!!user && <Nav />}
				<Switch>
					<Route exact path="/" component={LandingPage} />
					<Route exact path="/login" component={Login} />
					<Route exact path="/sign-up" component={SignUp} />
					{!!user && <><Route path="/session/:sessionId?" component={Session} />
						<Route exact path="/clients" component={ClientManager} />
						<Route exact path="/workout-manager" component={WorkoutManager} />
						<Route exact path="/exercise-manager" component={ExerciseManager} />
						<Route exact path="/dashboard" component={Dashboard} />
					</>}
				</Switch>
			</div>
		</GlobalContext.Provider>
	)
}

export default App
