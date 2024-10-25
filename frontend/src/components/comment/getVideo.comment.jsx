import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DeleteComment from './delete.comment.jsx';

const GetVideoComments = ({ videoId, onCommentAdded }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      const accessToken = localStorage.getItem('accessToken');

      if (!accessToken) {
        setError('User is not authenticated');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(`https://web-development-project-5-streaming-platform.vercel.app/api/version_1/comment/${videoId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setComments(response.data.data.docs);
      } catch (error) {
        console.error('Error fetching comments:', error);
        setError('Error fetching comments');
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [videoId]);

  const handleAddComment = async (event) => {
    event.preventDefault();

    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      setError('User is not authenticated');
      return;
    }

    try {
      const response = await axios.post(`https://streamingplatformbackend.onrender.com/api/version_1/comment/${videoId}`, 
        { content: newComment }, 
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setComments((prevComments) => [...prevComments, response.data.data]);
      setNewComment('');
      if (onCommentAdded) onCommentAdded();
    } catch (error) {
      console.error('Error adding comment:', error);
      setError('Error adding comment');
    }
  };

return (
    <div className="comments-section">
      {loading ? (
        <p className="loading-message">Loading comments...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : comments.length > 0 ? (
        <ul>
          {comments.map((comment) => (
            <li key={comment._id}>
              <strong>{comment.owner.username}:</strong> {comment.content}
              <DeleteComment 
                commentId={comment._id} 
                onCommentDeleted={() => setComments(comments.filter(c => c._id !== comment._id))} 
              />
            </li>
          ))}
        </ul>
      ) : (
        <p>No comments yet</p>
      )}
      
      <form onSubmit={handleAddComment} className="form-section">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          required
        />
        <button type="submit">Add Comment</button>
      </form>
    </div>
  );
};

export default GetVideoComments;
