const express = require('express');
// 이전에 작성한 CommonJS 형식의 핸들러를 가져옵니다.
const dailyPassageHandler = require('./api/daily-passage.cjs');
const postsHandler = require('./api/posts.cjs'); // 게시판 핸들러 추가

const app = express();
const PORT = 3001; // Vite 개발 서버(5173)와 겹치지 않는 포트

// /api/daily-passage 경로에 대한 GET 요청을 핸들러로 처리
app.get('/api/daily-passage', dailyPassageHandler);

// /api/posts 및 /api/posts/:id 경로에 대한 모든 HTTP 메서드 요청을 핸들러로 처리
app.all('/api/posts', postsHandler);
app.all('/api/posts/:id', postsHandler);

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
