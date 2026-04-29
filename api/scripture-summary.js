import { getScriptureContext } from '../src/scriptureContext.js';

const DEFAULT_MODEL = process.env.OLLAMA_TEXT_MODEL || process.env.OLLAMA_MODEL || 'gemma3:4b';

function getOllamaBaseUrl() {
  return (process.env.OLLAMA_API_BASE_URL || '').replace(/\/$/, '');
}

function buildPrompt(reference, passageText, locale) {
  const languageRule =
    locale === 'de'
      ? 'Antworte auf Deutsch. Schreibe klar, kurz und seelsorgerlich.'
      : '한국어로 답하세요. 초신자도 이해할 수 있게 쉽고 따뜻하게 쓰세요.';

  return `${languageRule}

너는 10년 이상 성경 묵상 콘텐츠를 작성한 신중한 해설자다.
사용자가 읽는 오늘의 본문만 바탕으로, 신학적으로 과장하지 않고 본문 안에서만 배경 요약을 작성한다.

반드시 다음 형식을 지킨다.

📆 날짜 + 본문
📌 한줄 핵심 요약

👉 한 문장 요약

📖 구조별 요약
1️⃣ 첫 흐름 (절 범위)
본문에서 실제 일어나는 일을 쉽게 설명

👉 핵심: 핵심 문장

2️⃣ 두 번째 흐름 (절 범위)
본문의 다음 흐름을 쉽게 설명

👉 핵심:
핵심 문장

규칙:
- 너무 길게 쓰지 않는다.
- 본문에 없는 내용을 억지로 넣지 않는다.
- 설교문이 아니라 읽기 쉬운 배경 요약으로 쓴다.
- 저장용 묵상이 아니라 화면에 보여줄 짧은 해설이다.

[본문 제목]
${reference || '오늘의 묵상 본문'}

[본문]
${passageText || ''}`;
}

async function callOllama({ reference, passageText, locale }) {
  const baseUrl = getOllamaBaseUrl();
  if (!baseUrl) return null;

  const response = await fetch(`${baseUrl}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      prompt: buildPrompt(reference, passageText, locale),
      stream: false,
      options: {
        temperature: 0.35,
        num_predict: 700,
      },
    }),
    signal: AbortSignal.timeout(45000),
  });

  if (!response.ok) {
    throw new Error(`summary generation failed: ${response.status}`);
  }

  const data = await response.json();
  return String(data.response || '').trim();
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { reference = '', passageText = '', locale = 'ko' } = req.body || {};
  const fallback = getScriptureContext(reference, passageText, locale);

  try {
    const aiSummary = await callOllama({ reference, passageText, locale });
    return res.status(200).json({
      ...fallback,
      summary: aiSummary || fallback.summary,
      source: aiSummary ? 'local-ai' : 'fallback',
    });
  } catch {
    return res.status(200).json({
      ...fallback,
      source: 'fallback',
    });
  }
}
