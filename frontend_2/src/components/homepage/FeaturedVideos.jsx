import { useState } from 'react';
import { Typography, Box } from '@mui/material';

const FEATURED_CLIPS = [
  'https://res.cloudinary.com/duuwv0a2h/video/upload/v1/video1_i7eu0f',
  'https://res.cloudinary.com/duuwv0a2h/video/upload/v1/video2_ahitoy',
  'https://res.cloudinary.com/duuwv0a2h/video/upload/v1/video3_dmscvt',
  'https://res.cloudinary.com/duuwv0a2h/video/upload/v1/video4_ar021k',
  'https://res.cloudinary.com/duuwv0a2h/video/upload/v1/video5_sn7rsr',
  'https://res.cloudinary.com/duuwv0a2h/video/upload/v1/video6_n3pdrq',
];

// An accordion strip: the hovered (or tapped) clip expands, the others shrink.
const FeaturedVideos = () => {
  const [active, setActive] = useState(0);

  return (
    <Box component="section" sx={{ mb: 6 }}>
      <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
        Featured
      </Typography>
      <Box
        sx={{
          display: 'flex',
          gap: { xs: 0.75, md: 1.5 },
          height: { xs: 200, sm: 260, md: 320 },
        }}
      >
        {FEATURED_CLIPS.map((src, index) => (
          <Box
            key={src}
            onMouseEnter={() => setActive(index)}
            onClick={() => setActive(index)}
            sx={{
              flex: active === index ? 5 : 1,
              minWidth: 0,
              position: 'relative',
              borderRadius: 3,
              overflow: 'hidden',
              cursor: 'pointer',
              bgcolor: 'black',
              border: '1px solid',
              borderColor: active === index ? 'rgba(0, 212, 255, 0.5)' : 'rgba(255,255,255,0.08)',
              boxShadow: active === index ? '0 10px 40px rgba(0, 212, 255, 0.15)' : 'none',
              transition: 'flex 0.5s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.3s, box-shadow 0.3s',
            }}
          >
            <video
              src={src}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: active === index ? 'none' : 'brightness(0.55) saturate(0.7)',
                transition: 'filter 0.4s',
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default FeaturedVideos;
