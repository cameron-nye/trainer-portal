import Axios from 'axios';
import React, { createRef, useContext, useEffect, useState } from 'react'
import GlobalContext from '../../context/GlobalContext';
import Modal from '../Modal'

import './index.scss'

const ExerciseManager = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetAreas, setTargetAreas] = useState([]);
  const [exercises, setExercises] = useState([]);
  const { user } = useContext(GlobalContext)
  const newExerciseRef = createRef();

  useEffect(() => {
    Axios.get(`http://localhost:8080/users/${user.id}/exercises`).then(res => res.data.exercises).then(setExercises);
    Axios.get(`http://localhost:8080/users/${user.id}/target-areas`).then(res => res.data.targetAreas).then(setTargetAreas);
  }, [user.id])

  return (
    <div className="exercise-manager">
      <header>
        <h1>Exercise Manager</h1>
        <button onClick={() => setIsModalOpen(true)}>Add New</button>
      </header>
      <main>
        <table>
          <thead><tr><td>Name</td><td>Tags</td><td>Targets</td><td>Link</td></tr></thead>
          <tbody>
            {exercises.map(({ name, tags, targetAreas, linkUrl }, i) =>
              <tr key={i}><td>{name}</td><td>{tags?.split(',').map((t, i) => <label key={i}>{t}</label>)}</td><td>{targetAreas?.map((t, i) => <label key={i}>{t.name}</label>)}</td><td>{linkUrl}</td></tr>
            )}
          </tbody>
        </table>
      </main>
      <Modal
        open={isModalOpen}
        title="Add New Exercise"
        submit={{
          text: "Create", onClick: () => {
            const req = {
              name: newExerciseRef.current['name'].value,
              tags: newExerciseRef.current['tags'].value,
              linkUrl: newExerciseRef.current['linkUrl'].value,
              targetAreaIds: ([...newExerciseRef.current['targetAreaIds'].selectedOptions]).map(o => o.value)
            }
            Axios.post(`http://localhost:8080/users/${user.id}/exercises`, req).then(res => {
              setExercises(e => [...e, { id: res.data.exerciseId, ...req }]);
              setIsModalOpen(false);
            });
          }
        }}
        onClose={() => setIsModalOpen(false)}
        children={
          <form ref={newExerciseRef}>
            <input type="text" placeholder="Name" name="name" required />
            <input type="text" placeholder="Tags" name="tags" />
            <input type="text" placeholder="Link URL" name="linkUrl" />
            <select multiple name="targetAreaIds">
              {targetAreas.map((to, i) => <option key={i} value={to.id}>{to.name}</option>)}
            </select>
          </form>
        }
      />
    </div>
  )
}

export default ExerciseManager
