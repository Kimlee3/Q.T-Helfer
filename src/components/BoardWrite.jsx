import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function BoardWrite() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content, author }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      alert('게시글이 성공적으로 작성되었습니다!');
      navigate('/board'); // Redirect to board list
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container board-shell">
      <div className="board-hero">
        <div>
          <p className="eyebrow">Write</p>
          <h2>새 나눔 작성</h2>
          <p>오늘의 묵상을 한 편의 짧은 기록처럼 남겨보세요.</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="journal-form">
        <div className="form-field">
          <label htmlFor="title">제목</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="author">작성자</label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="content">내용</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows="10"
          ></textarea>
        </div>
        <div className="form-actions">
          <button type="submit" disabled={loading} className="primary-btn">
            {loading ? '작성 중...' : '나눔 저장'}
          </button>
          <button type="button" onClick={() => navigate('/board')} className="secondary-btn">
            목록으로
          </button>
        </div>
        {error && <p className="error-note">오류: {error}</p>}
      </form>
    </div>
  );
}

export default BoardWrite;
