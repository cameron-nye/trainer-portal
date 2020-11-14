import React from 'react'
import TrainerDashboard from './Trainer/index'
import ClientDashboard from './Client/index'

import './index.scss'

const Dashboard = () => {
  return (
    <div className='dashboard wrapper'>
      <ClientDashboard />
    </div>
  )
}

export default Dashboard
