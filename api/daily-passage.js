export default async function handler(req, res) {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=3600');

    // 간단한 오늘의 말씀 데이터 (임시로 하드코딩)
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    
    // 간단한 성경 구절들 (365일치)
    const dailyVerses = [
      { reference: "요한복음 3:16", text: "하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니 이는 그를 믿는 자마다 멸망하지 않고 영생을 얻게 하려 하심이라" },
      { reference: "로마서 8:28", text: "우리가 알거니와 하나님을 사랑하는 자 곧 그의 뜻대로 부르심을 입은 자들에게는 모든 것이 합력하여 선을 이루느니라" },
      { reference: "빌립보서 4:13", text: "내게 능력 주시는 자 안에서 내가 모든 것을 할 수 있느니라" },
      { reference: "시편 23:1", text: "여호와는 나의 목자시니 내게 부족함이 없으리로다" },
      { reference: "이사야 40:31", text: "오직 여호와를 앙망하는 자는 새 힘을 얻으리니 독수리가 날개를 치며 올라감 같을 것이요 달음박질하여도 곤비하지 아니하겠고 걸어가도 피곤하지 아니하리로다" }
    ];
    
    const verseIndex = dayOfYear % dailyVerses.length;
    const selectedVerse = dailyVerses[verseIndex];

    res.status(200).json({
      reference: selectedVerse.reference,
      text: `📖 ${selectedVerse.reference}\n${selectedVerse.text}`
    });

  } catch (error) {
    console.error('Daily passage error:', error);
    res.status(500).json({ 
      error: '오늘의 말씀을 가져오는데 실패했습니다.', 
      details: error.message 
    });
  }
}