import React from 'react';

function SavedContent({ showSaved, content, handleCopyClick }) {
  if (!showSaved) {
    return null;
  }

  return (
    <div className="card saved-content">
      <h3><i className="fas fa-history"></i> 저장된 내용</h3>
      <pre>{content}</pre>
      <div className="saved-actions">
        <button onClick={handleCopyClick} className="secondary-btn">
          <i className="fas fa-copy"></i> 복사하기
        </button>
      </div>
    </div>
  );
}

export default SavedContent;
