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
    <div className="input-section card">
      <div className="search-box">
        <h3><i className="fas fa-search"></i> 성경 구절 검색</h3>
        <div className="search-controls">
          <input
            type="text"
            value={bibleRef}
            onChange={(e) => setBibleRef(e.target.value)}
            placeholder="예) 로마서 1:1-10, 요한복음 1:1-3"
          />
          <button onClick={handleFetchClick} disabled={isLoading} className="primary-btn">
            <i className="fas fa-book-open"></i> 본문 가져오기
          </button>
          <button onClick={handleDailyDevotionalClick} disabled={isLoading} className="secondary-btn">
            <i className="fas fa-calendar-day"></i> 오늘의 본문
          </button>
          {isLoading && <span style={{ marginLeft: '10px' }}>⏳ 로딩 중...</span>}
        </div>
      </div>
      <textarea value={bibleText} readOnly placeholder="본문 내용이 여기에 표시됩니다..."></textarea>
    </div>
  );
}

export default Search;
