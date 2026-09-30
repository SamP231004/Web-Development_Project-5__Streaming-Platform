import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, CircularProgress, Alert } from "@mui/material";
import { getErrorMessage } from "../../api.js";

const EMPTY_FORM = { name: "", description: "" };

const PlaylistForm = ({ open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setError("");
    onClose();
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
      await onSubmit({ name: formData.name.trim(), description: formData.description.trim() });
      setFormData(EMPTY_FORM);
      onClose();
    }
    catch (err) {
      setError(getErrorMessage(err, "Failed to save playlist."));
    }
    finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs" PaperProps={{ component: "form", onSubmit: handleSubmit, noValidate: true }}>
      <DialogTitle sx={{ fontWeight: 700 }}>New playlist</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: "8px !important" }}>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          autoFocus
          fullWidth
          name="name"
          label="Name"
          value={formData.name}
          onChange={handleChange}
          inputProps={{ maxLength: 80 }}
        />
        <TextField
          fullWidth
          name="description"
          label="Description"
          multiline
          rows={3}
          value={formData.description}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} color="inherit" disabled={isSubmitting} sx={{ boxShadow: "none" }}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? <CircularProgress size={20} color="inherit" /> : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PlaylistForm;
