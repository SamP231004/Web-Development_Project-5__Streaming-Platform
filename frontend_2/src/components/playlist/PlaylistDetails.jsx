import React, { useState } from "react";
import { Box, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, IconButton, Card, CardContent, Chip } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { motion } from "framer-motion";

const PlaylistDetails = ({ playlist, onRemoveVideo }) => {
  const [deletingVideoIds, setDeletingVideoIds] = useState(new Set());

  if (!playlist) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4, color: 'text.secondary' }}>
        <Typography variant="h6">Select a playlist to see its details.</Typography>
      </Box>
    );
  }

  const handleRemoveVideo = async (videoId) => {
    try {
      setDeletingVideoIds(prev => new Set([...prev, videoId]));
      await onRemoveVideo(videoId);
    } 
    finally {
      setDeletingVideoIds(prev => {
        const newSet = new Set([...prev]);
        newSet.delete(videoId);
        return newSet;
      });
    }
  };

  const listItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <Card
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      sx={{
        mt: 4,
        bgcolor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: '16px',
        p: { xs: 2, md: 3 },
        border: '1px solid rgb(255, 255, 255)',
        boxShadow: '0px 0px 10px rgb(255, 255, 255)',
      }}
    >
      <CardContent sx={{ p: { xs: 2, md: 3 }, '&:last-child': { pb: { xs: 2, md: 3 } } }}>
        <Typography
          variant="h5"
          component="h3"
          gutterBottom
          sx={{ color: 'primary.main', fontWeight: 'bold', mb: 1 }}
        >
          {playlist.name}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {playlist.description}
        </Typography>

        <Typography variant="h6" component="h4" sx={{ mb: 2, color: 'text.primary', fontWeight: 'medium' }}>
          Videos in Playlist ({playlist.videos?.length || 0})
        </Typography>

        {playlist.videos && playlist.videos.length > 0 ? (
          <List>
            {playlist.videos.map((video) => (
              <ListItem
                key={video._id}
                component={motion.div}
                variants={listItemVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                layout
                sx={{
                  mb: 2,
                  p: 1.5,
                  bgcolor: 'transparent',
                  borderRadius: '10px',
                  boxShadow: 1,
                  border: '1px solid rgb(255, 255, 255)',
                  transition: 'background-color 0.3s ease-in-out',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                  },
                }}
              >
                <ListItemAvatar sx={{ minWidth: { xs: '80px', sm: '120px' }, mr: { xs: 1, sm: 2 } }}>
                  <Avatar
                    variant="rounded"
                    src={video.thumbnail}
                    alt={video.title}
                    sx={{
                      width: '100%',
                      height: { xs: 50, sm: 70 },
                      borderRadius: '8px',
                      objectFit: 'cover',
                      aspectRatio: '16/9',
                    }}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 'bold', lineHeight: 1.3 }}>
                      {video.title}
                    </Typography>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
                      <Chip
                        label={`${video.duration?.toFixed(1) || 'N/A'}s`}
                        size="small"
                        sx={{ bgcolor: 'info.dark', color: 'info.contrastText', fontWeight: 'bold' }}
                      />
                      <Chip
                        label={`${video.views} views`}
                        size="small"
                        sx={{ bgcolor: 'secondary.dark', color: 'secondary.contrastText', fontWeight: 'bold' }}
                      />
                    </Box>
                  }
                  sx={{ my: 0 }}
                />
                <IconButton
                  edge="end"
                  aria-label="remove"
                  onClick={() => handleRemoveVideo(video._id)}
                  disabled={deletingVideoIds.has(video._id)}
                  sx={{
                    color: 'error.main',
                    ml: { xs: 1, sm: 2 },
                    '&:hover': {
                      bgcolor: 'rgba(255, 0, 0, 0.1)',
                    },
                  }}
                >
                  {deletingVideoIds.has(video._id) ? (
                    <CircularProgress 
                      size={20} 
                      color="inherit"
                      sx={{ opacity: 0.7 }}
                    />
                  ) : (
                    <DeleteIcon />
                  )}
                </IconButton>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 3, fontStyle: 'italic' }}>
            This playlist is empty. Add some videos!
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default PlaylistDetails;