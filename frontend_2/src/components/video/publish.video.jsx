import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    TextField,
    Button,
    Typography,
    Alert,
    Paper,
    styled,
    Stepper,
    Step,
    StepLabel,
    IconButton,
    Tooltip,
    LinearProgress,
} from '@mui/material';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import VideoFileOutlinedIcon from '@mui/icons-material/VideoFileOutlined';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { motion, AnimatePresence } from 'framer-motion';
import api, { getErrorMessage } from '../../api.js';
import { useObjectUrl } from '../../utils/useObjectUrl.js';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const steps = ['Details', 'Files', 'Review'];

const formatSize = (bytes) => `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

const FilePicker = ({ label, accept, icon, file, previewUrl, error, onSelect, onClear, disabled, isVideo }) => (
    <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>{label}</Typography>
        {file ? (
            <Box sx={{ position: 'relative', borderRadius: 3, overflow: 'hidden', bgcolor: 'black', aspectRatio: '16 / 9' }}>
                {isVideo ? (
                    <video src={previewUrl} controls style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
                ) : (
                    <Box component="img" src={previewUrl} alt="Thumbnail preview" sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                )}
                <Tooltip title="Remove">
                    <IconButton
                        onClick={onClear}
                        disabled={disabled}
                        aria-label={`Remove ${label.toLowerCase()}`}
                        size="small"
                        sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(0,0,0,0.7)', '&:hover': { bgcolor: 'rgba(0,0,0,0.9)' } }}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>
        ) : (
            <Box
                component="label"
                sx={{
                    aspectRatio: '16 / 9',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                    borderRadius: 3,
                    border: '2px dashed',
                    borderColor: error ? 'error.main' : 'rgba(255,255,255,0.2)',
                    color: 'text.secondary',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s, background-color 0.2s',
                    '&:hover': { borderColor: 'secondary.main', bgcolor: 'rgba(0,212,255,0.05)', color: 'text.primary' },
                }}
            >
                <Box sx={{ '& svg': { fontSize: 40 } }}>{icon}</Box>
                <Typography variant="body2">Click to choose a file</Typography>
                <VisuallyHiddenInput type="file" accept={accept} onChange={(e) => onSelect(e.target.files[0])} />
            </Box>
        )}
        <Typography variant="caption" component="div" sx={{ mt: 0.5, color: error ? 'error.main' : undefined }} noWrap>
            {error || (file ? `${file.name} • ${formatSize(file.size)}` : ' ')}
        </Typography>
    </Box>
);

export default function VideoUpload() {
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [videoFile, setVideoFile] = useState(null);
    const [errors, setErrors] = useState({});
    const [errorMsg, setErrorMsg] = useState('');
    const [uploaded, setUploaded] = useState(false);
    const [progress, setProgress] = useState(null);

    const thumbnailPreview = useObjectUrl(thumbnailFile);
    const videoPreview = useObjectUrl(videoFile);
    const isProcessing = progress !== null;

    const validateStep = (step) => {
        const next = {};
        if (step === 0) {
            if (!title.trim()) next.title = 'Video title is required.';
            if (!description.trim()) next.description = 'Video description is required.';
        }
        if (step === 1) {
            if (!thumbnailFile) next.thumbnail = 'Thumbnail is required.';
            if (!videoFile) next.video = 'Video file is required.';
        }
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleNext = () => {
        if (validateStep(activeStep)) setActiveStep((prev) => prev + 1);
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setThumbnailFile(null);
        setVideoFile(null);
        setErrors({});
        setErrorMsg('');
        setUploaded(false);
        setActiveStep(0);
    };

    const handleFormSubmission = async () => {
        setErrorMsg('');
        setProgress(0);
        try {
            const formData = new FormData();
            formData.append('title', title.trim());
            formData.append('description', description.trim());
            formData.append('thumbnail', thumbnailFile);
            formData.append('video', videoFile);

            await api.post('/video', formData, {
                onUploadProgress: (event) => {
                    if (event.total) setProgress(Math.round((event.loaded / event.total) * 100));
                },
            });
            setUploaded(true);
        }
        catch (error) {
            setErrorMsg(getErrorMessage(error, 'Failed to upload video'));
        }
        finally {
            setProgress(null);
        }
    };

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <TextField
                            fullWidth
                            label="Title"
                            value={title}
                            onChange={(e) => { setTitle(e.target.value); setErrors((p) => ({ ...p, title: '' })); }}
                            error={!!errors.title}
                            helperText={errors.title || `${title.length}/100`}
                            inputProps={{ maxLength: 100 }}
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            multiline
                            rows={5}
                            value={description}
                            onChange={(e) => { setDescription(e.target.value); setErrors((p) => ({ ...p, description: '' })); }}
                            error={!!errors.description}
                            helperText={errors.description || 'Tell viewers what your video is about'}
                        />
                    </Box>
                );

            case 1:
                return (
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
                        <FilePicker
                            label="Thumbnail"
                            accept="image/*"
                            icon={<ImageOutlinedIcon />}
                            file={thumbnailFile}
                            previewUrl={thumbnailPreview}
                            error={errors.thumbnail}
                            onSelect={(file) => { setThumbnailFile(file || null); setErrors((p) => ({ ...p, thumbnail: '' })); }}
                            onClear={() => setThumbnailFile(null)}
                        />
                        <FilePicker
                            label="Video"
                            accept="video/*"
                            icon={<VideoFileOutlinedIcon />}
                            file={videoFile}
                            previewUrl={videoPreview}
                            error={errors.video}
                            onSelect={(file) => { setVideoFile(file || null); setErrors((p) => ({ ...p, video: '' })); }}
                            onClear={() => setVideoFile(null)}
                            isVideo
                        />
                    </Box>
                );

            default:
                return (
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, alignItems: 'flex-start' }}>
                        {thumbnailPreview && (
                            <Box component="img" src={thumbnailPreview} alt="Thumbnail" sx={{ width: { xs: '100%', sm: 220 }, aspectRatio: '16 / 9', objectFit: 'cover', borderRadius: 2 }} />
                        )}
                        <Box sx={{ minWidth: 0 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, wordBreak: 'break-word' }}>{title}</Typography>
                            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mt: 1, wordBreak: 'break-word' }}>{description}</Typography>
                            {videoFile && (
                                <Typography variant="caption" component="div" sx={{ mt: 2 }}>
                                    {videoFile.name} • {formatSize(videoFile.size)}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                );
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Paper
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                sx={{
                    width: '100%',
                    maxWidth: 760,
                    p: { xs: 2.5, sm: 4 },
                    bgcolor: 'rgba(22, 22, 22, 0.85)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 4,
                }}
            >
                <Typography variant="h4" component="h1" sx={{ mb: 3, fontSize: { xs: '1.6rem', md: '2rem' } }}>
                    Upload video
                </Typography>

                {uploaded ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <CheckCircleOutlineIcon sx={{ fontSize: 64, color: 'success.main', mb: 1 }} />
                        <Typography variant="h6" sx={{ mb: 1 }}>Your video is live!</Typography>
                        <Typography variant="body2" sx={{ mb: 3 }}>&ldquo;{title}&rdquo; was uploaded successfully.</Typography>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Button variant="contained" onClick={() => navigate('/dashboard/stats')}>Go to dashboard</Button>
                            <Button variant="outlined" color="secondary" onClick={resetForm}>Upload another</Button>
                        </Box>
                    </Box>
                ) : (
                    <>
                        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>

                        {errorMsg && <Alert severity="error" sx={{ mb: 3 }}>{errorMsg}</Alert>}

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                {renderStepContent(activeStep)}
                            </motion.div>
                        </AnimatePresence>

                        {isProcessing && (
                            <Box sx={{ mt: 3 }}>
                                <LinearProgress variant={progress < 100 ? 'determinate' : 'indeterminate'} value={progress} color="secondary" sx={{ height: 8, borderRadius: 4 }} />
                                <Typography variant="caption" component="div" sx={{ mt: 1, textAlign: 'center' }}>
                                    {progress < 100 ? `Uploading... ${progress}%` : 'Processing video, this can take a moment...'}
                                </Typography>
                            </Box>
                        )}

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                            <Button
                                color="inherit"
                                disabled={activeStep === 0 || isProcessing}
                                onClick={() => setActiveStep((prev) => prev - 1)}
                                sx={{ boxShadow: 'none' }}
                            >
                                Back
                            </Button>
                            <Button
                                variant="contained"
                                onClick={activeStep === steps.length - 1 ? handleFormSubmission : handleNext}
                                disabled={isProcessing}
                            >
                                {activeStep === steps.length - 1 ? 'Publish' : 'Next'}
                            </Button>
                        </Box>
                    </>
                )}
            </Paper>
        </Box>
    );
}
