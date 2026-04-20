import React from 'react';

function Actions({ handleSaveClick, handleShareClick }) {
  return (
    <div className="action-buttons">
      <button onClick={handleSaveClick} className="primary-btn">
        오늘의 묵상 저장
      </button>
      <button onClick={handleShareClick} className="secondary-btn">
        나눔으로 공유
      </button>
    </div>
  );
}

export default Actions;
