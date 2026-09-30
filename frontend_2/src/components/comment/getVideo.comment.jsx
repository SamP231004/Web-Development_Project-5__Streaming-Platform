import { useEffect, useState } from 'react';
import { Box, Avatar, Typography, TextField, IconButton, Tooltip, CircularProgress, Alert } from '@mui/material';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import api, { getErrorMessage, getStoredUser } from '../../api.js';
import { timeAgo } from '../../utils/format.js';
import DeleteComment from './delete.comment.jsx';

const GetVideoComments = ({ videoId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const currentUser = getStoredUser();

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    api.get(`/comment/${videoId}`)
      .then(({ data }) => active && setComments(data.data.docs || []))
      .catch((err) => active && setError(getErrorMessage(err, 'Error fetching comments')))
      .finally(() => active && setLoading(false));

    return () => { active = false; };
  }, [videoId]);

  const handleAddComment = async (event) => {
    event.preventDefault();
    const content = newComment.trim();
    if (!content) return;

    setSubmitting(true);
    setError(null);
    try {
      const { data } = await api.post(`/comment/${videoId}`, { content });
      // The create endpoint returns the owner as a bare id, so attach the current user for display.
      const created = {
        ...data.data,
        owner: { username: currentUser?.username, fullName: currentUser?.fullName, avatar: currentUser?.avatar },
      };
      setComments((prev) => [created, ...prev]);
      setNewComment('');
    }
    catch (err) {
      setError(getErrorMessage(err, 'Error adding comment'));
    }
    finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      <Box component="form" onSubmit={handleAddComment} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', mb: 3 }}>
        <Avatar src={currentUser?.avatar} alt={currentUser?.username} sx={{ width: 36, height: 36 }}>
          {currentUser?.username?.[0]?.toUpperCase()}
        </Avatar>
        <TextField
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          size="small"
          fullWidth
          multiline
          maxRows={4}
          inputProps={{ 'aria-label': 'Add a comment' }}
        />
        <Tooltip title="Post comment">
          <span>
            <IconButton
              type="submit"
              color="primary"
              disabled={submitting || !newComment.trim()}
              aria-label="Post comment"
            >
              {submitting ? <CircularProgress size={20} color="inherit" /> : <SendRoundedIcon />}
            </IconButton>
          </span>
        </Tooltip>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
          <CircularProgress size={28} />
        </Box>
      ) : comments.length === 0 ? (
        <Typography variant="body2" sx={{ textAlign: 'center', py: 3 }}>
          No comments yet. Be the first to share your thoughts!
        </Typography>
      ) : (
        <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {comments.map((comment) => {
            const isOwn = !!currentUser?.username && comment.owner?.username === currentUser.username;
            return (
              <Box component="li" key={comment._id} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                <Avatar src={comment.owner?.avatar} alt={comment.owner?.username} sx={{ width: 36, height: 36 }}>
                  {comment.owner?.username?.[0]?.toUpperCase()}
                </Avatar>
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography variant="body2" component="div">
                    <Box component="span" sx={{ color: 'text.primary', fontWeight: 600, mr: 1 }}>
                      @{comment.owner?.username || 'unknown'}
                    </Box>
                    {comment.createdAt && timeAgo(comment.createdAt)}
                  </Typography>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '0.95rem' }}>
                    {comment.content}
                  </Typography>
                </Box>
                {isOwn && (
                  <DeleteComment
                    commentId={comment._id}
                    onCommentDeleted={(id) => setComments((prev) => prev.filter((c) => c._id !== id))}
                  />
                )}
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default GetVideoComments;
