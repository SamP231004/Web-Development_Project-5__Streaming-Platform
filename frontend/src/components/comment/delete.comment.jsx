import React from 'react';

import deleteIcon from '../../Images_Used/image_6.png';

const DeleteComment = ({ commentId, onCommentDeleted }) => {
  const handleDelete = async () => {
    const accessToken = localStorage.getItem('accessToken');

    try {
      const response = await fetch(`https://web-development-project-5-streaming-platform.vercel.app/api/version_1/comment/channel/${commentId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete comment. You might not be the owner.');
      }

      onCommentDeleted(commentId);
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert(error.message);
    }
  };

  return (
    <img
      src = {deleteIcon}
      alt="Delete"
      onClick={handleDelete}
      className="delete-icon"
    />
  );
};

export default DeleteComment;