import React, { useMemo, useState } from 'react';
import { getReadingStats, newTestamentBooks, oldTestamentBooks } from '../readingPlan.js';
import { getBoardEditToken, saveBoardEditToken } from '../boardEditTokens.js';

const STORAGE_KEY = 'qt_helper_bible_reading_progress';
const PROFILE_KEY = 'qt_helper_bible_reading_profile';
const POST_IDS_KEY = 'qt_helper_bible_reading_post_ids';

function readProgress() {
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function writeProgress(progress) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Keep reading plan usable even if localStorage is blocked.
  }
}

function readProfile() {
  try {
    const today = new Date().toISOString().slice(0, 10);
    return {
      readerName: '',
      startDate: today,
      ...JSON.parse(window.localStorage.getItem(PROFILE_KEY) || '{}'),
    };
  } catch {
    return {
      readerName: '',
      startDate: new Date().toISOString().slice(0, 10),
    };
  }
}

function writeProfile(profile) {
  try {
    window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {
    // Keep the reading plan usable even if localStorage is blocked.
  }
}

function readPostIds() {
  try {
    return JSON.parse(window.localStorage.getItem(POST_IDS_KEY) || '{}');
  } catch {
    return {};
  }
}

function writePostIds(ids) {
  try {
    window.localStorage.setItem(POST_IDS_KEY, JSON.stringify(ids));
  } catch {
    // Keep local progress usable even if localStorage is blocked.
  }
}

function getStoredPostReference(value) {
  if (!value) return { id: '', editToken: '' };
  if (typeof value === 'string') return { id: value, editToken: getBoardEditToken(value) };
  return {
    id: value.id || value._id || '',
    editToken: value.editToken || getBoardEditToken(value.id || value._id),
  };
}

function percent(done, total) {
  return total ? Math.round((done / total) * 100) : 0;
}

function getScopeStats(progress, scope) {
  const books = scope === 'old' ? oldTestamentBooks : newTestamentBooks;
  const total = books.reduce((sum, [, , chapters]) => sum + chapters, 0);
  const done = books.reduce((sum, [book, , chapters]) => {
    const count = Array.from({ length: chapters }, (_, index) => progress[`${book}:${index + 1}`]).filter(Boolean).length;
    return sum + count;
  }, 0);
  return { done, total, rate: percent(done, total) };
}

function ReadingPlan({ uiLanguage = 'ko', onOpenPassage }) {
  const [scope, setScope] = useState('new');
  const [completed, setCompleted] = useState(() => readProgress());
  const [profile, setProfile] = useState(() => readProfile());
  const [syncState, setSyncState] = useState('');
  const [openingKey, setOpeningKey] = useState('');
  const books = scope === 'old' ? oldTestamentBooks : newTestamentBooks;
  const stats = useMemo(() => getReadingStats(completed), [completed]);
  const currentStats = useMemo(() => getScopeStats(completed, scope), [completed, scope]);
  const copy = {
    ko: {
      eyebrow: 'Bible Reading',
      title: '구약·신약 통독 체크',
      description: '읽은 장을 체크하며 통독 흐름을 이어갈 수 있습니다. 진행률은 이 브라우저에만 저장됩니다.',
      old: '구약',
      new: '신약',
      total: '전체',
      progress: '진행률',
      reset: '통독 기록 초기화',
      chapter: '장',
      readerName: '작성자 이름',
      readerPlaceholder: '예: 김이관',
      startDate: '시작일',
      boardSync: '통독 게시판 자동 업데이트',
      boardSyncHelp: '이름을 입력하면 장을 체크할 때마다 통독 완주 기록 게시판의 내 기록이 업데이트됩니다.',
      synced: '통독 게시판 기록이 업데이트되었습니다.',
      syncReady: '이름을 입력하면 게시판 업데이트가 켜집니다.',
      syncFailed: '게시판 업데이트에 실패했습니다. 통독 체크는 이 브라우저에 저장되었습니다.',
      openChapter: '본문 보기',
      openingChapter: '불러오는 중',
      markRead: '읽음 체크',
      unmarkRead: '체크 해제',
    },
    de: {
      eyebrow: 'Bibelleseplan',
      title: 'Altes und Neues Testament lesen',
      description: 'Markiere gelesene Kapitel und halte deinen Lesefortschritt fest. Der Stand bleibt nur in diesem Browser.',
      old: 'Altes Testament',
      new: 'Neues Testament',
      total: 'Gesamt',
      progress: 'Fortschritt',
      reset: 'Lesestand zurücksetzen',
      chapter: 'Kapitel',
      readerName: 'Name',
      readerPlaceholder: 'z. B. Kim',
      startDate: 'Startdatum',
      boardSync: 'Lesestand im Board aktualisieren',
      boardSyncHelp: 'Wenn ein Name eingetragen ist, wird dein Lesestand bei jedem Kapitel im Board aktualisiert.',
      synced: 'Der Lesestand wurde im Board aktualisiert.',
      syncReady: 'Trage einen Namen ein, um das Board-Update zu aktivieren.',
      syncFailed: 'Board-Update fehlgeschlagen. Der Lesestand bleibt in diesem Browser gespeichert.',
      openChapter: 'Text lesen',
      openingChapter: 'Lädt',
      markRead: 'Gelesen markieren',
      unmarkRead: 'Markierung lösen',
    },
  }[uiLanguage];

  function updateProfile(nextPatch) {
    const next = { ...profile, ...nextPatch };
    setProfile(next);
    writeProfile(next);
  }

  function buildCompletionPost(progress, selectedScope) {
    const readerName = profile.readerName.trim();
    const statsForScope = getScopeStats(progress, selectedScope);
    const testament = selectedScope === 'old' ? copy.old : copy.new;
    const today = new Date().toISOString().slice(0, 10);

    return {
      title: `[통독 기록] ${readerName} - ${testament} ${statsForScope.rate}%`,
      author: readerName,
      category: 'completion',
      content: [
        `작성자: ${readerName}`,
        `통독 범위: ${testament}`,
        `완주률: ${statsForScope.rate}%`,
        `진행: ${statsForScope.done}/${statsForScope.total}장`,
        `시작일: ${profile.startDate || today}`,
        `최근 업데이트: ${today}`,
        '',
        statsForScope.rate >= 100
          ? '통독 완주를 완료했습니다.'
          : '통독을 계속 진행 중입니다.',
      ].join('\n'),
    };
  }

  async function syncCompletionPost(progress, selectedScope) {
    const readerName = profile.readerName.trim();
    if (!readerName) {
      setSyncState(copy.syncReady);
      return;
    }

    const postIds = readPostIds();
    const key = `${readerName}:${selectedScope}`;
    const existing = getStoredPostReference(postIds[key]);
    const existingId = existing.id;
    const postBody = buildCompletionPost(progress, selectedScope);

    try {
      const response = await fetch(existingId ? `/api/posts?id=${encodeURIComponent(existingId)}` : '/api/posts', {
        method: existingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(existing.editToken ? { 'X-Edit-Token': existing.editToken } : {}),
        },
        body: JSON.stringify(postBody),
      });

      if (!response.ok) {
        throw new Error('sync failed');
      }

      const data = await response.json();
      const nextId = data._id || data.id || existingId;
      const nextEditToken = data.editToken || existing.editToken;
      saveBoardEditToken(nextId, nextEditToken);
      const nextIds = {
        ...postIds,
        [key]: {
          id: nextId,
          editToken: nextEditToken,
        },
      };
      writePostIds(nextIds);
      setSyncState(copy.synced);
    } catch {
      setSyncState(copy.syncFailed);
    }
  }

  function toggleChapter(book, chapter) {
    const key = `${book}:${chapter}`;
    const next = {
      ...completed,
      [key]: !completed[key],
    };
    if (!next[key]) delete next[key];
    setCompleted(next);
    writeProgress(next);
    syncCompletionPost(next, scope);
  }

  function resetProgress() {
    const next = {};
    setCompleted(next);
    writeProgress(next);
    syncCompletionPost(next, scope);
  }

  async function openPassage(book, chapter) {
    if (!onOpenPassage) return;
    const key = `${book}:${chapter}`;
    setOpeningKey(key);
    try {
      await onOpenPassage(book, chapter);
    } finally {
      setOpeningKey('');
    }
  }

  return (
    <section className="reading-plan card">
      <div className="section-heading">
        <span className="soft-icon"><i className="fas fa-route"></i></span>
        <div>
          <p className="eyebrow">{copy.eyebrow}</p>
          <h3>{copy.title}</h3>
        </div>
      </div>
      <p className="section-description">{copy.description}</p>

      <div className="reading-profile">
        <div>
          <label htmlFor="reader-name">{copy.readerName}</label>
          <input
            id="reader-name"
            value={profile.readerName}
            onChange={(event) => updateProfile({ readerName: event.target.value })}
            placeholder={copy.readerPlaceholder}
          />
        </div>
        <div>
          <label htmlFor="reading-start-date">{copy.startDate}</label>
          <input
            id="reading-start-date"
            type="date"
            value={profile.startDate}
            onChange={(event) => updateProfile({ startDate: event.target.value })}
          />
        </div>
        <div className="reading-sync-note">
          <strong>{copy.boardSync}</strong>
          <span>{copy.boardSyncHelp}</span>
          {syncState && <em>{syncState}</em>}
        </div>
      </div>

      <div className="reading-stats">
        <div>
          <strong>{percent(stats.oldDone, stats.oldTotal)}%</strong>
          <span>{copy.old}</span>
        </div>
        <div>
          <strong>{percent(stats.newDone, stats.newTotal)}%</strong>
          <span>{copy.new}</span>
        </div>
        <div>
          <strong>{percent(stats.done, stats.total)}%</strong>
          <span>{copy.total}</span>
        </div>
      </div>

      <div className="reading-tabs">
        <button className={scope === 'old' ? 'active' : ''} onClick={() => setScope('old')}>{copy.old}</button>
        <button className={scope === 'new' ? 'active' : ''} onClick={() => setScope('new')}>{copy.new}</button>
        <span className="active-reading-rate">{copy.progress}: {currentStats.rate}%</span>
        <button className="reset-reading" onClick={resetProgress}>{copy.reset}</button>
      </div>

      <div className="book-grid">
        {books.map(([bookKo, bookEn, chapters]) => {
          const done = Array.from({ length: chapters }, (_, index) => completed[`${bookKo}:${index + 1}`]).filter(Boolean).length;
          return (
            <article className="book-card" key={bookKo}>
              <div className="book-title">
                <strong>{uiLanguage === 'de' ? bookEn : bookKo}</strong>
                <span>{done}/{chapters}</span>
              </div>
              <div className="chapter-grid">
                {Array.from({ length: chapters }, (_, index) => {
                  const chapter = index + 1;
                  const key = `${bookKo}:${chapter}`;
                  const checked = Boolean(completed[key]);
                  const opening = openingKey === key;
                  return (
                    <div className={`chapter-actions ${checked ? 'checked' : ''}`} key={chapter}>
                      <button
                        type="button"
                        className="open-chapter"
                        onClick={() => openPassage(bookKo, chapter)}
                        aria-label={`${bookKo} ${chapter}${copy.chapter} ${copy.openChapter}`}
                      >
                        <strong>{chapter}</strong>
                        <span>{opening ? copy.openingChapter : copy.openChapter}</span>
                      </button>
                      <button
                        type="button"
                        className="toggle-read"
                        onClick={() => toggleChapter(bookKo, chapter)}
                        aria-label={`${bookKo} ${chapter}${copy.chapter} ${checked ? copy.unmarkRead : copy.markRead}`}
                        title={checked ? copy.unmarkRead : copy.markRead}
                      >
                        <i className={`fas ${checked ? 'fa-check' : 'fa-plus'}`}></i>
                      </button>
                    </div>
                  );
                })}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default ReadingPlan;
