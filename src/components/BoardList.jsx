import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';

function BoardList() {
  const [posts, setPosts] = useState([]);
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

  return (
    <ErrorBoundary>
      <div className="container board-shell">
        <div className="board-hero">
          <div>
            <p className="eyebrow">Community Journal</p>
            <h2>나눔 게시판</h2>
            <p>묵상에서 받은 마음을 조용히 남기고 다시 읽는 공간입니다.</p>
          </div>
          <Link to="/board/write" className="primary-btn">
            새 글 작성
          </Link>
        </div>
        <Link to="/" className="ghost-btn board-back">묵상실로 돌아가기</Link>
        {Array.isArray(posts) && posts.length === 0 ? (
          <div className="empty-state">아직 게시글이 없습니다. 첫 나눔을 남겨보세요.</div>
        ) : (
          <ul className="post-list">
            {Array.isArray(posts) && posts.map(post => {
              const pid = post._id || post.id;
              const created = post.createdAt ? new Date(post.createdAt) : new Date();
              return (
                <li key={pid} className="post-list-item">
                  <Link to={`/board/${pid}`}>
                    {post.title}
                  </Link>
                  <span>{post.author} · {created.toLocaleDateString()}</span>
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
