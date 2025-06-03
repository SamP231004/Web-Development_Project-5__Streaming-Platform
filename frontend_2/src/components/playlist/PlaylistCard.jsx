import React from "react";

const PlaylistCard = ({ playlist, onClick, isOpen }) => {
  return (
    <div
      onClick={onClick}
      style={{
        border: "1px solid #ccc",
        padding: 16,
        borderRadius: 6,
        cursor: "pointer",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        marginBottom: 12,
        backgroundColor: isOpen ? "#e6f7ff" : "transparent",
      }}
    >
      <h3>{playlist.name}</h3>
      <p>{playlist.description}</p>
      <p>
        Videos: {playlist.totalVideos || 0} | Views: {playlist.totalViews || 0}
      </p>
    </div>
  );
};

export default PlaylistCard;
