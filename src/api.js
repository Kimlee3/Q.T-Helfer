const PROXY_URL = 'https://api.allorigins.win/get?url=';

const bookMapping = {
    "창세기": { ibibles: "gen", osis: "Gen", de: "1. Mose" },
    "출애굽기": { ibibles: "exo", osis: "Exod", de: "2. Mose" },
    "레위기": { ibibles: "lev", osis: "Lev", de: "3. Mose" },
    "민수기": { ibibles: "num", osis: "Num", de: "4. Mose" },
    "신명기": { ibibles: "deu", osis: "Deut", de: "5. Mose" },
    "여호수아": { ibibles: "jos", osis: "Josh", de: "Josua" },
    "사사기": { ibibles: "jdg", osis: "Judg", de: "Richter" },
    "룻기": { ibibles: "rut", osis: "Ruth", de: "Rut" },
    "사무엘상": { ibibles: "1sa", osis: "1Sam", de: "1. Samuel" },
    "사무엘하": { ibibles: "2sa", osis: "2Sam", de: "2. Samuel" },
    "열왕기상": { ibibles: "1ki", osis: "1Kgs", de: "1. Könige" },
    "열왕기하": { ibibles: "2ki", osis: "2Kgs", de: "2. Könige" },
    "역대상": { ibibles: "1ch", osis: "1Chr", de: "1. Chronik" },
    "역대하": { ibibles: "2ch", osis: "2Chr", de: "2. Chronik" },
    "에스라": { ibibles: "ezr", osis: "Ezra", de: "Esra" },
    "느헤미야": { ibibles: "neh", osis: "Neh", de: "Nehemia" },
    "에스더": { ibibles: "est", osis: "Esth", de: "Ester" },
    "욥기": { ibibles: "job", osis: "Job", de: "Hiob" },
    "시편": { ibibles: "psa", osis: "Ps", de: "Psalmen" },
    "잠언": { ibibles: "pro", osis: "Prov", de: "Sprüche" },
    "전도서": { ibibles: "ecc", osis: "Eccl", de: "Prediger" },
    "아가": { ibibles: "sng", osis: "Song", de: "Hohelied" },
    "이사야": { ibibles: "isa", osis: "Isa", de: "Jesaja" },
    "예레미야": { ibibles: "jer", osis: "Jer", de: "Jeremia" },
    "예레미야애가": { ibibles: "lam", osis: "Lam", de: "Klagelieder" },
    "에스겔": { ibibles: "ezk", osis: "Ezek", de: "Hesekiel" },
    "다니엘": { ibibles: "dan", osis: "Dan", de: "Daniel" },
    "호세아": { ibibles: "hos", osis: "Hos", de: "Hosea" },
    "요엘": { ibibles: "jol", osis: "Joel", de: "Joel" },
    "아모스": { ibibles: "amo", osis: "Amos", de: "Amos" },
    "오바댜": { ibibles: "oba", osis: "Obad", de: "Obadja" },
    "요나": { ibibles: "jon", osis: "Jonah", de: "Jona" },
    "미가": { ibibles: "mic", osis: "Mic", de: "Micha" },
    "나훔": { ibibles: "nam", osis: "Nah", de: "Nahum" },
    "하박국": { ibibles: "hab", osis: "Hab", de: "Habakuk" },
    "스바냐": { ibibles: "zep", osis: "Zeph", de: "Zefanja" },
    "학개": { ibibles: "hag", osis: "Hag", de: "Haggai" },
    "스가랴": { ibibles: "zec", osis: "Zech", de: "Sacharja" },
    "말라기": { ibibles: "mal", osis: "Mal", de: "Maleachi" },
    "마태복음": { ibibles: "mat", osis: "Matt", de: "Matthäus" },
    "마가복음": { ibibles: "mrk", osis: "Mark", de: "Markus" },
    "누가복음": { ibibles: "luk", osis: "Luke", de: "Lukas" },
    "요한복음": { ibibles: "jhn", osis: "John", de: "Johannes" },
    "사도행전": { ibibles: "act", osis: "Acts", de: "Apostelgeschichte" },
    "로마서": { ibibles: "rom", osis: "Rom", de: "Römer" },
    "고린도전서": { ibibles: "1co", osis: "1Cor", de: "1. Korinther" },
    "고린도후서": { ibibles: "2co", osis: "2Cor", de: "2. Korinther" },
    "갈라디아서": { ibibles: "gal", osis: "Gal", de: "Galater" },
    "에베소서": { ibibles: "eph", osis: "Eph", de: "Epheser" },
    "빌립보서": { ibibles: "php", osis: "Phil", de: "Philipper" },
    "골로새서": { ibibles: "col", osis: "Col", de: "Kolosser" },
    "데살로니가전서": { ibibles: "1th", osis: "1Thess", de: "1. Thessalonicher" },
    "데살로니가후서": { ibibles: "2th", osis: "2Thess", de: "2. Thessalonicher" },
    "디모데전서": { ibibles: "1ti", osis: "1Tim", de: "1. Timotheus" },
    "디모데후서": { ibibles: "2ti", osis: "2Tim", de: "2. Timotheus" },
    "디도서": { ibibles: "tit", osis: "Titus", de: "Titus" },
    "빌레몬서": { ibibles: "phm", osis: "Phlm", de: "Philemon" },
    "히브리서": { ibibles: "heb", osis: "Heb", de: "Hebräer" },
    "야고보서": { ibibles: "jas", osis: "Jas", de: "Jakobus" },
    "베드로전서": { ibibles: "1pe", osis: "1Pet", de: "1. Petrus" },
    "베드로후서": { ibibles: "2pe", osis: "2Pet", de: "2. Petrus" },
    "요한일서": { ibibles: "1jn", osis: "1John", de: "1. Johannes" },
    "요한이서": { ibibles: "2jn", osis: "2John", de: "2. Johannes" },
    "요한삼서": { ibibles: "3jn", osis: "3John", de: "3. Johannes" },
    "유다서": { ibibles: "jud", osis: "Jude", de: "Judas" },
    "요한계시록": { ibibles: "rev", osis: "Rev", de: "Offenbarung" },
};

const bookNames = Object.keys(bookMapping).sort((a, b) => b.length - a.length);
let luther1912Promise = null;

function parseReference(reference) {
    const normalized = String(reference || '').trim().replace(/\s+/g, ' ');
    const bookKorean = bookNames.find((name) => normalized.includes(name));
    if (!bookKorean) throw new Error('지원되는 성경 책 이름을 찾지 못했습니다. 예: "로마서 1:1"');

    const afterBook = normalized.slice(normalized.indexOf(bookKorean) + bookKorean.length);
    const passageMatch = afterBook.match(/(\d+)\s*(?:장|:)\s*(\d+)(?:\s*(?:-|~|–)\s*(\d+))?/);
    if (!passageMatch) throw new Error('구절 형식이 잘못되었습니다. 예: "로마서 1:1" 또는 "로마서 1:1-5"');

    const chapter = Number.parseInt(passageMatch[1], 10);
    const startVerse = Number.parseInt(passageMatch[2], 10);
    const endVerse = passageMatch[3] ? Number.parseInt(passageMatch[3], 10) : startVerse;
    if (Number.isNaN(chapter) || Number.isNaN(startVerse) || Number.isNaN(endVerse)) {
        throw new Error('장 또는 절 번호가 유효하지 않습니다. 예: "로마서 1:1"');
    }

    const book = bookMapping[bookKorean];
    return { bookKorean, book: book.ibibles, osis: book.osis, deBook: book.de, chapter, startVerse, endVerse };
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

export async function fetchBibleChapter(bookKorean, chapter) {
    const book = bookMapping[bookKorean];
    const chapterNumber = Number.parseInt(chapter, 10);
    if (!book || Number.isNaN(chapterNumber)) {
        throw new Error('지원되는 성경 장을 찾지 못했습니다.');
    }

    const reference = `${bookKorean} ${chapterNumber}장`;
    const apiUrl = `http://ibibles.net/quote.php?kor-${book.ibibles}/${chapterNumber}:1-200`;
    const proxyUrl = `${PROXY_URL}${encodeURIComponent(apiUrl)}`;

    const response = await fetch(proxyUrl);
    if (!response.ok) throw new Error('API 요청 실패 (서버 응답 오류)');

    const data = await response.json();
    const parser = new DOMParser();
    const doc = parser.parseFromString(data.contents || '', 'text/html');
    const text = doc.querySelector('body')?.textContent?.trim();
    if (!text) throw new Error('해당 장의 본문을 찾을 수 없습니다.');

    return `📖 ${reference}\n${text}\n`;
}

async function loadLuther1912() {
    if (!luther1912Promise) {
        luther1912Promise = fetch('/luther1912.json').then((response) => {
            if (!response.ok) throw new Error('독일어 성경 데이터를 불러오지 못했습니다.');
            return response.json();
        });
    }
    return luther1912Promise;
}

export async function fetchGermanBibleVerses(reference) {
    const parsedRef = parseReference(reference);
    const bible = await loadLuther1912();
    const verses = [];

    for (let verse = parsedRef.startVerse; verse <= parsedRef.endVerse; verse += 1) {
        const osisId = `${parsedRef.osis}.${parsedRef.chapter}.${verse}`;
        const text = bible.verses[osisId];
        if (text) {
            verses.push(`${verse}. ${text}`);
        }
    }

    if (!verses.length) {
        throw new Error('해당 구절의 독일어 본문을 찾지 못했습니다.');
    }

    const verseRange = parsedRef.startVerse === parsedRef.endVerse
        ? `${parsedRef.chapter},${parsedRef.startVerse}`
        : `${parsedRef.chapter},${parsedRef.startVerse}-${parsedRef.endVerse}`;

    return `📖 ${parsedRef.deBook} ${verseRange}\nLutherbibel 1912 (앱 내 표시) / Luther 1984는 공식 Die-Bibel.de에서 확인\n\n${verses.join('\n')}`;
}

export async function fetchGermanBibleChapter(bookKorean, chapter) {
    const book = bookMapping[bookKorean];
    const chapterNumber = Number.parseInt(chapter, 10);
    if (!book || Number.isNaN(chapterNumber)) {
        throw new Error('지원되는 독일어 성경 장을 찾지 못했습니다.');
    }

    const bible = await loadLuther1912();
    const verses = [];
    let missingAfterFound = 0;

    for (let verse = 1; verse <= 200; verse += 1) {
        const osisId = `${book.osis}.${chapterNumber}.${verse}`;
        const text = bible.verses[osisId];
        if (text) {
            verses.push(`${verse}. ${text}`);
            missingAfterFound = 0;
        } else if (verses.length) {
            missingAfterFound += 1;
            if (missingAfterFound >= 5) break;
        }
    }

    if (!verses.length) {
        throw new Error('해당 장의 독일어 본문을 찾지 못했습니다.');
    }

    return `📖 ${book.de} ${chapterNumber}\nLutherbibel 1912 (앱 내 표시) / Luther 1984는 공식 Die-Bibel.de에서 확인\n\n${verses.join('\n')}`;
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
