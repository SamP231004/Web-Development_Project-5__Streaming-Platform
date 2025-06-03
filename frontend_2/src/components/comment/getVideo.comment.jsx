import { useEffect, useState } from 'react';
import axios from 'axios';
import DeleteComment from './delete.comment.jsx';

const API_URL = import.meta.env.VITE_BACKEND_URL;

const GetVideoComments = ({ videoId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = async () => {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      setError('User is not authenticated');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/api/version_1/comment/${videoId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setComments(response.data.data.docs);
    } 
    catch (error) {
      console.error('Error fetching comments:', error);
      setError('Error fetching comments');
    } 
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [videoId]);

  const handleAddComment = async (event) => {
    event.preventDefault();
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      setError('User is not authenticated');
      return;
    }

    if (!newComment.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await axios.post(
        `${API_URL}/api/version_1/comment/${videoId}`,
        { content: newComment },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      setComments((prevComments) => [...prevComments, response.data.data]);
      setNewComment('');
    } 
    catch (error) {
      console.error('Error adding comment:', error);
      setError('Error adding comment');
    } 
    finally {
      setSubmitting(false);
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
                onCommentDeleted={() => setComments((prevComments) => prevComments.filter(c => c._id !== comment._id))} 
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
        <button type="submit" disabled={submitting}>
          {submitting ? 'Adding Comment...' : 'Add Comment'}
        </button>
      </form>
    </div>
  );
};

export default GetVideoComments;