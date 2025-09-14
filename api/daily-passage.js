import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

export default async function handler(req, res) {
  let browser = null;
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=3600');

    // Use @sparticuz/chromium
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.goto('https://bible.asher.design/quiettime.php', {
      waitUntil: 'domcontentloaded',
    });

    const data = await page.evaluate(() => {
      let reference = '오늘의 말씀';
      let scriptureText = '';

      // Extract reference text
      const bodyText = document.body.innerText;
      const refMatch = bodyText.match(/(\d+월\s+\d+일\s+묵상\s+[^\n]+)/);
      if (refMatch && refMatch[1]) {
        reference = refMatch[1].trim();
      }

      // Extract scripture text from the table
      const table = document.querySelector('table');
      if (table) {
        const verses = [];
        const rows = table.querySelectorAll('tr');
        rows.forEach((row, index) => {
          // Skip the first row which contains the book name
          if (index === 0) return; 
          
          const cells = row.querySelectorAll('td');
          // Ensure it's a verse row (number in first cell)
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

    if (!data.text) {
      throw new Error('Could not extract scripture text. The page structure might have changed.');
    }

    res.status(200).json({
      reference: data.reference,
      text: `📆 ${data.reference}\n${data.text}`
    });

  } catch (error) {
    console.error('Error scraping daily passage with Puppeteer:', error);
    res.status(500).json({
      message: '오늘의 말씀을 크롤링하는 중 오류가 발생했습니다.',
      details: error.message
    });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}