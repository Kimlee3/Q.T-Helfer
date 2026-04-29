import { JSDOM } from 'jsdom';

const TARGET_URL = 'https://bible.asher.design/quiettime.php';
const FALLBACK_PASSAGES = [
  {
    reference: '시편 23:1-3',
    text: '1절 여호와는 나의 목자시니 내게 부족함이 없으리로다\n2절 그가 나를 푸른 풀밭에 누이시며 쉴 만한 물 가로 인도하시는도다\n3절 내 영혼을 소생시키시고 자기 이름을 위하여 의의 길로 인도하시는도다',
  },
  {
    reference: '로마서 8:28',
    text: '28절 우리가 알거니와 하나님을 사랑하는 자 곧 그의 뜻대로 부르심을 입은 자들에게는 모든 것이 합력하여 선을 이루느니라',
  },
  {
    reference: '마태복음 6:33',
    text: '33절 그런즉 너희는 먼저 그의 나라와 그의 의를 구하라 그리하면 이 모든 것을 너희에게 더하시리라',
  },
  {
    reference: '빌립보서 4:6-7',
    text: '6절 아무 것도 염려하지 말고 다만 모든 일에 기도와 간구로 너희 구할 것을 감사함으로 하나님께 아뢰라\n7절 그리하면 모든 지각에 뛰어난 하나님의 평강이 그리스도 예수 안에서 너희 마음과 생각을 지키시리라',
  },
  {
    reference: '이사야 41:10',
    text: '10절 두려워하지 말라 내가 너와 함께 함이라 놀라지 말라 나는 네 하나님이 됨이라 내가 너를 굳세게 하리라 참으로 너를 도와 주리라',
  },
  {
    reference: '요한복음 15:5',
    text: '5절 나는 포도나무요 너희는 가지라 그가 내 안에 내가 그 안에 거하면 사람이 열매를 많이 맺나니 나를 떠나서는 너희가 아무 것도 할 수 없음이라',
  },
  {
    reference: '잠언 3:5-6',
    text: '5절 너는 마음을 다하여 여호와를 신뢰하고 네 명철을 의지하지 말라\n6절 너는 범사에 그를 인정하라 그리하면 네 길을 지도하시리라',
  },
];

function normalizeSpaces(value = '') {
  return String(value).replace(/\s+/g, ' ').trim();
}

function normalizeReference(reference = '') {
  return normalizeSpaces(reference)
    .replace(/(\d{1,2})\s*월\s*(\d{1,2})\s*일/, (_, month, day) => {
      return `${month.padStart(2, '0')}월 ${day.padStart(2, '0')}일`;
    })
    .replace(/(\d+)\s*장\s*(\d+)\s*(?:-|~|–|—)\s*(\d+)/g, '$1장 $2 - $3')
    .replace(/(\d+)\s*(?:-|~|–|—)\s*(\d+)$/g, '$1 - $2');
}

function formatVerseLine(verseNum, verseText) {
  const number = String(verseNum || '').replace(/[^\d]/g, '');
  const text = normalizeSpaces(verseText);
  return number && text ? `${number}절 ${text}` : '';
}

function normalizeVerseBlock(text = '') {
  return String(text)
    .split('\n')
    .map((line) => {
      const trimmed = normalizeSpaces(line);
      const match = trimmed.match(/^(\d+)\s*(?:절|[.)])?\s*(.+)$/);
      return match ? `${match[1]}절 ${match[2]}` : trimmed;
    })
    .filter(Boolean)
    .join('\n');
}

function formatDailyPassage(data) {
  return `📆 ${normalizeReference(data.reference)}\n${normalizeVerseBlock(data.text)}`;
}

function parseWithJsdom(html) {
  const dom = new JSDOM(html);
  const { document } = dom.window;

  let reference = '오늘의 말씀';
  let scriptureText = '';

  const bodyText = document.body?.textContent || '';
  const refMatch = bodyText.match(/(\d+월\s+\d+일\s+묵상\s+[^\n]+)/);
  if (refMatch && refMatch[1]) reference = refMatch[1].trim();

  const table = document.querySelector('table');
  if (table) {
    const verses = [];
    const rows = table.querySelectorAll('tr');
    rows.forEach((row, index) => {
      if (index === 0) return;
      const cells = row.querySelectorAll('td');
      const verseNum = cells[0]?.textContent?.trim() || '';
      const verseText = cells[1]?.textContent?.trim() || '';
      if (cells.length === 2 && verseNum.length < 5 && !Number.isNaN(Number.parseInt(verseNum, 10)) && verseText) {
        const verseLine = formatVerseLine(verseNum, verseText);
        if (verseLine) verses.push(verseLine);
      }
    });
    scriptureText = verses.join('\n');
  }

  return { reference, text: scriptureText };
}

function getFallbackPassage() {
  const dayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % FALLBACK_PASSAGES.length;
  return FALLBACK_PASSAGES[dayIndex];
}

function sendPassage(res, data, source = 'remote') {
  const reference = normalizeReference(data.reference);
  return res.status(200).json({
    reference,
    text: formatDailyPassage({ ...data, reference }),
    source,
  });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=3600');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const response = await fetch(TARGET_URL, {
      headers: { 'User-Agent': 'Mozilla/5.0 QT-Helper/1.0' },
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      throw new Error(`Upstream status ${response.status}`);
    }

    const html = await response.text();
    const data = parseWithJsdom(html);
    if (!data.text) {
      throw new Error('본문을 추출하지 못했습니다.');
    }

    return sendPassage(res, data, 'remote');
  } catch (error) {
    console.warn('Daily passage remote fallback:', error.message);
    return sendPassage(res, getFallbackPassage(), 'fallback');
  }
}
