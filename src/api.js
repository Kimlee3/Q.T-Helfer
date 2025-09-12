const PROXY_URL = 'https://api.allorigins.win/get?url=';

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
        "고린도전서": "1co", "고린도후서": "2co", "갈라디아서": "gal", "에베소서": "eph",
        "빌립보서": "php", "골로새서": "col", "데살로니가전서": "1th", "데살로니가후서": "2th",
        "디모데전서": "1ti", "디모데후서": "2ti", "디도서": "tit", "빌레몬서": "phm",
        "히브리서": "heb", "야고보서": "jas", "베드로전서": "1pe", "베드로후서": "2pe",
        "요한일서": "1jn", "요한이서": "2jn", "요한삼서": "3jn", "유다서": "jud", "요한계시록": "rev"
    };
    reference = reference.trim();
    if (!reference.includes(':')) throw new Error('구절 형식이 잘못되었습니다. 예: "로마서 1:1" 또는 "로마서 1:1-5"');
    const [bookAndChapter, verse] = reference.split(':');
    const lastSpaceIndex = bookAndChapter.lastIndexOf(' ');
    if (lastSpaceIndex === -1) throw new Error('책 이름과 장이 올바르게 입력되지 않았습니다. 예: "로마서 1:1"');
    const bookKorean = bookAndChapter.substring(0, lastSpaceIndex).trim();
    const book = bookMapping[bookKorean];
    if (!book) throw new Error(`"${bookKorean}"는 지원되지 않는 책 이름입니다.`);
    const chapter = parseInt(bookAndChapter.substring(lastSpaceIndex + 1).trim(), 10);
    const verseParts = verse.split('-');
    const startVerse = parseInt(verseParts[0].trim(), 10);
    const endVerse = verseParts[1] ? parseInt(verseParts[1].trim(), 10) : startVerse;
    if (isNaN(chapter) || isNaN(startVerse) || (verseParts[1] && isNaN(endVerse))) throw new Error('장 또는 절 번호가 유효하지 않습니다. 예: "로마서 1:1"');
    return { book, chapter, startVerse, endVerse };
}

export async function fetchBibleVerses(reference) {
    const parsedRef = parseReference(reference);
    const formattedRef = `${parsedRef.book}/${parsedRef.chapter}:${parsedRef.startVerse}-${parsedRef.endVerse}`;
    const apiUrl = `http://ibibles.net/quote.php?kor-${formattedRef}`;
    const proxyUrl = `${PROXY_URL}${encodeURIComponent(apiUrl)}`;

    const response = await fetch(proxyUrl);
    if (!response.ok) throw new Error('API 요청 실패 (서버 응답 오류)');

    const data = await response.json();
    const html = data.contents;

    const extractText = (html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const contentElement = doc.querySelector("body");
        if (!contentElement) throw new Error("본문을 찾을 수 없습니다");
        return contentElement.textContent.trim();
    };

    const text = extractText(html);
    if (!text) throw new Error("해당 구절을 찾을 수 없습니다");

    return `📖 ${reference}\n${text}\n`;
}

export async function fetchDailyDevotional() {
  // 이제 우리 자신의 서버리스 함수(API)를 호출합니다.
  const response = await fetch('/api/daily-passage');
  if (!response.ok) {
    const errorData = await response.json().catch(() => null); // JSON 파싱 실패를 대비
    throw new Error(errorData?.error || '오늘의 본문을 가져오는데 실패했습니다.');
  }
  const data = await response.json();
  return data;
}
