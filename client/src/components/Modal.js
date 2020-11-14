import React, { useEffect } from 'react'

import './Modal.scss'

const Modal = ({ open, title, children, submit: { text, onClick }, onClose }) => {
  useEffect(() => {
    const handler = e => ([...e.target.classList]).includes('modal') && onClose();
    window.addEventListener('click', handler)
    return () => window.removeEventListener('click', handler)
  }, [open])

  return !!open && (
    <div className="modal">
      <header>
        <h1>{title}</h1>
      </header>
      <main>
        {children}
      </main>
      <footer>
        <button onClick={onClick}>{text || 'Done'}</button>
      </footer>
    </div>
  )
}

export default Modal
