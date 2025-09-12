const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');

module.exports = async (req, res) => {
  let browser;
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=3600');

    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });
    const page = await browser.newPage();
    await page.goto('https://bible.asher.design/quiettime.php', { waitUntil: 'networkidle2' }); // 네트워크 활동이 없을 때까지 기다림

    // 페이지 내에서 본문과 참조를 추출
    const data = await page.evaluate(() => {
      // 웹사이트의 HTML 구조를 기반으로 정확한 선택자를 찾아야 합니다.
      // 이 부분은 웹사이트 구조에 따라 변경될 수 있습니다.
      const referenceElement = document.querySelector('.daily_title, .qt_title, h2'); // 제목/참조가 있을 법한 요소
      const contentContainer = document.querySelector('body'); // 전체 본문이 있을 법한 컨테이너

      let reference = referenceElement ? referenceElement.textContent.trim() : '오늘의 말씀';
      let scriptureText = '';

      if (contentContainer) {
        const fullText = contentContainer.innerText; // 렌더링된 텍스트 전체를 가져옴
        const lines = fullText.split('\n').map(line => line.trim()).filter(line => line.length > 0);

        // '묵상'이 포함된 라인을 찾아 참조 추출
        const refLineIndex = lines.findIndex(line => line.includes('묵상'));
        if (refLineIndex !== -1) {
          const refMatch = lines[refLineIndex].match(/묵상 (.*)/);
          if (refMatch && refMatch[1]) {
            reference = refMatch[1].trim();
          }
        }

        // 본문 시작점과 끝점 찾기 (예상되는 패턴 기반)
        // '묵상' 라인 다음의 첫 번째 비어있지 않은 라인부터 시작
        let scriptureStartIndex = -1;
        if (refLineIndex !== -1) {
            for (let i = refLineIndex + 1; i < lines.length; i++) {
                if (lines[i].length > 0 && !lines[i].includes('----')) {
                    scriptureStartIndex = i;
                    break;
                }
            }
        }

        const scriptureEndIndex = lines.findIndex((line, index) => index >= scriptureStartIndex && line.includes('----'));
        
        if (scriptureStartIndex !== -1) {
            const scriptureLines = lines.slice(scriptureStartIndex, scriptureEndIndex > -1 ? scriptureEndIndex : undefined);
            scriptureText = scriptureLines.join('\n').trim();
        }
      }

      return { reference, scriptureText };
    });

    if (!data.scriptureText) {
      return res.status(500).json({ error: 'Could not find scripture text in the source (Puppeteer parsing failed).' });
    }

    res.status(200).json({
      reference: data.reference,
      text: `📖 ${data.reference}\n${data.scriptureText}`
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching the daily passage with Puppeteer.', details: error.message });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};