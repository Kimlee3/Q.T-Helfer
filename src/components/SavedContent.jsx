import React from 'react';

function SavedContent({ showSaved, content, handleCopyClick }) {
  if (!showSaved) {
    return null;
  }

  return (
    <div className="card saved-content">
      <div className="section-heading">
        <span className="soft-icon"><i className="fas fa-feather"></i></span>
        <div>
          <p className="eyebrow">Archive Preview</p>
          <h3>저장된 묵상</h3>
        </div>
      </div>
      <pre>{content}</pre>
      <div className="saved-actions">
        <button onClick={handleCopyClick} className="secondary-btn">
          복사하기
        </button>
      </div>
    </div>
  );
}

export default SavedContent;
