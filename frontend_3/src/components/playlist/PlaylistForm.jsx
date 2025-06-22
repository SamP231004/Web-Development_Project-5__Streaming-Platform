import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, CircularProgress, Alert } from "@mui/material";

const PlaylistForm = ({ onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    description: initialData.description || ""
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || ""
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Playlist name is required.");
      return;
    }
    if (!formData.description.trim()) {
      setError("Playlist description is required.");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      if (!initialData._id) {
        setFormData({ name: "", description: "" });
      }
    } 
    catch (err) {
      setError(err.message || "Failed to save playlist.");
    } 
    finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{
        maxWidth: 500,
        margin: "auto",
        p: 3,
        bgcolor: 'background.paper',
        borderRadius: '12px',
        boxShadow: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        mt: 4,
      }}
    >
      {/* Title */}
      <Typography
        variant="h5"
        component="h2"
        sx={{
          mb: 2,
          color: 'text.primary',
          fontWeight: 'bold',
          textAlign: 'center'
        }}
      >
        {initialData._id ? "Edit Playlist" : "Create New Playlist"}
      </Typography>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Form Fields */}
      <TextField
        fullWidth
        name="name"
        label="Playlist Name"
        variant="outlined"
        value={formData.name}
        onChange={handleChange}
        // Remove disabled prop
        sx={{
          '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.2)',
          },
          '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'primary.main',
          },
          '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'primary.light',
          },
          '& .MuiInputLabel-root': { color: 'text.secondary' },
          '& .MuiInputBase-input': { color: 'text.primary' },
        }}
      />

      <TextField
        fullWidth
        name="description"
        label="Playlist Description"
        variant="outlined"
        multiline
        rows={4}
        value={formData.description}
        onChange={handleChange}
        sx={{
          '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.2)',
          },
          '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'primary.main',
          },
          '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'primary.light',
          },
          '& .MuiInputLabel-root': { color: 'text.secondary' },
          '& .MuiInputBase-input': { color: 'text.primary' },
        }}
      />

      {/* Submit Button */}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={isSubmitting}
        sx={{
          mt: 2,
          py: 1.5,
          fontWeight: 'bold',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
        }}
      >
        {isSubmitting ? (
          <>
            <CircularProgress size={20} color="inherit" />
            {initialData._id ? "Updating..." : "Creating..."}
          </>
        ) : (
          initialData._id ? "Update Playlist" : "Create Playlist"
        )}
      </Button>
    </Box>
  );
};

export default PlaylistForm;