import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout.jsx';
import BoardList from './components/BoardList.jsx';
import BoardWrite from './components/BoardWrite.jsx';
import BoardDetail from './components/BoardDetail.jsx';
import BoardEdit from './components/BoardEdit.jsx';
import { fetchBibleVerses, fetchDailyDevotional } from './api.js';
import './style.css';

const THEME_STORAGE_KEY = 'qt_helper_theme_preference';
const THEME_OPTIONS = ['auto', 'light', 'dark'];

function isNightTime(date = new Date()) {
  const hour = date.getHours();
  return hour >= 19 || hour < 6;
}

function getStoredThemePreference() {
  if (typeof window === 'undefined') return 'auto';

  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return THEME_OPTIONS.includes(stored) ? stored : 'auto';
  } catch {
    return 'auto';
  }
}

function resolveDarkMode(themePreference) {
  if (themePreference === 'dark') return true;
  if (themePreference === 'light') return false;
  return isNightTime();
}

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
  const [themePreference, setThemePreference] = useState(() => getStoredThemePreference());
  const [darkMode, setDarkMode] = useState(() => resolveDarkMode(getStoredThemePreference()));

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

  useEffect(() => {
    const nextDarkMode = resolveDarkMode(themePreference);
    setDarkMode(nextDarkMode);

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, themePreference);
    } catch {
      // Keep the app usable in browsers that block localStorage.
    }

    if (themePreference !== 'auto') return undefined;

    const timer = window.setInterval(() => {
      setDarkMode(resolveDarkMode('auto'));
    }, 60 * 1000);

    return () => window.clearInterval(timer);
  }, [themePreference]);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    document.body.dataset.themePreference = themePreference;
  }, [darkMode, themePreference]);

  const handleThemeToggle = () => {
    setThemePreference((current) => {
      const nextIndex = (THEME_OPTIONS.indexOf(current) + 1) % THEME_OPTIONS.length;
      return THEME_OPTIONS[nextIndex];
    });
  };

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
      <button
        id="darkmode-toggle"
        onClick={handleThemeToggle}
        aria-label="화면 밝기 모드 변경"
        title="자동, 낮, 밤 모드 전환"
      >
        <i className={`fas ${themePreference === 'auto' ? 'fa-clock' : darkMode ? 'fa-moon' : 'fa-sun'}`}></i>
        <span>
          {themePreference === 'auto' ? '자동' : darkMode ? '밤' : '낮'}
        </span>
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
