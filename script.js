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

// CORS 프록시 URL을 환경 변수로 관리 (보안 강화)
const PROXY_URL = 'https://api.allorigins.win/get?url=';

// 복수 구절 파싱 지원
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

    const verseParts = verse.split('-');
    const startVerse = parseInt(verseParts[0].trim(), 10);
    const endVerse = verseParts[1] ? parseInt(verseParts[1].trim(), 10) : startVerse;

    if (isNaN(chapter) || isNaN(startVerse) || (verseParts[1] && isNaN(endVerse))) {
        throw new Error('장 또는 절 번호가 유효하지 않습니다. 예: "로마서 1:1"');
    }

    return { book, chapter, startVerse, endVerse };
}

// 성경 구절 가져오기 함수 (API 버전으로 대체)
async function fetchBibleVerses(reference) {
    try {
        const parsedRef = parseReference(reference);
        const formattedRef = `${parsedRef.book}-${parsedRef.chapter}-${parsedRef.startVerse}`;
        const apiUrl = `https://m.ibibles.net/quote10.htm?kor/${formattedRef}`;
        const proxyUrl = `${PROXY_URL}${encodeURIComponent(apiUrl)}`;

        // 로딩 상태 표시
        bibleText.value = "성경 본문을 가져오는 중...";

        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error('API 요청 실패 (서버 응답 오류)');

        const data = await response.json();
        const html = data.contents;

        // HTML에서 본문 추출 (파싱)
        const extractText = (html) => {
            const startMarker = "<font size=-1>";
            const endMarker = "</font>";
            const startIdx = html.indexOf(startMarker);

            if (startIdx === -1) throw new Error("본문 형식이 변경되었습니다");

            const endIdx = html.indexOf(endMarker, startIdx + startMarker.length);
            return html.slice(startIdx + startMarker.length, endIdx).trim();
        };

        const text = extractText(html);
        if (!text) throw new Error("해당 구절을 찾을 수 없습니다");

        return `📖 ${reference}\n${text}\n`;

    } catch (error) {
        console.error('API Error:', error);

        // API 실패 시 대체 로직 (기존 JSON 파일 사용)
        try {
            const fallbackResult = await fetchBibleVersesFromFile(reference);
            return fallbackResult;
        } catch (fallbackError) {
            throw new Error(`본문 가져오기 실패: ${error.message} (대체 시도도 실패)`);
        }
    }
}

// 본문 가져오기 버튼 이벤트 수정
fetchBtn.addEventListener('click', async () => {
    if (!bibleRef.value) {
        alert('먼저 본문 말씀을 입력해주세요!');
        return;
    }

    try {
        fetchBtn.disabled = true;
        loadingIndicator.style.display = 'inline-block';

        // 변경된 부분: 새 API 함수 사용
        const response = await fetchBibleVerses(bibleRef.value);
        bibleText.value = response;

    } catch (error) {
        bibleText.value = `오류: ${error.message}`;
        alert(error.message);
    } finally {
        fetchBtn.disabled = false;
        loadingIndicator.style.display = 'none';
    }
});
