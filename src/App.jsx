import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import MainLayout from './components/MainLayout.jsx';
import BoardList from './components/BoardList.jsx';
import BoardDetail from './components/BoardDetail.jsx';
import BoardWrite from './components/BoardWrite.jsx';
import BoardEdit from './components/BoardEdit.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { fetchBibleVerses, fetchDailyDevotional } from './api.js';

const STORAGE_KEYS = {
  savedContent: 'qt-helper:saved-content',
  qtState: 'qt-helper:form-state'
};

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
  const [savedContent, setSavedContent] = useState('');
  const [showSaved, setShowSaved] = useState(false);
  const [saveBannerVisible, setSaveBannerVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const storedContent = window.localStorage.getItem(STORAGE_KEYS.savedContent);
      if (storedContent) {
        setSavedContent(storedContent);
        setShowSaved(true);
      }

      const storedState = window.localStorage.getItem(STORAGE_KEYS.qtState);
      if (storedState) {
        const parsed = JSON.parse(storedState);
        setBibleRef(parsed.bibleRef || '');
        setBibleText(parsed.bibleText || '');
        setPrayerText(parsed.prayerText || '');
        setSummaryText(parsed.summaryText || '');
        setCapturedText(parsed.capturedText || '');
        setMeditationText(parsed.meditationText || '');
        setCharacterText(parsed.characterText || '');
        setActionText(parsed.actionText || '');
        setFinalPrayer(parsed.finalPrayer || '');
      }
    } catch (error) {
      console.warn('큐티 작성 상태를 불러오지 못했습니다.', error);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const payload = JSON.stringify({
      bibleRef,
      bibleText,
      prayerText,
      summaryText,
      capturedText,
      meditationText,
      characterText,
      actionText,
      finalPrayer
    });

    try {
      window.localStorage.setItem(STORAGE_KEYS.qtState, payload);
    } catch (error) {
      console.warn('큐티 작성 상태를 저장하지 못했습니다.', error);
    }
  }, [
    bibleRef,
    bibleText,
    prayerText,
    summaryText,
    capturedText,
    meditationText,
    characterText,
    actionText,
    finalPrayer
  ]);

  useEffect(() => {
    if (typeof window === 'undefined' || !savedContent) {
      return;
    }

    try {
      window.localStorage.setItem(STORAGE_KEYS.savedContent, savedContent);
    } catch (error) {
      console.warn('저장된 큐티 내용을 보관하지 못했습니다.', error);
    }
  }, [savedContent]);

  const assembledContent = useMemo(() => {
    const bodySections = [
      prayerText && `🙏 들어가는 기도\n${prayerText}`,
      summaryText && `📝 본문 요약\n${summaryText}`,
      capturedText && `💡 붙잡은 말씀\n${capturedText}`,
      meditationText && `✨ 느낌과 묵상\n${meditationText}`,
      (characterText || actionText) &&
        `🛤 적용과 결단\n- 성품: ${characterText || '작성되지 않음'}\n- 행동: ${actionText || '작성되지 않음'}`,
      finalPrayer && `🙌 올려드리는 기도\n${finalPrayer}`
    ].filter(Boolean);

    if (bodySections.length === 0) {
      return '';
    }

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const header = `${year}년 ${month}월 ${day}일 말씀 묵상`;

    return [header, ...bodySections].join('\n\n').trim();
  }, [
    actionText,
    capturedText,
    characterText,
    finalPrayer,
    meditationText,
    prayerText,
    summaryText
  ]);

  const handleFetchClick = useCallback(async () => {
    if (!bibleRef.trim()) {
      window.alert('성경 구절을 입력해주세요. 예: 로마서 8:28');
      return;
    }

    setIsLoading(true);
    try {
      const text = await fetchBibleVerses(bibleRef.trim());
      setBibleText(text);
      setShowSaved(false);
    } catch (error) {
      console.error('본문을 불러오지 못했습니다:', error);
      window.alert(error.message || '본문을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [bibleRef]);

  const handleDailyDevotionalClick = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchDailyDevotional();
      if (data?.reference) {
        setBibleRef(data.reference);
      }
      setBibleText(data?.text || '오늘의 본문을 불러오지 못했습니다.');
      setShowSaved(false);
    } catch (error) {
      console.error('오늘의 본문을 불러오지 못했습니다:', error);
      window.alert(error.message || '오늘의 본문을 가져오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSaveClick = useCallback(() => {
    if (!assembledContent) {
      window.alert('저장할 내용이 없습니다. 먼저 내용을 작성해주세요.');
      return;
    }

    setSavedContent(assembledContent);
    setShowSaved(true);
    setSaveBannerVisible(true);
    window.setTimeout(() => setSaveBannerVisible(false), 2000);
  }, [assembledContent]);

  const handleCopyClick = useCallback(async () => {
    const content = savedContent || assembledContent;
    if (!content) {
      window.alert('복사할 내용이 없습니다.');
      return;
    }

    try {
      await navigator.clipboard.writeText(content);
      window.alert('클립보드에 복사되었습니다.');
    } catch (error) {
      console.error('클립보드 복사에 실패했습니다:', error);
      window.alert('복사에 실패했습니다. 다시 시도해주세요.');
    }
  }, [assembledContent, savedContent]);

  const handleShareClick = useCallback(async () => {
    const content = savedContent || assembledContent;
    if (!content) {
      window.alert('공유할 내용이 없습니다.');
      return;
    }

    if (navigator.share) {
      try {
        await navigator.share({ text: content, title: '오늘의 큐티 나눔' });
      } catch (error) {
        if (error?.name !== 'AbortError') {
          window.alert('공유에 실패했습니다.');
        }
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(content);
      window.alert('이 기기에서는 공유를 지원하지 않아 복사했습니다. 붙여넣기로 나눠보세요.');
    } catch (error) {
      window.alert('공유할 수 없어 복사도 실패했습니다. 다시 시도해주세요.');
    }
  }, [assembledContent, savedContent]);

  return (
    <BrowserRouter>
      <div className="app-shell">
        <nav className="global-nav">
          <div className="nav-brand">
            <Link to="/">Q.T 헬퍼</Link>
          </div>
          <div className="nav-links">
            <Link to="/">묵상 작성</Link>
            <Link to="/board">게시판</Link>
            <Link to="/board/write">새 글 쓰기</Link>
          </div>
        </nav>

        {saveBannerVisible && (
          <div className="save-banner">저장되었습니다. 저장된 내용을 아래에서 확인할 수 있어요.</div>
        )}

        <main className="app-content">
          <Routes>
            <Route
              path="/"
              element={(
                <MainLayout
                  bibleRef={bibleRef}
                  setBibleRef={setBibleRef}
                  bibleText={bibleText}
                  setBibleText={setBibleText}
                  prayerText={prayerText}
                  setPrayerText={setPrayerText}
                  summaryText={summaryText}
                  setSummaryText={setSummaryText}
                  capturedText={capturedText}
                  setCapturedText={setCapturedText}
                  meditationText={meditationText}
                  setMeditationText={setMeditationText}
                  characterText={characterText}
                  setCharacterText={setCharacterText}
                  actionText={actionText}
                  setActionText={setActionText}
                  finalPrayer={finalPrayer}
                  setFinalPrayer={setFinalPrayer}
                  isLoading={isLoading}
                  isSaved={Boolean(savedContent)}
                  savedContent={savedContent}
                  showSaved={showSaved}
                  handleFetchClick={handleFetchClick}
                  handleDailyDevotionalClick={handleDailyDevotionalClick}
                  handleSaveClick={handleSaveClick}
                  handleCopyClick={handleCopyClick}
                  handleShareClick={handleShareClick}
                />
              )}
            />
            <Route
              path="/board"
              element={
                <ErrorBoundary>
                  <BoardList />
                </ErrorBoundary>
              }
            />
            <Route
              path="/board/write"
              element={
                <ErrorBoundary>
                  <BoardWrite />
                </ErrorBoundary>
              }
            />
            <Route
              path="/board/edit/:id"
              element={
                <ErrorBoundary>
                  <BoardEdit />
                </ErrorBoundary>
              }
            />
            <Route
              path="/board/:id"
              element={
                <ErrorBoundary>
                  <BoardDetail />
                </ErrorBoundary>
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
