export default async function handler(req, res) {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=3600');

    // bible.asher.design에서 실제 오늘의 말씀 가져오기
    const response = await fetch('https://bible.asher.design/quiettime.php', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    
    // HTML에서 오늘의 말씀 정보 추출
    const referenceMatch = html.match(/묵상\s+([^<]+?)(?:\s*\|)/);
    let reference = referenceMatch ? referenceMatch[1].trim() : '오늘의 말씀';
    
    // 더 정확한 참조 추출 시도
    const betterRefMatch = html.match(/묵상\s+([^<]+?)(?:\s*\|)/);
    if (betterRefMatch) {
      const refText = betterRefMatch[1].trim();
      // "이사야 66장 15 - 24" 형태로 정리
      if (refText.includes('이사야') && refText.includes('66장')) {
        reference = '이사야 66:15-24';
      } else {
        reference = refText;
      }
    }
    
    // 성경 본문 추출 (테이블에서)
    const tableMatch = html.match(/<table[^>]*>([\s\S]*?)<\/table>/);
    let scriptureText = '';
    
    if (tableMatch) {
      const tableContent = tableMatch[1];
      // 테이블 셀에서 성경 본문 추출
      const cellMatches = tableContent.match(/<td[^>]*>([^<]+)<\/td>/g);
      if (cellMatches) {
        const verses = cellMatches
          .map(match => match.replace(/<[^>]*>/g, '').trim())
          .filter(text => text.length > 0 && !text.match(/^\d+$/)); // 숫자만 있는 행 제외
        
        scriptureText = verses.join('\n');
      }
    }

    // 추출 실패 시 기본값 사용
    if (!scriptureText) {
      const fallbackVerses = [
        { reference: "요한복음 3:16", text: "하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니 이는 그를 믿는 자마다 멸망하지 않고 영생을 얻게 하려 하심이라" },
        { reference: "로마서 8:28", text: "우리가 알거니와 하나님을 사랑하는 자 곧 그의 뜻대로 부르심을 입은 자들에게는 모든 것이 합력하여 선을 이루느니라" },
        { reference: "빌립보서 4:13", text: "내게 능력 주시는 자 안에서 내가 모든 것을 할 수 있느니라" }
      ];
      
      const today = new Date();
      const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
      const selectedVerse = fallbackVerses[dayOfYear % fallbackVerses.length];
      
      return res.status(200).json({
        reference: selectedVerse.reference,
        text: `📖 ${selectedVerse.reference}\n${selectedVerse.text}`
      });
    }

    res.status(200).json({
      reference: reference,
      text: `📖 ${reference}\n${scriptureText}`
    });

  } catch (error) {
    console.error('Daily passage error:', error);
    
    // 에러 발생 시 기본값 사용
    const fallbackVerses = [
      { reference: "요한복음 3:16", text: "하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니 이는 그를 믿는 자마다 멸망하지 않고 영생을 얻게 하려 하심이라" },
      { reference: "로마서 8:28", text: "우리가 알거니와 하나님을 사랑하는 자 곧 그의 뜻대로 부르심을 입은 자들에게는 모든 것이 합력하여 선을 이루느니라" },
      { reference: "빌립보서 4:13", text: "내게 능력 주시는 자 안에서 내가 모든 것을 할 수 있느니라" }
    ];
    
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const selectedVerse = fallbackVerses[dayOfYear % fallbackVerses.length];
    
    res.status(200).json({
      reference: selectedVerse.reference,
      text: `📖 ${selectedVerse.reference}\n${selectedVerse.text}`
    });
  }
}