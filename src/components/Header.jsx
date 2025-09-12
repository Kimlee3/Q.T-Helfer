import React from 'react';

function Header() {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="title-group">
          <h1><i className="fas fa-bible"></i> 큐티 도우미</h1>
          <p className="subtitle">매일의 말씀 묵상을 위한 지혜로운 도우미</p>
        </div>
        {/* 다크 모드 버튼은 App.jsx에 있으므로 여기서는 제거됩니다. */}
      </div>
    </header>
  );
}

export default Header;
