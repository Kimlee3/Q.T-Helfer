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
        const response = await fetch(`/api/posts?id=${encodeURIComponent(id)}`);
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
      const response = await fetch(`/api/posts?id=${encodeURIComponent(id)}`, {
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

  if (loading) return <div className="container board-shell">게시글 정보를 불러오는 중...</div>;
  if (error) return <div className="container board-shell">오류: {error}</div>;

  return (
    <div className="container board-shell">
      <div className="board-hero">
        <div>
          <p className="eyebrow">Revise</p>
          <h2>나눔 수정</h2>
          <p>처음 남긴 마음을 다시 다듬어 저장합니다.</p>
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
            {loading ? '수정 중...' : '수정 저장'}
          </button>
          <button type="button" onClick={() => navigate(`/board/${id}`)} className="secondary-btn">
            돌아가기
          </button>
        </div>
        {error && <p className="error-note">오류: {error}</p>}
      </form>
    </div>
  );
}

export default BoardEdit;
