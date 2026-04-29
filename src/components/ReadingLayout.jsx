import React from 'react';
import Header from './Header.jsx';
import ReadingPlan from './ReadingPlan.jsx';

function ReadingLayout({ uiLanguage = 'ko', setUiLanguage, handleOpenReadingPassage }) {
  const copy = {
    ko: {
      readingRoom: '통독실',
      readingText: '구약과 신약을 장별로 체크하고, 필요한 본문은 묵상실로 가져와 읽을 수 있습니다.',
    },
    de: {
      readingRoom: 'Leseplan',
      readingText: 'Markiere Kapitel aus Altem und Neuem Testament und öffne Texte bei Bedarf im Andachtsraum.',
    },
  }[uiLanguage || 'ko'];

  return (
    <div className="container sanctuary-shell">
      <Header uiLanguage={uiLanguage} setUiLanguage={setUiLanguage} />
      <section id="reading-room" className="room-section reading-room-section">
        <div className="room-heading">
          <p className="eyebrow">{copy.readingRoom}</p>
          <h2>{copy.readingRoom}</h2>
          <p>{copy.readingText}</p>
        </div>
        <ReadingPlan uiLanguage={uiLanguage} onOpenPassage={handleOpenReadingPassage} />
      </section>
    </div>
  );
}

export default ReadingLayout;
