import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// Import components
import MainLayout from './components/MainLayout.jsx';
import BoardList from './components/BoardList.jsx';
import BoardWrite from './components/BoardWrite.jsx';
import BoardDetail from './components/BoardDetail.jsx';
import BoardEdit from './components/BoardEdit.jsx';

// Import API functions
import { fetchBibleVerses, fetchDailyDevotional } from './api.js';

function App() {
  // --- State Management ---
  // Input states
  const [bibleRef, setBibleRef] = useState('');
  const [bibleText, setBibleText] = useState('');
  const [prayerText, setPrayerText] = useState('');
  const [summaryText, setSummaryText] = useState('');
  const [capturedText, setCapturedText] = useState('');
  const [meditationText, setMeditationText] = useState('');
  const [characterText, setCharacterText] = useState('');
  const [actionText, setActionText] = useState('');
  const [finalPrayer, setFinalPrayer] = useState('');

  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Data states
  const [isSaved, setIsSaved] = useState(false);
  const [savedContent, setSavedContent] = useState('');
  const [showSaved, setShowSaved] = useState(false);

  // --- Effects ---
  // Effect for dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  // Effect to reset save status on input change
  useEffect(() => {
    setIsSaved(false);
  }, [bibleRef, bibleText, prayerText, summaryText, capturedText, meditationText, characterText, actionText, finalPrayer]);


  // --- Event Handlers ---
  const handleFetchClick = async () => {
    if (!bibleRef) {
      alert('먼저 본문 말씀을 입력해주세요!');
      return;
    }
    setIsLoading(true);
    setBibleText("성경 본문을 가져오는 중...");
    try {
      const response = await fetchBibleVerses(bibleRef);
      setBibleText(response);
    } catch (error) {
      const errorMessage = `오류: ${error.message}`;
      setBibleText(errorMessage);
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDailyDevotionalClick = async () => {
    setIsLoading(true);
    setBibleText("오늘의 본문을 가져오는 중...");
    try {
      const result = await fetchDailyDevotional();
      setBibleRef(result.reference);
      setBibleText(result.text);
    } catch (error) {
      const errorMessage = `오늘의 본문을 가져오는데 실패했습니다: ${error.message}`;
      setBibleText(errorMessage);
      alert(errorMessage);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveClick = () => {
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    const currentDate = now.toLocaleDateString('ko-KR', options);
    
    let applicationContent = "성품: " + characterText;
    if (actionText) {
        applicationContent += "\n행동: " + actionText;
    }

    const sections = [
        `📅 ${currentDate}`,
        bibleRef ? `📖 ${bibleRef}` : null,
        prayerText ? `🙏 들어가는 기도\n${prayerText}` : null,
        summaryText ? `📝 본문 요약\n${summaryText}` : null,
        capturedText ? `📖 붙잡은 말씀\n${capturedText}` : null,
        meditationText ? `💭 느낌과 묵상\n${meditationText}` : null,
        (characterText || actionText) ? `✍️ 적용과 결단\n${applicationContent}` : null,
        finalPrayer ? `🙌 올려드리는 기도\n${finalPrayer}` : null
    ];

    const formattedText = sections.filter(Boolean).join('\n\n');
    setSavedContent(formattedText);
    setShowSaved(true);
    setIsSaved(true);
    alert('큐티 내용이 저장되었습니다.');
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText(savedContent).then(() => {
        alert('텍스트가 클립보드에 복사되었습니다.');
    }).catch(err => {
        console.error('복사 실패:', err);
        alert('복사에 실패했습니다.');
    });
  };

  const handleShareClick = () => {
    if (!isSaved) {
        alert('먼저 저장하기 버튼을 눌러 큐티 내용을 저장해주세요.');
        return;
    }
    if (navigator.share) {
        navigator.share({
            title: '큐티 도우미 - 오늘의 묵상',
            text: savedContent
        }).catch(err => console.error('공유 실패:', err));
    } else {
        alert('이 브라우저에서는 공유하기 기능을 사용할 수 없습니다.');
    }
  };

  // --- JSX ---
  return (
    <BrowserRouter>
      {/* Navigation Bar */}
      <nav style={{ padding: '10px', background: '#f0f0f0', marginBottom: '20px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold' }}>큐티 도우미</Link>
        <Link to="/board" style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold' }}>게시판</Link>
      </nav>

      <Routes>
        <Route path="/" element={
          <MainLayout
            // State props
            bibleRef={bibleRef} setBibleRef={setBibleRef} bibleText={bibleText} setBibleText={setBibleText}
            prayerText={prayerText} setPrayerText={setPrayerText} summaryText={summaryText} setSummaryText={setSummaryText}
            capturedText={capturedText} setCapturedText={setCapturedText} meditationText={meditationText} setMeditationText={setMeditationText}
            characterText={characterText} setCharacterText={setCharacterText} actionText={actionText} setActionText={setActionText}
            finalPrayer={finalPrayer} setFinalPrayer={setFinalPrayer}
            isLoading={isLoading} isSaved={isSaved} savedContent={savedContent} showSaved={showSaved}
            // Handler props
            handleFetchClick={handleFetchClick} handleDailyDevotionalClick={handleDailyDevotionalClick}
            handleSaveClick={handleSaveClick} handleCopyClick={handleCopyClick} handleShareClick={handleShareClick}
          />
        } />
        <Route path="/board" element={<BoardList />} />
        <Route path="/board/write" element={<BoardWrite />} />
        <Route path="/board/:id" element={<BoardDetail />} />
        <Route path="/board/edit/:id" element={<BoardEdit />} />
      </Routes>

      {/* Dark mode button - remains here as it affects the body */}
      <button onClick={() => setIsDarkMode(!isDarkMode)} id="darkmode-toggle">
        <i className={isDarkMode ? 'fas fa-sun' : 'fas fa-moon'}></i>
      </button>
    </BrowserRouter>
  );
}

export default App;