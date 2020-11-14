import Axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import GlobalContext from '../../context/GlobalContext';

import './index.scss'

const Workout = ({ match }) => {
  const [exercises, setExercises] = useState([]);
  const { user } = useContext(GlobalContext);

  const [workout, setWorkout] = useState({});

  useEffect(() => {
    if (!match.params.workoutId) return;
    Axios.get(`http://localhost:8080/workouts/${match.params.workoutId}`).then(res => res.data).then(setWorkout);
  }, [match.params.workoutId])

  useEffect(() => {
    Axios.get(`http://localhost:8080/users/${user.id}/exercises`).then(res => res.data.exercises).then(setExercises);
  }, [user.id])

  useEffect(() => {
    if (!workout || !workout.name || !workout.tags) return;

    const req = { name: workout.name, tags: workout.tags };
    if (workout.id) {
      Axios.put(`http://localhost:8080/workouts/${workout.id}`, req);
    } else {
      Axios.post(`http://localhost:8080/users/${user.id}/workouts`, req).then(res => setWorkout(w => ({ ...w, id: res.data.workoutId })));
    }
  }, [user.id, workout])

  return (
    <div className="workout">
      <header>
        <h1>Workout</h1>
      </header>
      <main>
        <form>
          <input type="text" name="name" placeholder="Name" defaultValue={workout.name} onBlur={v => setWorkout(w => ({ ...w, name: v.target.value }))} />
          <input type="text" name="tags" placeholder="Tags" defaultValue={workout.tags} onBlur={v => setWorkout(w => ({ ...w, tags: v.target.value }))} />
        </form>
        <table>
          <thead><tr><td>Name</td><td>Tags</td><td>Targets</td><td>Link</td></tr></thead>
          <tbody>
            {exercises.map(({ name, tags, targetAreas, linkUrl }, i) =>
              <tr key={i}>
                <td>{name}</td>
                <td>{tags?.split(',').map((t, i) => <label key={i}>{t}</label>)}</td>
                <td>{targetAreas?.map((t, i) => <label key={i}>{t.name}</label>)}</td>
                <td>{linkUrl}</td>
              </tr>
            )}
          </tbody>
        </table>
      </main>
    </div>
  )
}

export default Workout
