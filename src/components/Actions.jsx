import React from 'react';

function Actions({ handleSaveClick, handleShareClick }) {
  return (
    <div className="action-buttons">
      <button onClick={handleSaveClick} className="primary-btn">
        <i className="fas fa-save"></i> 저장하기
      </button>
      <button onClick={handleShareClick} className="secondary-btn">
        <i className="fas fa-share-alt"></i> 공유하기
      </button>
    </div>
  );
}

export default Actions;
