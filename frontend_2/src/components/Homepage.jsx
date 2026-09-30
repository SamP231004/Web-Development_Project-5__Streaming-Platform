import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Button, Chip, Stack, Typography, CircularProgress } from '@mui/material';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import VideoLibraryOutlinedIcon from '@mui/icons-material/VideoLibraryOutlined';
import api from '../api.js';
import { fetchAllVideos } from './video/fetchAll.video.jsx';
import { useVideoPlayer } from './video/handleView.video.jsx';
import { LoadingState, ErrorState, EmptyState } from './common/PageState.jsx';

import FeaturedVideos from './homepage/FeaturedVideos.jsx';
import AllVideos from './homepage/AllVideos.jsx';
import VideoPlayerModal from './homepage/VideoPlayerModal.jsx';

const SORTS = [
  { id: 'latest', label: 'Latest', compare: (a, b) => new Date(b.createdAt) - new Date(a.createdAt) },
  { id: 'popular', label: 'Most viewed', compare: (a, b) => (b.views || 0) - (a.views || 0) },
  { id: 'short', label: 'Quick watches', filter: (v) => (v.duration || 0) < 60 },
];

const matchesQuery = (video, query) => {
  const haystack = `${video.title} ${video.description} ${video.ownerDetails?.username}`.toLowerCase();
  return query.toLowerCase().split(/\s+/).every((word) => haystack.includes(word));
};

const Homepage = ({ currentUser }) => {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get('q') || '').trim();

  const [videos, setVideos] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [errorMsg, setErrorMessage] = useState('');
  const [sort, setSort] = useState('latest');
  const { selectedVideo, play, close } = useVideoPlayer(setVideos);

  const userId = currentUser?._id;

  const loadVideos = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const result = await fetchAllVideos({ page: 1 });
      setVideos(result.videos);
      setHasNextPage(result.hasNextPage);
      setPage(1);
    }
    catch (error) {
      setErrorMessage(error.message);
    }
    finally {
      setIsLoading(false);
    }
  }, []);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const result = await fetchAllVideos({ page: page + 1 });
      setVideos((prev) => {
        const seen = new Set(prev.map((v) => v._id));
        return [...prev, ...result.videos.filter((v) => !seen.has(v._id))];
      });
      setHasNextPage(result.hasNextPage);
      setPage((p) => p + 1);
    }
    catch (error) {
      setErrorMessage(error.message);
    }
    finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (!userId) return;
    loadVideos();
    api.get(`/playlist/user/${userId}`)
      .then(({ data }) => setPlaylists(data.data || []))
      .catch((err) => console.error('Failed to fetch playlists:', err));
  }, [userId, loadVideos]);

  const visibleVideos = useMemo(() => {
    const active = SORTS.find((s) => s.id === sort);
    let list = query ? videos.filter((v) => matchesQuery(v, query)) : videos;
    if (active.filter) list = list.filter(active.filter);
    if (active.compare) list = [...list].sort(active.compare);
    return list;
  }, [videos, query, sort]);

  const renderVideos = () => {
    if (isLoading) return <LoadingState label="Loading videos..." />;
    if (errorMsg) return <ErrorState message={errorMsg} onRetry={loadVideos} />;
    if (videos.length === 0) {
      return (
        <EmptyState icon={<VideoLibraryOutlinedIcon />} title="No videos yet" description="Be the first to publish something!" />
      );
    }
    if (visibleVideos.length === 0) {
      return (
        <EmptyState
          icon={<SearchOffIcon />}
          title={query ? `No results for “${query}”` : 'Nothing here yet'}
          description={query ? 'Try a different search term or clear the filter.' : 'Try another filter.'}
          action={sort !== 'latest' && <Button variant="outlined" color="secondary" onClick={() => setSort('latest')}>Show all videos</Button>}
        />
      );
    }
    return (
      <>
        <AllVideos videos={visibleVideos} playlists={playlists} currentUser={currentUser} onPlay={play} />
        {hasNextPage && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
            <Button
              variant="outlined"
              color="inherit"
              onClick={loadMore}
              disabled={loadingMore}
              sx={{ borderRadius: 999, px: 4, borderColor: 'rgba(255,255,255,0.2)', boxShadow: 'none' }}
            >
              {loadingMore ? <CircularProgress size={20} color="inherit" /> : 'Load more'}
            </Button>
          </Box>
        )}
      </>
    );
  };

  return (
    <Box>
      {!query && <FeaturedVideos />}

      <Box sx={{ display: 'flex', alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 3 }}>
        <Box>
          <Typography variant="h5" component="h2">
            {query ? `Results for “${query}”` : 'Explore'}
          </Typography>
          {!isLoading && !errorMsg && (
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              {visibleVideos.length} {visibleVideos.length === 1 ? 'video' : 'videos'}
            </Typography>
          )}
        </Box>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
          {SORTS.map(({ id, label }) => {
            const selected = sort === id;
            return (
              <Chip
                key={id}
                label={label}
                clickable
                onClick={() => setSort(id)}
                sx={{
                  fontWeight: 600,
                  borderRadius: 2,
                  bgcolor: selected ? 'common.white' : 'rgba(255,255,255,0.08)',
                  color: selected ? '#0A0A0A' : 'text.primary',
                  '&:hover': { bgcolor: selected ? '#E0E0E0' : 'rgba(255,255,255,0.14)' },
                }}
              />
            );
          })}
        </Stack>
      </Box>

      {renderVideos()}

      <VideoPlayerModal selectedVideo={selectedVideo} handleClose={close} currentUser={currentUser} />
    </Box>
  );
};

export default Homepage;
