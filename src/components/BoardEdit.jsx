import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function BoardEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTitle(data.title);
        setContent(data.content);
        setAuthor(data.author);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content, author }),
      });
      if (!response.ok) {
        throw new Error('게시글 수정에 실패했습니다.');
      }
      alert('게시글이 수정되었습니다.');
      navigate(`/board/${id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>게시글 정보를 불러오는 중...</div>;
  if (error) return <div>오류: {error}</div>;

  return (
    <div className="container card">
      <h2>게시글 수정</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="title" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>제목</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="author" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>작성자</label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="content" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>내용</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows="10"
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', resize: 'vertical' }}
          ></textarea>
        </div>
        <button type="submit" disabled={loading} className="primary-btn">
          {loading ? '수정 중...' : '게시글 수정'}
        </button>
        {error && <p style={{ color: 'red', marginTop: '10px' }}>오류: {error}</p>}
      </form>
    </div>
  );
}

export default BoardEdit;
