// 1. 요소 선택
const fetchBtn = document.getElementById('fetch-btn');
const bibleRef = document.getElementById('bible-ref');
const bibleText = document.getElementById('bible-text');
const prayerText = document.getElementById('prayer-text');
const capturedText = document.getElementById('captured-text');
const meditationText = document.getElementById('meditation-text');
const characterText = document.getElementById('character-text');
const actionText = document.getElementById('action-text');
const finalPrayer = document.getElementById('final-prayer');
const saveBtn = document.getElementById('save-btn');
const savedContent = document.getElementById('saved-content');
const savedText = document.getElementById('saved-text');
const copyBtn = document.getElementById('copy-btn');
const darkModeToggle = document.getElementById('darkmode-toggle');
const loadingIndicator = document.getElementById('loading-indicator');

// 2. 성경 구절 파싱 함수 (개선된 버전)
function parseReference(reference) {
    reference = reference.trim();

    if (!reference.includes(':')) {
        throw new Error('구절 형식이 잘못되었습니다. 예: "로마서 1:1" 또는 "로마서 1:1-5"');
    }

    const [bookAndChapter, verse] = reference.split(':');
    const lastSpaceIndex = bookAndChapter.lastIndexOf(' ');

    if (lastSpaceIndex === -1) {
        throw new Error('책 이름과 장이 올바르게 입력되지 않았습니다. 예: "로마서 1:1"');
    }

    const book = bookAndChapter.substring(0, lastSpaceIndex).trim();
    const chapter = parseInt(bookAndChapter.substring(lastSpaceIndex + 1).trim(), 10);
    const verseNumber = parseInt(verse.trim(), 10);

    if (isNaN(chapter) || isNaN(verseNumber)) {
        throw new Error('장 또는 절 번호가 유효하지 않습니다. 예: "로마서 1:1"');
    }

    return { book, chapter, verse: verseNumber };
}

// 3. 성경 구절 가져오기 함수 (개선된 버전)
async function fetchBibleVersesFromFile(reference) {
    try {
        reference = reference.trim();
        if (!reference) throw new Error('검색할 구절을 입력해주세요.');

        const response = await fetch('bible_kor.json');
        if (!response.ok) throw new Error('성경 데이터를 불러오지 못했습니다.');
        const data = await response.json();

        const ranges = reference.split(',').map(r => r.trim());
        const results = [];

        for (const range of ranges) {
            if (range.includes('-')) {
                // 범위 검색 처리
                const [startRef, endRef] = range.split('-').map(r => r.trim());
                const start = parseReference(startRef);
                const end = parseReference(endRef);

                if (start.book !== end.book) {
                    throw new Error('범위 검색은 동일한 책 내에서만 가능합니다.');
                }

                for (let chapter = start.chapter; chapter <= end.chapter; chapter++) {
                    const startVerse = chapter === start.chapter ? start.verse : 1;
                    const endVerse = chapter === end.chapter ? end.verse : 999;

                    for (let verse = startVerse; verse <= endVerse; verse++) {
                        const key = `${start.book} ${chapter}:${verse}`;
                        if (data[key]) {
                            results.push(`📖 ${key}\n${data[key]}\n`);
                        }
                    }
                }
            } else {
                // 단일 구절 검색 처리
                const { book, chapter, verse } = parseReference(range);
                const key = `${book} ${chapter}:${verse}`;
                if (data[key]) {
                    results.push(`📖 ${key}\n${data[key]}\n`);
                } else {
                    throw new Error(`구절을 찾을 수 없습니다: ${range}`);
                }
            }
        }

        if (results.length === 0) {
            throw new Error('입력된 구절에서 아무 내용도 찾을 수 없습니다.');
        }

        return results.join('\n');
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// 4. 본문 가져오기 버튼 이벤트 (개선된 버전)
fetchBtn.addEventListener('click', async () => {
    if (!bibleRef.value) {
        alert('먼저 본문 말씀을 입력해주세요!');
        return;
    }

    try {
        // 로딩 시작
        fetchBtn.disabled = true;
        if (loadingIndicator) {
            loadingIndicator.style.display = 'inline-block';
            loadingIndicator.classList.add('loading');
        }

        const response = await fetchBibleVersesFromFile(bibleRef.value);
        bibleText.value = response;
    } catch (error) {
        alert(error.message);
        bibleText.value = `오류: ${error.message}`;
    } finally {
        // 로딩 종료
        fetchBtn.disabled = false;
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
            loadingIndicator.classList.remove('loading');
        }
    }
});

// 5. 다크 모드 토글
darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    darkModeToggle.textContent = isDark ? '☀️ 라이트 모드' : '🌙 다크 모드';
    localStorage.setItem('darkMode', isDark);
});

// 6. 페이지 로드 시 다크 모드 설정 불러오기
window.addEventListener('load', () => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    if (isDark) {
        document.body.classList.add('dark-mode');
        darkModeToggle.textContent = '☀️ 라이트 모드';
    }
    
    // 입력 필드 자동 포커스
    bibleRef.focus();
});

// 7. 저장하기 버튼 클릭 이벤트
saveBtn.addEventListener('click', () => {
    // 작성된 내용을 정리
    const content = `
📖 오늘의 본문: ${bibleRef.value}
${bibleText.value}

🙏 들어가는 기도:
${prayerText.value}

✍️ 붙잡은 말씀:
${capturedText.value}

💭 느낌과 묵상:
${meditationText.value}

✏️ 적용과 결단:
성품 변화: ${characterText.value}
행동 계획: ${actionText.value}

🙌 올려드리는 기도:
${finalPrayer.value}
    `;

    // 저장된 내용을 화면에 표시
    savedText.textContent = content;
    savedContent.style.display = 'block';
});

// 8. 복사하기 버튼 클릭 이벤트
copyBtn.addEventListener('click', () => {
    // 저장된 내용을 복사
    navigator.clipboard.writeText(savedText.textContent)
        .then(() => {
            alert('내용이 복사되었습니다!');
        })
        .catch(err => {
            console.error('복사 중 오류 발생:', err);
            alert('복사에 실패했습니다.');
        });
})// script.js에 추가
// URL 공유 기능
const shareBtn = document.getElementById('share-btn');
if (shareBtn) {
  shareBtn.addEventListener('click', () => {
    if (navigator.share) {
      navigator.share({
        title: '큐티 도우미',
        text: '매일 말씀을 통해 하나님과 교제하세요!',
        url: window.location.href
      });
    } else {
      alert('URL을 복사해서 공유해주세요: ' + window.location.href);
    }
  });
}
/ 대체 API 예시 (John 3:16 가져오기)
fetch("https://bible-api.com/john 3:16?translation=kjv")
  .then(response => response.json())
  .then(data => console.log(data.text));
