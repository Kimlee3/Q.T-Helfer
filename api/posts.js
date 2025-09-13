import mongoose from 'mongoose';

// 로컬 개발용 메모리 저장소
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

// MongoDB 연결 함수
const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    // 이미 연결되어 있으면 다시 연결하지 않음
    return;
  }
  try {
    if (!process.env.MONGODB_URI) {
      console.log('MONGODB_URI not found, using memory storage');
      return;
    }
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully.');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // 연결 실패 시 에러를 던져서 핸들러에서 잡도록 함
    throw new Error(`MongoDB Connection Error: ${error.message}`);
  }
};

// 게시물 스키마 정의
const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Post 모델 생성
const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectDB(); // 요청 처리 전에 DB 연결
  } catch (error) {
    console.error('Database connection failed:', error);
    return res.status(500).json({ message: 'Database connection failed', details: error.message });
  }

  if (req.method === 'GET') {
    try {
      const urlParts = req.url.split('/');
      const id = urlParts[urlParts.length - 1];

      // MongoDB 연결 상태 확인
      if (mongoose.connections[0].readyState === 1) {
        // MongoDB 연결된 경우
        if (mongoose.Types.ObjectId.isValid(id)) { // ID가 유효한 ObjectId인 경우, 특정 게시글 조회
          const post = await Post.findById(id);
          if (post) {
            return res.status(200).json(post);
          } else {
            return res.status(404).json({ message: 'Post not found' });
          }
        } else { // ID가 없거나 유효하지 않은 경우, 전체 게시글 목록 조회
          const posts = await Post.find({});
          return res.status(200).json(posts);
        }
      } else {
        // MongoDB 연결되지 않은 경우 메모리 저장소 사용
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
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      return res.status(500).json({ message: 'Error fetching posts', details: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      const { title, content, author } = req.body;

      if (!title || !content || !author) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      if (mongoose.connections[0].readyState === 1) {
        // MongoDB에 저장
        const newPost = new Post({ title, content, author });
        await newPost.save();
        return res.status(201).json(newPost);
      } else {
        // 메모리 저장소에 저장
        const newPost = {
          _id: String(nextId++),
          title,
          content,
          author,
          createdAt: new Date().toISOString(),
        };
        posts.push(newPost);
        return res.status(201).json(newPost);
      }
    } catch (error) {
      console.error('Error creating post:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'PUT') { // PUT 요청 처리 (게시글 수정)
    const urlParts = req.url.split('/');
    const id = urlParts[urlParts.length - 1];

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Post ID' });
    }

    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      try {
        const { title, content, author } = JSON.parse(body);
        const updatedPost = await Post.findByIdAndUpdate(
          id,
          { title, content, author, createdAt: new Date().toISOString() }, // createdAt도 업데이트
          { new: true, runValidators: true }
        );
        if (updatedPost) {
          return res.status(200).json(updatedPost);
        } else {
          return res.status(404).json({ message: 'Post not found' });
        }
      } catch (error) {
        console.error('Error updating post:', error);
        return res.status(400).json({ message: 'Invalid data or error updating post', details: error.message });
      }
    });
  } else if (req.method === 'DELETE') { // DELETE 요청 처리 (게시글 삭제)
    const urlParts = req.url.split('/');
    const id = urlParts[urlParts.length - 1];

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Post ID' });
    }

    try {
      const deletedPost = await Post.findByIdAndDelete(id);
      if (deletedPost) {
        return res.status(200).json({ message: 'Post deleted successfully', deletedPost });
      } else {
        return res.status(404).json({ message: 'Post not found' });
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      return res.status(500).json({ message: 'Error deleting post', details: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
