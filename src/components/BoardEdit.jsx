import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BOARD_CATEGORIES, normalizeCategory } from '../boardCategories.js';
import { getBoardEditToken } from '../boardEditTokens.js';

function BoardEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('meditation');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const editToken = getBoardEditToken(id);

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
        setCategory(normalizeCategory(data.category));
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
          'X-Edit-Token': editToken,
        },
        body: JSON.stringify({ title, content, author, category }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || '게시글 수정에 실패했습니다.');
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
  if (!editToken) {
    return (
      <div className="container board-shell">
        <div className="board-hero">
          <div>
            <p className="eyebrow">Protected</p>
            <h2>수정 권한 확인 필요</h2>
            <p>이 글을 작성한 브라우저에서만 수정할 수 있습니다.</p>
          </div>
        </div>
        <button type="button" onClick={() => navigate(`/board/${id}`)} className="secondary-btn">
          돌아가기
        </button>
      </div>
    );
  }

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
          <label htmlFor="category">게시판</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(normalizeCategory(e.target.value))}
          >
            {Object.entries(BOARD_CATEGORIES).map(([key, item]) => (
              <option key={key} value={key}>{item.label}</option>
            ))}
          </select>
        </div>
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
