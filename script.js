// 모던 스타일의 큐티 도우미 자바스크립트
document.addEventListener("DOMContentLoaded", function() {
    // 주요 요소 선택
    const fetchBtn = document.getElementById('fetch-btn');
    const bibleRef = document.getElementById('bible-ref');
    const bibleText = document.getElementById('bible-text');
    const saveBtn = document.getElementById('save-btn');
    const shareBtn = document.getElementById('share-btn');
    const copyBtn = document.getElementById('copy-btn');
    const darkModeToggle = document.getElementById('darkmode-toggle');
    const loadingIndicator = document.getElementById('loading-indicator');
    const recentSearches = document.getElementById('recent-searches');
    const dailyDevotionalBtn = document.getElementById('daily-devotional-btn');
    
    // 다크 모드 설정 불러오기
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    // 카드 효과: 호버 시 살짝 들어올리기
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
    
    // 모든 텍스트 영역에 자동 크기 조절 기능 추가
    const allTextareas = document.querySelectorAll('textarea');
    allTextareas.forEach(textarea => {
        textarea.addEventListener('input', autoResizeTextarea);
    });
    
    function autoResizeTextarea() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    }
    
    // 버튼 리플 효과
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', createRipple);
    });
    
    function createRipple(event) {
        const button = event.currentTarget;
        
        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;
        
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
        circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
        circle.classList.add('ripple');
        
        // 이미 있는 리플은 제거
        const ripple = button.querySelector('.ripple');
        if (ripple) {
            ripple.remove();
        }
        
        button.appendChild(circle);
    }
    
    // 다크 모드 토글
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        darkModeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem('darkMode', isDarkMode);
    });
    
    // 최근 검색어 저장 및 불러오기
    function saveRecentSearch(search) {
        let searches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
        // 중복 제거
        searches = searches.filter(item => item !== search);
        // 맨 앞에 추가
        searches.unshift(search);
        // 최대 5개만 저장
        if (searches.length > 5) {
            searches.pop();
        }
        localStorage.setItem('recentSearches', JSON.stringify(searches));
        updateRecentSearchesDropdown(searches);
    }
    
    function updateRecentSearchesDropdown(searches) {
        recentSearches.innerHTML = '';
        searches.forEach(search => {
            const option = document.createElement('option');
            option.value = search;
            recentSearches.appendChild(option);
        });
    }
    
    // 저장된 검색어 불러오기
    const savedSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    updateRecentSearchesDropdown(savedSearches);
    
    // 검색 결과 표시 애니메이션
    function showSearchResult(text) {
        bibleText.style.opacity = 0;
        setTimeout(() => {
            bibleText.value = text;
            bibleText.style.opacity = 1;
        }, 300);
    }
    
    // 폼 제출
    const form = document.querySelector('.search-controls');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        fetchBtn.click();
    });

    // CORS 프록시 URL
    const PROXY_URL = 'https://api.allorigins.win/get?url=';

    // 성경 구절 파싱
    function parseReference(reference) {
        const bookMapping = {
            "창세기": "gen", "출애굽기": "exo", "레위기": "lev", "민수기": "num", "신명기": "deu",
            "여호수아": "jos", "사사기": "jdg", "룻기": "rut", "사무엘상": "1sa", "사무엘하": "2sa",
            "열왕기상": "1ki", "열왕기하": "2ki", "역대상": "1ch", "역대하": "2ch", "에스라": "ezr",
            "느헤미야": "neh", "에스더": "est", "욥기": "job", "시편": "psa", "잠언": "pro",
            "전도서": "ecc", "아가": "sng", "이사야": "isa", "예레미야": "jer", "예레미야애가": "lam",
            "에스겔": "ezk", "다니엘": "dan", "호세아": "hos", "요엘": "jol", "아모스": "amo",
            "오바댜": "oba", "요나": "jon", "미가": "mic", "나훔": "nam", "하박국": "hab",
            "스바냐": "zep", "학개": "hag", "스가랴": "zec", "말라기": "mal", "마태복음": "mat",
            "마가복음": "mrk", "누가복음": "luk", "요한복음": "jhn", "사도행전": "act", "로마서": "rom",
            "고린도전서": "1co", "고린도후서": "2co", "갈라디아서": "gal", "에베소서": "eph", "빌립보서": "php",
            "골로새서": "col", "데살로니가전서": "1th", "데살로니가후서": "2th", "디모데전서": "1ti", "디모데후서": "2ti",
            "디도서": "tit", "빌레몬서": "phm", "히브리서": "heb", "야고보서": "jas", "베드로전서": "1pe",
            "베드로후서": "2pe", "요한일서": "1jn", "요한이서": "2jn", "요한삼서": "3jn", "유다서": "jud",
            "요한계시록": "rev"
        };

        reference = reference.trim();

        if (!reference.includes(':')) {
            throw new Error('구절 형식이 잘못되었습니다. 예: "로마서 1:1" 또는 "로마서 1:1-5"');
        }

        const [bookAndChapter, verse] = reference.split(':');
        const lastSpaceIndex = bookAndChapter.lastIndexOf(' ');

        if (lastSpaceIndex === -1) {
            throw new Error('책 이름과 장이 올바르게 입력되지 않았습니다. 예: "로마서 1:1"');
        }

        const bookKorean = bookAndChapter.substring(0, lastSpaceIndex).trim();
        const book = bookMapping[bookKorean];
        if (!book) throw new Error(`"${bookKorean}"는 지원되지 않는 책 이름입니다.`);

        const chapter = parseInt(bookAndChapter.substring(lastSpaceIndex + 1).trim(), 10);

        const verseParts = verse.split('-');
        const startVerse = parseInt(verseParts[0].trim(), 10);
        const endVerse = verseParts[1] ? parseInt(verseParts[1].trim(), 10) : startVerse;

        if (isNaN(chapter) || isNaN(startVerse) || (verseParts[1] && isNaN(endVerse))) {
            throw new Error('장 또는 절 번호가 유효하지 않습니다. 예: "로마서 1:1"');
        }

        return { book, chapter, startVerse, endVerse };
    }

    // 성경 구절 가져오기
    async function fetchBibleVerses(reference) {
        try {
            const parsedRef = parseReference(reference);
            const formattedRef = `${parsedRef.book}/${parsedRef.chapter}:${parsedRef.startVerse}-${parsedRef.endVerse}`;
            const apiUrl = `http://ibibles.net/quote.php?kor-${formattedRef}`;
            const proxyUrl = `${PROXY_URL}${encodeURIComponent(apiUrl)}`;

            // 로딩 상태 표시
            bibleText.value = "말씀을 가져오는 중...";
            loadingIndicator.style.display = 'inline-block';

            const response = await fetch(proxyUrl);
            if (!response.ok) throw new Error('API 요청 실패 (서버 응답 오류)');

            const data = await response.json();
            const html = data.contents;

            // HTML에서 본문 추출
            const extractText = (html) => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, "text/html");
                const contentElement = doc.querySelector("body");
                if (!contentElement) throw new Error("본문을 찾을 수 없습니다");
                return contentElement.textContent.trim();
            };

            const text = extractText(html);
            if (!text) throw new Error("해당 구절을 찾을 수 없습니다");

            // 검색어 저장
            saveRecentSearch(reference);

            // 결과 표시
            return `📖 ${reference}\n\n${text}\n`;

        } catch (error) {
            console.error('API Error:', error);
            return `오류: ${error.message}`;
        } finally {
            loadingIndicator.style.display = 'none';
        }
    }

    // 본문 가져오기 버튼 이벤트
    fetchBtn.addEventListener('click', async () => {
        if (!bibleRef.value) {
            showNotification('먼저 본문 말씀을 입력해주세요!', 'warning');
            bibleRef.focus();
            return;
        }

        try {
            fetchBtn.disabled = true;
            const response = await fetchBibleVerses(bibleRef.value);
            showSearchResult(response);
        } catch (error) {
            showNotification(error.message, 'error');
        } finally {
            fetchBtn.disabled = false;
        }
    });

    // 알림 표시 함수
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // 나타나는 애니메이션
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // 자동 사라짐
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // 저장 버튼 이벤트
    saveBtn.addEventListener("click", () => {
        const savedContent = document.getElementById('saved-content');
        const savedText = document.getElementById('saved-text');
        const date = new Date().toLocaleDateString('ko-KR', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
        });
        
       // QT 내용 수집
const currentDate = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
const qtData = {
    "날짜": currentDate,
    // "본문" 항목 제거함
    "들어가는 기도": document.getElementById('prayer-text').value.trim(),
    "본문 요약": document.getElementById('summary-text')?.value.trim(),
    "붙잡은 말씀": document.getElementById('captured-text').value.trim(),
    "느낌과 묵상": document.getElementById('meditation-text').value.trim(),
    "적용과 결단 - 성품": document.getElementById('character-text').value.trim(),
    "적용과 결단 - 행동": document.getElementById('action-text').value.trim(),
    "올려드리는 기도": document.getElementById('final-prayer').value.trim()
};
        
        // 사용자 친화적 형식으로 표시
        let formattedContent = `# 큐티 기록: ${date}\n\n`;
        
        for (const [title, content] of Object.entries(qtData)) {
            if (content) {
                formattedContent += `## ${title}\n${content}\n\n`;
            }
        }
        
        savedText.textContent = formattedContent;
        savedContent.style.display = "block";
        
        // 자동 스크롤
        savedContent.scrollIntoView({ behavior: 'smooth' });
        showNotification('큐티 내용이 저장되었습니다.', 'success');
        
        // 로컬 스토리지에 저장
        try {
            localStorage.setItem('saved_qt_' + Date.now(), JSON.stringify(qtData));
        } catch (e) {
            console.error("저장 실패:", e);
        }
    });
    
    // 복사 버튼 이벤트
    copyBtn.addEventListener('click', () => {
        const textToCopy = savedText.textContent;
        navigator.clipboard.writeText(textToCopy).then(() => {
            showNotification('내용이 클립보드에 복사되었습니다.', 'success');
        }).catch(err => {
            console.error('복사 실패:', err);
            showNotification('복사에 실패했습니다.', 'error');
        });
    });
    
    // 공유하기 버튼 이벤트
    shareBtn.addEventListener('click', () => {
        if (navigator.share) {
            navigator.share({
                title: '큐티 도우미 - 오늘의 묵상',
                text: savedText.textContent || '큐티 도우미로 작성한 오늘의 말씀 묵상',
                url: window.location.href
            }).then(() => {
                showNotification('공유되었습니다.', 'success');
            }).catch(err => {
                console.error('공유 실패:', err);
                showNotification('공유에 실패했습니다.', 'error');
            });
        } else {
            showNotification('이 브라우저에서는 공유 기능을 지원하지 않습니다.', 'warning');
        }
    });
    
    // 페이지 로드 시 CSS 애니메이션 적용 (카드 순차적으로 나타나기)
    setTimeout(() => {
        document.querySelectorAll('.card').forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
        });
    }, 100);
    
    // 대체 프록시 URL 사용
    const CORS_PROXY_URL = 'https://corsproxy.io/?';

    // 오늘의 본문 말씀 가져오기 함수
    async function fetchDailyDevotional() {
        try {
            loadingIndicator.style.display = 'inline-block';
            dailyDevotionalBtn.disabled = true;
            
            // bible.asher.design에서 오늘의 본문 가져오기
            const asherBibleUrl = 'https://bible.asher.design/quiettime.php';
            const proxyUrl = `${CORS_PROXY_URL}${encodeURIComponent(asherBibleUrl)}`;
            
            console.log("요청 URL:", proxyUrl); // 디버깅용
            
            const response = await fetch(proxyUrl);
            if (!response.ok) throw new Error('API 요청 실패 (상태 코드: ' + response.status + ')');
            
            const text = await response.text();
            
            // HTML 파싱
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            
            console.log("파싱된 문서:", doc); // 디버깅용
            
            // 더 유연한 선택자로 검색 (실제 사이트 구조 파악 후 수정 필요)
            const bibleReference = doc.querySelector('h1, h2, h3, .title, .reference') || 
                                 doc.querySelector('div[class*="title"], div[class*="reference"]');
            
            const scriptureText = doc.querySelector('div[class*="content"], div[class*="scripture"], div[class*="bible"], p');
            
            // 디버깅 정보
            console.log("참조:", bibleReference?.textContent);
            console.log("본문:", scriptureText?.textContent);
            
            if (!scriptureText || !scriptureText.textContent || scriptureText.textContent.trim() === '') {
                // 대체 방법: 전체 HTML 내용에서 의미 있는 텍스트 추출
                const bodyText = doc.body.textContent.trim();
                if (bodyText) {
                    // 간단한 본문 가져오기
                    bibleText.value = `📖 오늘의 묵상 말씀\n${bodyText}\n`;
                    return true;
                }
                throw new Error('말씀 본문을 찾을 수 없습니다');
            }
            
            // 검색창에 참조 표시 및 본문 표시
            const refText = bibleReference ? bibleReference.textContent.trim() : '오늘의 말씀';
            bibleRef.value = refText;
            bibleText.value = `📖 ${refText}\n${scriptureText.textContent.trim()}\n`;
            
            return true;
        } catch (error) {
            console.error('오늘의 본문 가져오기 실패:', error);
            bibleText.value = `오늘의 본문을 가져오는데 실패했습니다: ${error.message}`;
            return false;
        } finally {
            loadingIndicator.style.display = 'none';
            dailyDevotionalBtn.disabled = false;
        }
    }

    // 검색 기록에 추가하는 함수
    function addToRecentSearches(reference) {
        let searches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
        if (!searches.includes(reference)) {
            searches.unshift(reference);
            if (searches.length > 5) searches.pop(); // 최대 5개 유지
            localStorage.setItem('recentSearches', JSON.stringify(searches));
            updateRecentSearchesDropdown(searches);
        }
    }

    // 오늘의 본문 버튼 이벤트 리스너
    dailyDevotionalBtn.addEventListener('click', async () => {
        try {
            await fetchDailyDevotional();
        } catch (error) {
            alert('오늘의 본문을 가져오는데 실패했습니다. 다시 시도해주세요.');
            console.error(error);
        }
    });
});

// CSS 클래스 추가
document.head.insertAdjacentHTML('beforeend', `
<style>
/* 알림 스타일 */
.notification {
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 12px 20px;
    border-radius: 8px;
    background-color: #333;
    color: white;
    box-shadow: 0 3px 10px rgba(0,0,0,0.2);
    transform: translateY(100px);
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    z-index: 1000;
}

.notification.show {
    transform: translateY(0);
    opacity: 1;
}

.notification.success {
    background-color: #4CAF50;
}

.notification.error {
    background-color: #F44336;
}

.notification.warning {
    background-color: #FF9800;
}

/* 리플 효과 */
button {
    position: relative;
    overflow: hidden;
}

.ripple {
    position: absolute;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.4);
    transform: scale(0);
    animation: ripple-effect 0.6s linear;
    pointer-events: none;
}

.dark-mode .ripple {
    background-color: rgba(255, 255, 255, 0.2);
}

@keyframes ripple-effect {
    to {
        transform: scale(4);
        opacity: 0;
    }
}
</style>
`);
