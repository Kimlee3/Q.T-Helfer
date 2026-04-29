import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout.jsx';
import BoardList from './components/BoardList.jsx';
import BoardWrite from './components/BoardWrite.jsx';
import BoardDetail from './components/BoardDetail.jsx';
import BoardEdit from './components/BoardEdit.jsx';
import { fetchBibleChapter, fetchBibleVerses, fetchDailyDevotional, fetchGermanBibleChapter, fetchGermanBibleVerses } from './api.js';
import './style.css';

const THEME_STORAGE_KEY = 'qt_helper_theme_preference';
const LANGUAGE_STORAGE_KEY = 'qt_helper_language';
const THEME_OPTIONS = ['auto', 'light', 'dark'];
const LANGUAGE_OPTIONS = ['ko', 'de'];

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

function getStoredLanguage() {
  if (typeof window === 'undefined') return 'ko';

  try {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return LANGUAGE_OPTIONS.includes(stored) ? stored : 'ko';
  } catch {
    return 'ko';
  }
}

function resolveDarkMode(themePreference) {
  if (themePreference === 'dark') return true;
  if (themePreference === 'light') return false;
  return isNightTime();
}

function formatKoreanDateTitle(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}년 ${month}월 ${day}일 말씀 묵상`;
}

function App() {
  const [bibleRef, setBibleRef] = useState('');
  const [bibleText, setBibleText] = useState('');
  const [germanBibleText, setGermanBibleText] = useState('');
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
  const [uiLanguage, setUiLanguage] = useState(() => getStoredLanguage());

  const handleFetchClick = async () => {
    if (!bibleRef) {
      setBibleText('성경 구절을 입력해주세요. (예: 로마서 8:28)');
      return;
    }
    setIsLoading(true);
    setBibleText('');
    setGermanBibleText('');
    try {
      const [verses, germanVerses] = await Promise.allSettled([
        fetchBibleVerses(bibleRef),
        fetchGermanBibleVerses(bibleRef),
      ]);

      if (verses.status === 'fulfilled') {
        setBibleText(verses.value);
      } else {
        throw verses.reason;
      }

      setGermanBibleText(
        germanVerses.status === 'fulfilled'
          ? germanVerses.value
          : `독일어 본문을 불러오지 못했습니다: ${germanVerses.reason.message}`
      );
    } catch (error) {
      setBibleText(`오류: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDailyDevotionalClick = async () => {
    setIsLoading(true);
    setBibleText('');
    setGermanBibleText('');
    try {
      const data = await fetchDailyDevotional();
      setBibleRef(data.reference);
      setBibleText(data.text);
      try {
        const germanVerses = await fetchGermanBibleVerses(data.reference);
        setGermanBibleText(germanVerses);
      } catch (germanError) {
        setGermanBibleText(`독일어 본문을 불러오지 못했습니다: ${germanError.message}`);
      }
    } catch (error) {
      setBibleText(`오늘의 묵상 본문을 가져오는 데 실패했습니다: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenReadingPassage = async (bookKorean, chapter) => {
    const nextReference = `${bookKorean} ${chapter}장`;
    setIsLoading(true);
    setBibleRef(nextReference);
    setBibleText('');
    setGermanBibleText('');

    try {
      const [verses, germanVerses] = await Promise.allSettled([
        fetchBibleChapter(bookKorean, chapter),
        fetchGermanBibleChapter(bookKorean, chapter),
      ]);

      if (verses.status === 'fulfilled') {
        setBibleText(verses.value);
      } else {
        throw verses.reason;
      }

      setGermanBibleText(
        germanVerses.status === 'fulfilled'
          ? germanVerses.value
          : `독일어 본문을 불러오지 못했습니다: ${germanVerses.reason.message}`
      );

      window.requestAnimationFrame(() => {
        document.querySelector('.scripture-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    } catch (error) {
      setBibleText(`본문을 가져오지 못했습니다: ${error.message}`);
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

  useEffect(() => {
    document.documentElement.lang = uiLanguage === 'de' ? 'de' : 'ko';
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, uiLanguage);
    } catch {
      // Keep the app usable in browsers that block localStorage.
    }
  }, [uiLanguage]);

  const handleThemeToggle = () => {
    setThemePreference((current) => {
      const nextIndex = (THEME_OPTIONS.indexOf(current) + 1) % THEME_OPTIONS.length;
      return THEME_OPTIONS[nextIndex];
    });
  };

  const handleSaveClick = () => {
    const dateTitle = formatKoreanDateTitle();
    const content = `
${dateTitle}

🙏 들어가는 기도
${prayerText}

📝 본문 요약
${summaryText}

💡 붙잡은 말씀
${capturedText}

✨ 느낌과 묵상
${meditationText}

🛤 적용과 결단
- 성품: ${characterText}
- 행동: ${actionText}

🙌 올려드리는 기도
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
              germanBibleText={germanBibleText}
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
              uiLanguage={uiLanguage}
              setUiLanguage={setUiLanguage}
              handleOpenReadingPassage={handleOpenReadingPassage}
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
