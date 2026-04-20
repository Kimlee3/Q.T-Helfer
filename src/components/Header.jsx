import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="title-group">
          <p className="eyebrow">Digital Sanctuary</p>
          <h1>조용한 말씀 작업실</h1>
          <p className="subtitle">오늘의 본문을 천천히 읽고, 마음에 남은 문장을 삶의 결단으로 정리합니다.</p>
        </div>
        <nav className="top-nav" aria-label="주요 메뉴">
          <Link to="/" className="ghost-btn">묵상실</Link>
          <Link to="/board" className="ghost-btn">나눔 게시판</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
