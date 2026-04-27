import React, { useEffect, useState } from 'react';
import { getScriptureContext } from '../scriptureContext.js';

function stripScriptureForSpeech(text) {
  return String(text || '')
    .replace(/📖|📆/g, '')
    .replace(/Lutherbibel 1912.*$/gm, '')
    .replace(/Luther 1984.*$/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function Search({ 
  bibleRef, 
  setBibleRef, 
  bibleText, 
  germanBibleText = '',
  isLoading, 
  handleFetchClick, 
  handleDailyDevotionalClick,
  uiLanguage = 'ko'
}) {
  const [speakingKey, setSpeakingKey] = useState('');
  const context = getScriptureContext(bibleRef, bibleText, uiLanguage);
  const copy = {
    ko: {
      eyebrow: 'Scripture',
      title: '오늘 펼쳐볼 말씀',
      placeholder: '예) 로마서 1:1-10, 요한복음 1:1-3',
      fetch: '본문 가져오기',
      daily: '오늘의 본문',
      loading: '본문을 준비하는 중...',
      textarea: '본문 내용이 여기에 표시됩니다...',
      koreanTitle: '개역개정 본문',
      germanTitle: '독일어 성경',
      germanSource: 'Luther 1984는 공식 앱/사이트에서 확인',
      germanPlaceholder: '독일어 성경 본문이 여기에 표시됩니다...',
      germanRights:
        '앱 안에는 공개 가능한 Luther 1912 본문을 표시합니다. Luther 1984 전문은 Deutsche Bibelgesellschaft 권리 대상이라 공식 “Die-Bibel.de” 앱/사이트에서 확인해 주세요.',
      germanLink: 'Luther 1984 공식 확인',
      readKorean: '한국어 읽어주기',
      readGerman: '독일어 읽어주기',
      stopReading: '읽기 멈춤',
      speechUnsupported: '이 브라우저는 음성 읽기를 지원하지 않습니다.',
      contextEyebrow: 'Background',
      contextTitle: '본문 배경',
      book: '책',
      type: '성격',
      setting: '큰 흐름',
      lens: '오늘 읽는 렌즈',
      note: '본문과 배경 설명을 함께 보며 오늘 묵상의 흐름을 차분히 정리해 보세요.',
    },
    de: {
      eyebrow: 'Schrift',
      title: 'Bibeltext für heute',
      placeholder: 'z. B. Römer 1:1-10, Johannes 1:1-3',
      fetch: 'Text laden',
      daily: 'Heutiger Text',
      loading: 'Der Bibeltext wird vorbereitet...',
      textarea: 'Der Bibeltext erscheint hier...',
      koreanTitle: 'Koreanischer Bibeltext',
      germanTitle: 'Deutscher Bibeltext',
      germanSource: 'Luther 1984 offiziell prüfen',
      germanPlaceholder: 'Der deutsche Bibeltext erscheint hier...',
      germanRights:
        'In der App wird der frei nutzbare Luther-1912-Text angezeigt. Den Luther-1984-Text bitte offiziell in der Die-Bibel.de-App/Webseite prüfen.',
      germanLink: 'Luther 1984 offiziell öffnen',
      readKorean: 'Koreanisch vorlesen',
      readGerman: 'Deutsch vorlesen',
      stopReading: 'Vorlesen stoppen',
      speechUnsupported: 'Dieser Browser unterstützt Vorlesen nicht.',
      contextEyebrow: 'Background',
      contextTitle: 'Hintergrund zum Text',
      book: 'Buch',
      type: 'Gattung',
      setting: 'Großer Zusammenhang',
      lens: 'Lesebrille für heute',
      note: 'Lies den Bibeltext und den Hintergrund zusammen, damit der heutige Abschnitt ruhiger einzuordnen ist.',
    },
  }[uiLanguage];

  useEffect(() => () => {
    window.speechSynthesis?.cancel();
  }, []);

  const speakText = (text, lang, key) => {
    if (!('speechSynthesis' in window)) {
      alert(copy.speechUnsupported);
      return;
    }

    const cleanText = stripScriptureForSpeech(text);
    if (!cleanText) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = lang;
    utterance.rate = lang === 'de-DE' ? 0.88 : 0.92;
    utterance.pitch = 1;
    utterance.onend = () => setSpeakingKey('');
    utterance.onerror = () => setSpeakingKey('');
    setSpeakingKey(key);
    window.speechSynthesis.speak(utterance);
  };

  const stopReading = () => {
    window.speechSynthesis?.cancel();
    setSpeakingKey('');
  };

  return (
    <section className="input-section card scripture-card">
      <div className="scripture-layout">
        <div className="search-box">
          <div className="section-heading">
            <span className="soft-icon"><i className="fas fa-book-open"></i></span>
            <div>
              <p className="eyebrow">{copy.eyebrow}</p>
              <h3>{copy.title}</h3>
            </div>
          </div>
          <div className="search-controls">
            <input
              type="text"
              value={bibleRef || ""}
              onChange={(e) => setBibleRef(e.target.value)}
              placeholder={copy.placeholder}
            />
            <button onClick={handleFetchClick} disabled={isLoading} className="primary-btn">
              {copy.fetch}
            </button>
            <button onClick={handleDailyDevotionalClick} disabled={isLoading} className="secondary-btn">
              {copy.daily}
            </button>
            {isLoading && <span className="loading-note">{copy.loading}</span>}
          </div>
          <div className="bible-columns">
            <label className="bible-pane">
              <span>{copy.koreanTitle}</span>
              <textarea className="scripture-textarea" value={bibleText} readOnly placeholder={copy.textarea}></textarea>
              <div className="speech-controls">
                <button type="button" onClick={() => speakText(bibleText, 'ko-KR', 'ko')} disabled={!bibleText}>
                  <i className="fas fa-volume-up"></i> {copy.readKorean}
                </button>
                {speakingKey === 'ko' && (
                  <button type="button" onClick={stopReading} className="stop-speech">
                    <i className="fas fa-stop"></i> {copy.stopReading}
                  </button>
                )}
              </div>
            </label>
            <label className="bible-pane german-pane">
              <span>
                {copy.germanTitle}
                <small>{copy.germanSource}</small>
              </span>
              <textarea className="scripture-textarea" value={germanBibleText} readOnly placeholder={copy.germanPlaceholder}></textarea>
              <div className="speech-controls">
                <button type="button" onClick={() => speakText(germanBibleText, 'de-DE', 'de')} disabled={!germanBibleText}>
                  <i className="fas fa-volume-up"></i> {copy.readGerman}
                </button>
                {speakingKey === 'de' && (
                  <button type="button" onClick={stopReading} className="stop-speech">
                    <i className="fas fa-stop"></i> {copy.stopReading}
                  </button>
                )}
              </div>
              <p className="version-note">{copy.germanRights}</p>
              <a
                className="version-link"
                href="https://www.die-bibel.de/"
                target="_blank"
                rel="noreferrer"
              >
                {copy.germanLink}
              </a>
            </label>
          </div>
        </div>
        <aside className="scripture-context" aria-label={copy.contextTitle}>
          <div className="section-heading compact-heading">
            <span className="soft-icon"><i className="fas fa-scroll"></i></span>
            <div>
              <p className="eyebrow">{copy.contextEyebrow}</p>
              <h3>{copy.contextTitle}</h3>
            </div>
          </div>
          <dl className="context-list">
            <div>
              <dt>{copy.book}</dt>
              <dd>{context.book}</dd>
            </div>
            <div>
              <dt>{copy.type}</dt>
              <dd>{context.type}</dd>
            </div>
            <div>
              <dt>{copy.setting}</dt>
              <dd>{context.setting}</dd>
            </div>
            <div>
              <dt>{copy.lens}</dt>
              <dd>{context.lens}</dd>
            </div>
          </dl>
          <p className="context-note">{copy.note}</p>
        </aside>
      </div>
    </section>
  );
}

export default Search;
