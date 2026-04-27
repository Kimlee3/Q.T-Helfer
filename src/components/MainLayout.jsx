import React from 'react';
import Header from './Header.jsx';
import Search from './Search.jsx';
import QtSections from './QtSections.jsx';
import Actions from './Actions.jsx';
import SavedContent from './SavedContent.jsx';
import ReadingPlan from './ReadingPlan.jsx';

function MainLayout({
  // State props
  bibleRef, setBibleRef, bibleText, setBibleText, germanBibleText, prayerText, setPrayerText,
  summaryText, setSummaryText, capturedText, setCapturedText, meditationText, setMeditationText,
  characterText, setCharacterText, actionText, setActionText, finalPrayer, setFinalPrayer,
  isLoading, isSaved, savedContent, showSaved,

  // Handler props
  handleFetchClick, handleDailyDevotionalClick, handleSaveClick, handleCopyClick, handleShareClick,
  uiLanguage, setUiLanguage, handleOpenReadingPassage
}) {
  const copy = {
    ko: {
      eyebrow: 'Quiet Time Companion',
      title: '말씀을 읽고, 붙잡고, 오늘의 언어로 남기는 시간',
      description: '본문 검색, 묵상 기록, 적용과 기도까지 한 흐름으로 정리합니다. 도구처럼 바쁘게 굴러가기보다, 한 장의 좋은 저널처럼 숨 쉴 공간을 만들었습니다.',
      dataNote: '작성한 묵상은 사용자가 저장하거나 복사하기 전까지 화면 안에서만 다룹니다. 나눔 게시판에 올릴 내용은 공개해도 괜찮은 문장만 남겨 주세요.',
    },
    de: {
      eyebrow: 'Quiet Time Companion',
      title: 'Bibel lesen, festhalten und in den Alltag mitnehmen',
      description: 'Suche Bibeltexte, halte deine Gedanken fest und formuliere Anwendung und Gebet in einem ruhigen, klaren Ablauf.',
      dataNote: 'Deine Andacht bleibt zuerst in diesem Arbeitsraum. Veröffentliche im Austauschbereich nur Sätze, die du wirklich teilen möchtest.',
    },
  }[uiLanguage || 'ko'];

  return (
    <div className="container sanctuary-shell">
      <Header uiLanguage={uiLanguage} setUiLanguage={setUiLanguage} />
      <section className="hero-panel" aria-label="큐티 도우미 소개">
        <div>
          <p className="eyebrow">{copy.eyebrow}</p>
          <h2>{copy.title}</h2>
        </div>
        <div>
          <p>{copy.description}</p>
          <p className="data-note">{copy.dataNote}</p>
        </div>
      </section>
      <Search
        bibleRef={bibleRef} setBibleRef={setBibleRef}
        bibleText={bibleText} germanBibleText={germanBibleText} isLoading={isLoading}
        handleFetchClick={handleFetchClick} handleDailyDevotionalClick={handleDailyDevotionalClick}
        uiLanguage={uiLanguage}
      />
      <QtSections
        uiLanguage={uiLanguage}
        prayerText={prayerText} setPrayerText={setPrayerText}
        summaryText={summaryText} setSummaryText={setSummaryText}
        capturedText={capturedText} setCapturedText={setCapturedText}
        meditationText={meditationText} setMeditationText={setMeditationText}
        characterText={characterText} setCharacterText={setCharacterText}
        actionText={actionText} setActionText={setActionText}
        finalPrayer={finalPrayer} setFinalPrayer={setFinalPrayer}
      />
      <ReadingPlan uiLanguage={uiLanguage} onOpenPassage={handleOpenReadingPassage} />
      <Actions handleSaveClick={handleSaveClick} handleShareClick={handleShareClick} />
      <SavedContent showSaved={showSaved} content={savedContent} handleCopyClick={handleCopyClick} />
    </div>
  );
}

export default MainLayout;
