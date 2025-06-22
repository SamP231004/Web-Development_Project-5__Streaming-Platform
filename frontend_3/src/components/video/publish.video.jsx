import React, { useState, useCallback } from 'react';
import axios from 'axios';
import {
    Box,
    TextField,
    Button,
    Typography,
    CircularProgress,
    Alert,
    Paper,
    FormHelperText,
    styled,
    Stepper,
    Step,
    StepLabel,
    IconButton,
    Tooltip
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ImageIcon from '@mui/icons-material/Image';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import DeleteIcon from '@mui/icons-material/Delete';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = import.meta.env.VITE_BACKEND_URL;

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

const steps = ['Basic Info', 'Upload Files', 'Review & Submit'];

export default function VideoUpload() {
    const [activeStep, setActiveStep] = useState(0);
    // Form field states
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [videoFile, setVideoFile] = useState(null);

    // Preview states
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);

    // Error states
    const [titleError, setTitleError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');
    const [thumbnailError, setThumbnailError] = useState('');
    const [videoFileError, setVideoFileError] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // Processing state
    const [isProcessing, setIsProcessing] = useState(false);

    const handleNext = useCallback(() => {
        let isStepValid = true;

        if (activeStep === 0) {
            if (!title.trim()) {
                setTitleError('Video title is required.');
                isStepValid = false;
            }
            if (!description.trim()) {
                setDescriptionError('Video description is required.');
                isStepValid = false;
            }
        }

        if (activeStep === 1) {
            if (!thumbnailFile) {
                setThumbnailError('Thumbnail is required.');
                isStepValid = false;
            }
            if (!videoFile) {
                setVideoFileError('Video file is required.');
                isStepValid = false;
            }
        }

        if (isStepValid && activeStep < steps.length - 1) {
            setActiveStep((prev) => prev + 1);
        }
    }, [activeStep, title, description, thumbnailFile, videoFile]);

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    const handleThumbnailFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setThumbnailFile(file);
            setThumbnailError('');
            const reader = new FileReader();
            reader.onloadend = () => {
                setThumbnailPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleVideoFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setVideoFile(file);
            setVideoFileError('');
            const reader = new FileReader();
            reader.onloadend = () => {
                setVideoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFormSubmission = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        setErrorMsg('');
        setSuccessMsg('');

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('thumbnail', thumbnailFile);
            formData.append('video', videoFile);

            const response = await axios.post(`${API_URL}/api/version_1/video`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                }
            });

            if (response.data.success) {
                setSuccessMsg('Video uploaded successfully!');
                // Reset form after successful upload
                setTitle('');
                setDescription('');
                setThumbnailFile(null);
                setVideoFile(null);
                setThumbnailPreview(null);
                setVideoPreview(null);
                setActiveStep(0);
            }
        } catch (error) {
            setErrorMsg(error.response?.data?.message || 'Failed to upload video');
        } finally {
            setIsProcessing(false);
        }
    };

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <TextField
                            fullWidth
                            label="Video Title"
                            variant="outlined"
                            value={title}
                            onChange={(e) => { setTitle(e.target.value); setTitleError(''); }}
                            error={!!titleError}
                            helperText={titleError}
                            disabled={isProcessing}
                            margin="normal"
                            sx={{ mb: 3 }}
                        />
                        <TextField
                            fullWidth
                            label="Video Description"
                            variant="outlined"
                            multiline
                            rows={4}
                            value={description}
                            onChange={(e) => { setDescription(e.target.value); setDescriptionError(''); }}
                            error={!!descriptionError}
                            helperText={descriptionError}
                            disabled={isProcessing}
                        />
                    </motion.div>
                );

            case 1:
                return (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
                            {/* Thumbnail Section */}
                            <Box sx={{ width: '100%', textAlign: 'center' }}>
                                <Button
                                    component="label"
                                    variant="outlined"
                                    startIcon={thumbnailFile ? <DeleteIcon /> : <ImageIcon />}
                                    onClick={thumbnailFile ? () => setThumbnailFile(null) : undefined}
                                    sx={{
                                        mb: 2,
                                        borderColor: thumbnailFile ? 'success.main' : 'primary.main',
                                        color: thumbnailFile ? 'success.main' : 'primary.main',
                                    }}
                                >
                                    {thumbnailFile ? 'Remove Thumbnail' : 'Select Thumbnail'}
                                    {!thumbnailFile && (
                                        <VisuallyHiddenInput type="file" accept="image/*" onChange={handleThumbnailFileChange} />
                                    )}
                                </Button>
                                {thumbnailPreview && (
                                    <Box
                                        component={motion.div}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        sx={{
                                            position: 'relative',
                                            width: '100%',
                                            maxWidth: '300px',
                                            margin: '0 auto'
                                        }}
                                    >
                                        <img
                                            src={thumbnailPreview}
                                            alt="Thumbnail Preview"
                                            style={{
                                                width: '100%',
                                                height: 'auto',
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                            }}
                                        />
                                    </Box>
                                )}
                            </Box>

                            {/* Video Section */}
                            <Box sx={{ width: '100%', textAlign: 'center' }}>
                                <Button
                                    component="label"
                                    variant="outlined"
                                    startIcon={videoFile ? <DeleteIcon /> : <VideoFileIcon />}
                                    onClick={videoFile ? () => setVideoFile(null) : undefined}
                                    sx={{
                                        mb: 2,
                                        borderColor: videoFile ? 'success.main' : 'primary.main',
                                        color: videoFile ? 'success.main' : 'primary.main',
                                    }}
                                >
                                    {videoFile ? 'Remove Video' : 'Select Video'}
                                    {!videoFile && (
                                        <VisuallyHiddenInput type="file" accept="video/*" onChange={handleVideoFileChange} />
                                    )}
                                </Button>
                                {videoPreview && (
                                    <Box
                                        component={motion.div}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                    >
                                        <video
                                            src={videoPreview}
                                            controls
                                            style={{
                                                width: '100%',
                                                maxHeight: '300px',
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                            }}
                                        />
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    </motion.div>
                );

            case 2:
                return (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <Box sx={{ textAlign: 'center', py: 3 }}>
                            <Typography variant="h6" gutterBottom>Review Your Upload</Typography>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle1" color="primary">Title</Typography>
                                <Typography>{title}</Typography>
                            </Box>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle1" color="primary">Description</Typography>
                                <Typography>{description}</Typography>
                            </Box>
                            {thumbnailPreview && (
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle1" color="primary">Thumbnail</Typography>
                                    <img
                                        src={thumbnailPreview}
                                        alt="Thumbnail"
                                        style={{
                                            maxWidth: '200px',
                                            height: 'auto',
                                            borderRadius: '8px',
                                            margin: '10px 0'
                                        }}
                                    />
                                </Box>
                            )}
                            {videoFile && (
                                <Box>
                                    <Typography variant="subtitle1" color="primary">Video File</Typography>
                                    <Typography>{videoFile.name}</Typography>
                                </Box>
                            )}
                        </Box>
                    </motion.div>
                );
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                py: 4,
                px: 2,
            }}
        >
            <Paper
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                elevation={6}
                sx={{
                    width: '100%',
                    marginTop: 7,
                    maxWidth: 600,
                    maxHeight: '80vh',
                    p: 4,
                    bgcolor: 'rgba(0, 0, 0, 0.4)',
                    borderRadius: '16px',
                    boxShadow: theme => `0 0 20px ${theme.palette.primary.main}40`,
                    overflowY: 'auto',
                    // Updated scrollbar styling
                    '&::-webkit-scrollbar': {
                        width: '8px',
                        background: 'transparent',
                    },
                    '&::-webkit-scrollbar-track': {
                        background: 'transparent',
                        borderRadius: '8px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: 'rgba(0, 255, 255, 0.2)',
                        borderRadius: '8px',
                        '&:hover': {
                            background: 'rgba(0, 255, 255, 0.3)',
                        },
                    },
                    // Hide scrollbar for Firefox
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'rgba(0, 255, 255, 0.2) transparent',
                    // Hide scrollbar for IE/Edge
                    '-ms-overflow-style': 'none',
                }}
            >
                <Typography
                    variant="h4"
                    component="h1"
                    align="center"
                    sx={{ mb: 4, fontWeight: 'bold' }}
                >
                    Upload Video
                </Typography>

                <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                <AnimatePresence mode="wait">
                    {(errorMsg || successMsg) && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            style={{ marginBottom: '24px' }}
                        >
                            <Alert severity={errorMsg ? "error" : "success"}>
                                {errorMsg || successMsg}
                            </Alert>
                        </motion.div>
                    )}
                </AnimatePresence>

                {renderStepContent(activeStep)}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                    <Button
                        disabled={activeStep === 0 || isProcessing}
                        onClick={handleBack}
                        sx={{ mr: 1 }}
                    >
                        Back
                    </Button>
                    <Button
                        variant="contained"
                        onClick={activeStep === steps.length - 1 ? handleFormSubmission : handleNext}
                        disabled={isProcessing}
                        startIcon={isProcessing && <CircularProgress size={20} />}
                    >
                        {activeStep === steps.length - 1 ? 'Upload' : 'Next'}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}