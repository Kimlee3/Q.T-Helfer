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

  if (loading) return <div>게시글을 불러오는 중...</div>;
  if (error) return <div>게시글을 불러오는데 실패했습니다: {error.message}</div>;

  return (
    <ErrorBoundary>
      <div className="container card">
        <h2>게시판 목록</h2>
        <Link to="/board/write" className="primary-btn" style={{ marginBottom: '20px', display: 'inline-block' }}>
          <i className="fas fa-pencil-alt"></i> 새 글 작성
        </Link>
        {Array.isArray(posts) && posts.length === 0 ? (
          <p>게시글이 없습니다. 첫 글을 작성해 보세요!</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {Array.isArray(posts) && posts.map(post => {
              const pid = post._id || post.id;
              const created = post.createdAt ? new Date(post.createdAt) : new Date();
              return (
                <li key={pid} style={{ borderBottom: '1px solid #eee', padding: '10px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Link to={`/board/${pid}`} style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold' }}>
                    {post.title}
                  </Link>
                  <span style={{ fontSize: '0.8em', color: '#777' }}>{post.author} | {created.toLocaleDateString()}</span>
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
