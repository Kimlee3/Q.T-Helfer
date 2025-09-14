import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout.jsx';
import BoardList from './components/BoardList.jsx';
import BoardWrite from './components/BoardWrite.jsx';
import BoardDetail from './components/BoardDetail.jsx';
import BoardEdit from './components/BoardEdit.jsx';
import { fetchBibleVerses, fetchDailyDevotional } from './api.js';
import './style.css';

function App() {
  const [bibleRef, setBibleRef] = useState('');
  const [bibleText, setBibleText] = useState('');
  const [prayerText, setPrayerText] = useState('');
  const [summaryText, setSummaryText] = useState('');
  const [capturedText, setCapturedText] = useState('');
  const [meditationText, setMeditationText] = useState('');
  const [characterText, setCharacterText] = useState('');
  const [actionText, setActionText] = useState('');
  const [finalPrayer, setFinalPrayer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [savedContent, setSavedContent] = useState('');
  const [showSaved, setShowSaved] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleFetchClick = async () => {
    if (!bibleRef) {
      setBibleText('성경 구절을 입력해주세요. (예: 로마서 8:28)');
      return;
    }
    setIsLoading(true);
    setBibleText('');
    try {
      const verses = await fetchBibleVerses(bibleRef);
      setBibleText(verses);
    } catch (error) {
      setBibleText(`오류: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDailyDevotionalClick = async () => {
    setIsLoading(true);
    setBibleText('');
    try {
      const data = await fetchDailyDevotional();
      setBibleRef(data.reference);
      setBibleText(data.text);
    } catch (error) {
      setBibleText(`오늘의 묵상 본문을 가져오는 데 실패했습니다: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Load daily devotional on initial render
  useEffect(() => {
    handleDailyDevotionalClick();
  }, []);

  // Dark mode toggling using a body class
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const handleSaveClick = () => {
    const content = `
QT 나눔
${bibleRef}
${bibleText}

[내용 요약]
${summaryText}

[붙잡은 말씀]
${capturedText}

[느낌과 묵상]
${meditationText}

[적용과 결단]
- 성품: ${characterText}
- 행동: ${actionText}

[마무리 기도]
${finalPrayer}
    `.trim();
    setSavedContent(content);
    setShowSaved(true);
    setIsSaved(true);
  };

  const handleCopyClick = (contentToCopy) => {
    navigator.clipboard.writeText(contentToCopy)
      .then(() => alert('클립보드에 복사되었습니다!'))
      .catch(err => alert('복사 실패: ', err));
  };

  const handleShareClick = () => {
    if (navigator.share) {
      navigator.share({
        title: 'QT 나눔',
        text: savedContent,
      })
      .catch(err => console.log('공유 실패:', err));
    } else {
      handleCopyClick(savedContent);
      alert('공유 기능이 지원되지 않는 브라우저입니다. 내용이 클립보드에 복사되었습니다.');
    }
  };


  return (
    <>
      <button id="darkmode-toggle" onClick={() => setDarkMode(v => !v)} aria-label="다크 모드 토글">
        <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i>
      </button>
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout
              bibleRef={bibleRef} setBibleRef={setBibleRef}
              bibleText={bibleText} setBibleText={setBibleText}
              prayerText={prayerText} setPrayerText={setPrayerText}
              summaryText={summaryText} setSummaryText={setSummaryText}
              capturedText={capturedText} setCapturedText={setCapturedText}
              meditationText={meditationText} setMeditationText={setMeditationText}
              characterText={characterText} setCharacterText={setCharacterText}
              actionText={actionText} setActionText={setActionText}
              finalPrayer={finalPrayer} setFinalPrayer={setFinalPrayer}
              isLoading={isLoading} isSaved={isSaved}
              savedContent={savedContent} showSaved={showSaved}
              handleFetchClick={handleFetchClick}
              handleDailyDevotionalClick={handleDailyDevotionalClick}
              handleSaveClick={handleSaveClick}
              handleCopyClick={() => handleCopyClick(savedContent)}
              handleShareClick={handleShareClick}
            />
          }
        />
        <Route path="/board" element={<BoardList />} />
        <Route path="/board/write" element={<BoardWrite />} />
        <Route path="/board/:id" element={<BoardDetail />} />
        <Route path="/board/edit/:id" element={<BoardEdit />} />
      </Routes>
    </>
  );
}

export default App;
