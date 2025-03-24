import React, { useState } from 'react';

const UpdateComment = ({ commentId, initialContent, onCommentUpdated }) => {
  const [content, setContent] = useState(initialContent);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpdateComment = async () => {
    if (!content.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const accessToken = localStorage.getItem('accessToken');
      
      const response = await fetch(`https://streamingplatformbackend.onrender.com/api/version_1/comment/${commentId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        onCommentUpdated(content);
      } else {
        throw new Error('Failed to update comment. You might not be the owner.');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Update Comment</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <textarea
        placeholder="Edit your comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button onClick={handleUpdateComment} disabled={loading}>
        {loading ? 'Updating Comment...' : 'Update Comment'}
      </button>
    </div>
  );
};

export default UpdateComment;