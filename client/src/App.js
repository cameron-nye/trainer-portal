import React from 'react'
import {Route, Switch} from 'react-router-dom'
import LandingPage from './components/LandingPage'
import SignUp from './components/SignUp/index'
import Login from './components/Login/index'
import './App.scss'

const App = () => {

  return (
    <div className='app'>
      <Switch>
        <Route exact path='/' component={LandingPage}/>
        <Route exact path='/login' component={Login}/>
        <Route exact path='/sign-up' component={SignUp}/>
      </Switch>
    </div>
  )
}

export default App