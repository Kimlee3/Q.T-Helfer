import React from 'react';

function Search({ 
  bibleRef, 
  setBibleRef, 
  bibleText, 
  isLoading, 
  handleFetchClick, 
  handleDailyDevotionalClick 
}) {
  return (
    <section className="input-section card scripture-card">
      <div className="search-box">
        <div className="section-heading">
          <span className="soft-icon"><i className="fas fa-book-open"></i></span>
          <div>
            <p className="eyebrow">Scripture</p>
            <h3>오늘 펼쳐볼 말씀</h3>
          </div>
        </div>
        <div className="search-controls">
          <input
            type="text"
            value={bibleRef || ""} // Ensure value is always defined
            onChange={(e) => setBibleRef(e.target.value)}
            placeholder="예) 로마서 1:1-10, 요한복음 1:1-3"
          />
          <button onClick={handleFetchClick} disabled={isLoading} className="primary-btn">
            본문 가져오기
          </button>
          <button onClick={handleDailyDevotionalClick} disabled={isLoading} className="secondary-btn">
            오늘의 본문
          </button>
          {isLoading && <span className="loading-note">본문을 준비하는 중...</span>}
        </div>
      </div>
      <textarea className="scripture-textarea" value={bibleText} readOnly placeholder="본문 내용이 여기에 표시됩니다..."></textarea>
    </section>
  );
}

export default Search;
