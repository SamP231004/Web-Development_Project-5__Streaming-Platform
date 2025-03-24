import React, { useState } from 'react';
import axios from 'axios';

const AddComment = ({ videoId, onCommentAdded }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAddComment = async (event) => {
    event.preventDefault();
    if (!content.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `https://streamingplatformbackend.onrender.com/api/version_1/comment/${videoId}`,
        { content },
        { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } }
      );

      if (response.status === 201) {
        onCommentAdded(response.data.data);
        setContent('');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      setError('Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Add a Comment</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleAddComment}>
        <textarea
          placeholder="Write your comment here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Adding Comment...' : 'Add Comment'}
        </button>
      </form>
    </div>
  );
};

export default AddComment;
