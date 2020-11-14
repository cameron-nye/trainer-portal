import Axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import GlobalContext from '../../context/GlobalContext';
import Modal from '../Modal'

import './index.scss'

const ExerciseManager = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetOptions, setTargetOptions] = useState([]);
  const [exercises, setExercises] = useState([]);
  const { user } = useContext(GlobalContext)

  useEffect(() => {
    Axios.get(`http://localhost:8080/users/${user.id}/exercises`)
  }, [])

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
            {exercises.map(({ name, tags, targets, linkUrl }, i) =>
              <tr><td>{name}</td><td>{tags.split(',').map(t => <label key={i}>{t}</label>)}</td><td>{targets.map((t, i) => <label key={i}>{t.name}</label>)}</td><td>{linkUrl}</td></tr>
            )}
          </tbody>
        </table>
      </main>
      <Modal
        open={isModalOpen}
        title="Add New Exercise"
        submit={{ text: "Create", onClick: () => setIsModalOpen(false) }}
        onClose={() => setIsModalOpen(false)}
        children={
          <form>
            <input type="text" placeholder="Name" required />
            <input type="text" placeholder="Tags" />
            <input type="text" placeholder="Link URL" />
            <select multiple onChange={v => console.log("values", v)}>
              {targetOptions.map((to, i) => <option key={i} value={to.id}>{to.name}</option>)}
            </select>
          </form>
        }
      />
    </div>
  )
}

export default ExerciseManager
