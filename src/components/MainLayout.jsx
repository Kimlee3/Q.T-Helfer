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
    <div className="container">
      <Header />
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
