import React from 'react';
import { Link } from 'react-router-dom';

function Header({ uiLanguage = 'ko', setUiLanguage }) {
  const copy = {
    ko: {
      eyebrow: 'Digital Sanctuary',
      title: '조용한 말씀 작업실',
      subtitle: '오늘의 본문을 천천히 읽고, 마음에 남은 문장을 삶의 결단으로 정리합니다.',
      home: '묵상실',
      reading: '통독실',
      board: '나눔실',
      languageLabel: '언어 선택',
    },
    de: {
      eyebrow: 'Digital Sanctuary',
      title: 'Stiller Bibelarbeitsraum',
      subtitle: 'Lies den heutigen Bibeltext langsam und halte fest, was daraus für dein Leben wird.',
      home: 'Andachtsraum',
      reading: 'Leseplan',
      board: 'Austauschraum',
      languageLabel: 'Sprache wählen',
    },
  }[uiLanguage];

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="title-group">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1>{copy.title}</h1>
          <p className="subtitle">{copy.subtitle}</p>
        </div>
        <nav className="top-nav" aria-label="주요 메뉴">
          <div className="language-switch" role="group" aria-label={copy.languageLabel}>
            <button
              type="button"
              className={uiLanguage === 'ko' ? 'active' : ''}
              onClick={() => setUiLanguage?.('ko')}
            >
              한국어
            </button>
            <button
              type="button"
              className={uiLanguage === 'de' ? 'active' : ''}
              onClick={() => setUiLanguage?.('de')}
            >
              Deutsch
            </button>
          </div>
          <Link to="/" className="ghost-btn">{copy.home}</Link>
          <Link to="/reading" className="ghost-btn">{copy.reading}</Link>
          <Link to="/board" className="ghost-btn">{copy.board}</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
