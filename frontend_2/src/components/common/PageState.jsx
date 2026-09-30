import { Box, Typography, CircularProgress, Alert, Button } from '@mui/material';

export const PageHeader = ({ title, subtitle, action }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: { xs: 'flex-start', sm: 'center' },
      justifyContent: 'space-between',
      flexDirection: { xs: 'column', sm: 'row' },
      gap: 2,
      mb: 4,
    }}
  >
    <Box>
      <Typography variant="h4" component="h1" sx={{ fontSize: { xs: '1.6rem', md: '2rem' } }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" sx={{ mt: 0.5 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
    {action}
  </Box>
);

export const LoadingState = ({ label = 'Loading...' }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '50vh',
      gap: 2,
    }}
  >
    <CircularProgress size={48} />
    <Typography variant="body2">{label}</Typography>
  </Box>
);

export const ErrorState = ({ message, onRetry }) => (
  <Alert
    severity="error"
    sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}
    action={onRetry && <Button color="inherit" size="small" onClick={onRetry}>Retry</Button>}
  >
    {message}
  </Alert>
);

export const EmptyState = ({ icon, title, description, action }) => (
  <Box
    sx={{
      textAlign: 'center',
      py: 8,
      px: 2,
      border: '1px dashed',
      borderColor: 'divider',
      borderRadius: 4,
      color: 'text.secondary',
    }}
  >
    {icon && <Box sx={{ fontSize: 56, mb: 1, color: 'text.disabled', '& svg': { fontSize: 'inherit' } }}>{icon}</Box>}
    <Typography variant="h6" sx={{ mb: 1 }}>{title}</Typography>
    {description && <Typography variant="body2" sx={{ mb: action ? 3 : 0 }}>{description}</Typography>}
    {action}
  </Box>
);
