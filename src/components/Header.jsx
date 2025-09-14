import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="title-group">
          <h1><i className="fas fa-bible"></i> 큐티 도우미</h1>
          <p className="subtitle">매일의 말씀 묵상을 위한 지혜로운 도우미</p>
        </div>
        <nav style={{ marginLeft: 'auto', display: 'flex', gap: '12px' }}>
          <Link to="/" className="secondary-btn"><i className="fas fa-home"></i> 홈</Link>
          <Link to="/board" className="secondary-btn"><i className="fas fa-list"></i> 게시판</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
