import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';
import { JSDOM } from 'jsdom';

async function parseWithJsdom(html) {
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
      if (cells.length === 2 && cells[0].textContent.trim().length < 5 && !isNaN(parseInt(cells[0].textContent, 10))) {
        const verseNum = cells[0].textContent.trim();
        const verseText = cells[1].textContent.trim();
        verses.push(`${verseNum}절 ${verseText}`);
      }
    });
    scriptureText = verses.join('\n');
  }
  return { reference, text: scriptureText };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=3600');

  const targetUrl = 'https://bible.asher.design/quiettime.php';
  let browser = null;
  try {
    // 1) Try lightweight fetch + JSDOM first
    try {
      const r = await fetch(targetUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (!r.ok) throw new Error(`Upstream status ${r.status}`);
      const html = await r.text();
      const data = await parseWithJsdom(html);
      if (data.text) {
        return res.status(200).json({ reference: data.reference, text: `📆 ${data.reference}\n${data.text}` });
      }
    } catch (e) {
      // fall through to Puppeteer
    }

    // 2) Fallback to Puppeteer when structure needs JS rendering
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });

    const data = await page.evaluate(() => {
      let reference = '오늘의 말씀';
      let scriptureText = '';
      const bodyText = document.body.innerText;
      const refMatch = bodyText.match(/(\d+월\s+\d+일\s+묵상\s+[^\n]+)/);
      if (refMatch && refMatch[1]) reference = refMatch[1].trim();
      const table = document.querySelector('table');
      if (table) {
        const verses = [];
        const rows = table.querySelectorAll('tr');
        rows.forEach((row, index) => {
          if (index === 0) return;
          const cells = row.querySelectorAll('td');
          if (cells.length === 2 && cells[0].innerText.trim().length < 5 && !isNaN(parseInt(cells[0].innerText, 10))) {
            const verseNum = cells[0].innerText.trim();
            const verseText = cells[1].innerText.trim();
            verses.push(`${verseNum}절 ${verseText}`);
          }
        });
        scriptureText = verses.join('\n');
      }
      return { reference, text: scriptureText };
    });

    if (!data.text) throw new Error('본문을 추출하지 못했습니다.');
    return res.status(200).json({ reference: data.reference, text: `📆 ${data.reference}\n${data.text}` });
  } catch (error) {
    console.error('Error fetching daily passage:', error);
    return res.status(500).json({ message: '오늘의 말씀을 가져오는 중 오류가 발생했습니다.', details: error.message });
  } finally {
    if (browser) await browser.close();
  }
}
