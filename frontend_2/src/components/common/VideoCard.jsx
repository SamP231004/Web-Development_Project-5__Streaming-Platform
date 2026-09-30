import { Box, Typography, Avatar, Grid, ButtonBase } from '@mui/material';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import { motion } from 'framer-motion';
import { formatCount, formatDuration, timeAgo } from '../../utils/format.js';

const gridVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

export const VideoGrid = ({ children }) => (
  <Grid
    container
    columnSpacing={2.5}
    rowSpacing={4}
    component={motion.div}
    variants={gridVariants}
    initial="hidden"
    animate="visible"
  >
    {children}
  </Grid>
);

export const VideoGridItem = ({ children }) => (
  <Grid size={{ xs: 12, sm: 6, md: 4, xl: 3 }} component={motion.div} variants={cardVariants}>
    {children}
  </Grid>
);

const VideoCard = ({ video, onPlay, owner = video.ownerDetails, actions, menu }) => (
  <Box
    component="article"
    sx={{
      '&:hover .video-thumb': { transform: 'scale(1.04)' },
      '&:hover .video-play': { opacity: 1 },
      '&:hover .video-frame': { boxShadow: '0 12px 32px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(0, 212, 255, 0.35)' },
      '&:hover .video-menu, &:focus-within .video-menu': { opacity: 1 },
    }}
  >
    <ButtonBase
      onClick={() => onPlay?.(video)}
      aria-label={`Play ${video.title}`}
      className="video-frame"
      sx={{
        display: 'block',
        width: '100%',
        position: 'relative',
        aspectRatio: '16 / 9',
        borderRadius: 3,
        overflow: 'hidden',
        bgcolor: '#111',
        transition: 'box-shadow 0.25s ease',
        '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'secondary.main', outlineOffset: 2 },
      }}
    >
      <Box
        component="img"
        className="video-thumb"
        src={video.thumbnail}
        alt=""
        loading="lazy"
        sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
      />
      <Box
        className="video-play"
        sx={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(to top, rgba(0,0,0,0.45), rgba(0,0,0,0.1))',
          opacity: 0,
          transition: 'opacity 0.25s',
        }}
      >
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(255, 65, 54, 0.92)',
            boxShadow: '0 6px 20px rgba(255, 65, 54, 0.45)',
          }}
        >
          <PlayArrowRoundedIcon sx={{ fontSize: 36, color: 'white' }} />
        </Box>
      </Box>
      {typeof video.duration === 'number' && (
        <Box
          sx={{
            position: 'absolute',
            right: 8,
            bottom: 8,
            px: 0.75,
            py: 0.125,
            borderRadius: 1,
            bgcolor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.02em',
          }}
        >
          {formatDuration(video.duration)}
        </Box>
      )}
    </ButtonBase>

    <Box sx={{ display: 'flex', gap: 1.5, mt: 1.5 }}>
      {owner && (
        <Avatar src={owner.avatar} alt={owner.username} sx={{ width: 36, height: 36 }}>
          {owner.username?.[0]?.toUpperCase()}
        </Avatar>
      )}
      <Box sx={{ minWidth: 0, flexGrow: 1 }}>
        <Typography
          component="h3"
          title={video.title}
          sx={{
            fontSize: '0.98rem',
            fontWeight: 600,
            lineHeight: 1.35,
            color: 'text.primary',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {video.title}
        </Typography>
        {owner?.username && (
          <Typography variant="body2" sx={{ mt: 0.5, fontSize: '0.85rem' }} noWrap>
            {owner.username}
          </Typography>
        )}
        <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
          {formatCount(video.views)} views
          {video.createdAt && ` · ${timeAgo(video.createdAt)}`}
        </Typography>
        {actions && <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1.5 }}>{actions}</Box>}
      </Box>
      {menu && (
        <Box
          className="video-menu"
          sx={{
            flexShrink: 0,
            mt: -0.5,
            mr: -1,
            opacity: 0,
            transition: 'opacity 0.2s',
            '@media (hover: none)': { opacity: 1 },
          }}
        >
          {menu}
        </Box>
      )}
    </Box>
  </Box>
);

export default VideoCard;
