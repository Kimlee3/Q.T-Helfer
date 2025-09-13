// 임시 메모리 저장소 (MongoDB 대신)
let posts = [
  {
    _id: '1',
    title: '첫 번째 게시글',
    content: '안녕하세요! 첫 번째 게시글입니다.',
    author: '관리자',
    createdAt: new Date().toISOString()
  },
  {
    _id: '2', 
    title: 'QT 헬퍼 사용법',
    content: 'QT 헬퍼를 사용하여 매일 말씀을 읽어보세요.',
    author: '관리자',
    createdAt: new Date().toISOString()
  }
];

let nextId = 3;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      const urlParts = req.url.split('/');
      const id = urlParts[urlParts.length - 1];

      if (id && id !== 'posts') { // 특정 게시글 조회
        const post = posts.find(p => p._id === id);
        if (post) {
          return res.status(200).json(post);
        } else {
          return res.status(404).json({ message: 'Post not found' });
        }
      } else { // 전체 게시글 목록 조회
        return res.status(200).json(posts);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      return res.status(500).json({ message: 'Error fetching posts', details: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      const { title, content, author } = req.body;
      if (!title || !content || !author) {
        return res.status(400).json({ message: 'Title, content, and author are required' });
      }
      
      const newPost = {
        _id: nextId.toString(),
        title,
        content,
        author,
        createdAt: new Date().toISOString()
      };
      
      posts.push(newPost);
      nextId++;
      
      return res.status(201).json(newPost);
    } catch (error) {
      console.error('Error creating post:', error);
      return res.status(400).json({ message: 'Invalid data or missing fields', details: error.message });
    }
  } else if (req.method === 'PUT') { // PUT 요청 처리 (게시글 수정)
    try {
      const urlParts = req.url.split('/');
      const id = urlParts[urlParts.length - 1];

      if (!id) {
        return res.status(400).json({ message: 'Post ID is required' });
      }

      const { title, content, author } = req.body;
      const postIndex = posts.findIndex(p => p._id === id);
      
      if (postIndex === -1) {
        return res.status(404).json({ message: 'Post not found' });
      }

      posts[postIndex] = {
        ...posts[postIndex],
        title,
        content,
        author,
        createdAt: new Date().toISOString()
      };

      return res.status(200).json(posts[postIndex]);
    } catch (error) {
      console.error('Error updating post:', error);
      return res.status(400).json({ message: 'Invalid data or error updating post', details: error.message });
    }
  } else if (req.method === 'DELETE') { // DELETE 요청 처리 (게시글 삭제)
    try {
      const urlParts = req.url.split('/');
      const id = urlParts[urlParts.length - 1];

      if (!id) {
        return res.status(400).json({ message: 'Post ID is required' });
      }

      const postIndex = posts.findIndex(p => p._id === id);
      if (postIndex === -1) {
        return res.status(404).json({ message: 'Post not found' });
      }

      const deletedPost = posts.splice(postIndex, 1)[0];
      return res.status(200).json({ message: 'Post deleted successfully', deletedPost });
    } catch (error) {
      console.error('Error deleting post:', error);
      return res.status(500).json({ message: 'Error deleting post', details: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
