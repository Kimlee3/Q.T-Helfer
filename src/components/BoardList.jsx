import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';
import { BOARD_CATEGORIES, normalizeCategory } from '../boardCategories.js';

function BoardList() {
  const [posts, setPosts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('meditation');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <div className="container board-shell">게시글을 불러오는 중...</div>;
  if (error) return <div className="container board-shell">게시글을 불러오는데 실패했습니다: {error.message}</div>;

  const filteredPosts = Array.isArray(posts)
    ? posts.filter((post) => normalizeCategory(post.category) === activeCategory)
    : [];
  const activeCopy = BOARD_CATEGORIES[activeCategory];

  return (
    <ErrorBoundary>
      <div className="container board-shell">
        <div className="board-hero">
          <div>
            <p className="eyebrow">Community Journal</p>
            <h2>나눔 게시판</h2>
            <p>묵상 나눔과 통독 완주 기록을 나누어 남기는 공간입니다.</p>
          </div>
          <Link to={`/board/write?category=${activeCategory}`} className="primary-btn">
            새 글 작성
          </Link>
        </div>
        <Link to="/" className="ghost-btn board-back">묵상실로 돌아가기</Link>
        <div className="board-tabs">
          {Object.entries(BOARD_CATEGORIES).map(([key, category]) => (
            <button
              key={key}
              className={activeCategory === key ? 'active' : ''}
              onClick={() => setActiveCategory(key)}
            >
              <strong>{category.label}</strong>
              <span>{category.description}</span>
            </button>
          ))}
        </div>
        <div className="board-section-title">
          <p className="eyebrow">{activeCopy.eyebrow}</p>
          <h3>{activeCopy.label}</h3>
        </div>
        {filteredPosts.length === 0 ? (
          <div className="empty-state">아직 게시글이 없습니다. 첫 기록을 남겨보세요.</div>
        ) : (
          <ul className="post-list">
            {filteredPosts.map(post => {
              const pid = post._id || post.id;
              const created = post.createdAt ? new Date(post.createdAt) : new Date();
              const category = BOARD_CATEGORIES[normalizeCategory(post.category)];
              return (
                <li key={pid} className="post-list-item">
                  <Link to={`/board/${pid}`}>
                    {post.title}
                  </Link>
                  <span>{category.label} · {post.author} · {created.toLocaleDateString()}</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default BoardList;
