import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

function BoardDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
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
        setPost(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      try {
        const response = await fetch(`/api/posts/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('게시글 삭제에 실패했습니다.');
        }
        alert('게시글이 삭제되었습니다.');
        navigate('/board');
      } catch (err) {
        alert(err.message);
      }
    }
  };

  if (loading) return <div>게시글을 불러오는 중...</div>;
  if (error) return <div>오류: {error}</div>;
  if (!post) return <div>게시글을 찾을 수 없습니다.</div>;

  return (
    <div className="container card">
      <h2>{post.title}</h2>
      <p style={{ color: '#555', marginBottom: '20px' }}>
        <strong>작성자:</strong> {post.author} | <strong>작성일:</strong> {new Date(post.createdAt).toLocaleDateString()}
      </p>
      <div style={{ whiteSpace: 'pre-wrap', marginBottom: '30px', lineHeight: '1.6' }}>
        {post.content}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Link to="/board" className="secondary-btn">
          <i className="fas fa-list"></i> 목록으로
        </Link>
        <div>
          <Link to={`/board/edit/${id}`} className="primary-btn" style={{ marginRight: '10px' }}>
            <i className="fas fa-edit"></i> 수정
          </Link>
          <button onClick={handleDelete} className="danger-btn">
            <i className="fas fa-trash"></i> 삭제
          </button>
        </div>
      </div>
    </div>
  );
}

export default BoardDetail;
