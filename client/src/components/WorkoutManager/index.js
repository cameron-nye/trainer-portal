import Axios from 'axios';
import React, { createRef, useContext, useEffect, useState } from 'react'
import GlobalContext from '../../context/GlobalContext';
import Modal from '../Modal'

import './index.scss'

const WorkoutManager = () => {
  const [workouts, setWorkouts] = useState([]);
  const { user } = useContext(GlobalContext)

  useEffect(() => {
    Axios.get(`http://localhost:8080/users/${user.id}/workouts`).then(res => res.data.workouts).then(setWorkouts);
  }, [user.id])

  return (
    <div className="workout-manager">
      <header>
        <h1>Workouts Manager</h1>
        <button onClick={() => window.location = '/workout'}>Add New</button>
      </header>
      <main>
        <table>
          <thead><tr><td>Name</td><td>Tags</td></tr></thead>
          <tbody>
            {workouts.map(({ id, name, tags }, i) =>
              <tr key={i} onClick={() => window.location = `/workout/${id}`}>
                <td>{name}</td>
                <td>{tags?.split(',').filter(t => t).map((t, i) => <label key={i}>{t}</label>)}</td>
              </tr>
            )}
          </tbody>
        </table>
      </main>
    </div>
  )
}

export default WorkoutManager
