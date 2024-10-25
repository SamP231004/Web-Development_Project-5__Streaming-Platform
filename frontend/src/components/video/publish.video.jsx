import React, { useRef, useState } from 'react';
import axios from 'axios';

export default function VideoUpload() {
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);
    const [errorMsg, setErrorMessage] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [videoData, setVideoData] = useState();

    const thumbnailFileInputRef = useRef(null);
    const videoFileInputRef = useRef(null);
    const titleRef = useRef(null);
    const descriptionRef = useRef(null);

    const handleThumbnailFileSelect = () => {
        thumbnailFileInputRef.current.click();
    };

    const handleThumbnailFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setThumbnailPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleVideoFileSelect = () => {
        videoFileInputRef.current.click();
    };

    const handleVideoFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setVideoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFormSubmission = async (event) => {
        event.preventDefault();
        setIsProcessing(true);
        setErrorMessage('');

        // Retrieve the access token from localStorage
        const accessToken = localStorage.getItem('accessToken');

        // Validate required fields
        if (!titleRef.current.value.trim() || !descriptionRef.current.value.trim()) {
            setErrorMessage('Title and description are required.');
            setIsProcessing(false);
            return;
        }

        if (!thumbnailFileInputRef.current.files[0] || !videoFileInputRef.current.files[0]) {
            setErrorMessage('Both video and thumbnail files are required.');
            setIsProcessing(false);
            return;
        }

        const formData = new FormData();
        formData.append('title', titleRef.current.value);
        formData.append('description', descriptionRef.current.value);
        formData.append('thumbnail', thumbnailFileInputRef.current.files[0]);
        formData.append('videoFile', videoFileInputRef.current.files[0]);

        try {
            const response = await axios.post('https://web-development-project-5-streaming-platform.vercel.app/api/version_1/video', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${accessToken}`,
                },
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
                timeout: 600000
            });


            if (response.data.success) {
                setVideoData(response.data.data);

                console.log('Video Uploaded Successfully:');
                console.log('Title:', response.data.data.title);
                console.log('Description:', response.data.data.description);
                console.log('Video File URL:', response.data.data.videoFile);
                console.log('Thumbnail URL:', response.data.data.thumbnail);
                console.log('Owner ID:', response.data.data.owner);

                if (thumbnailFileInputRef.current) thumbnailFileInputRef.current.value = '';
                if (videoFileInputRef.current) videoFileInputRef.current.value = '';
                if (titleRef.current) titleRef.current.value = '';
                if (descriptionRef.current) descriptionRef.current.value = '';
                setThumbnailPreview(null);
                setVideoPreview(null);

                alert('Video Uploaded: Video has been uploaded successfully');
            } 
            else {
                setErrorMessage(response.data.message || 'Video upload failed: Please try again later.');
            }
        }
        catch (error) {
            console.error('Video Upload Failed:', error);
            if (error.response) {
                console.error('Response Data:', error.response.data);
                setErrorMessage(error.response.data.message || 'Video upload failed: Please try again later.');
            } 
            else if (error.request) {
                console.error('No response received:', error.request);
                setErrorMessage('No response from server: Please check your network connection.');
            } 
            else {
                console.error('Error setting up request:', error.message);
                setErrorMessage('An unexpected error occurred.');
            }
        }
        finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="upload-container">
            <h1 className="upload-title">Upload Video</h1>
            <form onSubmit={handleFormSubmission} className="upload-form">
                <div className="form-group">
                    <label className="label">Title:</label>
                    <input type="text" ref={titleRef} required className="input" />
                </div>
                <div className="form-group">
                    <label className="label">Description:</label>
                    <textarea ref={descriptionRef} required className="textarea" />
                </div>
                <div className="form-group">
                    <button type="button" onClick={handleThumbnailFileSelect} className="button button-select">
                        Select Thumbnail
                    </button>
                    <input type="file" ref={thumbnailFileInputRef} accept="image/*" onChange={handleThumbnailFileChange} style={{ display: 'none' }} />
                    {thumbnailPreview && <img src={thumbnailPreview} alt="Thumbnail Preview" className="thumbnail-preview" />}
                </div>
                <div className="form-group">
                    <button type="button" onClick={handleVideoFileSelect} className="button button-select">
                        Select Video
                    </button>
                    <input type="file" ref={videoFileInputRef} accept="video/*" onChange={handleVideoFileChange} style={{ display: 'none' }} />
                    {videoPreview && <video src={videoPreview} controls className="video-preview" />}
                </div>
                <button type="submit" disabled={isProcessing} className="btn-login uploadButton">
                    {isProcessing ? 'Uploading...' : 'Upload Video'}
                </button>
                {errorMsg && <p className="error-message">{errorMsg}</p>}
            </form>
        </div>
    );
}