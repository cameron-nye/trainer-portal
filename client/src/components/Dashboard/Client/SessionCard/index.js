import React from 'react'

import './index.scss'

const SessionCard = ({data: {dueDate, deadline, isCompleted}}) => {
  
  return (
    <div className={`session-card ${isCompleted && 'complete'}`}>
      <p>{dueDate}</p>
    </div>
  )
}

export default SessionCard
