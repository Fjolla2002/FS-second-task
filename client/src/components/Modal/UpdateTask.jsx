import React from 'react';
import './modal.scss';

const UpdateTask = ({
  isOpen,
  closeModal,
  handleUpdateTask,
  handleTaskTitleChange,
  handleTaskFinishedChange,
  taskTitleInput,
  taskFinishedInput,
  errorMessage,
  label
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className='modal'>
      <span className='wrapper-modal' onClick={() => closeModal()} />
      <div className='content-modal'>
        <button className='close' onClick={() => closeModal()}>X</button>
        <div className='content'>
          <form>
            <div className='input-field'>
              <span>{label}:</span>
              <input type="text" value={taskTitleInput} placeholder={label} onChange={(e) => handleTaskTitleChange(e)} />
            </div>
            <div className='input-field'>
              <span>Is Finished:</span>
              <input type="checkbox" checked={taskFinishedInput} onChange={(e) => handleTaskFinishedChange(e)} />
            </div>
            <button type="button" onClick={() => handleUpdateTask()} className='btn'>
              Update Task
            </button>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateTask;