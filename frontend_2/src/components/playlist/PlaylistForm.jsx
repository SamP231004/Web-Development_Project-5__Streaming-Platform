import React, { useState, useEffect } from "react";

const PlaylistForm = ({ onSubmit, initialData = {}, loading }) => {
  const [name, setName] = useState(initialData.name || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!name && !description && initialData.name) {
      setName(initialData.name);
      setDescription(initialData.description || "");
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      setError("Both name and description are required.");
      return;
    }
    setError("");
    onSubmit({ name, description });
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "auto" }}>
      <h2>{initialData._id ? "Edit Playlist" : "Create Playlist"}</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        type="text"
        placeholder="Playlist Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 12 }}
      />
      <textarea
        placeholder="Playlist Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
        style={{ width: "100%", padding: 8, marginBottom: 12 }}
      />
      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save"}
      </button>
    </form>
  );
};

export default PlaylistForm;
