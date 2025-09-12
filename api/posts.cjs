let posts = [
  { id: 1, title: '첫 번째 게시글', content: '안녕하세요, 첫 게시글입니다.', author: '관리자', createdAt: new Date().toISOString() },
  { id: 2, title: '두 번째 게시글', content: '게시판 기능 테스트 중입니다.', author: '테스터', createdAt: new Date().toISOString() },
];
let nextId = 3; // For generating unique IDs

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    // URL 파싱을 통해 ID 추출 (예: /api/posts/123)
    const urlParts = req.url.split('/');
    const id = parseInt(urlParts[urlParts.length - 1]);

    if (!isNaN(id)) { // ID가 숫자인 경우, 특정 게시글 조회
      const post = posts.find(p => p.id === id);
      if (post) {
        return res.status(200).json(post);
      } else {
        return res.status(404).json({ message: 'Post not found' });
      }
    } else { // ID가 없는 경우, 전체 게시글 목록 조회
      return res.status(200).json(posts);
    }
  } else if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const { title, content, author } = JSON.parse(body);
        if (!title || !content || !author) {
          return res.status(400).json({ message: 'Title, content, and author are required' });
        }
        const newPost = {
          id: nextId++,
          title,
          content,
          author,
          createdAt: new Date().toISOString(),
        };
        posts.push(newPost);
        return res.status(201).json(newPost);
      } catch (error) {
        return res.status(400).json({ message: 'Invalid JSON or missing fields', details: error.message });
      }
    });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};
