import React from "react";

const PlaylistVideoCard = ({ video, onRemove }) => {
  console.log("Video Details : ", video);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: 8,
        borderBottom: "1px solid #eee",
        marginBottom: 8,
      }}
    >
      <img
        src={video.thumbnail || "https://via.placeholder.com/150x84"}
        alt={video.title}
        width={150}
        height={84}
        style={{ objectFit: "cover", marginRight: 16 }}
      />
      <div style={{ flex: 1 }}>
        <h4>{video.title}</h4>
        <p>Duration: {video.duration}</p>
      </div>
      {onRemove && (
        <button
          onClick={() => onRemove(video._id)}
          style={{
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            padding: "8px 12px",
            cursor: "pointer",
            borderRadius: 4,
          }}
        >
          Remove
        </button>
      )}
    </div>
  );
};

export default PlaylistVideoCard;
