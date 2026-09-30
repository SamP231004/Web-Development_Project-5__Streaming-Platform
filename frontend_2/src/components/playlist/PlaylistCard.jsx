import { Card, CardActionArea, Box, Typography } from "@mui/material";
import PlaylistPlayIcon from "@mui/icons-material/PlaylistPlay";
import { formatCount } from "../../utils/format.js";

const PlaylistCard = ({ playlist, onClick, isOpen }) => {
  const cover = playlist.videos?.[0]?.thumbnail;
  const count = playlist.totalVideos ?? playlist.videos?.length ?? 0;

  return (
    <Card
      sx={{
        height: "100%",
        bgcolor: "rgba(22,22,22,0.85)",
        border: "1px solid",
        borderColor: isOpen ? "secondary.main" : "rgba(255,255,255,0.08)",
        boxShadow: isOpen ? "0 0 0 1px rgba(0,212,255,0.4), 0 10px 30px rgba(0,212,255,0.12)" : undefined,
        borderRadius: 3,
        transition: "border-color 0.2s, transform 0.2s",
        "&:hover": { transform: "translateY(-4px)" },
      }}
    >
      <CardActionArea onClick={onClick} aria-pressed={isOpen} sx={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "stretch" }}>
        <Box sx={{ position: "relative", aspectRatio: "16 / 9", bgcolor: "rgba(255,255,255,0.04)" }}>
          {cover ? (
            <Box component="img" src={cover} alt="" sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          ) : (
            <Box sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "text.disabled" }}>
              <PlaylistPlayIcon sx={{ fontSize: 56 }} />
            </Box>
          )}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              width: "38%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "rgba(0,0,0,0.72)",
              backdropFilter: "blur(4px)",
              color: "white",
            }}
          >
            <Typography variant="h6" component="span" sx={{ fontWeight: 700, color: "white" }}>{count}</Typography>
            <PlaylistPlayIcon />
          </Box>
        </Box>
        <Box sx={{ p: 2, flexGrow: 1 }}>
          <Typography variant="subtitle1" noWrap sx={{ fontWeight: 600 }}>{playlist.name}</Typography>
          <Typography variant="body2" sx={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {playlist.description}
          </Typography>
          <Typography variant="caption" component="div" sx={{ mt: 1 }}>
            {count} {count === 1 ? "video" : "videos"} • {formatCount(playlist.totalViews)} views
          </Typography>
        </Box>
      </CardActionArea>
    </Card>
  );
};

export default PlaylistCard;
