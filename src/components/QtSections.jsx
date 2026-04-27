import React from 'react';

function QtSections({
  uiLanguage = 'ko',
  prayerText, setPrayerText,
  summaryText, setSummaryText,
  capturedText, setCapturedText,
  meditationText, setMeditationText,
  characterText, setCharacterText,
  actionText, setActionText,
  finalPrayer, setFinalPrayer
}) {
  const copy = {
    ko: {
      opening: ['Opening Prayer', '들어가는 기도', '말씀을 읽기 전에 드리는 기도를 작성해주세요'],
      summary: ['Summary', '본문 요약', '오늘 읽은 본문을 간단히 요약해보세요', '본문 내용을 요약해서 작성해주세요'],
      captured: ['Captured Verse', '붙잡은 말씀', '오늘 말씀 중 가장 마음에 와닿은 구절을 기록하세요', '본문에서 감동받은 구절을 작성해주세요'],
      meditation: ['Meditation', '느낌과 묵상', '말씀을 통해 깨달은 점과 묵상한 내용을 기록하세요', '오늘 말씀을 통해 깨달은 점을 기록하세요'],
      practice: ['Practice', '적용과 결단', '말씀을 삶에 어떻게 적용할지 구체적으로 계획해보세요'],
      character: ['성품', '말씀을 통해 바꾸고 싶은 성품과 태도'],
      action: ['행동', '구체적으로 실천할 행동'],
      closing: ['Closing Prayer', '올려드리는 기도', '오늘의 큐티를 마무리하는 기도문'],
    },
    de: {
      opening: ['Opening Prayer', 'Eingangsgebet', 'Schreibe ein kurzes Gebet, bevor du den Text liest.'],
      summary: ['Summary', 'Zusammenfassung', 'Fasse den heutigen Bibeltext kurz zusammen.', 'Schreibe die Kernaussage des Textes auf.'],
      captured: ['Captured Verse', 'Festgehaltener Vers', 'Notiere den Vers oder Satz, der dich heute besonders berührt.', 'Welcher Satz bleibt dir heute im Herzen?'],
      meditation: ['Meditation', 'Gedanken und Andacht', 'Halte fest, was du durch den Text erkennst und bewegst.', 'Was zeigt dir Gott durch diesen Text?'],
      practice: ['Practice', 'Anwendung und Entscheidung', 'Plane konkret, wie du das Wort heute leben möchtest.'],
      character: ['Charakter', 'Welche Haltung oder Eigenschaft soll sich verändern?'],
      action: ['Handlung', 'Welche konkrete Handlung willst du heute tun?'],
      closing: ['Closing Prayer', 'Abschlussgebet', 'Formuliere dein Gebet zum Abschluss der Andacht.'],
    },
  }[uiLanguage];

  return (
    <div className="qt-sections">
      <div className="prayer-section card reflection-card">
        <div className="section-heading">
          <span className="soft-icon"><i className="fas fa-pray"></i></span>
          <div>
            <p className="eyebrow">{copy.opening[0]}</p>
            <h3>{copy.opening[1]}</h3>
          </div>
        </div>
        <textarea value={prayerText} onChange={(e) => setPrayerText(e.target.value)} placeholder={copy.opening[2]}></textarea>
      </div>
      <div className="summary-section card reflection-card">
        <div className="section-heading">
          <span className="soft-icon"><i className="fas fa-align-left"></i></span>
          <div>
            <p className="eyebrow">{copy.summary[0]}</p>
            <h3>{copy.summary[1]}</h3>
          </div>
        </div>
        <p className="section-description">{copy.summary[2]}</p>
        <textarea value={summaryText} onChange={(e) => setSummaryText(e.target.value)} placeholder={copy.summary[3]}></textarea>
      </div>
      <div className="captured-section card reflection-card">
        <div className="section-heading">
          <span className="soft-icon"><i className="fas fa-highlighter"></i></span>
          <div>
            <p className="eyebrow">{copy.captured[0]}</p>
            <h3>{copy.captured[1]}</h3>
          </div>
        </div>
        <p className="section-description">{copy.captured[2]}</p>
        <textarea value={capturedText} onChange={(e) => setCapturedText(e.target.value)} placeholder={copy.captured[3]}></textarea>
      </div>
      <div className="meditation-section card reflection-card">
        <div className="section-heading">
          <span className="soft-icon"><i className="fas fa-lightbulb"></i></span>
          <div>
            <p className="eyebrow">{copy.meditation[0]}</p>
            <h3>{copy.meditation[1]}</h3>
          </div>
        </div>
        <p className="section-description">{copy.meditation[2]}</p>
        <textarea value={meditationText} onChange={(e) => setMeditationText(e.target.value)} placeholder={copy.meditation[3]}></textarea>
      </div>
      <div className="application-section card reflection-card">
        <div className="section-heading">
          <span className="soft-icon"><i className="fas fa-hands-helping"></i></span>
          <div>
            <p className="eyebrow">{copy.practice[0]}</p>
            <h3>{copy.practice[1]}</h3>
          </div>
        </div>
        <p className="section-description">{copy.practice[2]}</p>
        <div className="application-grid">
          <div className="app-card">
            <label><i className="fas fa-heart"></i> {copy.character[0]}</label>
            <textarea value={characterText} onChange={(e) => setCharacterText(e.target.value)} placeholder={copy.character[1]}></textarea>
          </div>
          <div className="app-card">
            <label><i className="fas fa-walking"></i> {copy.action[0]}</label>
            <textarea value={actionText} onChange={(e) => setActionText(e.target.value)} placeholder={copy.action[1]}></textarea>
          </div>
        </div>
      </div>
      <div className="prayer-section card reflection-card">
        <div className="section-heading">
          <span className="soft-icon"><i className="fas fa-hands-praying"></i></span>
          <div>
            <p className="eyebrow">{copy.closing[0]}</p>
            <h3>{copy.closing[1]}</h3>
          </div>
        </div>
        <textarea value={finalPrayer} onChange={(e) => setFinalPrayer(e.target.value)} placeholder={copy.closing[2]}></textarea>
      </div>
    </div>
  );
}

export default QtSections;
