import React from 'react';
import Header from './Header.jsx';
import Search from './Search.jsx';
import QtSections from './QtSections.jsx';
import Actions from './Actions.jsx';
import SavedContent from './SavedContent.jsx';

function MainLayout({
  // State props
  bibleRef, setBibleRef, bibleText, setBibleText, prayerText, setPrayerText,
  summaryText, setSummaryText, capturedText, setCapturedText, meditationText, setMeditationText,
  characterText, setCharacterText, actionText, setActionText, finalPrayer, setFinalPrayer,
  isLoading, isSaved, savedContent, showSaved,

  // Handler props
  handleFetchClick, handleDailyDevotionalClick, handleSaveClick, handleCopyClick, handleShareClick
}) {
  return (
    <div className="container sanctuary-shell">
      <Header />
      <section className="hero-panel" aria-label="큐티 도우미 소개">
        <div>
          <p className="eyebrow">Quiet Time Companion</p>
          <h2>말씀을 읽고, 붙잡고, 오늘의 언어로 남기는 시간</h2>
        </div>
        <p>
          본문 검색, 묵상 기록, 적용과 기도까지 한 흐름으로 정리합니다.
          도구처럼 바쁘게 굴러가기보다, 한 장의 좋은 저널처럼 숨 쉴 공간을 만들었습니다.
        </p>
      </section>
      <Search
        bibleRef={bibleRef} setBibleRef={setBibleRef}
        bibleText={bibleText} isLoading={isLoading}
        handleFetchClick={handleFetchClick} handleDailyDevotionalClick={handleDailyDevotionalClick}
      />
      <QtSections
        prayerText={prayerText} setPrayerText={setPrayerText}
        summaryText={summaryText} setSummaryText={setSummaryText}
        capturedText={capturedText} setCapturedText={setCapturedText}
        meditationText={meditationText} setMeditationText={setMeditationText}
        characterText={characterText} setCharacterText={setCharacterText}
        actionText={actionText} setActionText={setActionText}
        finalPrayer={finalPrayer} setFinalPrayer={setFinalPrayer}
      />
      <Actions handleSaveClick={handleSaveClick} handleShareClick={handleShareClick} />
      <SavedContent showSaved={showSaved} content={savedContent} handleCopyClick={handleCopyClick} />
    </div>
  );
}

export default MainLayout;
