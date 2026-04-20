import React from 'react';

function QtSections({
  prayerText, setPrayerText,
  summaryText, setSummaryText,
  capturedText, setCapturedText,
  meditationText, setMeditationText,
  characterText, setCharacterText,
  actionText, setActionText,
  finalPrayer, setFinalPrayer
}) {
  return (
    <div className="qt-sections">
      <div className="prayer-section card reflection-card">
        <div className="section-heading">
          <span className="soft-icon"><i className="fas fa-pray"></i></span>
          <div>
            <p className="eyebrow">Opening Prayer</p>
            <h3>들어가는 기도</h3>
          </div>
        </div>
        <textarea value={prayerText} onChange={(e) => setPrayerText(e.target.value)} placeholder="말씀을 읽기 전에 드리는 기도를 작성해주세요"></textarea>
      </div>
      <div className="summary-section card reflection-card">
        <div className="section-heading">
          <span className="soft-icon"><i className="fas fa-align-left"></i></span>
          <div>
            <p className="eyebrow">Summary</p>
            <h3>본문 요약</h3>
          </div>
        </div>
        <p className="section-description">오늘 읽은 본문을 간단히 요약해보세요</p>
        <textarea value={summaryText} onChange={(e) => setSummaryText(e.target.value)} placeholder="본문 내용을 요약해서 작성해주세요"></textarea>
      </div>
      <div className="captured-section card reflection-card">
        <div className="section-heading">
          <span className="soft-icon"><i className="fas fa-highlighter"></i></span>
          <div>
            <p className="eyebrow">Captured Verse</p>
            <h3>붙잡은 말씀</h3>
          </div>
        </div>
        <p className="section-description">오늘 말씀 중 가장 마음에 와닿은 구절을 기록하세요</p>
        <textarea value={capturedText} onChange={(e) => setCapturedText(e.target.value)} placeholder="본문에서 감동받은 구절을 작성해주세요"></textarea>
      </div>
      <div className="meditation-section card reflection-card">
        <div className="section-heading">
          <span className="soft-icon"><i className="fas fa-lightbulb"></i></span>
          <div>
            <p className="eyebrow">Meditation</p>
            <h3>느낌과 묵상</h3>
          </div>
        </div>
        <p className="section-description">말씀을 통해 깨달은 점과 묵상한 내용을 기록하세요</p>
        <textarea value={meditationText} onChange={(e) => setMeditationText(e.target.value)} placeholder="오늘 말씀을 통해 깨달은 점을 기록하세요"></textarea>
      </div>
      <div className="application-section card reflection-card">
        <div className="section-heading">
          <span className="soft-icon"><i className="fas fa-hands-helping"></i></span>
          <div>
            <p className="eyebrow">Practice</p>
            <h3>적용과 결단</h3>
          </div>
        </div>
        <p className="section-description">말씀을 삶에 어떻게 적용할지 구체적으로 계획해보세요</p>
        <div className="application-grid">
          <div className="app-card">
            <label><i className="fas fa-heart"></i> 성품</label>
            <textarea value={characterText} onChange={(e) => setCharacterText(e.target.value)} placeholder="말씀을 통해 바꾸고 싶은 성품과 태도"></textarea>
          </div>
          <div className="app-card">
            <label><i className="fas fa-walking"></i> 행동</label>
            <textarea value={actionText} onChange={(e) => setActionText(e.target.value)} placeholder="구체적으로 실천할 행동"></textarea>
          </div>
        </div>
      </div>
      <div className="prayer-section card reflection-card">
        <div className="section-heading">
          <span className="soft-icon"><i className="fas fa-hands-praying"></i></span>
          <div>
            <p className="eyebrow">Closing Prayer</p>
            <h3>올려드리는 기도</h3>
          </div>
        </div>
        <textarea value={finalPrayer} onChange={(e) => setFinalPrayer(e.target.value)} placeholder="오늘의 큐티를 마무리하는 기도문"></textarea>
      </div>
    </div>
  );
}

export default QtSections;
