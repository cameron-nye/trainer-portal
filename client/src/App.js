import React from 'react'
import {Route, Switch} from 'react-router-dom'
import LandingPage from './components/LandingPage'
import './App.scss'

const App = () => {

  return (
    <div className='app'>
      <Switch>
        <Route exact path='/' component={LandingPage}/>
      </Switch>
    </div>
  )
}

export default App