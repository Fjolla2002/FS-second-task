import React from 'react';
import './modal.scss';

const CreateReport = ({
  isOpen,
  closeModal,
  handleCreateReport,
  handleUsernameChange,
  usernameInput,
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
              <input type="text" value={usernameInput}  placeholder={label}onChange={(e) => handleUsernameChange(e)} />
            </div>
            <button type="button" onClick={() => handleCreateReport()} className='btn'>
              Create
            </button>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateReport;
