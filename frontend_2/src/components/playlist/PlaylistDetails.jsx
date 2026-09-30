import { useState } from "react";
import { Box, Typography, IconButton, Card, Tooltip, CircularProgress } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CloseIcon from "@mui/icons-material/Close";
import { AnimatePresence, motion } from "framer-motion";
import { formatCount, formatDuration } from "../../utils/format.js";

const PlaylistDetails = ({ playlist, onRemoveVideo, onClose }) => {
  const [deletingVideoIds, setDeletingVideoIds] = useState(new Set());

  if (!playlist) return null;

  const handleRemoveVideo = async (videoId) => {
    setDeletingVideoIds((prev) => new Set(prev).add(videoId));
    try {
      await onRemoveVideo(videoId);
    }
    finally {
      setDeletingVideoIds((prev) => {
        const next = new Set(prev);
        next.delete(videoId);
        return next;
      });
    }
  };

  const videos = playlist.videos || [];

  return (
    <Card sx={{ bgcolor: "rgba(22,22,22,0.9)", border: "1px solid rgba(0,212,255,0.25)", borderRadius: 4, p: { xs: 2, md: 3 } }}>
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 3 }}>
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography variant="h5" component="h2" sx={{ color: "secondary.main" }}>{playlist.name}</Typography>
          <Typography variant="body2" sx={{ mt: 0.5 }}>{playlist.description}</Typography>
          <Typography variant="caption" component="div" sx={{ mt: 1 }}>
            {videos.length} {videos.length === 1 ? "video" : "videos"}
          </Typography>
        </Box>
        {onClose && (
          <IconButton onClick={onClose} aria-label="Close playlist details">
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      {videos.length === 0 ? (
        <Typography variant="body2" sx={{ textAlign: "center", py: 4 }}>
          This playlist is empty. Use the Save button on any video to add it here.
        </Typography>
      ) : (
        <Box component="ol" sx={{ listStyle: "none", p: 0, m: 0, display: "flex", flexDirection: "column", gap: 1 }}>
          <AnimatePresence initial={false}>
            {videos.map((video, index) => (
              <Box
                component={motion.li}
                key={video._id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 1,
                  borderRadius: 2,
                  "&:hover": { bgcolor: "rgba(255,255,255,0.05)" },
                }}
              >
                <Typography variant="body2" sx={{ width: 20, textAlign: "center", flexShrink: 0 }}>{index + 1}</Typography>
                <Box sx={{ position: "relative", width: { xs: 100, sm: 140 }, aspectRatio: "16 / 9", flexShrink: 0, borderRadius: 1.5, overflow: "hidden", bgcolor: "black" }}>
                  <Box component="img" src={video.thumbnail} alt="" sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  <Box sx={{ position: "absolute", right: 4, bottom: 4, px: 0.5, borderRadius: 0.5, bgcolor: "rgba(0,0,0,0.8)", fontSize: "0.7rem", color: "white" }}>
                    {formatDuration(video.duration)}
                  </Box>
                </Box>
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: "0.95rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {video.title}
                  </Typography>
                  <Typography variant="caption">{formatCount(video.views)} views</Typography>
                </Box>
                <Tooltip title="Remove from playlist">
                  <span>
                    <IconButton
                      aria-label={`Remove ${video.title} from playlist`}
                      onClick={() => handleRemoveVideo(video._id)}
                      disabled={deletingVideoIds.has(video._id)}
                      sx={{ "&:hover": { color: "error.main" } }}
                    >
                      {deletingVideoIds.has(video._id) ? <CircularProgress size={20} color="inherit" /> : <DeleteOutlineIcon />}
                    </IconButton>
                  </span>
                </Tooltip>
              </Box>
            ))}
          </AnimatePresence>
        </Box>
      )}
    </Card>
  );
};

export default PlaylistDetails;
