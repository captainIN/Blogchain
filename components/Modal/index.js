import React from 'react'

function Modal({
  show = true,
  closeModal,
  height = '300px',
  width = '200px',
  children
}) {
  return (
    <div className={`modal-container ${show ? 'active' : ''}`} >
      <div className='modal-body' style={{ height: height, width: width }}>
        <button onClick={closeModal}>Close</button>
        {children}
      </div>

    </div>
  )
}

export default Modal