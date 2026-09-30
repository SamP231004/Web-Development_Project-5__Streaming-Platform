import { useState } from 'react';
import { IconButton, Tooltip, CircularProgress } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import api, { getErrorMessage } from '../../api.js';
import { useNotify } from '../common/Notify.jsx';

const DeleteComment = ({ commentId, onCommentDeleted }) => {
  const [deleting, setDeleting] = useState(false);
  const notify = useNotify();

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/comment/channel/${commentId}`);
      onCommentDeleted(commentId);
    }
    catch (error) {
      console.error('Error deleting comment:', error);
      notify(getErrorMessage(error, 'Failed to delete comment.'), 'error');
      setDeleting(false);
    }
  };

  return (
    <Tooltip title="Delete comment">
      <span>
        <IconButton size="small" onClick={handleDelete} disabled={deleting} aria-label="Delete comment" sx={{ '&:hover': { color: 'error.main' } }}>
          {deleting ? <CircularProgress size={16} color="inherit" /> : <DeleteOutlineIcon fontSize="small" />}
        </IconButton>
      </span>
    </Tooltip>
  );
};

export default DeleteComment;
